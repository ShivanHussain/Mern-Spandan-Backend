import { catchAsyncError } from "../middleware/catchAsyncError.js";
import errorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import { Event } from "../models/eventSchema.js";
import { groupEventReg } from "../models/groupEventSchema.js"


export const registered = catchAsyncError(async(req, res, next )=>{


    const { teamName, pid1, pid2, pid3 }=req.body;


    const { id }=req.params;


    if(!teamName){
        return next(new errorHandler("Team Name is Required ",400));
    }


    if( !pid1 || !pid2 || !pid3 ){
        return next(new errorHandler("All Participants pid is Required ",400));

    }

    const user1 = await User.findOne({pid: pid1});
    if(!user1){
        return next(new errorHandler("Invalid Pid",400));

    }

    const user2 = await User.findOne({pid: pid2});
    if(!user2){
        return next(new errorHandler("Invalid Pid",400));

    }


    const user3 = await User.findOne({pid: pid3});
    if(!user3){
        return next(new errorHandler("Invalid Pid",400));

    } 

    const event = await Event.findById(id);

    if(!event){
        return next(new errorHandler("Internal Server Error",400));

    }

    const groupEventDatails = await groupEventReg.create({
        teamName,pid: pid1, participants:[ pid2, pid3], eventName: event.eventname, eventType: event.eventtype
    });


    res.status(200).json({
        success: true,
        message:"Successfully Registered",
        data: groupEventDatails
    })

});


export const addParticipate = catchAsyncError(async(req, res, next)=>{

    const { id }=req.params;
    console.log(id);

    const { teamName, pid1, pid2, pid3, pid4, pid5 }=req.body;


    const event = await groupEventReg.findById(id);

    console.log(event);

    if(!event){
        return next(new errorHandler("Team Not Registered",400));
    }

    const updatedparticipants = await groupEventReg.findByIdAndUpdate(id,
        {
            $push: {
              participants: { $each: [pid1,pid2, pid3, pid4, pid5 ] }
            }
        },
          { new: true, runValidators: true }
        );
    console.log(updatedparticipants);

    if(!updatedparticipants){
        return next(new errorHandler("Some error occured",400));
    }

    res.status(200).json({
        success: true,
        message: "successfully Added"
    })
})