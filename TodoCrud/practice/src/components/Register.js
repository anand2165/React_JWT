import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match.');
            }

            const response = await axios.post('http://localhost:8080/api/register', { name, email, password });
            console.log(response);
            setErrorMessage(null);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            const message = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group row">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="confirmPassword" className="col-sm-2 col-form-label">Confirm Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                </div>
                <div className="form-group row">
                    <button type='submit' className='btn btn-primary' disabled={loading}>Submit</button>
                    {loading && <span>Loading...</span>}
                </div>
            </form>
        </div>
    );
};

export default Register;
