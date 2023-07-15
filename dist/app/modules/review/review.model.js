"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const cowSchema = new mongoose_1.Schema({
    review: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
        type: String,
        ref: 'User',
        required: true,
    },
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
}, { timestamps: true });
exports.Review = (0, mongoose_1.model)('Review', cowSchema);
