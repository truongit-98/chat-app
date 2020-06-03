import express from "express";
import chatRouter from "./chat.mjs";
import registerRouter from "./register.mjs";
import loginRouter from "./login.mjs";
import authRouter from "./authenticate.mjs";

const routers = {
    loginRouter,
    chatRouter,
    registerRouter,
    authRouter
}
export default routers; 
