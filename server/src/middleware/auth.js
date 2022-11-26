const UserModel = require('../models/auctionuser');
let jwt = require('jwt-simple');

const authUserMiddleware = async (req, res, next) => {
    const { id, token } = req.body;
    console.log(id, token);
    if (await isUser({ id, token })) {
        console.log("[AUTH-MIDDLEWARE] Authorized User");
        next();
    }
    else {
        console.log("[AUTH-MIDDLEWARE] Not Authorized User");
        res.status(401).json({ error: "Not Authorized" });
    }
}

const isUser = async ( item ) => {
    try {
        let { id, token } = item;
        let secret_key = process.env.SECRET_KEY;

        if(id == null || token == null) {
            return false;
        }    
        const password = jwt.decode(token, secret_key);
        const object = await UserModel.findOne(
            {username: id, password}
        );
        return object != null;        
    } catch (e) {
        return false;
    }
}

module.exports = authUserMiddleware;