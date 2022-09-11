const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
app.use(express.json());

app.use(express.static('public'));
// let user = [];

const authRouter=require("./Routers/authRouter");
const userRouter=require("./Routers/userRouter");
const planRouter=require("./Routers/planRouter");
const reviewRouter=require("./Routers/reviewRouter");
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use("/api/auth", authRouter);
app.use("/api/plan", planRouter);
app.use("/api/review",reviewRouter);  

// app.get('/api/user', createUser);
// app.post('/api/user',getUser);
// // update
// app.patch('/api/user', updateUser);
// // delete
// app.delete('/api/user', deleteUser);
// app.get("/api/user/:id", getUserById)

app.listen("8080", function () {
    console.log("server started");
})  