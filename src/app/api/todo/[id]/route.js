import { dbConnect } from "@/lib/dbConnect"
import { Todo } from "@/model/todo"


export const GET = async(req , {params})=>{
     try {
        dbConnect()
        const {id} = params
        const data =await Todo.findById(id)

        return new Response(JSON.stringify(data) , {status:200} , {statusText:"data fetch"})
        
     } catch (error) {
        
        return new Response("data feching feaild" , {status:400} )
     }
}


export const PATCH =async(req , {params})=>{

    try {
        const { id}= params
       const inputData = await req.json()
        
        const data = await Todo.findByIdAndUpdate(id ,{$set: inputData}, {new:true})

        return new Response(JSON.stringify(data) , {status:200} , {statusText:"data update"})

    } catch (error) {
        return new Response("data update feaild" , {status:400} )
        
    }
}

export const DELETE = async(req , {params})=>{

    try {
        const {id} = params
        await Todo.findByIdAndDelete(id)
        return new Response("data deleted success" , {status:200})
    } catch (error) {
        return new Response("data not delete" , {status:400})
    }
}