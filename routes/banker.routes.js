const express = require('express');
const router = express.Router();
const { getAccounts, getCustomerTransactions,getCustomerData } = require('../controllers/banker.controller');
const {isAuthenticatedUser} = require('../middleware/auth');

router.route('/api/accounts').get(isAuthenticatedUser, getAccounts);
router.route('/api/transactions/:userId').get(isAuthenticatedUser, getCustomerTransactions);
router.route('/api/customer/:userId').get(isAuthenticatedUser, getCustomerData);

module.exports = router;