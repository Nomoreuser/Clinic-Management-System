// const express = require("express");
// const nodemailer = require("nodemailer");
// const path = require("path");

import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import session from "express-session";

import pool from "./db.js";

// ✅ Recreate __dirname and __filename for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = 5000;

app.use(express.json());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));


//Email Verification
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "geraldalbonc@gmail.com",
        pass: "odyy zafr cpqc lylx" //App pasword
    }
});
//this is the design looks of message 
async function sendVerification(toEmail, code) {
    const mail = {
        from: '"Clinic Inventory" <geraldalbonc@gmail.com>',
        to: toEmail,
        subject: "Your Verification Code",
        html: `
            <div style="font-family:sans-serif;text-align:center;">
                <h2>Your Verification Code</h2>
                <p style="font-size:24px;letter-spacing:5px;background:#eee;display:inline-block;padding:10px 20px;border-radius:8px;">${code}</p>
                <button style="padding:10px 15px;background:#007bff;color:#fff;border:none;border-radius:6px;cursor:pointer;"
                  onclick="navigate.clipboard.writeText(${code})">
                    Copy Code
                </button>
            </div>
        `
    }

    try{
        let info = await transporter.sendMail(mail);
        console.log("Email sent:", info.response)
    }catch(error){
        console.error("❌ Error:", error)
    }
}
//sent to user email the veri. code 
app.post("/sent-verification",async (req,res)=>{

    const {email, code} = req.body;

    if(!email || !code){
        return res.status(400).json({error: "Email and code required!"})
    }

    try{
        await sendVerification(email,code);
        res.json({success: true, message: "Verification sent!"});
    }catch(error){
        console.error(error);
        res.status(500).json({error: "Failed to send verification email"});
    }
});

//save register to table account
app.post('/users/account', async(req, res) => {
    try{
        const {username, email, password} = req.body;

        const result = await pool.query(
            "INSERT INTO Accounts (username, email, password) VALUES ($1, $2, $3)",
            [username, email, password]
        );
        return res.status(201).json({
            success: true,
            message: "Successfully registered!"
        });
    }catch(error){
        console.error("Failed to fetch quote, using fallback:", error.message);
        res.status(500).json({ error: "Server Error"});
    }
})

// READ
app.post("/users/account-check", async (req, res) => {
  try {
    const {email} = req.body;

    const result = await pool.query(
        "SELECT * FROM Accounts WHERE email = $1",
        [email]
    )
    return res.json({ exists: result.rows.length > 0});

    } catch (err) {
    console.error("CHECK EMAIL ERROR:", err.message); // ✅ Corrected
    res.status(500).json({ error: "Server error" });
}


});

//login 
app.post("/user/login", async(req, res) => {

    try{
        const {email, pass} = req.body;

        const result = await pool.query(
            "SELECT * FROM Accounts WHERE email = $1 AND password = $2",
            [email, pass]
        )
        // return res.json({ exists: result.rows.length > 0})
        if(result.rows.length === 1){
            req.session.user = {email}
            res.json({ok: true});

        }else{
            res.json({ ok: false, message: "Invalid Credentials"});
        }
    }catch(error){
        console.error("CHECK EMAIL ERROR:", error.message);
        res.status(500).json({ error: "Server error" });
    }
})

//user will automatic go to /inventory when go to login if there already do login
app.get('/me', async(req, res) => {

    if(!req.session.user) return res.json({loggedIn: false});

    try {
        const result = await pool.query(
            "SELECT * FROM Accounts WHERE email = $1",
            [req.session.user.email]
        )
        return res.json({ loggedIn: result.rows.length === 1});
    } catch (err) {
        return res.json({ loggedIn: false });
    }
});
//logout remove session saved
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ ok: false, message: "Failed to logout" });
    }

    res.clearCookie('connect.sid', { path: '/' }); // default cookie name used by express-session
    res.json({ ok: true });
  });
});

app.get('/user/account-info', async(req, res)=>{
    if(!req.session.user) return res.json({ ok: false, message: "User not login"});

    try{
        const result = await pool.query(
            "SELECT * FROM Accounts WHERE email = $1",
            [req.session.user.email]
        );
        res.json({ ok: true, user: result.rows[0]});
    }catch(error){
        console.error(error.message);
        res.json({ok:false, message: error.message});
    }
});

app.post('/activity-log', async (req, res) => {
    try {
        const { type, activity } = req.body;

        // Get current user's id
        const getId = await pool.query(
            "SELECT id FROM Accounts WHERE email = $1",
            [req.session.user.email]
        );

        if (getId.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = getId.rows[0].id;

        // Insert activity log
        await pool.query(
            "INSERT INTO Activity (type, activity, userid) VALUES ($1, $2, $3)",
            [type, activity, userId]
        );

        res.status(200).json({success: true, message: "Activity logged successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/activity-log', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                a.type,
                a.activity,
                u.username,
                u.email,
                a.dateTime
            FROM Activity a
            JOIN Accounts u ON a.userid = u.id
            ORDER BY a.dateTime DESC;
        `);

        res.json({ ok: true, activities: result.rows });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});

app.post('/medicines', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "User not logged in" });
  }

  const { name, description, dosage, quantity, image } = req.body;

  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }

  try {
    // Get user ID from session
    const userResult = await pool.query(
      "SELECT id FROM Accounts WHERE email = $1",
      [req.session.user.email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const added_by = userResult.rows[0].id;

    // Insert medicine
    const result = await pool.query(
      `INSERT INTO Medicines (name, description, dosage, quantity, image, added_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, description, dosage, quantity, image, added_by]
    );

    res.status(201).json({ success: true, medicine: result.rows[0] });
  } catch (err) {
    console.error("Error inserting medicine:", err); // ✅ full error object
    res.status(500).json({ error: "Failed to add medicine" });
  }
});


// add up on this not this bellow : >> ok
app.use(express.static("public"));
app.use(express.static("AdminSystem"));

app.get("/",(req,res)=>{
    res.sendFile("index.html", {root: "public"});
});

// Route to file outside public
app.get("/register", (req, res) => {
    const filePath = path.join(__dirname, "AdminSystem/register.html");
    console.log(filePath); // <- log the full path
    res.sendFile(filePath);
});

app.get("/login", (req,res)=>{
    res.sendFile(path.join(__dirname, "AdminSystem/login.html"));
});
app.get("/inventory", (req,res)=>{
    res.sendFile(path.join(__dirname, "AdminSystem/mg.html"));
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})

