const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    brand_id: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    branch_id: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
    parent_product_category_id: { type: Schema.Types.ObjectId, ref: 'parentProductCategory', required: true },
    product_category_id: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true },
    unit_id: { type: Schema.Types.ObjectId, ref: 'Unit', required: true },
    expiry_date: { type: Date, default: null },
    stock_quantity: { type: Number, default: null },
    cost_price: { type: Number, default: null },
    selling_price: { type: Number, default: null },
    status: { type: Number, enum: [0, 1], default: 1 }, // 0 = Inactive, 1 = Active
    description: { type: String, default: null },
    stock_alert: { type: Number, default: null },
    featured_image: { type: Schema.Types.Mixed, default: null },
    image_gallery: { type: Schema.Types.Mixed, default: null },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User', default: null },
},
    {
        timestamps: true,
    });

module.exports = mongoose.model("Product", productSchema);
