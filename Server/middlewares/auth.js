import usersData from "../userDB.json" with {type: "json"};

export default function checkAuth(req, res, next) {
    const { uid } = req.cookies;
    const user =  usersData.find((user) => user.id === uid)
    if (!uid || !user) return res.status(401).json({ error: "Not logged in" });
    req.user = user;
    next();
}