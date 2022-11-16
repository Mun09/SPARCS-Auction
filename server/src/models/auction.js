const mongoose = require("mongoose");

const OSchemaDefinition = {
    _id: String,
    cost: String,
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const FeedModel = mongoose.model("auction", schema);

module.exports = FeedModel;