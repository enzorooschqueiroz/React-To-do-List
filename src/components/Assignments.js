import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Assignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('To Do'); // Status inicial
    const [dueDate, setDueDate] = useState('');
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

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
            if (isEditing && editingAssignment) {
                await axios.put(`https://prjtodolist.azurewebsites.net/assignment/${editingAssignment}`, {
                    assignment_title: title,
                    assignment_description: description,
                    assignment_status: status,
                    assignment_due_date: dueDate
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('https://prjtodolist.azurewebsites.net/assignment', {
                    assignment_title: title,
                    assignment_description: description,
                    assignment_status: status,
                    assignment_due_date: dueDate
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            await fetchAssignments();
            resetForm();
        } catch (error) {
            console.error('Erro ao criar ou editar tarefa:', error.response ? error.response.data : error.message);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStatus('To Do'); // Reseta o status para "To Do"
        setDueDate('');
        setEditingAssignment(null);
        setIsEditing(false);
    };

    const handleEdit = (assignment) => {
        setTitle(assignment.assignment_title);
        setDescription(assignment.assignment_description);
        setStatus(assignment.assignment_status);
        setDueDate(assignment.assignment_due_date);
        setEditingAssignment(assignment.assignment_id);
        setIsEditing(true);
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
        navigate('/'); // Redireciona para a página de login após o logout
    };

    useEffect(() => {
        fetchAssignments();
    }, [token]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Assignments</h2>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
                <h4>{isEditing ? 'Edit Assignment' : 'Add Assignment'}</h4>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="To Do">To Do</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div className="mb-3">
                    <input
                        type="date"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">{isEditing ? 'Update Assignment' : 'Add Assignment'}</button>
                {isEditing && <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancel</button>}
            </form>

            <div className="assignments-container">
                <h4>Your Assignments</h4>
                {assignments.map((assignment) => (
                    <div key={assignment.assignment_id} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{assignment.assignment_title}</h5>
                            <p className="card-text">{assignment.assignment_description}</p>
                            <p>Status: <strong>{assignment.assignment_status}</strong></p>
                            <p>Due Date: <strong>{new Date(assignment.assignment_due_date.$date || assignment.assignment_due_date).toLocaleDateString()}</strong></p>
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-warning me-2" onClick={() => handleEdit(assignment)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(assignment.assignment_id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assignment;
