const mongoose = require('mongoose');
const Expenses = new mongoose.Schema({
    expenseHeading:{
        type: 'string',
        required: true,
    },  
    totalExpense:{
        type:'string',
    },
    descriptions:{
        type:'string',
        trim:true,
    },
    share:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Share"
    },
    personal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Personal'
    },

},{
    timestamps:true,
});

module.exports = mongoose.model("Expenses",Expenses)