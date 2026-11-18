import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

function LoginForm() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                    return;
                }
                login(data);
            })
            .catch(err => setError('Could not connect to the server'));
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2>Login</h2>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">Log in</button>
        </form>
    );
}

export default LoginForm;