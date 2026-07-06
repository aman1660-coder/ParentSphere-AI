const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

router.get("/", async (req, res) => {
    const data = await Appointment.find();
    res.json(data);
});

router.post("/", async (req, res) => {
    const newApp = new Appointment(req.body);
    await newApp.save();
    res.json({ message: "Booked" });
});

module.exports = router;