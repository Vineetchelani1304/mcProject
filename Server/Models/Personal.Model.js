const mongoose = require('mongoose');
const Personal = new mongoose.Schema({
    itemsBought:[{
        type: String,
        required: true
    }],
    itemsCount:{
        type: Number,
        required: true
    },
    totalCost:{
        type: String,
        required: true,
    },
    photos:{
        type: String,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Personal', Personal)