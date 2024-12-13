const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");
const User = require("../models/userMongo");

const router = express.Router();

// Реєстрація
router.post("/register", async (req, res) => {
  console.log("Request received:", req.body);
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required!" });
}

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
    }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
          return res.status(400).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          username,
          email,
          password: hashedPassword,
          role,  
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Error during registration", error: error.message });
  }
});
  
  // Вхід
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            avatar: user.avatar || "https://www.gravatar.com/avatar?d=mp",
        });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
