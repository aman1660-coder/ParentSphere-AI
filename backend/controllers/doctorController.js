const Doctor = require("../models/Doctor");

// GET ALL DOCTORS
exports.getDoctors = async (req, res) => {
    const doctors = await Doctor.find();
    res.json(doctors);
};