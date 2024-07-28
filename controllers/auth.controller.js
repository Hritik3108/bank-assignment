const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('login init')
    try {
        const user = await User.findOne({ email:email });
        let isValidPassword
        console.log('login user',user,'password',password)

        if(user){
            isValidPassword = bcrypt.compareSync(password,user.password);
        }
        console.log('isvalid',isValidPassword)
        if (!user || !isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        user.password=undefined;
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ user,token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registration = async (req, res) => {
    const { username,email,password,role } = req.body;
    try {
        let newUser;
        if(req.file!=undefined){
            newUser = await User.create({pp:req.file.filename,username,email, password,role});
          }else{
            newUser = await User.create({username,email,password,role});
          }
        if (newUser) {
            const token = jwt.sign({userId: newUser._id, role: newUser.role },process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRES_IN });
            newUser.password=undefined;
            res.status(200).json({ user:newUser,token });
        } else {
            res.status(400).json({ error: "User not saved" });
        }  
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};