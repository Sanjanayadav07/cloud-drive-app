# ☁️ Cloud Drive App

A full-stack Google Drive-like cloud storage application built using **React, Node.js, Express, and MongoDB**.  
Users can upload, view, and manage files inside folders with authentication.

---

## 🚀 Features

- 🔐 User Authentication (Signup/Login with JWT)
- 📁 Folder creation system
- 📤 File upload (Multer)
- 📂 File listing per folder
- 🗑️ Delete files
- 🔎 Search files
- 🖼️ Image preview modal
- ⚡ Optimistic UI updates (instant feedback)
- 🔒 Protected routes with middleware

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Axios
- React Router
- Tailwind CSS

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file upload)

---

## 📂 Project Structure
```
cloud-drive-app
│
├── backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── middleware
│ ├── uploads
│ └── server.js
│
├── frontend
│ ├── src
│ │ ├── pages
│ │ ├── components
│ │ ├── api
│ │ └── App.jsx
│
└── README.md

```
---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/cloud-drive-app.git
cd cloud-drive-app
```
### 2️⃣ Backend Setup
```
cd backend
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run backend:
npm run dev
```
---
### 3️⃣ Frontend Setup
- cd frontend
- npm install
- npm run dev
---
### 🔐 Authentication Flow
- User signs up / logs in
- JWT token generated
- Token stored in localStorage
- Sent in headers for protected routes
---
### 📤 File Upload Flow
- User selects file
- Sent via FormData using Axios
- Multer handles upload on backend
- File metadata stored in MongoDB
---
### 🗑️ Delete Flow
- User clicks delete
- Request sent to backend with file ID
- File removed from DB
- Folder size updated
---
### ⚠️ Known Limitation
- File storage is not persistent (Vercel/serverless limitation)
- Images are stored as metadata only in deployed version
- For production, Cloudinary or AWS S3 is recommended
---
### 🚀 Future Improvements
- Cloudinary integration for real file storage
- Drag & drop upload
- Folder nesting
- File sharing system
- Role-based access
---
### 👨‍💻 Author

- Developed by Sanjana Yadav
