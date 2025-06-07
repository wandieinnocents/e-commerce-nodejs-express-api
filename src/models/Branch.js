const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
    {
        branch_code: { type: String, default: null, unique: true },
        branch_name: { type: String, required: true, unique: true },
        branch_status: {
            type: Number,
            default: 1,
            required: false,
        },
        branch_address: { type: String, default: null , required:false},
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Branch", branchSchema);
