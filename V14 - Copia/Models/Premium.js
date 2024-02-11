const { Schema, model } = require("mongoose");

let premiumSchema = new Schema({
    userId: String
}, { versionKey: false });

module.exports = model("premiumSchema", premiumSchema);