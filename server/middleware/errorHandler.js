const notFound = (req, res) => {
    res.status(404).json({ error: 'Route not found' });
};

const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    if (err.name === 'MulterError' || err.message === 'Only images are allowed') {
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
};

module.exports = { notFound, errorHandler };