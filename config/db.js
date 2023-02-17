import mongoose from 'mongoose'

const db=async()=>{
    try{
        const connect=await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connect ${connect.connection.host}`)
    }
    catch(err){
        console.log(err)
    }
}

export default db