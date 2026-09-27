import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function LibrarianDashboard({ user, logout }) {
  const [page, setPage] = useState("dashboard");

  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [borrowings, setBorrowings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * =========================================================
   * AXIOS CONFIGURATION
   * =========================================================
   */

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${user?.token}`
    }
  });

  /*
   * =========================================================
   * LOAD ALL LIBRARY DATA
   * =========================================================
   */

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const config = getConfig();

      const [booksResponse, membersResponse, borrowingsResponse] =
        await Promise.all([
          axios.get(`${API}/books`, config),
          axios.get(`${API}/members`, config),
          axios.get(`${API}/borrowings`, config)
        ]);

      setBooks(booksResponse.data);
      setMembers(membersResponse.data);
      setBorrowings(borrowingsResponse.data);

    } catch (err) {
      console.error("Dashboard loading error:", err);

      if (err.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to access this data.");
      } else {
        setError("Unable to load library data.");
      }

    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * LOAD DATA WHEN DASHBOARD OPENS
   * =========================================================
   */

  useEffect(() => {
    loadData();
  }, []);

  /*
   * =========================================================
   * DELETE BOOK
   * =========================================================
   */

  const deleteBook = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API}/books/${id}`,
        getConfig()
      );

      alert("Book deleted successfully.");

      loadData();

    } catch (err) {
      console.error(err);
      alert("Unable to delete book.");
    }
  };

  /*
   * =========================================================
   * DELETE MEMBER
   * =========================================================
   */

  const deleteMember = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API}/members/${id}`,
        getConfig()
      );

      alert("Member deleted successfully.");

      loadData();

    } catch (err) {
      console.error(err);
      alert("Unable to delete member.");
    }
  };

  /*
   * =========================================================
   * ISSUE BOOK
   * =========================================================
   */

  const issueBook = async (bookId, memberId) => {
    if (!bookId || !memberId) {
      alert("Please select both book and member.");
      return;
    }

    try {
      await axios.post(
        `${API}/borrowings?bookId=${bookId}&memberId=${memberId}`,
        {},
        getConfig()
      );

      alert("Book issued successfully.");

      loadData();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data ||
        "Unable to issue book."
      );
    }
  };

  /*
   * =========================================================
   * RETURN BOOK
   * =========================================================
   */

  const returnBook = async (id) => {
    try {
      await axios.put(
        `${API}/borrowings/${id}?returned=true`,
        {},
        getConfig()
      );

      alert("Book returned successfully.");

      loadData();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data ||
        "Unable to return book."
      );
    }
  };

  /*
   * =========================================================
   * CALCULATIONS
   * =========================================================
   */

  const totalBooks = books.length;

  const totalCopies = books.reduce(
    (sum, book) => sum + Number(book.totalCopies || 0),
    0
  );

  const availableCopies = books.reduce(
    (sum, book) => sum + Number(book.availableCopies || 0),
    0
  );

  const activeBorrowings = borrowings.filter(
    borrowing => !borrowing.returned
  ).length;

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading Library Dashboard...</h2>
        <p>Please wait.</p>
      </div>
    );
  }

  /*
   * =========================================================
   * MAIN DASHBOARD
   * =========================================================
   */

  return (
    <div className="portal">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="portal-sidebar librarian-sidebar">

        <div className="portal-logo">
          📚 <span>Library</span>
        </div>

        <div className="role-label">
          LIBRARIAN PORTAL
        </div>

        <nav>

          <button
            className={
              page === "dashboard"
                ? "nav-active"
                : ""
            }
            onClick={() => setPage("dashboard")}
          >
            📊 Dashboard
          </button>

          <button
            className={
              page === "books"
                ? "nav-active"
                : ""
            }
            onClick={() => setPage("books")}
          >
            📚 Manage Books
          </button>

          <button
            className={
              page === "members"
                ? "nav-active"
                : ""
            }
            onClick={() => setPage("members")}
          >
            👥 Manage Members
          </button>

          <button
            className={
              page === "borrowings"
                ? "nav-active"
                : ""
            }
            onClick={() => setPage("borrowings")}
          >
            🔄 Borrowings
          </button>

        </nav>

        <button
          className="logout-btn"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="portal-main">

        {/* HEADER */}

        <header className="portal-header">

          <div>

            <h1>
              {page === "dashboard"
                ? "Librarian Dashboard"
                : page === "books"
                ? "Manage Books"
                : page === "members"
                ? "Manage Members"
                : "Borrowing Management"}
            </h1>

            <p>
              Welcome, {user?.username}
            </p>

          </div>

          <div className="user-chip">
            👨‍💼 {user?.username}
          </div>

        </header>


        {/* ERROR */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* ===================================================
            DASHBOARD PAGE
        =================================================== */}

        {page === "dashboard" && (

          <>

            <div className="stats">

              <Stat
                icon="📚"
                value={totalBooks}
                label="Total Books"
              />

              <Stat
                icon="📦"
                value={availableCopies}
                label="Available Copies"
              />

              <Stat
                icon="👥"
                value={members.length}
                label="Total Members"
              />

              <Stat
                icon="🔄"
                value={activeBorrowings}
                label="Active Borrowings"
              />

            </div>


            <div className="dashboard-grid">

              {/* LIBRARY OVERVIEW */}

              <div className="section-card">

                <h2>
                  Library Overview
                </h2>

                <div className="overview-row">
                  <span>
                    Total Book Titles
                  </span>

                  <strong>
                    {totalBooks}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    Total Book Copies
                  </span>

                  <strong>
                    {totalCopies}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    Available Copies
                  </span>

                  <strong>
                    {availableCopies}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    Borrowed Copies
                  </span>

                  <strong>
                    {totalCopies - availableCopies}
                  </strong>
                </div>

                <div className="overview-row">
                  <span>
                    Total Borrowing Records
                  </span>

                  <strong>
                    {borrowings.length}
                  </strong>
                </div>

              </div>


              {/* RECENT BOOKS */}

              <div className="section-card">

                <h2>
                  Books in Library
                </h2>

                {books.slice(0, 5).map(book => (

                  <div
                    className="recent-book"
                    key={book.id}
                  >

                    <div>

                      <strong>
                        {book.title}
                      </strong>

                      <small>
                        {book.author}
                      </small>

                    </div>

                    <span>
                      {book.availableCopies}/
                      {book.totalCopies}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </>
        )}


        {/* ===================================================
            BOOK MANAGEMENT
        =================================================== */}

        {page === "books" && (

          <ManageBooks
            books={books}
            deleteBook={deleteBook}
          />

        )}


        {/* ===================================================
            MEMBER MANAGEMENT
        =================================================== */}

        {page === "members" && (

          <ManageMembers
            members={members}
            deleteMember={deleteMember}
          />

        )}


        {/* ===================================================
            BORROWING MANAGEMENT
        =================================================== */}

        {page === "borrowings" && (

          <ManageBorrowings
            books={books}
            members={members}
            borrowings={borrowings}
            issueBook={issueBook}
            returnBook={returnBook}
          />

        )}

      </main>

    </div>
  );
}


/*
 * =========================================================
 * STAT COMPONENT
 * =========================================================
 */

function Stat({ icon, value, label }) {

  return (
    <div className="stat-card">

      <div className="stat-icon">
        {icon}
      </div>

      <div>

        <h3>
          {value}
        </h3>

        <p>
          {label}
        </p>

      </div>

    </div>
  );
}


/*
 * =========================================================
 * MANAGE BOOKS
 * =========================================================
 */

function ManageBooks({ books, deleteBook }) {

  return (

    <div className="section-card">

      <div className="section-heading">

        <div>

          <h2>
            Book Collection
          </h2>

          <p>
            Manage books in the library
          </p>

        </div>

      </div>


      <div className="table-card">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Book</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Total</th>
              <th>Available</th>
              <th>Action</th>
            </tr>

          </thead>


          <tbody>

            {books.map(book => (

              <tr key={book.id}>

                <td>
                  {book.id}
                </td>

                <td>
                  <strong>
                    {book.title}
                  </strong>
                </td>

                <td>
                  {book.author}
                </td>

                <td>
                  {book.isbn}
                </td>

                <td>
                  <span className="badge">
                    {book.category || "General"}
                  </span>
                </td>

                <td>
                  {book.totalCopies}
                </td>

                <td className="available">
                  {book.availableCopies}
                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteBook(book.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


/*
 * =========================================================
 * MANAGE MEMBERS
 * =========================================================
 */

function ManageMembers({
  members,
  deleteMember
}) {

  return (

    <div className="section-card">

      <div className="section-heading">

        <div>

          <h2>
            Library Members
          </h2>

          <p>
            Manage registered members
          </p>

        </div>

      </div>


      <div className="table-card">

        <table>

          <thead>

            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Action</th>
            </tr>

          </thead>


          <tbody>

            {members.map(member => (

              <tr key={member.id}>

                <td>
                  {member.id}
                </td>

                <td>
                  <strong>
                    {member.name}
                  </strong>
                </td>

                <td>
                  {member.email}
                </td>

                <td>
                  {member.phone}
                </td>

                <td>
                  {member.address}
                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteMember(member.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


/*
 * =========================================================
 * BORROWING MANAGEMENT
 * =========================================================
 */

function ManageBorrowings({
  books,
  members,
  borrowings,
  issueBook,
  returnBook
}) {

  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");

  const handleIssue = () => {

    issueBook(
      bookId,
      memberId
    );

    setBookId("");
    setMemberId("");
  };


  return (

    <>

      {/* ISSUE BOOK FORM */}

      <div className="borrow-form">

        <div>

          <label>
            Book
          </label>

          <select
            value={bookId}
            onChange={(e) =>
              setBookId(e.target.value)
            }
          >

            <option value="">
              Select book
            </option>

            {books
              .filter(
                book =>
                  book.availableCopies > 0
              )
              .map(book => (

                <option
                  key={book.id}
                  value={book.id}
                >
                  {book.title}
                  {" - "}
                  {book.availableCopies}
                  {" available"}
                </option>

              ))}

          </select>

        </div>


        <div>

          <label>
            Member
          </label>

          <select
            value={memberId}
            onChange={(e) =>
              setMemberId(e.target.value)
            }
          >

            <option value="">
              Select member
            </option>

            {members.map(member => (

              <option
                key={member.id}
                value={member.id}
              >
                {member.name}
              </option>

            ))}

          </select>

        </div>


        <button
          className="primary-btn"
          onClick={handleIssue}
        >
          Issue Book
        </button>

      </div>


      {/* BORROWING TABLE */}

      <div className="section-card">

        <div className="section-heading">

          <div>

            <h2>
              Borrowing Records
            </h2>

            <p>
              Track all book transactions
            </p>

          </div>

        </div>


        <div className="table-card">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Book</th>
                <th>Member</th>
                <th>Borrow Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {borrowings.map(borrowing => (

                <tr key={borrowing.id}>

                  <td>
                    {borrowing.id}
                  </td>

                  <td>
                    {borrowing.book?.title}
                  </td>

                  <td>
                    {borrowing.member?.name}
                  </td>

                  <td>
                    {borrowing.borrowDate}
                  </td>

                  <td>

                    <span
                      className={
                        borrowing.returned
                          ? "returned"
                          : "borrowed"
                      }
                    >
                      {borrowing.returned
                        ? "Returned"
                        : "Borrowed"}
                    </span>

                  </td>

                  <td>

                    {!borrowing.returned && (

                      <button
                        className="return-btn"
                        onClick={() =>
                          returnBook(
                            borrowing.id
                          )
                        }
                      >
                        Return
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </>
  );
}


export default LibrarianDashboard;