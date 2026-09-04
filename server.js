require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


// MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// Test database connection
db.getConnection(function (err, connection) {

    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("MySQL Database Connected Successfully!");

    connection.release();
});


// Home route
app.get("/", function (req, res) {
    res.send("Portfolio Backend is Running 🚀");
});


// Contact API
app.post("/api/contact", function (req, res) {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        });
    }

    const sql = `
        INSERT INTO contacts (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    `;

    db.execute(
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
                "Contact saved successfully! ID: " + result.insertId
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
    console.log("Server running on port " + PORT);
});