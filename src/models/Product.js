const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    product_code: { type: String, required: true },
    product_name: { type: String, required: true },
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    brand_id: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    branch_id: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    parent_product_category_id: { type: Schema.Types.ObjectId, ref: 'parentProductCategory', required: true },
    product_category_id: { type: Schema.Types.ObjectId, ref: 'productCategory', required: true },
    unit_id: { type: Schema.Types.ObjectId, ref: 'Unit', required: true }, //handle its api first
    product_created_date: { type: Date, default: Date.now },
    product_expiry_date: { type: Date, default: null },
    product_stock_quantity: { type: Number, default: null },
    product_cost_price: { type: Number, default: null },
    product_selling_price: { type: Number, default: null },
    product_status: { type: Number, enum: [0, 1], default: 1 }, // 0 = Inactive, 1 = Active
    product_description: { type: String, default: null },
    product_stock_alert: { type: Number, default: null },
    product_image: { type: Schema.Types.Mixed, default: null },
    product_image_gallery: { type: Schema.Types.Mixed, default: null },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
},
    {
        timestamps: true,
    });

module.exports = mongoose.model("Product", productSchema);
