const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    fee: Number,
    specialization: String,

    // 🔥 NEW
    availableSlots: [String]
});

module.exports = mongoose.model("Doctor", doctorSchema);