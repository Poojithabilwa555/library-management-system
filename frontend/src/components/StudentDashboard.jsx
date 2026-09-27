import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api";

function StudentDashboard({ username, onLogout, user }) {

  const [page, setPage] = useState("dashboard");
  const [books, setBooks] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // AUTH TOKEN
  // ---------------------------------------------------------

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // ---------------------------------------------------------
  // LOAD BOOKS
  // ---------------------------------------------------------

  const loadBooks = async () => {
    try {
      const response = await axios.get(
        `${API}/books`,
        { headers }
      );

      setBooks(response.data);

    } catch (error) {
      console.error("Unable to load books:", error);
    }
  };

  // ---------------------------------------------------------
  // LOAD BORROWINGS
  // ---------------------------------------------------------

  const loadBorrowings = async () => {
    try {
      const response = await axios.get(
        `${API}/borrowings`,
        { headers }
      );

      setBorrowings(response.data);

    } catch (error) {
      console.error("Unable to load borrowings:", error);
    }
  };

  // ---------------------------------------------------------
  // LOAD ALL DATA
  // ---------------------------------------------------------

  const loadData = async () => {

    setLoading(true);

    await Promise.all([
      loadBooks(),
      loadBorrowings()
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ---------------------------------------------------------
  // BORROW BOOK
  // ---------------------------------------------------------

  const borrowBook = async (bookId) => {

    /*
     * Current project member ID.
     * We can connect this dynamically to the
     * logged-in student's member record later.
     */
    const memberId = 2;

    try {

      await axios.post(
        `${API}/borrowings?bookId=${bookId}&memberId=${memberId}`,
        {},
        { headers }
      );

      alert("Book borrowed successfully!");

      loadData();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data ||
        "Unable to borrow this book."
      );
    }
  };

  // ---------------------------------------------------------
  // RETURN BOOK
  // ---------------------------------------------------------

  const returnBook = async (borrowingId) => {

    try {

      await axios.put(
        `${API}/borrowings/${borrowingId}?returned=true`,
        {},
        { headers }
      );

      alert("Book returned successfully!");

      loadData();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data ||
        "Unable to return this book."
      );
    }
  };

  // ---------------------------------------------------------
  // FILTER BOOKS
  // ---------------------------------------------------------

  const filteredBooks = books.filter((book) => {

    const text = `
      ${book.title || ""}
      ${book.author || ""}
      ${book.category || ""}
      ${book.isbn || ""}
    `.toLowerCase();

    return text.includes(search.toLowerCase());

  });

  // ---------------------------------------------------------
  // STATISTICS
  // ---------------------------------------------------------

  const availableBooks = books.filter(
    book => book.availableCopies > 0
  ).length;

  const activeBorrowings = borrowings.filter(
    borrowing => !borrowing.returned
  );

  // ---------------------------------------------------------
  // STYLES
  // ---------------------------------------------------------

  const styles = {

    app: {
      minHeight: "100vh",
      display: "flex",
      background: "#f5f7fb",
      fontFamily: "Arial, sans-serif",
      color: "#1f2937"
    },

    sidebar: {
      width: "240px",
      background: "#111827",
      color: "white",
      padding: "25px 18px",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0
    },

    logo: {
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "8px"
    },

    portal: {
      fontSize: "11px",
      color: "#9ca3af",
      letterSpacing: "1px",
      marginBottom: "30px"
    },

    navButton: {
      width: "100%",
      padding: "13px 15px",
      marginBottom: "8px",
      border: "none",
      borderRadius: "8px",
      textAlign: "left",
      cursor: "pointer",
      fontSize: "14px",
      background: "transparent",
      color: "#d1d5db"
    },

    navActive: {
      background: "#2563eb",
      color: "white"
    },

    logout: {
      marginTop: "auto",
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      background: "#dc2626",
      color: "white",
      fontWeight: "bold"
    },

    main: {
      marginLeft: "240px",
      width: "calc(100% - 240px)",
      padding: "30px"
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px"
    },

    title: {
      margin: 0,
      fontSize: "28px"
    },

    subtitle: {
      marginTop: "6px",
      color: "#6b7280"
    },

    userChip: {
      background: "white",
      padding: "10px 16px",
      borderRadius: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },

    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "20px",
      marginBottom: "30px"
    },

    stat: {
      background: "white",
      padding: "22px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)"
    },

    statNumber: {
      fontSize: "28px",
      fontWeight: "bold",
      marginTop: "10px"
    },

    card: {
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      marginBottom: "25px"
    },

    search: {
      width: "100%",
      padding: "14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "15px",
      marginBottom: "20px",
      boxSizing: "border-box"
    },

    bookGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
      gap: "20px"
    },

    book: {
      border: "1px solid #e5e7eb",
      borderRadius: "10px",
      padding: "18px",
      background: "#fff"
    },

    bookIcon: {
      fontSize: "40px",
      marginBottom: "12px"
    },

    category: {
      display: "inline-block",
      background: "#eff6ff",
      color: "#2563eb",
      padding: "5px 9px",
      borderRadius: "5px",
      fontSize: "11px",
      marginBottom: "8px"
    },

    bookTitle: {
      margin: "5px 0",
      fontSize: "18px"
    },

    author: {
      color: "#6b7280",
      marginBottom: "15px"
    },

    borrowButton: {
      width: "100%",
      padding: "10px",
      border: "none",
      borderRadius: "7px",
      background: "#2563eb",
      color: "white",
      cursor: "pointer",
      fontWeight: "bold"
    },

    disabledButton: {
      width: "100%",
      padding: "10px",
      border: "none",
      borderRadius: "7px",
      background: "#9ca3af",
      color: "white"
    },

    table: {
      width: "100%",
      borderCollapse: "collapse"
    },

    th: {
      textAlign: "left",
      padding: "14px",
      background: "#f9fafb",
      borderBottom: "1px solid #e5e7eb"
    },

    td: {
      padding: "14px",
      borderBottom: "1px solid #e5e7eb"
    },

    returned: {
      color: "#16a34a",
      fontWeight: "bold"
    },

    borrowed: {
      color: "#2563eb",
      fontWeight: "bold"
    },

    returnButton: {
      padding: "8px 12px",
      border: "none",
      borderRadius: "6px",
      background: "#dc2626",
      color: "white",
      cursor: "pointer"
    },

    profile: {
      textAlign: "center",
      padding: "40px"
    },

    avatar: {
      fontSize: "65px",
      marginBottom: "15px"
    }
  };

  // ---------------------------------------------------------
  // DASHBOARD PAGE
  // ---------------------------------------------------------

  const Dashboard = () => (

    <>
      <div style={styles.card}>

        <h2>
          Hello, {username || "Student"} 👋
        </h2>

        <p style={{ color: "#6b7280" }}>
          Welcome to your Library Management Portal.
          Browse books, manage your borrowings and track
          your library activity.
        </p>

      </div>


      <div style={styles.stats}>

        <div style={styles.stat}>

          <div>📚 Books in Library</div>

          <div style={styles.statNumber}>
            {books.length}
          </div>

        </div>


        <div style={styles.stat}>

          <div>📖 Available Books</div>

          <div style={styles.statNumber}>
            {availableBooks}
          </div>

        </div>


        <div style={styles.stat}>

          <div>🔄 My Active Borrowings</div>

          <div style={styles.statNumber}>
            {activeBorrowings.length}
          </div>

        </div>

      </div>


      <div style={styles.card}>

        <h2>Recommended Books</h2>

        <p style={{ color: "#6b7280" }}>
          Explore books currently available in the library.
        </p>

        <div style={styles.bookGrid}>

          {books.slice(0, 4).map(book => (

            <BookCard
              key={book.id}
              book={book}
            />

          ))}

        </div>

      </div>
    </>
  );

  // ---------------------------------------------------------
  // BOOK CARD
  // ---------------------------------------------------------

  const BookCard = ({ book }) => (

    <div style={styles.book}>

      <div style={styles.bookIcon}>
        📖
      </div>

      <span style={styles.category}>
        {book.category || "General"}
      </span>

      <h3 style={styles.bookTitle}>
        {book.title}
      </h3>

      <p style={styles.author}>
        {book.author}
      </p>

      <p>
        <strong>
          {book.availableCopies || 0}
        </strong>{" "}
        copies available
      </p>

      {book.availableCopies > 0 ? (

        <button
          style={styles.borrowButton}
          onClick={() => borrowBook(book.id)}
        >
          Borrow Book
        </button>

      ) : (

        <button
          style={styles.disabledButton}
          disabled
        >
          Currently Unavailable
        </button>

      )}

    </div>
  );

  // ---------------------------------------------------------
  // BROWSE BOOKS
  // ---------------------------------------------------------

  const BrowseBooks = () => (

    <>

      <div style={styles.card}>

        <h2>Browse Books</h2>

        <p style={{ color: "#6b7280" }}>
          Search the library collection.
        </p>

        <input
          style={styles.search}
          type="text"
          placeholder="Search by title, author, category or ISBN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {loading ? (

        <div style={styles.card}>
          Loading books...
        </div>

      ) : (

        <div style={styles.bookGrid}>

          {filteredBooks.map(book => (

            <BookCard
              key={book.id}
              book={book}
            />

          ))}

        </div>

      )}

      {!loading && filteredBooks.length === 0 && (

        <div style={styles.card}>
          No books found.
        </div>

      )}

    </>
  );

  // ---------------------------------------------------------
  // BORROWINGS
  // ---------------------------------------------------------

  const MyBorrowings = () => (

    <div style={styles.card}>

      <h2>My Borrowings</h2>

      <p style={{ color: "#6b7280" }}>
        Track your borrowed books.
      </p>

      {borrowings.length === 0 ? (

        <p>
          You have no borrowing records.
        </p>

      ) : (

        <div style={{ overflowX: "auto" }}>

          <table style={styles.table}>

            <thead>

              <tr>

                <th style={styles.th}>
                  Book
                </th>

                <th style={styles.th}>
                  Borrow Date
                </th>

                <th style={styles.th}>
                  Status
                </th>

                <th style={styles.th}>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {borrowings.map(borrowing => (

                <tr key={borrowing.id}>

                  <td style={styles.td}>
                    <strong>
                      {borrowing.book?.title || "Book"}
                    </strong>
                  </td>

                  <td style={styles.td}>
                    {borrowing.borrowDate || "-"}
                  </td>

                  <td style={styles.td}>

                    <span
                      style={
                        borrowing.returned
                          ? styles.returned
                          : styles.borrowed
                      }
                    >

                      {borrowing.returned
                        ? "Returned"
                        : "Borrowed"}

                    </span>

                  </td>

                  <td style={styles.td}>

                    {!borrowing.returned && (

                      <button
                        style={styles.returnButton}
                        onClick={() =>
                          returnBook(borrowing.id)
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

      )}

    </div>
  );

  // ---------------------------------------------------------
  // PROFILE
  // ---------------------------------------------------------

  const Profile = () => (

    <div style={styles.card}>

      <div style={styles.profile}>

        <div style={styles.avatar}>
          🎓
        </div>

        <h2>
          {username || "Student"}
        </h2>

        <p style={{ color: "#6b7280" }}>
          Student Account
        </p>

        <hr
          style={{
            margin: "25px 0",
            border: "none",
            borderTop: "1px solid #e5e7eb"
          }}
        />

        <p>
          <strong>Username:</strong>{" "}
          {username}
        </p>

        <p>
          <strong>Role:</strong>{" "}
          STUDENT
        </p>

        <p>
          <strong>Active Borrowings:</strong>{" "}
          {activeBorrowings.length}
        </p>

      </div>

    </div>
  );

  // ---------------------------------------------------------
  // MAIN RETURN
  // ---------------------------------------------------------

  return (

    <div style={styles.app}>

      {/* SIDEBAR */}

      <aside style={styles.sidebar}>

        <div style={styles.logo}>
          📚 Library
        </div>

        <div style={styles.portal}>
          STUDENT PORTAL
        </div>


        <button
          style={{
            ...styles.navButton,
            ...(page === "dashboard"
              ? styles.navActive
              : {})
          }}
          onClick={() => setPage("dashboard")}
        >
          🏠 Dashboard
        </button>


        <button
          style={{
            ...styles.navButton,
            ...(page === "books"
              ? styles.navActive
              : {})
          }}
          onClick={() => setPage("books")}
        >
          📖 Browse Books
        </button>


        <button
          style={{
            ...styles.navButton,
            ...(page === "borrowings"
              ? styles.navActive
              : {})
          }}
          onClick={() => setPage("borrowings")}
        >
          🔄 My Borrowings
        </button>


        <button
          style={{
            ...styles.navButton,
            ...(page === "profile"
              ? styles.navActive
              : {})
          }}
          onClick={() => setPage("profile")}
        >
          👤 My Profile
        </button>


        <button
          style={styles.logout}
          onClick={onLogout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}

      <main style={styles.main}>

        <header style={styles.header}>

          <div>

            <h1 style={styles.title}>

              {page === "dashboard"
                ? "Student Dashboard"
                : page === "books"
                ? "Browse Books"
                : page === "borrowings"
                ? "My Borrowings"
                : "My Profile"}

            </h1>

            <p style={styles.subtitle}>
              Welcome back, {username}
            </p>

          </div>


          <div style={styles.userChip}>
            🎓 {username}
          </div>

        </header>


        {page === "dashboard" && <Dashboard />}

        {page === "books" && <BrowseBooks />}

        {page === "borrowings" && <MyBorrowings />}

        {page === "profile" && <Profile />}

      </main>

    </div>

  );
}

export default StudentDashboard;