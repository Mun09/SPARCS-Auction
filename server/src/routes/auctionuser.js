let express = require('express');
let router = express.Router();
let jwt = require('jwt-simple');
let getRandomInt = require('../tools/getRandom.js');
let secret_key = process.env.SECRET_KEY;

const UserModel = require('../models/auctionuser');

class UserDB {
    static _inst_;
	static getInst = () => {
		if(!UserDB._inst_) UserDB._inst_ = new UserDB();
		return UserDB._inst_;
	}

	constructor() { console.log("[Feed-DB] DB Init Completed"); }

    getUserInfo = async ( item ) => {
        try {
            const { username, password } = item;
            const findArguments = password != null ? {name: username, password} : {name: username};
            const data = await UserModel.findOne(findArguments);
            return {success: true, data: data};
        } catch (e) {
            return {success: false, data: e};
        }
    }

    registerUserInfo = async ( item ) => {
        try {
            const { username, password } = item;
            const _id = getRandomInt(1, 100000);
            const newItem = new UserModel({_id, name: username, password});
            const res = await newItem.save();
            return {success: true};
        } catch (e) {
			console.log(`[AuctionUser-DB] Register Error: ${ e }`);
			return { success: false, data: `DB Error - ${ e }` };
        }
    }
}

const userDBInst = UserDB.getInst();

router.post('/getUserIdToken', async (req, res) => {
    try {
        const { username, password } = req.body;
        const UserInfo = await userDBInst.getUserInfo({username, password});
        if(UserInfo.success) {
            const id = UserInfo.data.name;
            const token = jwt.encode(UserInfo.data.password, secret_key);
            return res.status(200).json({success: true, id: id, token: token }); 
        } else {
            return res.status(500).json({success: false});
        }
    } catch (e) { return res.status(500).json({Error: e}) };
});

router.post('/getUserInfo', async (req, res) => {
    try {
        const { username, password } = req.body;
        const UserInfo = await userDBInst.getUserInfo({username, password});
        if(UserInfo.success) {
            return res.status(200).json({success: true, data: UserInfo.data }); 
        } else {
            return res.status(200).json({success: false});
        }
    } catch (e) {
        return res.status(500).json({error: e});
    }
});

router.post('/getUserInfobyIdToken', async (req, res) => {
    try {
        const { id, token } = req.query;
        if(id == "null" || token == "null") {
            return res.status(200).json({success: false});
        }
        const password = jwt.decode(token, secret_key);

        console.log(id, "and", password);
        const UserInfo = await userDBInst.getUserInfo({username: id, password});
        if(UserInfo.success) {
            return res.status(200).json({success: true, data: UserInfo.data }); 
        } else {
            return res.status(200).json({success: false});
        }
    } catch (e) { return res.status(500).json({Error: e}) };
});

router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.query;
        const isThere = await userDBInst.getUserInfo({username, password});
        if(isThere.success==true) {
            return res.status(200).json({success: false});
        }
        const res = userDBInst.registerUserInfo({username, password});
        return res;
    } catch (e) {
        return res.status(500).json({error: e});
    }
})

module.exports = router;