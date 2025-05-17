const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        supplier_code: { type: String, default: null, unique: true },
        supplier_name: { type: String, required: true },
        supplier_email: { type: String, default: null, unique: true },
        supplier_phone: { type: String, required: true, unique: true },
        supplier_city: { type: String, default: null },
        supplier_address: { type: String, default: null },
        supplier_country: { type: Number, default: null },
        supplier_organization: { type: String, default: null },
        supplier_status: {
            type: Number,
            enum: [0, 1], //0 = Inactive, 1 = Activer
            default: 1
        },
        supplier_description: { type: String, default: null },
        supplier_website_url: { type: String, default: null },
        supplier_image: { type: String, default: null },
        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        updated_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Supplier", supplierSchema);
