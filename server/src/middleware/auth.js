const UserModel = require('../models/auctionuser');

const authUserMiddleware = async (req, res, next) => {
    const { username, password } = req.body;
    if (isUser({username, password})) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

const isUser = async ( item ) => {
    const { username, password } = item;
    const object = await UserModel.findOne({
        where: {
            name: username,
            password: password
        }
    });
    return object != null;
}

module.exports = authUserMiddleware;