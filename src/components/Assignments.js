import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Replacing useHistory with useNavigate

const Assignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [dueDate, setDueDate] = useState('');

    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // Replacing useHistory with useNavigate

    const fetchAssignments = async () => {
        if (!token) {
            console.error('Token não disponível');
            return;
        }

        try {
            const { data } = await axios.get('https://prjtodolist.azurewebsites.net/assignments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssignments(data.assignments);
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error.response ? error.response.data : error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            console.error('Token não disponível ao enviar a tarefa');
            return;
        }

        try {
            await axios.post('https://prjtodolist.azurewebsites.net/assignment', {
                assignment_title: title,
                assignment_description: description,
                assignment_status: status,
                assignment_due_date: dueDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchAssignments();
            resetForm();
        } catch (error) {
            console.error('Erro ao criar tarefa:', error.response ? error.response.data : error.message);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus('');
        setDueDate('');
    };

    const handleDelete = async (id) => {
        if (!token) {
            console.error('Token não disponível ao excluir a tarefa');
            return;
        }

        try {
            await axios.delete(`https://prjtodolist.azurewebsites.net/assignment/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchAssignments();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error.response ? error.response.data : error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Redirect to login page after logging out
    };

    useEffect(() => {
        fetchAssignments();
    }, [token]);

    return (
        <div>
            <h2>Assignments</h2>
            <button onClick={handleLogout}>Logout</button>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
                <button type="submit">Add Assignment</button>
            </form>
            <div className="assignments-container">
                {assignments.map((assignment) => (
                    <div key={assignment.assignment_id} className="assignment-card">
                        <h3>{assignment.assignment_title}</h3>
                        <p>{assignment.assignment_description}</p>
                        <p>Status: {assignment.assignment_status}</p>
                        <p>Due Date: {new Date(assignment.assignment_due_date.$date || assignment.assignment_due_date).toLocaleDateString()}</p>
                        <button onClick={() => handleDelete(assignment.assignment_id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assignment;
