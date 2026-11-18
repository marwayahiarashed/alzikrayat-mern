const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

const getAll = async (req, res) => {
    try {
        const photos = await Photo.find()
            .populate('userId', 'firstName lastName')
            .sort({ dateTime: -1 });
        res.json({ success: true, photos });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getOne = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName');
        if (!photo) return res.status(404).json({ error: 'Photo not found' });

        const comments = await Comment.find({ photoId: photo._id })
            .populate('userId', 'firstName lastName')
            .sort({ dateTime: 1 });

        res.json({ success: true, photo, comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Photo file is required' });
        }

        const photo = new Photo({
            userId: req.user.id,
            fileName: req.file.filename,
            title: req.body.title,
            description: req.body.description
        });
        await photo.save();

        res.status(201).json({ success: true, photo });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ error: 'Photo not found' });

        // only the owner can delete
        if (photo.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own photos' });
        }

        fs.unlink(path.join(__dirname, '..', 'uploads', photo.fileName), () => {});
        await Comment.deleteMany({ photoId: photo._id });
        await Photo.findByIdAndDelete(photo._id);

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getOne, create, remove };