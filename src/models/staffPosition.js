const mongoose = require('mongoose');

const staffPositionSchema = new mongoose.Schema({
    position_code: { type: String, required: true, unique: true },
    position_name: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Number,
        default: null
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const StaffPosition = mongoose.model('StaffPosition', staffPositionSchema);
module.exports = StaffPosition;