const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResetPinSchema = new Schema({

    pin: {
        type: String,
        maxlength: 6,
        minlength: 6
    },
    email: {
        type: String,
        maxlength: 50,
        required: true
    },
    addedAt: {
        type: Date,
        required: true,
        default: Date.now(),
      },

});

module.exports = {
    ResetPinSchema: mongoose.model("reset_pin", ResetPinSchema), // It will create users table with the given User table name
}