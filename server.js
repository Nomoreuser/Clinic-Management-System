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

import multer from 'multer';
import fs from 'fs';


// ✅ Recreate __dirname and __filename for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

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
    const type = req.query.type;

    try {
        let query = `
            SELECT 
                a.type,
                a.activity,
                a.datetime,
                u.username,
                u.email
            FROM Activity a
            LEFT JOIN Accounts u
            ON a.userId = u.id
        `;

        let params = [];

        if (type && type !== "all") {
            query += " WHERE a.type = $1 ORDER BY a.datetime DESC";
            params.push(type);
        } else {
            query += " ORDER BY a.datetime DESC";
        }

        const result = await pool.query(query, params);

        res.json({ ok: true, activities: result.rows });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});


////////////////////////////////////////////////////////////////////////
app.post('/medicines', upload.single('image'), async (req, res) => {
  const { name, description, dosage, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name) {
    return res.status(400).json({ error: "Name required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Medicines (name, description, dosage, quantity, image)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, dosage, quantity, image]
    );
    res.status(201).json({ success: true, medicine: result.rows[0] });
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ error: "Failed to add medicine" });
  }
});

app.get('/medicines', async(req, res) => {

    try{
        const result = await pool.query(
            "SELECT * FROM Medicines ORDER BY created_at DESC"
        )
        res.json({ok: true, meds: result.rows})
    }catch(err){
        console.error("GET Medicines: ", err)
    }
});

app.delete("/medicines/:id", async (req, res) => {
    const id = req.params.id;

    try {
        // 1. Get medicine image filename from DB
        const result = await pool.query(
            "SELECT name, dosage, image FROM medicines WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        const { name, dosage, image: imageFilename} = result.rows[0];

        const namedosage = `${name} ${dosage}`;

        await pool.query("BEGIN");
        
        await pool.query("DELETE FROM Records WHERE itemname = $1", [namedosage]);

        await pool.query("DELETE FROM medicines WHERE id = $1", [id]);

        await pool.query("COMMIT")

        // 3. Delete physical file from uploads
        if (imageFilename) {
            const imagePath = path.join(__dirname, "uploads", imageFilename);

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ success: true, message: "Deleted successfully" });

    } catch (err) {
        await pool.query("ROLLBACK");
        console.error("DELETE ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.put("/medicines/:id", upload.single("image"), async (req, res) => {
    const id = req.params.id;
    const { name, description, dosage, quantity, removeImage } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name required" });
    }

    try {
        // 1. Get existing medicine
        const result = await pool.query(
            "SELECT image FROM Medicines WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Medicine not found" });
        }

        const oldImage = result.rows[0].image;
        let newImage = oldImage;

        // 2. If new file uploaded → use new image
        if (req.file) {
            newImage = req.file.filename;

            // delete old image
            if (oldImage) {
                const oldPath = path.join(__dirname, "uploads", oldImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        // 3. If removeImage = "true" → delete old image + set to null
        if (removeImage === "true") {
            if (oldImage) {
                const oldPath = path.join(__dirname, "uploads", oldImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            newImage = null;
        }

        // 4. Update DB
        await pool.query(
            `UPDATE Medicines
             SET name = $1, description = $2, dosage = $3, quantity = $4, image = $5
             WHERE id = $6`,
            [name, description, dosage, quantity, newImage, id]
        );

        res.json({ success: true, message: "Medicine updated successfully" });

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

//Records for students side
/////////////////////////////////////////
app.post('/records', async(req, res)=>{
    const {studentId, type, itemName, qty, itemId} = req.body;

    try{
        await pool.query('INSERT INTO Records (studentid, type, itemname, qty) VALUES($1, $2, $3, $4) RETURNING *',
            [studentId, type, itemName, qty]
        )

        if(type == "get"){
            await pool.query(
                `UPDATE Medicines SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1`,
                [qty, itemId]
            );
        }

        if(type == "borrowed"){
            await pool.query(
                `UPDATE Equipments SET quantity = quantity - $1 WHERE id = $2 AND quantity >= $1`,
                [qty, itemId]
            );
        }

        if(type == "returned"){
            await pool.query(
                `UPDATE Equipments SET quantity = quantity + $1 WHERE name = $2`,
                [qty, itemName]
            );
        }

        res.json({ok: true, message: "success"});
    }catch(error){
        console.log("Records: " + error);
        res.json({ok: false, message: "error"});
    }
});
// app.get('/records', async (req, res) => {
//     const type = req.query.type;

//     try {
//         let query = `
//             SELECT * FROM Records
//         `;

//         let params = [];

//         if (type && type !== "all") {
//             query += " WHERE type = $1 ORDER BY datecreated DESC";
//             params.push(type);
//         } else {
//             query += " ORDER BY datecreated DESC";
//         }

//         const result = await pool.query(query, params);

//         res.json({ ok: true, records: result.rows });

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ ok: false, message: error.message });
//     }
// });




// app.get('/borrowed-items/:sid', async (req, res) => {
//     const sid = req.params.sid;

//     try {
//         const result = await pool.query(
//             `SELECT itemname, SUM(qty) AS total
//              FROM Records
//              WHERE type = 'borrowed' AND studentid = $1
//              GROUP BY itemname`,
//             [sid]
//         );

//         res.json({ 
//             studentId: sid,
//             borrowedItems: result.rows
//         });

//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });


// Equipments
//////////////////////////////////////////////////////////////////////

app.get('/records', async (req, res) => {
    const type = req.query.type;

    try {
        let query = "";
        let params = [];

        if (type && !["itemNotReturned"].includes(type)) {

            query = `
                SELECT *
                FROM Records
            `;

            if (type !== "all") {
                query += " WHERE type = $1";
                params.push(type);
            }

            query += " ORDER BY datecreated DESC";
        }
        else if (type === "itemNotReturned") {

            query = `
                SELECT 
                    r.studentid,
                    r.itemname,

                    -- COMPUTE STILL NOT RETURNED
                    (SUM(CASE WHEN r.type = 'borrowed' THEN r.qty ELSE 0 END) 
                    - SUM(CASE WHEN r.type = 'returned' THEN r.qty ELSE 0 END)) AS qty,

                    'not returned' AS type,

                    MAX(r.datecreated) AS datecreated
                FROM Records r
                GROUP BY r.studentid, r.itemname
                HAVING 
                    (SUM(CASE WHEN r.type = 'borrowed' THEN r.qty ELSE 0 END)
                    - SUM(CASE WHEN r.type = 'returned' THEN r.qty ELSE 0 END)) > 0
                ORDER BY qty DESC;
            `;
        }


        const result = await pool.query(query, params);

        res.json({ ok: true, records: result.rows });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ ok: false, message: error.message });
    }
});


app.get('/borrowed-items/:sid', async (req, res) => {
    const sid = req.params.sid;

    try {
        const result = await pool.query(
            `SELECT 
                itemname,
                SUM(CASE WHEN type = 'borrowed' THEN qty ELSE 0 END) -
                SUM(CASE WHEN type = 'returned' THEN qty ELSE 0 END) AS total,
                MAX(datecreated) AS last_borrowed
             FROM Records
             WHERE studentid = $1
             GROUP BY itemname
             HAVING SUM(CASE WHEN type = 'borrowed' THEN qty ELSE 0 END) -
                    SUM(CASE WHEN type = 'returned' THEN qty ELSE 0 END) > 0
             ORDER BY last_borrowed DESC`,
            [sid]
        );

        res.json({
            studentId: sid,
            borrowedItems: result.rows
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/equipments', upload.single('image'), async (req, res) => {
  const { name, description, quantity } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name) {
    return res.status(400).json({ error: "Name required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Equipments (name, description, quantity, image)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, quantity, image]
    );
    res.status(201).json({ success: true, message: "success"});
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ error: "Failed to add medicine" });
  }
});

app.get('/equipments', async(req, res) => {

    try{
        const result = await pool.query(
            "SELECT * FROM Equipments ORDER BY created_at DESC"
        )
        res.json({ok: true, equips: result.rows})
    }catch(err){
        console.error("GET Equipments: ", err)
    }
});

// app.delete("/equipments/:id", async (req, res) => {
//     const id = req.params.id;

//     try {
//         // 1. Get medicine image filename from DB
//         const result = await pool.query(
//             "SELECT image FROM equipments WHERE id = $1",
//             [id]
//         );

//         if (result.rows.length === 0) {
//             return res.status(404).json({ success: false, message: "Not found" });
//         }

//         const imageFilename = result.rows[0].image;

//         // 2. Delete DB row
//         await pool.query("DELETE FROM equipments WHERE id = $1", [id]);

//         // 3. Delete physical file from uploads
//         if (imageFilename) {
//             const imagePath = path.join(__dirname, "uploads", imageFilename);

//             if (fs.existsSync(imagePath)) {
//                 fs.unlinkSync(imagePath);
//             }
//         }

//         res.json({ success: true, message: "Deleted successfully" });

//     } catch (err) {
//         console.error("DELETE ERROR:", err);
//         res.status(500).json({ success: false, message: "Server error" });
//     }
// });

app.delete("/equipments/:id", async (req, res) => {
    const id = req.params.id;

    try {
        // 1. Get equipment info (name + image)
        const result = await pool.query(
            "SELECT name, image FROM equipments WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Equipment not found" });
        }

        const { name, image: imageFilename } = result.rows[0];

        await pool.query("BEGIN");

        await pool.query("DELETE FROM Records WHERE itemname = $1", [name]);

        await pool.query("DELETE FROM equipments WHERE id = $1", [id]);

        await pool.query("COMMIT");

        if (imageFilename) {
            const imagePath = path.join(__dirname, "uploads", imageFilename);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({ success: true, message: "Equipment and related records deleted successfully" });

    } catch (err) {
        await pool.query("ROLLBACK");
        console.error("DELETE ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



app.put("/equipments/:id", upload.single("image"), async (req, res) => {
    const id = req.params.id;
    const { name, description, quantity, removeImage } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name required" });
    }

    try {
        // 1. Get existing medicine
        const result = await pool.query(
            "SELECT image FROM Equipments WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Equipments not found" });
        }

        const oldImage = result.rows[0].image;
        let newImage = oldImage;

        // 2. If new file uploaded → use new image
        if (req.file) {
            newImage = req.file.filename;

            // delete old image
            if (oldImage) {
                const oldPath = path.join(__dirname, "uploads", oldImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        // 3. If removeImage = "true" → delete old image + set to null
        if (removeImage === "true") {
            if (oldImage) {
                const oldPath = path.join(__dirname, "uploads", oldImage);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            newImage = null;
        }

        // 4. Update DB
        await pool.query(
            `UPDATE Equipments
             SET name = $1, description = $2, quantity = $3, image = $4
             WHERE id = $5`,
            [name, description, quantity, newImage, id]
        );

        res.json({ success: true, message: "Equipments updated successfully" });

    } catch (err) {
        console.error("UPDATE ERROR:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// ///////////////////////////////////////////////////////////////////////////////
// add up on this not this bellow : >> ok
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static("AdminSystem"));
app.use(express.static("StudentSystem"));

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
app.get("/student", (req, res)=>{
    res.sendFile(path.join(__dirname, "StudentSystem/student.html"))
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})

