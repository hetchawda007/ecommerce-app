import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

export const Checkuser = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Admin.findOne({ name: decoded.name });
        console.log(user.password, decoded.password);
        if (decoded.password !== user.password) return res.json({ message: "Unauthorized" });
        res.json({ message1: "Protected content", message2: "Authorized" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const Login = async (req, res) => {
    try {
        const { name, password } = req.body;
        const admin = await Admin.findOne({ name: name });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = admin.password === password;
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { password: admin.password, name: admin.name, person: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: `${process.env.JWT_EXPIRES_IN}` }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.json({ message: 'Login successful', name: admin.name });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'error logging user' + err.message });
    }
};

export const Register = async (req, res) => {
    try {
        const { name, password } = req.body;
        console.log(req.body);
        const existingAdmin = await Admin.findOne({ name: name });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const newAdmin = new Admin({ name, password });
        await newAdmin.save();
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error registering user' + error.message });
    }
}

export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({});
        if (!admins || admins.length === 0) {
            return res.status(400).json({ message: 'No admins found' });
        }
        res.status(200).json(admins);

    } catch (error) {
        console.log(error);
        res.json({ message: 'Error getting admins: ' + error.message });
    }
}