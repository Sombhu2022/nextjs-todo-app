export const getKeyFromUrl = (url) => {
    console.log(process.env.BUCKET_NAME , "backet url");
    
    const baseUrl = `https://pdf-upload-intern.s3.eu-north-1.amazonaws.com/`;
    if (url.startsWith(baseUrl)) {
        return url.slice(baseUrl.length); // Extract the key
    }
    return null; // Return null if the URL doesn't match the expected pattern
};

