const mongoose = require("mongoose");
const Doctor = require("./models/Doctor");

// 🔥 CONNECT TO DB
mongoose.connect("mongodb://localhost:27017/parentsphere", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function seed() {
    try {
        // ❌ REMOVE OLD DATA
        await Doctor.deleteMany();

        // ✅ INSERT NEW DOCTORS WITH SLOTS
        await Doctor.insertMany([
            {
                name: "Dr. Aditi Sharma",
                rating: 4.8,
                fee: 850,
                specialization: "Family Therapy",
                availableSlots: ["10:00 AM", "10:30 AM", "11:00 AM"]
            },
            {
                name: "Bharati K Trivedi",
                rating: 4.7,
                fee: 880,
                specialization: "Child Psychology",
                availableSlots: ["11:30 AM", "12:00 PM", "4:00 PM"]
            },
            {
                name: "Dr. Rajesh Singh",
                rating: 4.6,
                fee: 820,
                specialization: "Career Guidance",
                availableSlots: ["10:00 AM", "11:00 AM", "5:00 PM"]
            }
        ]);

        console.log("Doctors with slots inserted ✅");

        process.exit();

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

seed();