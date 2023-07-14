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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_1 = require("../../../enums/user");
const user_model_1 = require("./user.model");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // If password is not given,set default password
    user.role = user_1.ENUM_USER_ROLE.USER;
    let newUserAllData = null;
    const newUser = yield user_model_1.User.create(user);
    if (newUser) {
        newUserAllData = yield user_model_1.User.findOne({ _id: newUser._id });
    }
    return newUserAllData;
});
exports.UserService = {
    createUser,
};
