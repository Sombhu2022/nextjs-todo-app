import {  DeleteObjectsCommand, GetObjectAclCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const s3Client = new S3Client({
        region: process.env.REGION , 
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey:process.env.AWS_SECRAT_KEY
        }
    })

export const sendSignUrl = async(fileName , type)=>{

    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME ,
        Key: `upload/${fileName}`,
        ContentType: type
    });

    try {
        const url = await getSignedUrl(s3Client, command );
        console.log("url",url);
        return { url , error:null };
      } catch (error) {
        console.error('Error getting signed URL', error);
        return { url :null , error}
      }
}



export const getFileUrl = async(Key)=>{

    const command = new GetObjectAclCommand({
        Bucket: process.env.BUCKET_NAME ,
        Key: Key,
        
    });

    try {
        const url = await getSignedUrl(s3Client, command);
        console.log("url",url);
        return { url , error:null };
      } catch (error) {
        console.error('Error getting signed URL', error);
        return { url :null , error}
      }


}


export const deleteFile = async (key) => {
  if(!process.env.BUCKET_NAME || !key){
       console.error(' bucket name and key required ')
  }
  
  const command = new DeleteObjectsCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
  });

  try {
      const response = await s3Client.send(command);
      console.log("File deleted successfully:", response);
      return { success: true, error: null };
  } catch (error) {
      console.error("Error deleting file", error);
      return { success: false, error };
  }
};

