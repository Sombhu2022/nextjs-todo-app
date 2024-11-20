import { sendSignUrl } from "@/utils/uploadFile";
import { NextResponse } from "next/server";


export const POST = async(req )=>{
    
    try {
      const { fileName, type } = await req.json();

      const { url, error } = await sendSignUrl(fileName, type);
  
      if (error) {
        return NextResponse.json('somthing error please try again' , {status : 400})
      }

     return NextResponse.json({ url , message: 'sign url genarate successfully !'} , {status : 200})
    } catch (err) {
        return NextResponse.json('server error ! please try again' , {status : 500})
    }
}
