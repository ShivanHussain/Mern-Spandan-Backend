import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { generateToken } from "../utils/jwtToken.js";
import { User } from "../models/userSchema.js";
import  generatePid  from "../utils/generatePid.js";
import { Pid } from "../models/pidSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import errorHandler from '../middleware/error.js'



//sign up user
export const signup = catchAsyncError(async(req, res, next)=>{
    


    if (!req.body) 
    {
        return next(new errorHandler("All Field are mendatory",400));
    }

    const { fullName, rollNo, phone, batch, branch, course, password, gender, email, collegeName }=req.body;

    console.log(password.length);

    const userEmail = await User.findOne({email : email});

    if(userEmail){
       return next(new errorHandler("User Already Registered",400))
    }

    if (password.length < 8) {
        // Create a new error with a message and status code
        const error = new errorHandler('Password must contain at least 8 characters', 400);
        return next(error); // Pass the error to the error handling middleware
    }


    const pid = await generatePid();

    console.log("userpid",pid);
    




    const user = await User.create({fullName, rollNo, phone, batch, branch, course, password, email, collegeName, gender,pid });


    generateToken(user, "User Registered",201,res);



});



//login function
export const login = catchAsyncError(async(req, res, next)=>{
    const { email, password } =req.body;

    if(!email || !password){
        return next(new errorHandler("Email and Password are Required",400));
    }

    const user = await User.findOne({ email }).select("+password"); //add password in userschema

    
    if(!user){
        return next(new errorHandler("Invalid Credential!",400));
    }

    const isPasswordMatch = await user.comparePassword(password);  //match the password

    if(!isPasswordMatch){
        return next(new errorHandler("Invalid Credential!",400));
    }


    const message = `Your Event Pid is:- \n\n ${user.pid} `;


    try {
        await sendEmail({
            email: user.email,
            subject: "Spandan Event PID-(P2025xxxxx)",
            message
        });
        
        
    } catch (error) {
        return next(new errorHandler(error.message, 500))
        
    }

    generateToken(user, `Logged In and PId Sent to ${user.email}`,200,res);

    

});


// logout the user with cookie
export const logout = catchAsyncError(async(req, res, next)=>{ 
    res.status(200).cookie("token","",{
        expires:new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged Out"
    });

});