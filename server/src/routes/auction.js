let express = require('express');
let router = express.Router();

const AuctionModel = require('../models/feed');

class AuctionDB {
	static _inst_;
	static getInst = () => {
		if(!AuctionDB._inst_) AuctionDB._inst_ = new AuctionDB();
		return AuctionDB._inst_;
	}

	postMoney = async ( item ) => {
		const {id, money} = item;
		try {
			const currentItemState = await AuctionModel.find({_id: id});
			return {success: true, data: currentItemState};
		} catch (e) {
			return {success: false, data: 'Error'};
		}
	}

	changeCurrentValue = async (item) => {
		const {id, money} = item;
		try {
			const result = await AuctionModel.findOneAndUpdate({_id: id}, {$set: {CurrentValue: money}}, {new: true});
			return {success: true, data: result};
		} catch (e) {
			return {success: false, data: 'Error'};
		}
	}
}
const auctionDBInst = AuctionDB.getInst();

router.post('/postAuction', async (req, res) => {
	try {
		const {id, money} = req.query;
		const result = await auctionDBInst.postMoney({id, money});
		if(!result.success) res.status(500).json({error: result.data});
		const { CurrentValue } = result.data[0];

		if(Number(CurrentValue) < Number(money)) {
			const result2 = await auctionDBInst.changeCurrentValue({id, money});
			return res.status(200).json(result2);
		} else {
			return res.status(200).json({success: false});
		}
	} catch (e) {
		return res.status(500).json({error: e});
	}
})

module.exports = router;