import { dbConnect } from "@/lib/dbConnect"
import { Todo } from "@/model/todo"



export const GET = async(req)=>{
    try {
        dbConnect()

        const data = await Todo.find({})
        console.log(data);
        
        return new Response(JSON.stringify(data) ,{statusText:"data fetch successfull"}, {status:200} )

    } catch (error) {
        return new Response("somthing error")
    }
}