const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    // created_by: { type: Number, required: true, },
    // updated_by: { type: Number, required: true, }

    //    username: { type: String, unique: true, required: true },
    //     email: { type: String, unique: true, required: true },
    //     first_name: { type: String, required: true },
    //     last_name: { type: String, required: true },
    //     other_names: { type: String, default: null },
    //     age: { type: Number, default: null },
    //     country_id: { type: Number, default: null },
    //     address: { type: String, default: null },
    //     phone: { type: String, default: null },
    //     staff_position_id: { type: Number, default: null },
    //     photo: { type: String, default: null },
    //     expiry_date: { type: Date, default: null },
    //     pin: { type: String, maxlength: 15, required: true },
    //     security_question_id: { type: Number, default: null },
    //     security_answer: { type: String, default: null },
    //     created_by: { type: Number, default: null },
    //     updated_by: { type: Number, default: null },
    //     last_login_at: { type: Date, default: null },
    //     password: { type: String, required: true },
    //     created_by: { type: Number, required: true },
    //     updated_by: { type: Number, required: true }


}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
