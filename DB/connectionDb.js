// import section 
import mongoose from "mongoose";

// connect db function 
const connectDb = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
               dbName: process.env.DATABASE_NAME
        }
       
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log('db connection Done.');
    } catch (error) {
        console.log(error);
    }
}
// export section 
export default connectDb;