const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
	monoId: {
		type: String,
        default: ''
	},
	institution: {
		type: String,
        default: ''
	},
    name: {
		type: String,
        default: ''
	},
	accountNumber: {
		type: String,
        default: ''
	},
    type: {
		type: String,
        default: ''
	},
	currency: {
		type: String,
        default: ''
	},
    balance: {
		type: String,
        default: ''
	},
	bvn: {
		type: String,
        default: ''
	},
},
{ timestamps: true }
);

const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;