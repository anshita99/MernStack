const User = require('../models/user');
const Category = require('../models/category');
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcrypt');
// const sgMail = require('@sendgrid/mail')
const nodemailer=require('nodemailer');

const crypto=require('crypto')


var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "anshitagarg1999@gmail.com",
        pass: ""
    }
});
let mailOptions = {
    from: 'anshitagarg1999@gmail.com',
    to: 'anshitagarg1999@gmail.com',
    subject: 'hello world!',
    text: 'hello world!'
};



const handleErrors = (err) => {
    let errors = { email: '', password: '' }

    console.log(err.message, "Hello there", err.code)
    
    if (err.message === 'incorrect email') {
        errors.email = ' email is not registered'
    }
   
    if (err.message === 'incorrect password') {
        errors.password = ' password is incorrect'
    }

    if (err.code === 11000) {
        errors.email = 'that email is already registered'
        return errors;
    }


    if (err.message.includes('user validation failed')) {
        
        return err.message
    }

    return errors;
}
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'priyesh pandey auth', {
        expiresIn: maxAge
    });
}

module.exports.get_dropdown = async (req, res) => {
    try {
        const drop = await Category.find();
        
        res.status(200).json(drop)
    } catch (err) {
        res.status(400).json(err)
    }
}



module.exports.admin_check = async (req, res) => {
    const email = req.params.email;
    
    const user = await User.find({ email });
    
    const tokenvalue = createToken(user._id);
    const token = jwt.sign(tokenvalue, 'Hello world');
    
    res.header('auth-token', token)
    res.status(200).json(user)

}
module.exports.get_all_details = async (req, res) => {

    console.log("Search value", req.query.search)

    try {
        const user = await User.find()
            .populate("category")

        
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err)
    }

}






module.exports.signup_post = async (req, res) => {

    const { fullname, email, password, role, category } = req.body;
   
    try {
        const user = await User.create({ fullname, email, password, role, category });
        const drop = await Category.find();
        res.status(201).json({ user: user._id });
    } catch (err) {
        res.status(400).json({ err })

    }
}
module.exports.delete_item = async (req, res) => {
    const id = req.params.id;
    
    try {
        const user = await User.deleteOne({ _id: id });
        
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err)
    }
}

module.exports.reset_Password = async (req, res) => {
    const { confirmPassword,currentPassword,newPassword }=req.body;
    console.log(confirmPassword,currentPassword,newPassword,req.params.id)
    
    const salt =await bcrypt.genSalt();
    const updatedPassword=await bcrypt.hash(newPassword,salt)
    
    if(!(confirmPassword=== newPassword)) return res.status(400).send("Please Enter same password")
    console.log("Checking", confirmPassword == newPassword)
    if(confirmPassword==newPassword)
    {
        const user = await User.findById({ _id: req.params.id  });
        const auth = await bcrypt.compare(currentPassword, user.password);
        console.log("The value of aut",auth)
        if(auth)
        {
            const user = await User.updateOne({ _id: req.params.id }, { $set: { password:updatedPassword} })
            console.log("haan bhai hogaya update",user)
            res.status(200).send("Password Updated")
        }else{
            res.status(400).send("Password dosen't match")
        }
    }  
    else{
        res.status(400).send("Something went wrong")
    } 
}


module.exports.login_post = async (req, res) => {
    const { email, password, role, active } = req.body;
    
    try {
        const user = await User.login(email, password, role, active);
        console.log(process.env.SEND_GRID)

        const tokenvalue = createToken(user._id);
        const token = jwt.sign(tokenvalue, 'Hello world');
       
        res.header('auth-token', token)
        res.status(200).json({ role: user.role, user: user._id, active: user.active })
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }

}







module.exports.user_item = async (req, res) => {
    const id = req.params.id;
   
    try {
        const user = await User.findById(id)
            .populate("category")
        
        res.json(user)
        
    } catch (err) {
        
    }
}

module.exports.update_item = async (req, res) => {

    try {
        console.log("happening..")
        const upateUser = await User.updateOne({ _id: req.params.id }, { $set: { email: req.body.email, password: req.body.password } })
        console.log(updateUser)
    } catch (err) {
        console.log("happening.. error")
        res.status(400).send(err)
        console.log(err)
    }
}
module.exports.userupdate_item = async (req, res) => {
    if (validator.isEmail(req.body.email)) {
        try {
            const upateUser = await User.updateOne({ _id: req.params.id }, { $set: { email: req.body.email, fullname: req.body.fullname, category: req.body.category } })
            console.log(upateUser)
            res.status(200).send("Done")
        } catch (err) {
           
            res.status(400).json({ err })
            
        }
    }
    res.status(400).send("Enter a valid Email")
}
module.exports.filter_data = async (req, res) => {
    
    try {
        const user = await User.find({ category: req.params.category })
            .populate("category")
        res.status(200).json(user)
           
    } catch (err) {
        
    }

}
module.exports.active = async (req, res) => {
    try {
        const updateUser = await User.updateOne({ _id: req.params.id }, { $set: { active: true } })
        res.status(200).json(updateUser)
    } catch (err) {
        res.send(err)
    }

}
module.exports.deactive = async (req, res) => {
    try {
        const updateUser = await User.updateOne({ _id: req.params.id }, { $set: { active: false } })
        res.status(200).json(updateUser)
    } catch (err) {
        res.send(err)
    }

}





module.exports.forgot_password = async (req, res) => {
    
    console.log("Email id", req.body.email)
   
    crypto.randomBytes(32,(err,buffer )=>{
        if(err){
            console.log(err)
        }
        const token=buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            
            if(!user)
            {
                return res.status(422).json({error:"User dont exist with that email"})
            }
            user.resetToken=token
            user.expireToken= Date.now() + 3600000
            user.save()
            .then((result)=>{
                transporter.sendMail(mailOptions, function (err, dta) {
                    if (err) {
                        console.log("Erro occurs", err)
                    } else {
                        console.log("Email sent!!")
                    }
                })
                transporter.sendMail({
                    to: user.email,
                    from:"anshitagarg1999@gmail.com",
                    subject:"Reset Password",
                    html: `<p>Hello user</p>
                    <a href="http://localhost:5000/set-password/${token}">Click<a/>`
                })
                res.json({message:"Check your email"})
            }).catch(err=>res.json({err}))
        })
    })


}
module.exports.update_Password =async (req,res)=>{
    console.log("Request body",req.body)
    const newPassword = req.body.value.newpassword;
    const confirmPassword = req.body.value.confirmpassword;
    const sentToken=req.body.token;
    console.log("present",sentToken)
    const salt = await bcrypt.genSalt();
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            console.log("Forgot Password",user)
            if (!user) {
                return res.status(422).json({ error: "Try again session expired" })
            }
            bcrypt.hash(newPassword,salt).then(hashedpassword => {
                console.log("updatedhashed",hashedpassword)
                
                User.updateOne({ _id: user._id }, { $set: { password: hashedpassword, resetToken: undefined, expireToken: undefined } })
                .then(result=>res.status(200))
                
            }).then(result=>res.status(200))
        }).catch(err => {
            console.log(err)
        })
    
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}





function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports.search_Result=async (req,res)=>{
    const pal=req.params.search;
    console.log("pal",pal.length)
    console.log(req.params.search);
    if (req.params.search) {
        const regex = new RegExp(escapeRegex(req.params.search), 'gi');
    console.log("regular expression",regex)
        User.find({ fullname: regex })
        .then(result=>{
            console.log(result)
            res.send(result)
        })
           
    }else{
       const user= User.find().populate("category")
        res.status(200).json(user);
        console.log("other way around")
    }
}