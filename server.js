// const express = require("express");
// const nodemailer = require("nodemailer");
// const path = require("path");

import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import pool from "./db.js";

// ✅ Recreate __dirname and __filename for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = 5000;

app.use(express.json());


//Email Verification
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "geraldalbonc@gmail.com",
        pass: "odyy zafr cpqc lylx" //App pasword
    }
});
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
        console.error("CHECK EMAIL ERROR:", error.message);
        res.status(500).json({ error: "Server error" });
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

