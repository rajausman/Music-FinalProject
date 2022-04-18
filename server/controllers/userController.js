const User = require('../models/user');

exports.loginUser = (req, res, next) => {
    const user = req.body;
    const verifyUser = User.authUser(user);
    res.status(200).json(verifyUser);
}
