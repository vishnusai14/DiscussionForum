const Cookie = require("universal-cookie")
require("dotenv").config()
const bcrypt = require('bcryptjs')
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const path = require("path")
const nodemailer = require("nodemailer")
const app = express()
const jwt = require('jsonwebtoken')
const blogModel = require("./models/blogModel")
const userModel = require("./models/userModel")
//app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(cors())
const secret = process.env.JWT_SECRET
const PORT = process.env.PORT || 5000

let uri = `mongodb+srv://Vishnu_Sai:${process.env.DB_PASSWORD}@cluster0.hkghe.mongodb.net/${process.env.DB_DBNAME}?retryWrites=true&w=majority`

// let uri  = "mongodb://localhost:27017/blogs"




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

mongoose.connect(uri , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false
}).then((response) => {
    console.log(response)
}).catch((err) => {
    console.log(err)
})




app.post("/checkotp" , (req,res) => {
    const cookie = new Cookie(req.headers.cookie)
    let token = req.body.token
    let otp = req.body.otp
    if(token){
        try{
            let user = jwt.verify(token, secret)
            if(user) {
               bcrypt.compare(otp.toString(), cookie.get('SSU_KEY_ENC') , (err, result) => {
                   if(result) {
                    userModel.updateOne({email : user.email} , {verify : true} , (err , result) => {
                        if(err) {
                            console.log(err)
                        }else{
                            res.status(200).send(token)
                        }
                    })
                }else{
                    res.status(500).send({error : "Check The Otp "})
                    res.end()
                }
                   
               })
                    
               
            }
        }catch(err){
            res.status(500).send({error : "No User "})
            res.end()
        }
        
    }else{
        res.status(500).send({error : "Unauthorized"})
    }

})


app.post("/newuser" , (req,res)=>{
    
    userModel.findOne({email : req.body.email} , (err, found) => {
        if(err) {
            res.status(500).send({error : "Some Internal Error"})
            res.end()
        }
        if(found){
            if(found.verify){
                res.status(500).send({error : "User Already Exist"})
                res.end()
            }else{
                userModel.deleteOne({email : found.email} , (err, result) => {
                    if(err) {
                        console.log(err)
                    }else{
                        res.status(500).send({error : "Please Signup Again To Verify You"})
                    }
                })
            }
        }else{
            const otp = Math.ceil(Math.random() * 10000)
            const otp_string = otp.toString()
            let mailOptions = {
                from: process.env.GMAIL,
                to: req.body.email,
                subject: 'OTP',
                html: `<h3>Your OTP is : </h3><br />${otp}`
            }
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    
                }
            })
            let hashedPassword = null
            bcrypt.hash(req.body.password, 2 , (err, hash) => {
                hashedPassword = hash
                
                let user = new userModel({
                    user : req.body.user,
                    email : req.body.email,
                    password : hashedPassword,
                    verify : false
                })
               
                user.save()
            }) 
            
            let data = {
                email : req.body.email,
                user : req.body.user
            }
            let token = jwt.sign(data,secret)
            

            let responseData = {
                msg : "Success",
                tokenId : token,
                otp : otp_string
            }
        
            res.status(200)
           
            res.send(responseData)
            
            res.end()
        }
          
        
    })
   
   
})


app.post("/checkuser" , (req,res) => {

    
        userModel.findOne({email : req.body.email} , (err, found) => {
            if(err) {
                res.status(500).send({error : "SomeError"})
                res.end()
            }
            if(!found){
                res.status(500).send({error : "No User Exists"})
            }else{ 
                if(found.verify){
                    if(req.body.user === found.user){
                        bcrypt.compare(req.body.password, found.password, (err,result) => {
                            if(result){
                                let data = {
                                    email : req.body.email,
                                    user : req.body.user
                                }
                                let token = jwt.sign(data,secret)
                                let responseData = {
                                    msg : "Success",
                                    tokenId : token
                                }
                              
                                res.status(200)
                               
                                res.send(responseData)
                                
                                res.end()
                            }else{
                                res.status(500).send({error : 'Password Error'})
                                res.end()
                            } 
                        })
                    }else{
                        res.status(500).send({error : 'Check Username Or Password'})
                        res.end()
                    }
                }else{
                    res.status(500).send({error : 'Please Verify '})
                    res.end()
                }
                
               
                    
                
            }
        })
})

app.post("/check" , (req,res) => {
    let token = req.body.token
    
    if(token){
        try{
            let user = jwt.verify(token, secret)
            if(user) {
                res.status(200)
                res.send(user.user)
                res.end()
            }
        }catch(err){
            res.status(500).send({error : "No User "})
            res.end()
        }
        
    }else{
        res.status(500).send({error : "Unauthorized"})
        res.end()
    }
    
    
})

app.get("/show" , (req,res) => {
    blogModel.find({}, (err, found) => {
        if(!err){
      
            res.status(200)
            res.send(found)
            res.end()
        }else{
            res.status(500)
            res.send("Error")
            res.end()
        }
    })
})


app.post("/showunique" , (req,res) => {
    
    let token = req.body.token
   
    if(token){
        try{
            let user = jwt.verify(token, secret)
            if(user) {
                blogModel.find({email : user.email}, (err, found) => {
                    if(!err){
                        if(found) {
                            
                            res.status(200)
                            res.send(found)
                            res.end()
                        }else{
                            
                            res.status(500).send({error : "No Found Result"})
                        }
                       
                    }else{
                        
                        res.status(500)
                        res.send("Error")
                        res.end()
                    }
                })
        }else{
            res.status(500).send({error : "Unauthorized"})
        }
        
    }catch(err){
        res.status(500).send({error : "No User "})
        res.end()
    }
}else{
    res.status(500).send({error : "Some Error"})
}  
})

app.post("/update" , (req,res) => {
    let id = req.body.id
    let msg = req.body.replymsg
    let token = req.body.token
    let date = req.body.date
    if(token){
        try{
            let user = jwt.verify(token, secret)
          
            if(user) {
                    let replyMsg = {
                         msg : msg ,
                         user : user.user,
                        date : date
                }
                blogModel.findOneAndUpdate({_id : id} , {$push : {reply : replyMsg}},(err, success) => {
                    if(err) {
                        res.status(500)
                        res.send("Error")
                        res.end()
                    }else{
                        res.status(200)
                        res.send("ok")
                        res.end()
                    }
               })
            }
        }catch(err){
            res.status(500).send({error : "No User "})
            res.end()
        }
        
    }
   
})

app.post("/create" , (req, res) => {
    let token = req.body.token
    if(token){
        try{
            let user = jwt.verify(token, secret)
          
            if(user) {
                const newquestion = new blogModel ({
                    email : user.email,
                    userName : user.user,
                    question : req.body.question,
                    reply : req.body.reply,
                    date : req.body.date
                })
               
                newquestion.save()
                res.status(200)
                res.send("Ok")
            }
        }catch(err){
            res.status(500).send({error : "No User "})
            res.end()
        }
        
    }
    
})


if(process.env.NODE_ENV === 'production'){

    app.use(express.static('client/build'))

    app.get('*' , (req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })


}

app.listen(PORT , ()  => {
    console.log("Server Started" , process.env.PORT)
})