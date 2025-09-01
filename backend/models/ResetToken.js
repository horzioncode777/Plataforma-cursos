const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Expira en 1 hora
});

module.exports = mongoose.model("ResetToken", resetTokenSchema);
