const mongoose = require("mongoose");

const OSchemaDefinition = {
    _id: String,
    title: String,
    content: {
        type: String,
        default: "No Content",
    },
    InitialValue: String,
    CurrentValue: String,
    seller: {
        type: String,
        default: ""
    },
    master: {
        type: String,
        default: ""
    },
    diff: String
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const FeedModel = mongoose.model("feed", schema);

module.exports = FeedModel;