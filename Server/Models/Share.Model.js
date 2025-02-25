const mongoose = require('mongoose');

const ShareSchema = new mongoose.Schema({
    itemsBought: [{
        type: String,
        required: true
    }],
    itemsCount: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,  // Change this to Number to match with the nature of cost
        required: true,
    },
    perHead: {
        type: Number,  // Change this to Number to match with the nature of cost per head
        required: true
    },
    whoPaid: {
        type: String,
        required: true
    },
    paymentDone: {
        type: Boolean,
        required: true
    },
    shareCountEmail: [{
        type: String,  
        required: true
    }],
    photos: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Share", ShareSchema);
