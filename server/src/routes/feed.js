const express = require('express');
const FeedModel = require('../models/feed');

const router = express.Router();

class FeedDB {
	static _inst_;
	static getInst = () => {
		if(!FeedDB._inst_) FeedDB._inst_ = new FeedDB();
		return FeedDB._inst_;
	}

	constructor() { console.log("[Feed-DB] DB Init Completed"); }

	searchItems = async ( item ) => {
		const { searchString } = item;
		const countLimit = 10;
		try {
			const res = await FeedModel.find().sort({'createdAt': -1}).limit(countLimit).exec();
			return {success: true, data: res};
		} catch (e) {
			console.log(`[Feed-DB] Select Error: ${ e }`);
			return { success: false, data: `DB Error - ${ e }` };
		}
	}
}

const feedDBInst = FeedDB.getInst();

router.get('/getfeed', async (req, res) => {
	try {
		const searchString = req.query.search;
		const dbRes = await feedDBInst.searchItems({ searchString });
		if(dbRes.success) return res.status(200).json(dbRes.data);
		else return res.status(500).json({error: dbRes.data});
	} catch (e) {
		return res.status(500).json({error: e});
	}
});

module.exports = router;