"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post('/register', () => {
});
authRouter.post('/login', () => {
});
authRouter.post('/change-password/generate-token', () => {
});
authRouter.post('/change-password', () => {
});
authRouter.post('/verify-account', () => {
});
exports.default = authRouter;
