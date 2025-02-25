const mongoose = require('mongoose');
const User = new mongoose.Schema({
    name: {
        type: 'string',
        require: true,
    },
    email: {
        type: 'string',
        require: true,
    },
    password: {
        type: 'string',
        require: true,
    },
    expenses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expenses",
        }
    ],
    

}, {
    timestamps: true,
});

module.exports = mongoose.model("User", User)