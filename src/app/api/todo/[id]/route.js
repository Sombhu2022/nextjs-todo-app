import { dbConnect } from "@/lib/dbConnect"
import { Todo } from "@/model/todo"
import { deleteFile } from "@/utils/uploadFile"
import { NextResponse } from "next/server"


export const GET = async(req , {params})=>{
     try {
        await dbConnect()
        const {id} = params
        const data =await Todo.findById(id)

       return NextResponse.json({data , message:'searching success'} , {status : 200})
        
     } catch (error) {
        
        return NextResponse.json({data , message:'something error , please try again ! '} , {status : 400})
     }
}



export const PATCH =async(req , {params})=>{

    try {
        await dbConnect()
        const { id}= params
        const inputData = await req.json()
        
        const data = await Todo.findByIdAndUpdate(id ,{$set: inputData}, {new:true})

        return NextResponse.json({data , message:'update success'} , {status : 200})

    } catch (error) {
        return NextResponse.json({data , message:'something error , please try again ! '} , {status : 400})
        
    }
}

export const DELETE = async(req , {params})=>{

    try {
        await dbConnect()
        const {id} = params
        const data =await Todo.findById(id)

        if(!data){
            return NextResponse.json({ message:'something error , please try again ! '} , {status : 400})

        }

        const {error , success} = await deleteFile(data.file.key)
        if(error){
            return NextResponse.json({error ,  message:'something error , please try again !' } , { status : 400})
        }

        await Todo.findByIdAndDelete(id)
        return NextResponse.json({message:"data deleted successfull ! " } , {status : 200})
    } catch (error) {
        return NextResponse.json({error , message:'something error , please try again ! '} , {status : 400})
    }
}