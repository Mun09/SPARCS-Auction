let express = require('express');
let router = express.Router();

const AuctionModel = require('../models/auction');


class AuctionDB {
	static _inst_;
	static getInst = () => {
		if(!AuctionDB._inst_) AuctionDB._inst_ = new AuctionDB();
		return AuctionDB._inst_;
	}

	postMoney = async ( item ) => {
		const {id, money} = item;
		const currentItemState = AuctionModel.find();
	}
}
const auctionDBInst = AuctionDB.getInst();

router.post('/postMoney', async (req, res) => {
	try {
		const id = req.body.id, money = req.body.money;
		const result = await AuctionDB.postMoney({id, money});

	} catch {

	}
})