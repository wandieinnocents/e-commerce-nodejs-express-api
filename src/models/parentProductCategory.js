const mongoose = require('mongoose');
const { Schema } = mongoose;

const parentProductCategorySchema = new Schema({
    parent_product_category_name: {
        type: String,
        default: null,
        required: true,
        unique: true
    },
    parent_product_category_code: {
        type: String,
        default: null
    },
    parent_product_category_status: {
        type: Number,
        enum: [0, 1], // 0 = Inactive, 1 = Active
        default: 1
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('parentProductCategory', parentProductCategorySchema);
