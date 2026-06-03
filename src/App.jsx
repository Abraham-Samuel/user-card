import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [viewerName, setViewerName] = useState(() => {
    return localStorage.getItem("viewerName") || "";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("viewerName");
  });

  const usersPerPage = 4;

  const lastUserIndex = currentPage * usersPerPage;
  const firstUserIndex = lastUserIndex - usersPerPage;

  const currentUsers = users.slice(firstUserIndex, lastUserIndex);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleLogin = () => {
    if (!viewerName.trim()) return;

    localStorage.setItem("viewerName", viewerName.trim());
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("viewerName");
    setViewerName("");
    setIsLoggedIn(false);
  };

  useEffect(() => {
    let timeoutId;

    async function fetchData() {
      try {
        setLoading(true);

        const res = await fetch("https://randomuser.me/api?results=20");

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data.results);

        timeoutId = setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error(error);

        timeoutId = setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }

    fetchData();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoggedIn]);

  return (
    <>
      {!isLoggedIn ? (
        <div className="login-container">
          <h1 style={{ marginBottom: "20px" }}>
            {" "}
            Welcome <span>👋</span>
          </h1>

          <label
            htmlFor="name"
            className="form-label"
            style={{ fontSize: "16px" }}
          >
            Please enter your name to view the user cards
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={viewerName}
            onChange={(e) => setViewerName(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <>
          <div className="header">
            <h1>Hello {viewerName}, Welcome to viewing my user cards</h1>

            <button onClick={handleLogout}>Logout</button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", marginTop: "10rem" }}>
              <h4>Loading user cards...</h4>
              <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              </div>
            </div>
          ) : currentUsers.length ? (
            <>
              <div className="user-card-container">
                {currentUsers.map((user) => (
                  <div className="user-card" key={user.login.uuid}>
                    <div className="user-card__header">
                      <img
                        src={user.picture.large}
                        alt={`${user.name.first} ${user.name.last}`}
                        className="user-card__image"
                      />

                      <div>
                        <h2 className="user-card__name">
                          {user.name.title} {user.name.first} {user.name.last}
                        </h2>

                        <p className="user-card__username">
                          @{user.login.username}
                        </p>
                      </div>
                    </div>

                    <div className="user-card__info">
                      <p>
                        <span>Email</span>
                        {user.email}
                      </p>

                      <p>
                        <span>Phone</span>
                        {user.phone}
                      </p>

                      <p>
                        <span>Gender</span>
                        {user.gender}
                      </p>

                      <p>
                        <span>Age</span>
                        {user.dob.age}
                      </p>

                      <p>
                        <span>Nationality</span>
                        {user.nat}
                      </p>

                      <p>
                        <span>Location</span>
                        {user.location.city}, {user.location.state}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    style={{
                      margin: "0 5px",
                      fontWeight: currentPage === index + 1 ? "bold" : "normal",
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <h4>No user available</h4>
          )}
        </>
      )}
    </>
  );
}

export default App;
