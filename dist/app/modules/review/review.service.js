"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const review_model_1 = require("./review.model");
const getAllReview = (pagination, bookId) => __awaiter(void 0, void 0, void 0, function* () {
    // sortOrder;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(pagination);
    const sortOptions = {};
    if (sortBy && sortOrder) {
        sortOptions[sortBy] = sortOrder;
    }
    const result = yield review_model_1.Review.find({ book: bookId })
        .populate('user')
        .sort(sortOptions)
        .limit(limit)
        .skip(skip);
    const total = result === null || result === void 0 ? void 0 : result.length;
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield review_model_1.Review.findOne({
        user: payload === null || payload === void 0 ? void 0 : payload.user,
        book: payload === null || payload === void 0 ? void 0 : payload.book,
    });
    if (isExist) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Duplicate review in not allow');
    }
    const response = (yield review_model_1.Review.create(payload)).populate('user');
    if (!response) {
        throw new ApiError_1.default(400, 'Faield to create');
    }
    return response;
});
exports.ReviewService = {
    createReview,
    getAllReview,
};
