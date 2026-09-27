# 🚀 Library Management System — Execution Guide

This document explains how to run the project locally from a fresh clone.

---

## 1. Prerequisites

Install the following:

- Java 25
- Maven (or use the included Maven Wrapper)
- MySQL 8+
- Node.js
- npm
- Git

Check installations:

```bash
java -version
node -v
npm -v
git --version
```

The current `pom.xml` specifies Java 25.

---

## 2. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd "LibraryManagement System"
```

---

## 3. Configure MySQL

Start the MySQL server.

Create the database:

```sql
CREATE DATABASE library_management;
```

Verify:

```sql
SHOW DATABASES;
```

---

## 4. Configure Backend Database Connection

Open:

```text
src/main/resources/application.properties
```

Configure your local MySQL username and password.

Example:

```properties
spring.application.name=library-management-system

spring.datasource.url=jdbc:mysql://localhost:3306/library_management
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

### IMPORTANT

Do not commit real database passwords to GitHub.

For a public repository, keep real credentials in your local configuration or environment variables and commit only a safe example configuration.

---

## 5. Start the Spring Boot Backend

Open Terminal 1 in the project root.

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Or, if Maven is installed:

```bash
mvn spring-boot:run
```

The backend should start on:

```text
http://localhost:8080
```

The API base URL is:

```text
http://localhost:8080/api
```

Keep this terminal running.

---

## 6. Start the React Frontend

Open Terminal 2.

Move into the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend should normally be available at:

```text
http://localhost:5173
```

Keep this terminal running.

---

## 7. Open the Application

Open your browser:

```text
http://localhost:5173
```

You should see the Library Management System login page.

---

# 🔐 8. Student Login Flow

If a student account does not exist, register one through:

```text
POST /api/auth/register
```

The application creates normal registered accounts with:

```text
Role = STUDENT
```

Then login using the login page.

Successful login returns:

```text
JWT token
username
role
```

The frontend stores these values and opens the Student Dashboard.

---

# 🎓 9. Student Portal

After student login:

```text
Student Dashboard
│
├── Dashboard
├── Browse Books
├── My Borrowings
├── My Profile
└── Logout
```

### Browse Books

Students can:

- View books
- Search books
- See available copies
- Borrow available books

### My Borrowings

Students can:

- View borrowing records
- Check borrow dates
- See Returned/Borrowed status
- Return an active borrowing

---

# 📚 10. Librarian Login

A librarian account must exist in the database with:

```text
role = LIBRARIAN
```

Login through the same login page.

After successful authentication, the frontend checks the returned role and opens the Librarian Dashboard.

---

# 👨‍💼 11. Librarian Portal

The librarian dashboard contains:

```text
Librarian Dashboard
│
├── Dashboard
│   ├── Total Books
│   ├── Available Copies
│   ├── Total Members
│   └── Active Borrowings
│
├── Manage Books
│
├── Manage Members
│
└── Borrowings
```

---

## 12. Book Management

The backend supports:

```text
GET     /api/books
GET     /api/books/{id}
POST    /api/books
PUT     /api/books/{id}
DELETE  /api/books/{id}
```

The librarian can view and delete books through the current dashboard.

---

## 13. Member Management

The backend supports:

```text
GET     /api/members
GET     /api/members/{id}
POST    /api/members
PUT     /api/members/{id}
DELETE  /api/members/{id}
```

The librarian dashboard displays member records and supports deletion.

---

## 14. Borrowing Flow

To issue a book:

```text
POST /api/borrowings?bookId=<BOOK_ID>&memberId=<MEMBER_ID>
```

The backend:

1. Finds the book.
2. Finds the member.
3. Checks available copies.
4. Decreases available copies.
5. Creates a borrowing record.
6. Stores the current date as the borrow date.

To return a book:

```text
PUT /api/borrowings/<BORROWING_ID>?returned=true
```

The backend:

1. Finds the borrowing record.
2. Checks whether it is already returned.
3. Increases the book's available copies.
4. Sets the return date.
5. Marks the borrowing as returned.

---

# 🔑 15. JWT Request Flow

After login:

```text
Login Page
    │
    ▼
POST /api/auth/login
    │
    ▼
Spring Security authenticates user
    │
    ▼
JWT generated
    │
    ▼
React stores token
    │
    ▼
Protected API request
    │
    ▼
Authorization: Bearer <JWT>
    │
    ▼
JwtAuthenticationFilter
    │
    ▼
Role checked
    │
    ▼
Controller
```

---

# 🛑 16. Stopping the Application

Frontend:

```text
Ctrl + C
```

Backend:

```text
Ctrl + C
```

MySQL can remain running if you plan to use the application again.

---

# 🧰 17. Troubleshooting

## Backend does not start

Check:

```bash
java -version
```

Make sure the installed Java version is compatible with the `pom.xml`.

Also check that MySQL is running.

---

## Database connection error

Check:

```text
spring.datasource.url
spring.datasource.username
spring.datasource.password
```

Make sure the database exists:

```sql
CREATE DATABASE library_management;
```

---

## Frontend cannot connect to backend

Make sure both servers are running:

```text
Backend  → http://localhost:8080
Frontend → http://localhost:5173
```

Also check the browser console for CORS or network errors.

---

## 401 Unauthorized

The JWT may be missing, invalid, or expired.

Logout and login again.

---

## 403 Forbidden

The authenticated user may not have the required role.

For example:

```text
STUDENT → cannot perform librarian-only book management
LIBRARIAN → can perform librarian operations
```

---

## Port already in use

Backend uses:

```text
8080
```

Frontend uses:

```text
5173
```

Close the process using the port or change the application configuration.

---

# ✅ Final Verification Checklist

Before considering the application ready:

- [ ] MySQL is running
- [ ] `library_management` database exists
- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Login page opens
- [ ] Student registration works
- [ ] Student login works
- [ ] Student dashboard opens
- [ ] Books can be viewed
- [ ] Student borrowing works
- [ ] Student return works
- [ ] Librarian login works
- [ ] Librarian dashboard opens
- [ ] Book data loads
- [ ] Member data loads
- [ ] Borrowing data loads
- [ ] Librarian book deletion works
- [ ] Librarian member deletion works
- [ ] Issue book works
- [ ] Return book works
- [ ] Logout works

---

## GitHub Preparation

Before the first push:

1. Remove real credentials from configuration.
2. Remove `node_modules/`.
3. Remove Maven `target/`.
4. Add a proper `.gitignore`.
5. Verify no `.env` or secret files are present.
6. Add `README.md`.
7. Add this `EXECUTION_GUIDE.md`.
8. Add `requirements.txt`.
9. Test the project once from the documented steps.
10. Commit and push.
