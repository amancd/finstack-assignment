# Task List Web Application

This is a full-stack task management web application built as part of a technical assessment. It allows users to create, assign, update, sort, filter, and manage tasks for team members. The application includes a RESTful Flask backend and a dynamic Angular frontend.

> 📎 **Reference Screens:** [Google Drive Link](https://drive.google.com/file/d/1_Pncl-FVsDppU30a1nS69CQ4fXmmErcK/view?usp=sharing)

---

## Features

- ✅ Create new tasks with entity, date, time, and contact person
- ✅ Assign tasks to team members
- ✅ Edit and update task details
- ✅ Filter and sort by:
  - Task Type (Call / Meeting / Video Call)
  - Status (Open / Closed)
  - Date
  - Entity Name
  - Contact Person
- ✅ Change status (Open ↔ Closed)
- ✅ Add or edit optional task notes
- ✅ Delete tasks
- ✅ Group tasks by date (Today, In X days, etc.)
- ✅ Fully responsive interface

---

## Tech Stack

### Backend
- Python 3.6x
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- Gunicorn (for production)
- PostgreSQL
- `python-dotenv` for secure config

### Frontend
- Angular 2+
- Tailwind CSS (or plain SCSS)

---

## Live Deployment

- **Backend**: Hosted on [Render](https://render.com)
- **Frontend**: Hosted on [Vercel](https://vercel.com)

---

## Setup Instructions

### Backend Setup (Flask)

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your DATABASE_URL here
python app.py
```

### Backend Setup (Flask)

```bash
cd task-manager-app
ng serve
```

### Project Structure

```bash
/backend
  ├── app.py
  ├── requirements.txt
  └── .env

/frontend
  ├── src/
  ├── angular.json
  └── package.json
```

## 📡 API Endpoints

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | `/tasks`              | Get all tasks (supports filters) |
| POST   | `/tasks`              | Create a new task     |
| GET    | `/tasks/<id>`         | Get a specific task by ID |
| PUT    | `/tasks/<id>`         | Update a task         |
| DELETE | `/tasks/<id>`         | Delete a task         |
| PATCH  | `/tasks/<id>/status`  | Update task status (open/closed) |
| PATCH  | `/tasks/<id>/note`    | Update task note      |

### Screenshots

<img width="943" alt="image" src="https://github.com/user-attachments/assets/a8f8662e-e290-4d83-b4ab-584cabeaf7a8" />
<img width="935" alt="image" src="https://github.com/user-attachments/assets/365c4fee-9a1b-4a75-ad2d-2ebee09c4b44" />
<img width="947" alt="image" src="https://github.com/user-attachments/assets/437c18d9-87aa-474d-9c55-7af905771333" />
<img width="944" alt="image" src="https://github.com/user-attachments/assets/f65a1df1-0279-4c5f-8956-bd572c59c258" />
<img width="943" alt="image" src="https://github.com/user-attachments/assets/4e742c21-17af-4b2d-ba4b-75bd1d0bf5e5" />
<img width="934" alt="image" src="https://github.com/user-attachments/assets/ccb32eba-44a5-4613-af69-059bdbe2a7b8" />


### License
This project is for technical assessment/demo purposes only.
