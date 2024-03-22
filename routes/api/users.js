/** @format */

const express = require("express");
const router = express.Router();
const { login } = require("./auth");
const authMiddleware = require("./authMiddleware");
const User = require("../../models/user");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jimp = require("jimp");

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      subscription: "starter",
    });

    await newUser.save();

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", login);

router.use(authMiddleware);

router.get("/logout", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/current", authMiddleware, async (req, res) => {
  try {
    res.status(200).json({
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const uploadDir = path.join(__dirname, "../../tmp");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.patch("/avatars", upload.single("avatar"), async (req, res) => {
  try {
    
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image = await jimp.read(req.file.path);

    
    await image.resize(250, 250);

    
    const uniqueFileName = Date.now() + "_" + req.file.originalname;

    
    await image.writeAsync(
      path.join(__dirname, "../../public/avatars", uniqueFileName)
    );

    
    fs.unlinkSync(req.file.path);

    
    const user = await User.findById(req.user._id);

    user.avatarURL = `/avatars/${uniqueFileName}`;
    await user.save();

    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
