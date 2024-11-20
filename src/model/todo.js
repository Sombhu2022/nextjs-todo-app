const { Schema, model, models, default: mongoose } = require("mongoose");


const todoSchema =new Schema({
    user : {
      type:mongoose.Schema.Types.ObjectId ,
      ref : 'user' ,
      
    } ,
    file :{
       url :{
          type:String , 
          required : [true , 'file url is required !']
       },
       key :{
          type:String ,
          required : [true , 'public_id is required !']
       }
    } , 
    message:{
        type:String , 
        default : null
    }
},{ timestamps: true})

export const Todo = models.todo || model('todo' , todoSchema)