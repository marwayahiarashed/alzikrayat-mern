const express = require('express');
const router = express.Router();
const { getAll, getOne, create, remove } = require('../controllers/photoController');
const { validatePhoto } = require('../middleware/validation');
const checkAuth = require('../middleware/auth');
const upload = require('../middleware/upload');
const commentRoutes = require('./commentRoutes');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', checkAuth, upload.single('photo'), validatePhoto, create);
router.delete('/:id', checkAuth, remove);

router.use('/:id/comments', commentRoutes);

module.exports = router;