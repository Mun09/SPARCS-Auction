const mongoose = require("mongoose");
const FKHelper = require("./helpers/foreign-key-helper");

const OSchemaDefinition = {
    _id: String,
    name: String,
    password: String,
    buylist: [String],
    selllist: [String]
};

const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const AuctionUserModel = mongoose.model("auctionuser", schema);

module.exports = AuctionUserModel;