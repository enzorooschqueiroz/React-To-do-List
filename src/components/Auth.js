import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isRegister ? '/register' : '/login';
            const payload = isRegister
                ? { user_name: name, user_email: email, user_password: password }
                : { user_email: email, user_password: password };
            
            const { data } = await axios.post(`https://prjtodolist.azurewebsites.net${url}`, payload);
    
            if (data.access_token) {
                localStorage.setItem('token', data.access_token);
                onLogin(data.access_token);
                window.location.href = '/assignments';
            } else {
                alert(data.message || 'Erro ao fazer login ou registro');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro na requisição. Tente novamente.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
                {isRegister && (
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <p onClick={() => setIsRegister(!isRegister)} className="mt-3 text-center">
                {isRegister ? 'Already have an account? Login' : 'Create a new account'}
            </p>
        </div>
    );
};

export default Auth;
