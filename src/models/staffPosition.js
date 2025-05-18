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
        enum: [0, 1], //0 = Inactive, 1 = Activer
        default: 1
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, { timestamps: true });

const StaffPosition = mongoose.model('StaffPosition', staffPositionSchema);
module.exports = StaffPosition;