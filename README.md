# 📚 Library Management System

A full-stack Library Management System built with **React**, **Spring Boot**, **Spring Security**, **JWT**, **Spring Data JPA**, and **MySQL**.

The application provides separate experiences for **Students** and **Librarians**. Students can browse and borrow books, while librarians can manage books, members, and borrowing transactions.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Student registration
- Username/password login
- JWT-based authentication
- BCrypt password hashing
- Role-based authorization
- Separate STUDENT and LIBRARIAN portals
- Logout with client-side authentication cleanup

### 🎓 Student Portal
- Student dashboard
- Browse available books
- Search books by title, author, category, or ISBN
- View available copies
- Borrow books
- View borrowing history
- Return borrowed books
- View student profile

### 📚 Librarian Portal
- Librarian dashboard
- View library statistics
- View total books and copies
- View available and borrowed copies
- Manage books
- View and delete members
- View borrowing records
- Issue books to members
- Process book returns

### 🗄️ Backend
- RESTful APIs
- Spring Data JPA
- MySQL persistence
- Service/repository architecture
- JWT authentication filter
- Role-based endpoint protection
- CORS configuration for the React frontend

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19.1.1 |
| Frontend tooling | Vite 8 |
| HTTP client | Axios |
| Backend | Spring Boot 4.0.0 |
| Language | Java 25 |
| Security | Spring Security + JWT |
| ORM | Spring Data JPA / Hibernate |
| Database | MySQL |
| Build tool | Maven |
| Authentication | JWT + BCrypt |

> The versions above are taken from the current project files.

---

## 🏗️ Architecture

```text
                    ┌──────────────────────────┐
                    │      React Frontend      │
                    │       Vite + Axios       │
                    │     localhost:5173       │
                    └────────────┬─────────────┘
                                 │ HTTP / REST
                                 │ JWT Bearer Token
                                 ▼
                    ┌──────────────────────────┐
                    │    Spring Boot Backend   │
                    │      localhost:8080      │
                    ├──────────────────────────┤
                    │ Controllers              │
                    │ Services                 │
                    │ Repositories             │
                    │ Spring Security          │
                    │ JWT Authentication       │
                    └────────────┬─────────────┘
                                 │ JPA / Hibernate
                                 ▼
                    ┌──────────────────────────┐
                    │       MySQL Database      │
                    │   library_management      │
                    └──────────────────────────┘
```

---

## 👥 User Roles

### STUDENT

Students can:

- Login
- Browse books
- Search books
- Borrow available books
- View their borrowing records
- Return borrowed books
- View their profile

### LIBRARIAN

Librarians can:

- Login
- View dashboard statistics
- Manage books
- Manage members
- Issue books
- Process returns
- View borrowing records

Normal registration creates a **STUDENT** account. Librarian accounts are expected to be created separately.

---

## 📂 Project Structure

```text
LibraryManagement System/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── LibrarianDashboard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── src/
│   └── main/
│       ├── java/com/library/management/
│       │   ├── controller/
│       │   ├── entity/
│       │   ├── repository/
│       │   ├── security/
│       │   ├── service/
│       │   └── LibraryManagementApplication.java
│       │
│       └── resources/
│           └── application.properties
│
├── pom.xml
├── mvnw
├── mvnw.cmd
├── README.md
├── EXECUTION_GUIDE.md
├── requirements.txt
└── .gitignore
```

---

## 🔌 Main REST APIs

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a student |
| POST | `/api/auth/login` | Login and receive JWT |

### Books

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/books` | Get all books |
| GET | `/api/books/{id}` | Get a book |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/{id}` | Update a book |
| DELETE | `/api/books/{id}` | Delete a book |

### Members

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/members` | Get all members |
| GET | `/api/members/{id}` | Get a member |
| POST | `/api/members` | Add a member |
| PUT | `/api/members/{id}` | Update a member |
| DELETE | `/api/members/{id}` | Delete a member |

### Borrowings

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/borrowings` | Get all borrowing records |
| GET | `/api/borrowings/{id}` | Get a borrowing record |
| POST | `/api/borrowings?bookId={bookId}&memberId={memberId}` | Issue a book |
| PUT | `/api/borrowings/{id}?returned=true` | Return a book |
| DELETE | `/api/borrowings/{id}` | Delete a borrowing record |

---

## 🔒 Security Model

The backend uses:

- Spring Security
- JWT authentication
- BCrypt password encoding
- Stateless sessions
- Role-based endpoint authorization

The frontend stores the JWT returned after login and sends it to protected API endpoints using:

```text
Authorization: Bearer <JWT>
```

Examples of authorization rules:

- `/api/auth/**` → public
- Book GET → STUDENT or LIBRARIAN
- Book POST/PUT/DELETE → LIBRARIAN
- Member GET → STUDENT or LIBRARIAN
- Member POST/PUT/DELETE → LIBRARIAN
- Borrowing GET/POST/PUT → STUDENT or LIBRARIAN
- Borrowing DELETE → LIBRARIAN

---

## 🗃️ Database

The application uses MySQL with the database:

```text
library_management
```

The main entities are:

```text
User
Book
Member
Borrowing
```

Relationships include:

```text
Borrowing
   │
   ├── Book
   │
   └── Member
```

Hibernate/JPA is configured to update the database schema automatically during development.

---

## 🚀 Running the Project

Read **[EXECUTION_GUIDE.md](EXECUTION_GUIDE.md)** for the complete step-by-step setup and execution procedure.

At a high level:

```text
1. Start MySQL
2. Create library_management database
3. Configure database credentials
4. Start Spring Boot backend on port 8080
5. Start React frontend on port 5173
6. Open the frontend in the browser
7. Register/login
8. Use the appropriate Student or Librarian portal
```

---

## ⚠️ Important Security Note

Before pushing this project to GitHub:

- Do **not** commit database passwords.
- Do **not** commit JWT secrets.
- Do **not** commit `.env` files containing credentials.
- Replace local credentials in `application.properties` with environment variables or a local-only configuration.
- Do **not** upload `node_modules/` or Maven `target/` files.

The current working project contains local database configuration, so review `src/main/resources/application.properties` before the first Git commit.

---

## 🧪 Current Functional Flow

```text
User
 │
 ▼
Login Page
 │
 ├── STUDENT ───────► Student Dashboard
 │                       │
 │                       ├── Browse Books
 │                       ├── Borrow Book
 │                       ├── My Borrowings
 │                       ├── Return Book
 │                       └── Profile
 │
 └── LIBRARIAN ────► Librarian Dashboard
                         │
                         ├── Dashboard
                         ├── Manage Books
                         ├── Manage Members
                         └── Borrowings
```

---

## 🔮 Future Enhancements

Possible future improvements:

- Add/update forms directly inside the librarian dashboard
- Fine calculation for overdue books
- Due dates and reminders
- Pagination for large book/member collections
- Advanced search and filtering
- Email notifications
- Admin portal for librarian account management
- Improved error handling and validation
- Automated unit and integration tests
- Deployment using a cloud database and hosted frontend/backend

---

## 👩‍💻 Project

**Library Management System**

Full-stack academic/project implementation using Java, Spring Boot, React, JWT, and MySQL.
