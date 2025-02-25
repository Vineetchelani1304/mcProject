const mongoose = require('mongoose');
exports.DbConnection = ()=>{
    try {
        mongoose.connect("mongodb+srv://vineetchelani:vineetttt@vineet.3wknhd0.mongodb.net/expense")
        .then(()=>{
            console.log("Server Connected to Database");
        })
        .catch(()=>{
            console.log("Error connecting to database")
        })
    } catch (error) {
        console.log(error) 
    }
}