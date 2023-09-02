"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter = (0, express_1.Router)();
userRouter.get('/profile', () => {
});
userRouter.put('/profile/update', () => {
});
userRouter.get('/transactions', () => {
});
userRouter.get('/wallet', () => {
});
exports.default = userRouter;
