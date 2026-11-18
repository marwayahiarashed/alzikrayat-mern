import { Link } from 'react-router-dom';

function PhotoCard({ photo, canDelete, onDelete }) {
    const owner = photo.userId;

    return (
        <div className="card">
            <Link to={`/photos/${photo._id}`}>
                <img src={`/uploads/${photo.fileName}`} alt={photo.title} />
            </Link>
            <div className="card-body">
                <h3>{photo.title}</h3>
                <p className="small">
                    by {owner ? owner.firstName + ' ' + owner.lastName : 'Unknown'} on{' '}
                    {new Date(photo.dateTime).toLocaleDateString()}
                </p>
                {canDelete && (
                    <button className="btn btn-danger btn-small" onClick={() => onDelete(photo._id)}>
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default PhotoCard;