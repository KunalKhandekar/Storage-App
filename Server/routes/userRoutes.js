import { Router } from "express";
import usersData from "../userDB.json" with {type: "json"};
import dirsData from "../dirDB.json" with {type: "json"};
import { writeFile } from "node:fs/promises"
import checkAuth from "../middlewares/auth.js";

const router = Router();
router.post("/register", async (req, res, next) => {
    const userId = crypto.randomUUID();
    const dirId = crypto.randomUUID();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    };

    const userFound = usersData.find((user) => user.email === email);

    if (userFound) return res.status(400).json({
        error: "User already exists",
        message: "Failed to create user"
    });

    dirsData.push({
        id: dirId,
        name: `root-${email}`,
        userId,
        files: [],
        directory: [],
        parentDirId: null,
    })

    usersData.push({
        id: userId,
        name,
        password,
        email,
        rootDirId: dirId
    });

    try {
        await Promise.all([writeFile("./userDB.json", JSON.stringify(usersData)), writeFile("./dirDB.json", JSON.stringify(dirsData))])
        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({
        error: "All fields are required"
    });

    const user = usersData.find((user) => user.email === email);

    if (!user || password !== user?.password) return res.status(404).json({
        error: "Invalid Credentials"
    });

    res.cookie("uid", user.id, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
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
        secure: false,          // use true in production
        sameSite: "none",
        path: "/",
        expires: new Date(0),
    });
    res.status(204).end();
})

export default router;
