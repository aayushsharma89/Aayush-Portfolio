require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve portfolio frontend files
app.use(express.static(__dirname));

// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect(function (err) {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("MySQL Database Connected Successfully!");
});

// Contact Form API
app.post("/api/contact", function (req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    // Check required fields
    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        });
    }

    const sql =
        "INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)";

    db.query(
        sql,
        [name, email, subject, message],
        function (err, result) {

            if (err) {
                console.error("Error saving contact:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Database error!"
                });
            }

            console.log(
                "Contact saved successfully. ID: " + result.insertId
            );

            return res.status(201).json({
                success: true,
                message: "Message sent successfully!"
            });
        }
    );
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log("Server running on http://localhost:" + PORT);
});