import { getFileUrl } from "@/utils/uploadFile";
import { NextResponse } from "next/server";


export const POST = async(req) =>{

    
    try {
      const { key } =await req.json();

      if(key){
        return NextResponse.json('somthing error please try again' , {status : 400})
      }

      const { url, error } = await getFileUrl(key);
  
      if (error) {
        return NextResponse.json('somthing error please try again' , {status : 400})
      }
  
      return NextResponse.json({ url , message: 'sign url genarate successfully !'} , {status : 200})
    } catch (err) {
        return NextResponse.json('server error please try again' , {status : 500})
    }

}