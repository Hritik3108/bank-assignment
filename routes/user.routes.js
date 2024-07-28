const express = require('express');
const router = express.Router();
const { getTransactions, deposit, withdraw } = require('../controllers/customer.controller');
const {isAuthenticatedUser} = require('../middleware/auth');

router.get('/api/transactions', isAuthenticatedUser, getTransactions);
router.post('/api/deposit', isAuthenticatedUser, deposit);
router.post('/api/withdraw', isAuthenticatedUser, withdraw);

module.exports = router;
