# ToDo List Assignment Manager

A React-based web app for managing assignments, allowing users to create, edit, delete, and track the status of tasks. The backend API is hosted on Azure, and the frontend is deployed on Vercel.

## Features

- User authentication with JWT.
- Create, update, delete assignments.
- Track task status: "To Do", "Ongoing", "Done".
- Set due dates for assignments.
- Responsive UI with Bootstrap.

## Technologies

- **Frontend**: React.js, Axios, Bootstrap, React Router
- **Backend**: Flask (Azure-hosted)
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend), Azure (Backend)


## API Endpoints

### **Authentication**
- `POST /login` – Login with email and password.
- `POST /register` – Register a new user.

### **Assignments**
- `GET /assignments` – Get all assignments.
- `POST /assignment` – Create a new assignment.
- `PUT /assignment/:id` – Update an assignment.
- `DELETE /assignment/:id` – Delete an assignment.

