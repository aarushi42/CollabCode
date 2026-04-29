# CollabCode — Backend

> REST API and real-time server powering the CollabCode platform — connecting developers worldwide to collaborate, build projects, and grow together.

📦 **Frontend Repo:** [github.com/aarushi42/CollabCode-Frontend](https://github.com/aarushi42/CollabCode-Frontend)

---

## 🚀 Tech Stack

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| Node.js               | Runtime Environment           |
| Express 5             | Web Framework                 |
| MongoDB + Mongoose    | Database & ODM                |
| Socket.IO             | Real-time Communication       |
| JSON Web Tokens (JWT) | Authentication                |
| bcrypt                | Password Hashing              |
| dotenv                | Environment Variables         |
| cors                  | Cross-Origin Resource Sharing |
| cookie-parser         | Cookie Handling               |
| validator             | Input Validation              |

---

## 📁 Project Structure

```
CollabCode/
├── src/
│   ├── app.js            # App entry point
│   ├── config/           # DB & environment configuration
│   ├── models/           # Mongoose data models
│   ├── routes/           # Express route definitions
│   ├── middlewares/      # Auth & other middleware
│   └── utils/            # Helper utilities
├── package.json
└── .gitignore
```

---

## 📡 API Overview

| Method | Endpoint                             | Description                      |
| ------ | ------------------------------------ | -------------------------------- |
| POST   | `/auth/signup`                       | Register a new user              |
| POST   | `/auth/login`                        | Login and receive JWT cookie     |
| POST   | `/auth/logout`                       | Logout and clear cookie          |
| GET    | `/profile`                           | Get authenticated user's profile |
| PATCH  | `/profile/edit`                      | Update user profile              |
| GET    | `/feed`                              | Browse developer profiles        |
| POST   | `/request/send/:status/:userId`      | Send connection request          |
| POST   | `/request/review/:status/:requestId` | Accept / reject a request        |
| GET    | `/connections`                       | Get all accepted connections     |

> Real-time messaging is handled via **Socket.IO** alongside the REST endpoints.

---

## 📜 Scripts

| Command       | Description                            |
| ------------- | -------------------------------------- |
| `npm run dev` | Start server with nodemon (hot reload) |
| `npm start`   | Start server for production            |
| `npm test`    | Run tests with Jest                    |

---

## 👩‍💻 Author

**Aarushi Koirala**  
[GitHub Profile](https://github.com/aarushi42)
