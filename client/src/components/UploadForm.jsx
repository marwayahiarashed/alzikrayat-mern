import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

function UploadForm({ onUploaded }) {
    const { token } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        if (!file) {
            setError('Please choose a photo');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('photo', file);

        fetch('/api/photos', {
            method: 'POST',
            headers: { Authorization: 'Bearer ' + token },
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }
                onUploaded(data.photo);
                setTitle('');
                setDescription('');
                setFile(null);
                setError('');
                form.reset();
            })
            .catch(err => setError('Could not connect to the server'));
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Upload a photo</h2>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows="2"
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">Upload</button>
        </form>
    );
}

export default UploadForm;