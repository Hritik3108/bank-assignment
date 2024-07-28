const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

exports.getAccounts = async (req, res) => {
    console.log('accouunts')
    if(req.user.role==='banker'){
    try {
        const accounts = await User.find({ role: 'customer' }).select('pp username email balance');
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}else{
        res.status(400).send({message:'Access denied'});
    }
};

exports.getCustomerTransactions = async (req, res) => {
    if(req.user.role==='banker'){
    try {
        const transactions = await Transaction.find({ user: req.params.userId });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}else{
        res.status(400).send({message:'Access denied'});
    }
};

exports.getCustomerData = async (req, res) => {
    if(req.user.role==='banker'){
    try {
        const account = await User.findById(req.params.userId).select('pp username email balance');
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}else{
        res.status(400).send({message:'Access denied'});
    }
};