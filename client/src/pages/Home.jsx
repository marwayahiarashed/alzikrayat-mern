import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import PhotoCard from '../components/PhotoCard';

function Home() {
    const { user } = useContext(AuthContext);
    const [photos, setPhotos] = useState([]);
    const lastLogin = localStorage.getItem('lastLogin');

    useEffect(() => {
        fetch('/api/photos')
            .then(res => {
                if (!res.ok) throw new Error('Network failed');
                return res.json();
            })
            .then(data => setPhotos(data.photos.slice(0, 4)))
            .catch(err => console.error('Fetch error:', err));
    }, []);

    return (
        <div>
            <h1>Welcome to Alzikrayat</h1>
            <p>Share your photos and comment on the photos of others.</p>

            {user ? (
                <>
                    <p>Logged in as <b>{user.firstName} {user.lastName}</b></p>
                    {lastLogin && (
                        <p className="small">
                            (last login from this computer was {new Date(lastLogin).toLocaleString()})
                        </p>
                    )}
                </>
            ) : (
                <p><Link to="/login">Login or register</Link> to upload photos and comment.</p>
            )}

            <h2>Latest photos</h2>
            {photos.length === 0 && <p>No photos yet.</p>}
            <div className="grid">
                {photos.map(photo => (
                    <PhotoCard key={photo._id} photo={photo} />
                ))}
            </div>
            <p><Link to="/gallery">See all photos</Link></p>
        </div>
    );
}

export default Home;