const User = require('../models/user.model');
const Transaction = require('../models/transaction.model');

exports.getTransactions = async (req, res) => {
    console.log('user',req.user._id);
    try {
        const transactions = await Transaction.find({ user: req.user._id });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deposit = async (req, res) => {
    const { amount } = req.body;
    if(req.user.role==='customer'){
    try {
        const user = await User.findById(req.user._id);
        user.balance = user.balance+amount;
        await user.save();

        const transaction = new Transaction({ user: req.user._id, type: 'deposit', amount });
        await transaction.save();

        res.json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    }else{
        res.status(400).send({message:'Access denied'});
    }
};

exports.withdraw = async (req, res) => {
    const { amount } = req.body;
    if(req.user.role==='customer'){
    try {
        const user = await User.findById(req.user._id);
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient Funds' });
        }

        user.balance = user.balance-amount;
        await user.save();

        const transaction = new Transaction({ user: req.user._id, type: 'withdraw', amount });
        await transaction.save();

        res.json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }}else{
        res.status(400).send({message:'Access denied'});
    }
};
