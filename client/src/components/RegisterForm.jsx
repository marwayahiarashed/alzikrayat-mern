import { useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';

function RegisterForm() {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
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
            <h2>Register</h2>
            <label>First name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
            <label>Last name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
            <label>Password (min 6 characters)</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">Create account</button>
        </form>
    );
}

export default RegisterForm;