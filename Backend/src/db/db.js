const mongoose = require("mongoose")
async function connectdb(){
    try{
        await mongoose.connect(process.env.Mongo_uri)
        console.log("Database connected!")
    }
    catch(err){
    console.log("DB Connection fail",err);
    
}
}
module.exports = connectdb  ;