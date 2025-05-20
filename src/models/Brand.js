const mongoose = require('mongoose');
const { Schema } = mongoose;

const BrandSchema = new Schema({
    brand_name: {
        type: String,
        default: null,
        required: true,
        unique: true
    },
    brand_code: {
        type: String,
        default: null
    },
    brand_register_date: {
        type: Date,
        default: Date.now
    },
    brand_status: {
        type: Number,
        enum: [0, 1], // 0 = Inactive, 1 = Active
        default: 1
    },
    brand_description: {
        type: String,
        default: null
    },
    brand_image: {
        type: String,
        default: null
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
    timestamps: true // This adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Brand', BrandSchema);
