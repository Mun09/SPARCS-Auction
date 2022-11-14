const mongoose = require("mongoose");

const OSchemaDefinition = {
    _id: String,
	picture: String,
    title: String,
    content: {
        type: String,
        default: "No Content",
    },
    diff: String
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const FeedModel = mongoose.model("feed", schema);

module.exports = FeedModel;