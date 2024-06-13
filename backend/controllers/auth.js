import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTER USER
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, picture, location, occupation } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picture,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });

        const user = await newUser.save();
        res.json(user).status(201);
    } catch (err) {
        res.json({ error: err.message }).status(500);
        console.log(err.message);
    }
};

// LOGIN USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.json({ message: 'User Does Not Exist' }).status(400);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ message: 'Invalid Credentials' }).status(400);

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        delete user.password;
        res.status(200).json({ user, token });

    } catch (err) {
        res.json({ error: err.message }).status(500);
        console.log(err.message);
    }
};