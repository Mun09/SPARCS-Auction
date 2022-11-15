const mongoose = require("mongoose");

const OSchemaDefinition = {
    _id: String,
    picture: String
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const PictureFeedModel = mongoose.model("picture", schema);

module.exports = PictureFeedModel;