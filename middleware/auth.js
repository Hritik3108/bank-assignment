const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model')

exports.isAuthenticatedUser =  (req, res, next) => {
    if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "JWT"
      ) {
    // console.log('auth')

        jwt.verify(
          req.headers.authorization.split(" ")[1],
          process.env.JWT_SECRET,
          function (err, verifiedToken) {
            if (err) {
                res.status(401).json({message: "Invalid JSON Token"});
            }
            userModel.findById(verifiedToken.userId).then(user => {
                // if(verifiedToken.role==='customer'){
                user.password=undefined;
                req.user = user;
                console.log('auth',user)
                next();
            }).catch(err => {
                res.status(500).json({message: err});
            })
          }
        );
      } else {
        res.status(403).json({message: "token not present"});
      }
};