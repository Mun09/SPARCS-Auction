let express = require('express');
let router = express.Router();
let jwt = require('jwt-simple');
let getRandomInt = require('../tools/getRandom.js');
let secret_key = process.env.SECRET_KEY;

const UserModel = require('../models/auctionuser');
const FeedModel = require('../models/feed');
const authUserMiddleware = require('../middleware/auth.js');

const asyncFilter = async (arr, predicate) => {
	const results = await Promise.all(arr.map(predicate));
	return arr.filter((_v, index) => results[index]);
};

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
            var data = await UserModel.findOne(findArguments);
            if(data == null) {
                return {success: false}
            }

            const valid_buylist = await asyncFilter(data.buylist, async (v) => {
                var result = await FeedModel.findOne({_id: v});
                if(result != null){
                    return true;
                }
                return false;
            });

            const valid_selllist = await asyncFilter(data.selllist, async (v) => {
                var result = await FeedModel.findOne({_id: v});
                if(result != null){
                    return true;
                }
                return false;
            });

            data = await UserModel.findOneAndUpdate(findArguments, {$set: {buylist: valid_buylist, selllist: valid_selllist}}, {new: true});
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

    addUserSelllist = async ( item ) => {
        try {
            const { userid, username, password, sellid } = item;
            await UserModel.updateOne({ name : username, password }, { $push : { selllist : sellid} });
            await FeedModel.updateOne({ _id: sellid }, { $set : {seller: userid}});
            return {success : true};
        } catch (e) {
			console.log(`[AuctionUser-DB] Selllist Error: ${ e }`);
			return { success: false, data: `DB Error - ${ e }` };
        }
    }

    addUserBuylist = async ( item ) => {
        try {
            const { userid, username, password, buyid } = item;
            await UserModel.updateOne({ name : username, password }, { $addToSet : { buylist : buyid} });
            console.log(buyid, " ", userid);
            await FeedModel.updateOne({ _id: buyid }, { $set : { master: userid }});
            return {success : true};
        } catch (e) {
			console.log(`[AuctionUser-DB] Selllist Error: ${ e }`);
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
        const {username, password} = req.body;
        const isThere = await userDBInst.getUserInfo({username});
        if(isThere.success==true) {
            return res.status(200).json({success: false});
        }
        const result = await userDBInst.registerUserInfo({username, password});
        return res.status(200).json({success: true});
    } catch (e) {
        return res.status(500).json({error: e});
    }
})

router.post('/addSelllist', authUserMiddleware, async (req, res) => {
    try {
        const {_id, id, token} = req.body;
        const password = jwt.decode(token, secret_key);
        const UserInfo = await userDBInst.getUserInfo({username: id, password});
        const result = await userDBInst.addUserSelllist({userid: UserInfo.data._id, username: UserInfo.data.name, password: UserInfo.data.password, sellid : _id});
        return res.status(200).json({isOK: true});;
    } catch (e) {
        return res.status(500).json({error: e});
    }
})

router.post('/addBuylist', authUserMiddleware, async (req, res) => {
    try {
        const {_id, id, token} = req.body;
        const password = jwt.decode(token, secret_key);
        const UserInfo = await userDBInst.getUserInfo({username : id, password});
        const result = await userDBInst.addUserBuylist({userid: UserInfo.data._id , username: UserInfo.data.name, password: UserInfo.data.password, buyid : _id});
        return res.status(200).json({isOK: true});;
    } catch (e) {
        return res.status(500).json({error: e});
    }
})

module.exports = router;