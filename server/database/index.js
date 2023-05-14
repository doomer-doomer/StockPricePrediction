const express = require('express')
const app = express();
const cors = require('cors')
const bcrypt = require('bcrypt');
const pool = require('./database');
const token = require('./tokenGenerator');
const auth = require('./auth');
const status = require('./activate')
const nodemailer = require('nodemailer')
const mailgen = require('mailgen');
const validate = require('./validate');

app.use(cors());
app.use(express.json());

app.post('/signup',async(req,res)=>{
    try {
        const {user_name,email,password,user_age,gender,contact,country} = req.body;
        const salt = await bcrypt.genSalt(10);
        const bcryptpassword = await bcrypt.hash(password,salt);

        const check = await pool.query("SELECT * FROM Users WHERE email = $1",[email]);
        
        if(check.rows.length!==0){
            return res.status(401).json("Account already found!");
        }

        
        const insert = await pool.query("INSERT INTO Users (user_name,email,password,user_age,gender,contact,country) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [user_name,email,bcryptpassword,user_age,gender,contact,country]);

        const sessionToken = token(insert.rows[0].user_id);
        res.json({sessionToken})
    } catch (error) {
        console.error(error.message);
        res.json("Some Error in Query");
    }
    
})

app.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        
        const data = await pool.query("SELECT email,password,user_id FROM Users WHERE email = $1",
        [email]);

        if(data.rows.length ===0){
            return res.status(401).json("Invalid Credentials");
        }

        const validPassword = await bcrypt.compare(
            password,
            data.rows[0].password
        );

        if(!validPassword){
            return res.status(401).json("Invalid Credentials");
        }

        const sessionToken = token(data.rows[0].user_id);
        res.json({sessionToken});
    } catch (error) {
        console.error(error.message);
        res.json("Some Error in Query");
    }
})

app.post('/auth',auth,async(req,res)=>{
    try {
        const check = await pool.query("SELECT status FROM Users WHERE user_id=$1",[req.user]);
        res.json(check.rows[0].status)
    } catch (error) {
        console.error(error.message);
    }
})

app.post('/mailauth',validate,async(req,res)=>{
    try {
        const verifyMail = await pool.query("UPDATE Users SET status='Verified' WHERE user_id=$1",[req.user]);
        res.json(true)
    } catch (error) {
        console.error(error.message);
    }
})

app.post('/verify',auth,async(req,res)=>{
    try {
        const getMail = await pool.query("SELECT * FROM Users WHERE user_id=$1",
        [req.user])

        let config = {
            service : "gmail",
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASS
            }
        }

        let transporter = nodemailer.createTransport(config);

        let mailGenerator = new mailgen({
            theme:"default",
            product:{
                name:"Chillax",
                link:"https://mailgen.js/"
            }
        })

        const activate = status(getMail.rows[0].user_id)

        let response = {
            body:{
                name:getMail.rows[0].user_name,
                intro:"Click the link to activate your account. \nhttp://localhost:3000/auth/"+activate,
            }
        }

        let mail = mailGenerator.generate(response);

        let message = {
            from:process.env.EMAIL,
            to:getMail.rows[0].email,
            subject:"Confirm your email",
            html:mail
        }

        transporter.sendMail(message).then(()=>{
            return res.status(201).json(
                {token:activate}
            );
        }).catch(err=>{
            return res.status(500).json({err})
        })
    } catch (error) {
        console.error(error.message);
    }
})

app.listen(5002,()=>{
    console.log("(Database) -> Started Successfully!")
})