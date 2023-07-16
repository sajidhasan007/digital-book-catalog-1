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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const book_constant_1 = require("./book.constant");
const book_model_1 = require("./book.model");
// import httpStatus from "http-status";
const getAllBook = (pagination, filters) => __awaiter(void 0, void 0, void 0, function* () {
    // sortOrder;
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(pagination);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]); // Add minPrice and maxPrice
    const sortOptions = {};
    if (sortBy && sortOrder) {
        sortOptions[sortBy] = sortOrder;
    }
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: book_constant_1.bookSearchableFields.map(field => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield book_model_1.Book.find(whereConditions)
        .populate('user')
        .sort(sortOptions)
        .limit(limit)
        .skip(skip);
    let total = yield book_model_1.Book.countDocuments(whereConditions);
    if (andConditions.length === 0) {
        total = result.length;
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
const createBook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = (yield book_model_1.Book.create(payload)).populate('user');
    if (!response) {
        throw new ApiError_1.default(400, 'Faield to create');
    }
    return response;
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id).populate('user');
    return result;
});
const updateBook = (id, user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findOne({ _id: id });
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    if ((book === null || book === void 0 ? void 0 : book.user) !== (user === null || user === void 0 ? void 0 : user.userId)) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Your are not elegible to update this book');
    }
    const result = yield book_model_1.Book.findOneAndUpdate({ _id: id, user: user === null || user === void 0 ? void 0 : user.userId }, payload, {
        new: true,
    });
    if (!result) {
        throw new ApiError_1.default(404, 'Failed to update Book');
    }
    return result;
});
const deleteBook = (id, user) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findOne({ _id: id });
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    if ((book === null || book === void 0 ? void 0 : book.user) !== (user === null || user === void 0 ? void 0 : user.userId)) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Your are not elegible to delete this book');
    }
    const result = yield book_model_1.Book.findOneAndDelete({
        _id: id,
        user: user === null || user === void 0 ? void 0 : user.userId,
    });
    if (!result) {
        throw new ApiError_1.default(404, 'Failed to delete Book');
    }
    return result;
});
exports.BookService = {
    createBook,
    getSingleBook,
    updateBook,
    getAllBook,
    deleteBook,
};
