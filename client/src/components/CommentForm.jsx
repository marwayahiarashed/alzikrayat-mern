import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

function CommentForm({ photoId, onCommentAdded }) {
    const { token } = useContext(AuthContext);
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`/api/photos/${photoId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({ comment: text })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }
                onCommentAdded(data.comment);
                setText('');
                setError('');
            })
            .catch(err => setError('Could not connect to the server'));
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <textarea
                placeholder="Write a comment..."
                value={text}
                onChange={e => setText(e.target.value)}
                rows="3"
                required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">Add comment</button>
        </form>
    );
}

export default CommentForm;