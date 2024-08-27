const { Schema, model, models } = require("mongoose");


const todoSchema =new Schema({
    name:{
        type:String ,
        required:[true , " this feild are required"]
    },
    message:{
        type:String , 
        required:[true , "message field are required"]
    }
},{ timestamps: true})

export const Todo = models.todo || model('todo' , todoSchema)