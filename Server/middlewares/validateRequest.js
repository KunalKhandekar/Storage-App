import { Types } from "mongoose";

export default function validateRequest(req, res, next, id) {
    if (!Types.ObjectId.isValid(id)) {
        return res.status(401).json({
            error: `Invalid ID: ${id}`,
        })
    }

    next();
}