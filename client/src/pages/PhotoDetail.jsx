import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import CommentForm from '../components/CommentForm';

function PhotoDetail() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [photo, setPhoto] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`/api/photos/${id}`)
            .then(res => {
                if (res.status === 404) throw new Error('Photo not found');
                if (!res.ok) throw new Error('Could not load the photo');
                return res.json();
            })
            .then(data => {
                setPhoto(data.photo);
                setComments(data.comments);
            })
            .catch(err => setError(err.message));
    }, [id]); // runs again when the id changes

    const handleCommentAdded = (comment) => {
        setComments([...comments, comment]);
    };

    if (error) {
        return (
            <div>
                <p className="error">{error}</p>
                <Link to="/gallery">Back to gallery</Link>
            </div>
        );
    }

    if (!photo) return <div>Loading...</div>;

    return (
        <div className="detail">
            <Link to="/gallery">&larr; Back to gallery</Link>
            <img className="detail-img" src={`/uploads/${photo.fileName}`} alt={photo.title} />
            <h1>{photo.title}</h1>
            <p className="small">
                by {photo.userId ? photo.userId.firstName + ' ' + photo.userId.lastName : 'Unknown'} on{' '}
                {new Date(photo.dateTime).toLocaleString()}
            </p>
            {photo.description && <p>{photo.description}</p>}

            <h2>Comments ({comments.length})</h2>
            {comments.length === 0 && <p>No comments yet.</p>}
            {comments.map(c => (
                <div key={c._id} className="comment">
                    <b>{c.userId ? c.userId.firstName + ' ' + c.userId.lastName : 'Unknown'}</b>
                    <span className="small"> - {new Date(c.dateTime).toLocaleString()}</span>
                    <p>{c.comment}</p>
                </div>
            ))}

            {user ? (
                <CommentForm photoId={photo._id} onCommentAdded={handleCommentAdded} />
            ) : (
                <p><Link to="/login">Login</Link> to add a comment.</p>
            )}
        </div>
    );
}

export default PhotoDetail;