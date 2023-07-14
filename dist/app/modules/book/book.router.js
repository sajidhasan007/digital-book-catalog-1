"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const book_controller_1 = require("./book.controller");
const book_validation_1 = require("./book.validation");
const router = express_1.default.Router();
router.get('/:id', book_controller_1.BookController.getSingleBook);
router.patch('/:id', (0, validateRequest_1.default)(book_validation_1.BookValidation.updateBookZodSchema), book_controller_1.BookController.updateBook);
router.get('/', book_controller_1.BookController.getAllBook);
router.delete('/:id', book_controller_1.BookController.deleteBook);
router.post('/create-book', (0, auth_1.default)(user_1.ENUM_USER_ROLE.USER), (0, validateRequest_1.default)(book_validation_1.BookValidation.createBookZodSchema), book_controller_1.BookController.createBook);
exports.BookRouter = router;
