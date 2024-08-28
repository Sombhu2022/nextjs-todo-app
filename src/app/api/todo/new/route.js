import { dbConnect } from "@/lib/dbConnect"
import { Todo } from "@/model/todo"

export const POST = async(req)=>{
    const { message , name }= await req.json()
    console.log(message , name);
    
   try {
     dbConnect();
     await Todo.create({message , name})
     const data = await Todo.find({})
     return new Response( JSON.stringify(data) , {status:200} )
     
    } catch (error) {
      
      return new Response([],{status:400},{statusText:"data not add"})
   }
}