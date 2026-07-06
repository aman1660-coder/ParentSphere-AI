const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    parentName: String,
    email: String,
    doctorName: String,
    date: String,
    time: String
});

module.exports = mongoose.model("Appointment", appointmentSchema);