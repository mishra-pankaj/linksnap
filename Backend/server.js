const app = require("./src/index")

app.listen(process.env.PORT,()=>{
    console.log(`Server is runnning on ${process.env.PORT}`);
    
})