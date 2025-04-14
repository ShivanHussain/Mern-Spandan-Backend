import { catchAsyncError } from "../middleware/catchAsyncError.js";
import errorHandler from "../middleware/error.js";
import { Contact } from "../models/contactSchema.js";


export const registered = catchAsyncError(async(req, res, next)=>{

    const { name, email, message }=req.body;

    if(!name || !email || !message ){
        return next(new errorHandler("All Fields are Mendatory",400));
    }

    const contactUser = await Contact.create({name, email, message });

    res.status(200).json({
        success: true,
        message: "Thank you for contacting us!"
    });

});