const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

// Year - FE, SE ,TE ,BE, ANY
const bidSchema = new mongoose.Schema({
    product_id: {
        type: ObjectId,
        ref: 'Product',
        required: true,
    },

    seller: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    buyer: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

}, 
    {timestamps: true}
);


module.exports = mongoose.model("Bid", bidSchema);