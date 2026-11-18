const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const makeToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashed });
        await user.save();

        res.status(201).json({
            success: true,
            token: makeToken(user),
            user: { _id: user._id, firstName, lastName, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // send the old login time, then save the new one
        const previousLogin = user.lastLogin;
        user.lastLogin = new Date();
        await user.save();

        res.json({
            success: true,
            token: makeToken(user),
            previousLogin,
            user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { register, login };