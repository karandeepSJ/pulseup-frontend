import "./navbar.css";
import Link from "../Link";

export default () => (
  <nav className="navigation">
    <section className="container">
      <Link className="navigation-title" to="/">
        <h1 className="title">{process.env.INFERNO_APP_CONTEST_NAME}</h1>
      </Link>
      <ul className="navigation-list float-right">
        {!window.username ? (
          <li className="navigation-item">
            <Link to="/login" className="navigation-link">
              Login
            </Link>
          </li>
        ) : (
          <li className="navigation-item">
            {window.username}&nbsp;
            <Link
              to="/logout"
              className="navigation-link"
              style={{ color: "#9b4dca", fontWeight: "bolder" }}
            >
              Logout
            </Link>
          </li>
        )}
      </ul>
    </section>
  </nav>
);
