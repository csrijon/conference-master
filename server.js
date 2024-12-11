const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const formData = require('express-form-data');


const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());
app.use(formData.parse());
app.use(express.urlencoded({ extended: true }));
app.use("/assets", express.static("assets"))
app.use("/bower_components", express.static("bower_components"))

// Serve static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create 'uploads' directory if not exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "admin.html"))
});

// In-memory storage for notifications and seminars
const notifications = [];
const seminars = [];

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
});

// Fetch Notifications
app.get("/notifications", (req, res) => {
    res.json(notifications);
});

// Fetch Notifications
app.get("/notifications", (req, res) => {
    res.json(notifications);
});

// Fetch Notifications
app.get("/intro", (_, res) => {
    let obj = JSON.parse(fs.readFileSync("db.json"))
    res.json(obj.intro)
});

app.post("/intro", (req, res) => {
    const data = req.body;
    let obj = JSON.parse(fs.readFileSync("db.json"))
    if (data.venue) {
        console.log("HERE")
        obj.intro.venue = data.venue;
    }
    if (data.name) {
        obj.intro.name = data.name;
    }
    if (data.tagline) {
        obj.intro.tagline = data.tagline;
    }
    fs.writeFileSync("db.json", JSON.stringify(obj))
    res.status(200).send(obj.intro)
});

app.get("/about", (_, res) => {
    let obj = JSON.parse(fs.readFileSync("db.json"))
    res.json(obj.about)
});

app.post("/about", (req, res) => {
    const data = req.body;
    let obj = JSON.parse(fs.readFileSync("db.json"))
    if (data.aboutus) {
        console.log("HERE")
        obj.about.aboutus = data.aboutus;
    }
    fs.writeFileSync("db.json", JSON.stringify(obj))
    res.status(200).send(obj.about)
});

// Push Notification
app.post("/notifications", (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Notification message is required" });
    }
    notifications.push({ message });
    res.status(201).json({ success: true, message: "Notification added" });
});

// Fetch Seminars
app.get("/seminars", (req, res) => {
    res.json(seminars);
});

// Add Seminar
app.post("/seminars", upload.single("image"), (req, res) => {
    const { title, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !image) {
        return res.status(400).json({ error: "All fields are required" });
    }

    seminars.push({ title, description, image });
    res.status(201).json({ success: true, message: "Seminar added" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
