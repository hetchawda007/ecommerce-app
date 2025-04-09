import User from "../models/User.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

export const Auth = async (req, res) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return res.json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.json({ message: 'Unauthorized' });
        }
        if (!decoded.person) {
            return res.json({ message: 'Unauthorized' });
        }
        if (decoded.person === "user") {
            const user = await User.findOne({ name: decoded.name });
            res.send({ person: "user", name: user.name, message: "Authorized" });
        }
        else {
            const admin = await Admin.findOne({ name: decoded.name });
            res.send({ person: "admin", name: admin.name, message: "Authorized" });
        }
    } catch (err) {
        console.log(err);
        res.json({ message: 'Internal server error' });
    }
}

