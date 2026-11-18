const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment } = require('../controllers/commentController');
const { validateComment } = require('../middleware/validation');
const checkAuth = require('../middleware/auth');

router.post('/', checkAuth, validateComment, addComment);

module.exports = router;