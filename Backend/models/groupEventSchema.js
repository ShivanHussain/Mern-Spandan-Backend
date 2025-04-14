import mongoose from "mongoose";


const groupEventSchema = new mongoose.Schema({
    teamName:{
        type: String,
        required: [true, "Enter your Full Name"]
    },
    pid:{
        type:String,
        required: [true,"Pid is Required"]
    },
    participants:{
        type: [String],
        required: [true,"ALL participants Pid Required"]
    },
    eventName:{
        type: String,
        required: [true,"Event Name is Required"]
    },
    eventType:{
        type: String,
        required: [true,"Event Type is Required"]
    },


},{timestamps: true});


export const groupEventReg = mongoose.model("groupEventReg",groupEventSchema)