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
const Razorpay = require('razorpay');

app.use(cors());
app.use(express.json());

//Databse Quries
// CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
//CREATE TABLE Users( user_id uuid DEFAULT uuid_generate_v4(), user_name VARCHAR NOT NULL,password VARCHAR NOT NULL, email VARCHAR NOT NULL,user_age SMALLINT NOT NULL, gender VARCHAR, contact BIGINT, country VARCHAR, status VARCHAR NOT NULL DEFAULT 'Not Verified');

//CREATE TABLE Transactions(id VARCHAR NOT NULL,amount_paid BIGINT,amount_due BIGINT, attempts SMALLINT, createdAt BIGINT, currency VARCHAR NOT NULL DEFAULT 'INR',type VARCHAR,status VARCHAR);

var instance = new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
});

app.post('/request',async(req,res)=>{
    try {
        const {amount,currency} = req.body;
        const order = instance.orders.create({amount,currency},async function(err,neworder){
            console.log(neworder);
            try {
                const create = await pool.query('INSERT INTO Transactions (id,amount_paid,amount_due,attempts,createdAt,currency,type,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
                [neworder.id,neworder.amount_due,neworder.amount_paid,neworder.attempts,neworder.created_at,neworder.currency,neworder.entity,neworder.status])
            } catch (error) {
                console.log(error.message)
            }
            
            return res.json(neworder)
        })
    } catch (error) {
        res.json("Error on the Razorpay's server")
    }
})

app.post('/getrequest',async(req,res)=>{
    try {
        const {id} = req.body
        const get = await pool.query("SELECT * FROM Transactions WHERE id = $1",
        [id]);
        res.json(get.rows[0])
    } catch (error) {
        res.json("Error in my server")
    }
})

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

app.post('/getData',auth,async(req,res)=>{
    try {
        const check = await pool.query("SELECT user_id,user_name,email,user_age,gender,contact,country FROM Users WHERE user_id=$1",[req.user]);
        res.json(check.rows)
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
                name:"GrowthIn",
                link:"https://growthin.vercel.app"
            }
        })

        const activate = status(getMail.rows[0].user_id)

        let response = {
            body:{
                name:getMail.rows[0].user_name,
                intro:'We are thrilled to welcome you to GrowthIn, your gateway to advanced securities analysis and prediction tools! Your decision to join our community is a significant step towards achieving your financial goals and making informed investment decisions.To get started, we need to verify your account. Please follow the steps below to complete the verification process:',
                action:{
                    button: {
                        color:"#0072F5",
                        text:"Click to verify",
                        link:"http://localhost:3000/auth/"+activate
                        }
                    },
                outro:"Note: Please do not share your verification code with anyone, as it is essential for account security. If you did not register for GrowthIn, please disregard this email."
            }
        }

        let mail = mailGenerator.generate(response);

        let message = {
            from:process.env.EMAIL,
            to:getMail.rows[0].email,
            subject:"Welcome to GrowthIn - Verify Your Account",
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