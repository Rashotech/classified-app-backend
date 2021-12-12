const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user.model');
const Balance = require('../models/userBalance.model');

const axios = require('axios');
require('dotenv').config();
const apiurl = "https://api.withmono.com/account/auth";

const monoAuth = catchAsync(async (req, res) => {
    const { code } = req.body;
    await axios({
        method: 'POST',
        url: apiurl,
        data: { code },
        responseType: 'application/json',
        headers: {
            'mono-sec-key': process.env.MONO_SECRET_KEY
        }
    }).then(async function ({ data }) {
        const body = {
            monoId: data.id,
            monoCode: code,
            monoStatus: true
        }  
        const info = await User.findOneAndUpdate({ _id: req.user._id }, body, { new: true, rawResult: true });
        return res.status(httpStatus.OK).send(info);
    }).catch(err => res.status(501).send("Error fetching id"));
});

const monoWebHook = catchAsync(async (req, res) => {
    const webhook = req.body;
    switch(webhook.event) {
        case "mono.events.account_updated":
            if (webhook.data.meta.data_status == "AVAILABLE") { // AVAILABLE, PROCESSING, FAILED
                const data = webhook.data.account;
                const result = {
                    institution: data.institution.name,
                    name: data.name,
                    accountNumber: data.accountNumber,
                    type: data.type,
                    currency: data.currency,
                    balance: data.balance,
                    bvn: data.bvn
                };
                await Balance.findOneAndUpdate({ monoId: data._id }, result, { 
                    new: true,
                    upsert: true,
                    rawResult: true
                });
                await User.findOneAndUpdate({ monoId: data._id }, { monoStatus: true }, { new: true });
            }
            else if (webhook.data.meta.data_status == "PROCESSING") {
                // 
            }
            break;

        case "mono.events.reauthorisation_required":
            break;

        case "mono.events.account_reauthorized":
            break;
    }
    return res.sendStatus(200);
});

const getTransactions = catchAsync(async (req, res) => {
    const { paginate } = req.query;
    let filters = "";
    Object.entries(req.query).forEach(([key, value]) => {
        if(['start', 'end', 'narration', 'type', 'limit'].includes(key)) {
            filters += !!value ? `${key}=${value}&` : ''
        }
    });
    if (await isDataAvailable(req.user.monoId)) {
        const { data } = await axios({
            method: 'get',
            url: process.env.MONO_API_URL + `${req.user.monoId}/transactions?paginate=${paginate}&${filters}`,
            responseType: 'application/json',
            headers: {
                'mono-sec-key': process.env.MONO_SECRET_KEY
            }
        })
        return res.status(httpStatus.OK).send(data);
    }
    return res.status(httpStatus.NOT_FOUND).send('Information not currently available');
});

const getAccountInfo = catchAsync(async (req, res) => {
    if (await isDataAvailable(req.user.monoId)) {
        const { data } = await axios({
            method: 'get',
            url: process.env.MONO_API_URL + req.user.monoId,
            responseType: 'application/json',
            headers: {
                'mono-sec-key': process.env.MONO_SECRET_KEY
            }
        })
        return res.status(httpStatus.OK).send(data);
    }
    return res.status(httpStatus.NOT_FOUND).send('Information not currently available');
});

const getIdentity = catchAsync(async (req, res) => {
    const { data } = await axios({
        method: 'get',
        url: process.env.MONO_API_URL + `${req.user.monoId}/identity`,
        responseType: 'application/json',
        headers: {
            'mono-sec-key': process.env.MONO_SECRET_KEY
        }
    })
    return res.status(httpStatus.OK).send(data);
});

const getLocalInfo = catchAsync(async (req, res) => {
    const user = await User.findOne({ _id:  req.user._id });
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'UnAuthorized');
    }
    return res.status(httpStatus.OK).send(user);
});

const isDataAvailable = async (id) => {
    const { data } = await axios({
        method: 'get',
        url: process.env.MONO_API_URL + `${id}`,
        responseType: 'application/json',
        headers: {
            'mono-sec-key': process.env.MONO_SECRET_KEY
        }
    })
	if (data.meta && data.meta.data_status == "AVAILABLE") {
		return true
	}
    return false
};

module.exports = {
  monoAuth,
  monoWebHook,
  getTransactions,
  getAccountInfo,
  getIdentity,
  getLocalInfo
};