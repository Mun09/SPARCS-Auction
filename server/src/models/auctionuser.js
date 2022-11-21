const mongoose = require("mongoose");

const OSchemaDefinition = {
    _id: String,
    name: String,
    password: String
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const FeedModel = mongoose.model("auctionuser", schema);

module.exports = FeedModel;