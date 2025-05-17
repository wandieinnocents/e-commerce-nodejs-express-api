const { required } = require("joi");
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    client_code: { type: String, default: null, unique: true },
    first_name: { type: String, default: null, required: true },
    last_name: { type: String, default: null },
    other_names: { type: String, default: null },
    age: { type: Number, default: null },
    email: { type: String, default: null, unique: true },
    profession: { type: String, default: null },
    phone: { type: String, default: null, required: true, unique: true },
    country_id: { type: Number, default: null },
    address: { type: String, default: null },
    website: { type: String, default: null },
    client_status: {
        type: Number,
        enum: [0, 1], //0 = Inactive, 1 = Activer
        default: 1
    },
    organization: { type: String, default: null },
    client_photo: { type: String, default: null },
    description: { type: String, default: null },
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
    });

module.exports = mongoose.model("Client", clientSchema);
