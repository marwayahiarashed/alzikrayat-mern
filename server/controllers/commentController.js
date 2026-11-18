const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

const addComment = async (req, res) => {
    try {
        const photo = await Photo.findById(req.params.id);
        if (!photo) return res.status(404).json({ error: 'Photo not found' });

        const comment = new Comment({
            photoId: photo._id,
            userId: req.user.id,
            comment: req.body.comment
        });
        await comment.save();
        await comment.populate('userId', 'firstName lastName');

        res.status(201).json({ success: true, comment });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { addComment };