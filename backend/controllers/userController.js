const User = require("../models/User");

// REGISTER
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password });

        res.json({
            name: user.name,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// LOGIN
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({
            name: user.name,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};