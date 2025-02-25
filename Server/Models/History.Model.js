const mongoose = require('mongoose');

const History = new mongoose.Schema({
    expense:{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Expenses"
    }
})

module.exports = mongoose.model('History',History)