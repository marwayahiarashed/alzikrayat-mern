import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="brand">Alzikrayat</Link>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/gallery">Gallery</Link>
                {user ? (
                    <>
                        <span className="nav-user">Hi, {user.firstName}</span>
                        <button className="btn btn-small" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;