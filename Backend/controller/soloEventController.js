import { catchAsyncError } from "../middleware/catchAsyncError.js";
import errorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import { Event } from "../models/eventSchema.js";
import { soloEventReg } from "../models/soloEventSchema.js"


export const registered = catchAsyncError(async(req, res, next )=>{

    const { fullName, pid }=req.body;

    const { id }=req.params;

    if( !fullName || !pid){
        return next(new errorHandler("All fields are Required",400));
    }


    const user = await User.findOne({pid: pid });
    //console.log(user);

    if(!user){
        return next(new errorHandler("Invalid Pid",400));

    }
    //console.log("user",user);


    const event = await Event.findById(id);
    console.log(id);
    console.log(event);

    if(!event){
        return next(new errorHandler("Internal Server Error",400));
        

    }


    const soloEventPId = await soloEventReg.find({pid: pid});

    const userEventReg = await soloEventReg.create({ 
        fullName, pid, phone: user.phone, 
         collegeName: user.collegeName, rollNo: user.rollNo ,eventName: event.eventname, eventType: event.eventtype });


    //console.log("usereventdatails",userEventReg);

    res.status(200).json({
        success: true,
        message :"Successfully participate",
        data: userEventReg
    })
});