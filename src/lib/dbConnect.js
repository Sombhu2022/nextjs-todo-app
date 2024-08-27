import mongoose from "mongoose";

let isConnect = false

export const dbConnect = async()=>{
    if(isConnect) {
        console.log("database is alrady connect");
        return ;
    }
try {
    
    await mongoose.connect(process.env.DB_URL)
    console.log("database connection success");
    
    isConnect = true;
} catch (error) {
    console.error(" database" ,error)
}

}