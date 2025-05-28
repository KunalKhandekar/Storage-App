export default function validateRequest(req, res, next, id) {
    const idRegex = /^[a-fA-F0-9]{24}$/;
    if (!idRegex.test(id)) {
        return res.status(401).json({
            error: `Invalid ID: ${id}`,
        })
    }

    next();
}