import React, { useState } from 'react';
import axios from 'axios';

const Auth = ({ onLogin }) => {
    const [name, setName] = useState(''); // Adiciona o estado para o nome
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = isRegister ? '/register' : '/login';
            
            // Se for registro, envia o nome também
            const payload = isRegister
                ? { user_name: name, user_email: email, user_password: password }
                : { user_email: email, user_password: password };
            
            const { data } = await axios.post(`https://prjtodolist.azurewebsites.net${url}`, payload);
    
            if (data.access_token) {
                // Armazena o token no localStorage
                localStorage.setItem('token', data.access_token);
                
                onLogin(data.access_token);
                // Redirecionar para a página de tarefas
                window.location.href = '/assignments';
            } else {
                // Tratamento de mensagens de erro
                alert(data.message || 'Erro ao fazer login ou registro');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro na requisição. Tente novamente.');
        }
    };

    return (
        <div>
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <p onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already have an account? Login' : 'Create a new account'}
            </p>
        </div>
    );
};

export default Auth;
