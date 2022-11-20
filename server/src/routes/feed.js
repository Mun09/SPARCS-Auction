let express = require('express');
let multer = require('multer');
let mongoose = require('mongoose');
let uuidv4 = require('uuid/v4');
let router = express.Router();
let fs = require('fs');
let path = require('path');

const FeedModel = require('../models/feed');
const PictureFeedModel = require('../models/picture');


const DIR = './public/';
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
			cb(null, DIR);
		},
	filename: (req, file, cb) => {
			const fileName = file.originalname.toLowerCase().split(' ').join('-');
			cb(null, uuidv4() + '-' + fileName)
	}
});

var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
			if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
					cb(null, true);
			} else {
					cb(null, false);
					return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
			}
	}
});

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
		const findArguments = searchString === "" ? {} : {$or: [ {_id: searchString}, { title: { "$regex": searchString } }, { content: { "$regex": searchString } } ]};
		
		try {
			const res = await FeedModel.find(findArguments).sort({'createdAt': -1}).limit(countLimit).exec();
			return {success: true, data: res};
		} catch (e) {
			console.log(`[Feed-DB] Select Error: ${ e }`);
			return { success: false, data: `DB Error - ${ e }` };
		}
	}

	searchPictureItems = async ( item ) => {
		const { searchString } = item;
		const countLimit = 10;
		const findArguments = searchString === "" ? {} : {_id: searchString};

		try {
			const res = await PictureFeedModel.find(findArguments).sort({'createdAt': -1}).limit(countLimit).exec();
			return {success: true, picture_data: res};
		} catch (e) {
			console.log(`[Feed-DB] Picture Select Error: ${ e }`);
			return { success: false, picture_data: `DB Error - ${ e }` };
		}
	}

	addItem = async ( item ) => {
		const { _id, title, content, diff, InitialValue, CurrentValue } = item;
		try {
			const newItem = new FeedModel({_id, title, content, diff, InitialValue, CurrentValue});
			const res = await newItem.save();
      return true;
		} catch (e) {
			console.log(`[Feed-DB] Insert Error: ${ e }`);
			return { success: false, data: `DB Error - ${ e }` };
		}
	}

	addPictureItem = async ( item ) => {
		const { _id, url, filename} = item;
		try {
			const newItem = new PictureFeedModel({
				_id: _id,
				picture: url + '/public/' + filename
			});
			const res = await newItem.save();
      return true;
		} catch (e) {
			console.log(`[Feed-DB] Picture Insert Error: ${ e }`);
			return { success: false, data: `DB Error - ${ e }` };
		}
	}

	deleteItem = async ( item ) => {
		const { id } = item;
		try {
			const res = await PictureFeedModel.findOneAndDelete({_id: id}).then((
				async (r) => {
					const basename = path.basename(r.picture);
					fs.unlink('public/' + basename, (err) => {
						if(err) throw err;
						console.log('file deleted');
					})
					console.log(r);
					await FeedModel.deleteOne({_id: id})
				}
			));
			return true;
		} catch (e) {
			console.log(`[Feed-DB] Delete Error: ${ e }`);
			return { success: false, data: `DB Error - ${ e }`};
		}
	}
}

const feedDBInst = FeedDB.getInst();

router.get('/getFeed', async (req, res) => {
	try {
		const searchString = req.query.search;
		const dbRes = await feedDBInst.searchItems({ searchString });
		if(dbRes.success) return res.status(200).json(dbRes.data);
		else return res.status(500).json({error: dbRes.data});
	} catch (e) {
		return res.status(500).json({error: e});
	}
});

router.get('/getPicture', async (req, res) => {
	try {
		const searchString = req.query.search;
		const dbRes = await feedDBInst.searchPictureItems({ searchString });
		if(dbRes.success) return res.status(200).json(dbRes.picture_data);
		else return res.status(500).json({error: dbRes.picture_data});
	} catch (e) {
		return res.status(500).json({error: e});
	}
});

router.post('/addFeed', async (req, res) => {
	try {
		const { _id, title, content, diff, InitialValue, CurrentValue} = req.body;
		const addResult = await feedDBInst.addItem({_id, title, content, diff, InitialValue, CurrentValue});
		if(addResult) return res.status(200).json({isOK: true});
		else return res.status(500).json({error: addResult});
	} catch (e) {
		return res.status(500).json({error: e});
	}
});

router.post('/addPicture', upload.single('picture'), async (req, res, next) => {
	try {
		const url = req.protocol + '://' + req.get('host');
		const { _id, picture } = req.body;
		const addResult = await feedDBInst.addPictureItem({_id, url, filename: req.file.filename});
		if(addResult) return res.status(200).json({isOK: true});
		else return res.status(500).json({error: addResult});
	} catch (e) {
		return res.status(500).json({error: e});
	}
});

router.post('/deleteItem', async (req, res) => {
	try {
		const { id } = req.body;
		const deleteResult = await feedDBInst.deleteItem({id});
		if(deleteResult) return res.status(200).json({isOK: true});
		else return res.status(500).json({error: addResult});
	} catch (e) {
		return res.status(500).json({error: e});
	}
})

module.exports = router;