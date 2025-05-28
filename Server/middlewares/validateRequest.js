import { ObjectId } from "mongodb";

export default function validateRequest(req, res, next, id) {
    if (!ObjectId.isValid(id)) {
        return res.status(401).json({
            error: `Invalid ID: ${id}`,
        })
    }

    next();
}