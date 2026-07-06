const Appointment = require("../models/Appointment");

// BOOK
exports.bookAppointment = async (req, res) => {
    try {
        console.log("BODY:", req.body); // DEBUG

        const appointment = await Appointment.create(req.body);

        res.json(appointment);
    } catch (err) {
        console.error("BOOK ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};