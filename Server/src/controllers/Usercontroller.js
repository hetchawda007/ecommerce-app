import User from "../models/User.js";
import jwt from "jsonwebtoken";


export const Register = async (req, res) => {
    try {
        const { name, password } = req.body;
        console.log(req.body);
        const existingUser = await User.findOne({ name: name });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ name, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
}

export const Login = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name: name });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = user.password === password;
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { password: user.password, name: user.name, person: "user" },
            process.env.JWT_SECRET,
            { expiresIn: `${process.env.JWT_EXPIRES_IN}` }
        );
        console.log(token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ message: 'Login successful', name: user.name });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error logging in user: ' + err.message });
    }
};


export const Checkuser = async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.json({ message: "Unauthorized" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ name: decoded.name });
        console.log(user.password, decoded.password);
        if (decoded.password !== user.password) return res.json({ message: "Unauthorized" });
        res.json({ message1: "Protected content", message2: "Authorized" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};