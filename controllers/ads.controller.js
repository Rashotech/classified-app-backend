const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const adsService = require('../services/ads.service');

const addListing = catchAsync(async (req, res) => {
    const listing = await adsService.createlisting(req.body, req.images, req.user._id);
    res.status(httpStatus.CREATED).send(listing);
});

const getListings = catchAsync(async (req, res) => {
  const { page, size, keyword, lga, minprice, maxprice, category, region } = req.query;
  const listings = await adsService.getListings(page, size, keyword, lga, minprice, maxprice, category, region);
  res.send(listings);
});

const getListingById = catchAsync(async (req, res) => {
  const listing = await adsService.getListingById(req.params.listingId);
  res.send(listing);
});

const getListingByUser = catchAsync(async (req, res) => {
  const listings = await adsService.getListingsByUser(req.user._id);
  res.send(listings);
});

const getListingsByCategory = catchAsync(async (req, res) => {
  const listings = await adsService.getListingsByCategory(req.params.categoryId);
  res.send(listings);
});


const updateListingById = catchAsync(async (req, res) => {
  const Listing = await postService.updatePostById(req.params.postId, req.body);
  res.status(httpStatus.OK).send(post);
});

const deleteListingById = catchAsync(async (req, res) => {
  await adsService.deletePostById(req.params.listingId, req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  addListing,
  getListings,
  getListingById,
  getListingByUser,
  getListingsByCategory,
  deleteListingById
};