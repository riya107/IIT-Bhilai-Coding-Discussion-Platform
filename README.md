# IIT Bhilai Coding Discussion Platform 💻
A full-stack web platform for coding discussions, Q&A, and collaboration for the IIT Bhilai community.

## 🚀 Tech Stack
**Frontend:** React, Redux Toolkit, React Router, Axios  
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt  
**Dev Tools:** nodemon, react-scripts

## 📁 Project Structure
client/ → React frontend  
server/ → Express + MongoDB backend  
README.md → this file

## ⚙️ Setup & Run (Development)

### 1. Start the Server
cd server  
npm install  

Create `server/.env`:
```
MONGODB_URL=<your-mongodb-uri>
JWT_SECRET=<your-secret>
PORT=8000
```

Run server:
```
npm run server
```
Server runs at `http://localhost:8000`.

### 2. Start the Client
cd client  
npm install  

Create `client/.env`:
```
REACT_APP_API_URL=http://localhost:8000
```

Start client:
```
npm start
```
Client runs at `http://localhost:3000`.

## 🔌 API Summary
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users | Register |
| POST | /api/auth | Login |
| GET | /api/auth/user | Get user from token |
| GET | /api/users/:username | Get profile |
| POST | /api/users/user | Update profile |
| GET | /api/posts | List posts |
| POST | /api/posts | Create post |
| PUT | /api/posts | Update post |
| DELETE | /api/posts/:id | Delete post |
| PUT | /api/posts/:id | Add comment |
| POST | /api/posts/:id | Vote |
| GET | /api/posts/:id | Get post + increment view |

## 🗂️ Key Folders
### Backend (`server/`)
- `server.js`
- `routes/api/`
- `models/`
- `middleware/`

### Frontend (`client/`)
- `src/App.js`
- `src/store/`
- `src/actions/`
- `src/components/`

## 🛠 Troubleshooting
- Client can't reach server → check `REACT_APP_API_URL`  
- MongoDB not connecting → verify `MONGODB_URL`  
- `.env` changes require restarting React dev server  

## 🤝 Contributing
1. Fork the repo  
2. Create a feature branch  
3. Commit changes  
4. Open a pull request
