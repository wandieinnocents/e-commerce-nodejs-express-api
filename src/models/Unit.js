const mongoose = require('mongoose');
const { Schema } = mongoose;

const unitSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
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

module.exports = mongoose.model('Unit', unitSchema);
