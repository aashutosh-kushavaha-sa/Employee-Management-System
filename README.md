
# 🚀 Employee Management System (EMS)

A complete **MEAN Stack Employee Management System** featuring responsive UI, JWT authentication, role‑based admin access, and clean service‑based backend architecture.

---

## 📘 Project Overview

This system provides:
- Admin authentication (JWT)
- Employee CRUD operations (Add, Update, View, Delete)
- Analytics dashboard
- Fully responsive Angular UI with Tailwind + DaisyUI
- Service-based backend architecture (Controller → Service → Model)
- Secure password hashing (bcrypt)
- MongoDB database

---

## 🏗 Project Architecture

```
EMS-Deploy/
│
├── backend/
│   ├── controllers/       # Request/Response handlers
│   ├── services/          # Business logic layer
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth + Error handling
│   ├── utils/             # Logger
│   ├── config/            # Database connection
│   ├── .env.example       # Sample environment file
│   └── server.js          # Backend entry point
│
└── frontend/
    ├── src/
    │   ├── app/           # Angular components/pages
    │   ├── assets/        # Images & static files
    │   ├── environments/  # API URLs
    │   └── styles.css     # Tailwind global styles
    └── angular.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Project
```
git clone https://github.com/aashutosh-kushavaha-sa/Employee-Management-System/tree/refactor/code-cleanup
cd EMS-Deploy
```

---

# 🖥 Backend Setup

### Install backend dependencies
```
cd backend
npm install
```

### Create `.env` file
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ems
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Start backend server
```
npm start
```

Backend runs on:
```
http://localhost:5000
```

---

# 🌐 Frontend Setup (Angular)

### Install dependencies
```
cd frontend
npm install
```

### Run Angular app
```
ng serve
```

Frontend runs on:
```
http://localhost:4200
```

---

# 🔐 Authentication

This system uses **JWT (JSON Web Token)** for secure admin login.

- Token stored in localStorage  
- Protected routes require token  
- Token expires in 1 hour  
- Backend validates token for each request  

---

# 📡 API Documentation

---

# AUTH ROUTES

### **POST /api/auth/register**
Registers a new admin  
Body:
```json
{
  "name": "Admin",
  "email": "admin@gmail.com",
  "password": "123456",
  "passwordConfirm": "123456"
}
```

### **POST /api/auth/login**
Body:
```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "jwt-token",
  "admin": { "id": "12345", "name": "Admin", "email": "admin@gmail.com" }
}
```

---

# EMPLOYEE ROUTES

Base URL:
```
/api/employee
```

### **POST /** – Add Employee  
### **GET /** – Get All Employees  
### **GET /:id** – Get Employee by ID  
### **PUT /:id** – Update Employee  
### **DELETE /:id** – Delete Employee  

---

# 📁 Folder Structure Explained

### **Backend**
| Folder | Description |
|--------|-------------|
| controllers | HTTP request handlers |
| services | Business logic layer |
| models | MongoDB schemas |
| routes | API endpoints |
| middleware | Auth + Error handlers |
| utils | Logger, helpers |
| config | Database setup |

---

### **Frontend**
| Folder | Description |
|--------|-------------|
| app | Angular pages/components |
| services | API calls |
| interfaces | Type definitions |
| styles.css | Tailwind/DaisyUI styles |
| environments | API URLs |

---

# 📈 Features
- Fully responsive UI  
- Admin JWT Authentication  
- Employee CRUD  
- Dashboard analytics  
- Logging & error handling  
- Modular backend architecture  

---

# 🔮 Future Enhancements
- Pagination  
- File Upload for employee images  
- Export to Excel/PDF  
- 2FA Login  
- Role-based permissions  

---

# 📝 License
This project is for portfolio and learning purposes.

---

