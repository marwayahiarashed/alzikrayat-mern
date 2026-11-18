import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import PhotoCard from '../components/PhotoCard';
import UploadForm from '../components/UploadForm';

function Gallery() {
    const { user, token } = useContext(AuthContext);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/photos')
            .then(res => {
                if (!res.ok) throw new Error('Network failed');
                return res.json();
            })
            .then(data => {
                setPhotos(data.photos);
                setLoading(false);
            })
            .catch(err => {
                setError('Could not load photos');
                setLoading(false);
            });
    }, []);

    const handleUploaded = (photo) => {
        // the new photo only has the user id, so we add the logged in user as owner
        setPhotos([{ ...photo, userId: user }, ...photos]);
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this photo?')) return;

        fetch(`/api/photos/${id}`, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + token }
        })
            .then(res => {
                if (!res.ok) throw new Error('Could not delete photo');
                setPhotos(photos.filter(p => p._id !== id));
            })
            .catch(err => setError(err.message));
    };

    return (
        <div>
            <h1>Gallery</h1>
            {user && <UploadForm onUploaded={handleUploaded} />}

            {error && <p className="error">{error}</p>}
            {loading && <p>Loading...</p>}
            {!loading && photos.length === 0 && <p>No photos yet.</p>}

            <div className="grid">
                {photos.map(photo => (
                    <PhotoCard
                        key={photo._id}
                        photo={photo}
                        canDelete={user && photo.userId && photo.userId._id === user._id}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export default Gallery;