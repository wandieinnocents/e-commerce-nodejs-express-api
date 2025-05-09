const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
    {
        branch_code: { type: String, default: null },
        branch_name: { type: String, required: true },
        branch_status: { type: Number, default: 1 },
        branch_address: { type: String, default: null },
        created_by: { type: Number, default: null },
        updated_by: { type: Number, default: null },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Branch", branchSchema);
