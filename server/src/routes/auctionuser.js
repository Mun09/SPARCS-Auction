let express = require('express');
let router = express.Router();
let jwt = require('jwt-simple');
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
            const data = await UserModel.findOne({
                where: {
                    name: username,
                    password: password
                }
            });
            if (data) {
                return {success: true, data: data};
            } else {
                return {success: false};
            }
        } catch (e) {
            return res.status(500).json({error: e});
        }
    }
}

const userDBInst = UserDB.getInst();

router.post('/getUserIdToken', (req, res) => {
    try {
        const { username, password } = req.body;
        const UserInfo = userDBInst.getUserInfo({username, password});
        if(UserInfo.success) {
            const data = {data: UserInfo.data};
            const id = data._id;
            const token = jwt.encode(data, secret_key);
            return res.status(200).json({success: true, id: id, token: token.data }); 
        } else {
            return res.status(200).json({success: false});
        }
    } catch (e) { return res.status(500).json({Error: e}) };
});

router.post('/getUserInfo', (req, res) => {
    try {
        const { username, password } = req.body;
        const UserInfo = userDBInst.getUserInfo({username, password});
        if(UserInfo.success) {
            return res.status(200).json({success: true, data: UserInfo.data }); 
        } else {
            return res.status(200).json({success: false});
        }
    } catch (e) {
        return res.status(500).json({error: e});
    }
});

router.post('/getUserInfobyIdToken', (req, res) => {

});

module.exports = router;