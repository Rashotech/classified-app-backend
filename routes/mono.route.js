const express = require('express');
const validate = require('../middleware/validate');
const monoValidation = require('../validations/mono.validation');
const monoController = require('../controllers/mono.controller');
const auth = require('../middleware/auth');
const verifyWebhook = require('../middleware/verifyWebhhook');
const router = express.Router();

router.post('/monoAuth', auth(), monoController.monoAuth);
router.post('/monoWebhook', verifyWebhook, monoController.monoWebHook);
router.get('/transactions', auth(), validate(monoValidation.getTransactions), monoController.getTransactions);
router.get('/accountInfo', auth(), monoController.getAccountInfo);
router.get('/identity', auth(), monoController.getIdentity);
router.get('/localinfo', auth(), monoController.getLocalInfo);

module.exports = router;