import mongoose from "mongoose";

const itemsSchema = new mongoose.Schema({
    adminname: {
        type: String,
        required: true,
    },
    items: [{
        productId: {
            type: String,
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
        image: {
            type: String,
            default: '',
            required: true
        },
        description: {
            type: String,
            default: ''
        },
    }],
}, { timestamps: true })

export default mongoose.model('AdminItems', itemsSchema);