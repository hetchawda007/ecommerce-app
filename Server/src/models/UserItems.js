import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }

    }],
})

export default mongoose.model('UserItems', itemsSchema);