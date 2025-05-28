import { Router } from "express";
import { ObjectId } from "mongodb";
import checkAuth from "../middlewares/auth.js";

const router = Router();

router.post("/register", async (req, res, next) => {

    const { name, email, password } = req.body;
    const db = req.db;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    };

    try {

        const userFound = await db.collection("users").findOne({ email });
        console.log(userFound);
        if (userFound) return res.status(400).json({
            error: "User already exists",
            message: "Failed to create user"
        });

        const { insertedId: rootDirId } = await db.collection("directories").insertOne({
            name: `root-${email}`,
            parentDirId: null,
        });

        const { insertedId: userId } = await db.collection("users").insertOne({
            name,
            password,
            email,
            rootDirId
        });

        await db.collection("directories").updateOne({ _id: new ObjectId(String(rootDirId)) }, {
            $set: { userId }
        });


        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const db = req.db;

    if (!email || !password) return res.status(400).json({
        error: "All fields are required"
    });

    const user = await db.collection("users").findOne({ email, password });

    if (!user) return res.status(404).json({
        error: "Invalid Credentials"
    });

    res.cookie("uid", user._id.toString(), { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(200).json({
        message: "Logged In"
    });
});

router.get("/", checkAuth, (req, res) => {
    res.status(200).json({
        email: req.user.email,
        name: req.user.name
    })
});

router.post("/logout", (req, res) => {
    console.log("req.cookie: ", req.cookies)
    res.cookie("uid", {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
        expires: new Date(0),
    });
    res.status(204).end();
})

export default router;
