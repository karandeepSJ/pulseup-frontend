import "./navbar.css";
import Link from "../Link";

export default () => (
  <nav className="navigation">
    <section className="container">
      <Link className="navigation-title" to="/">
        <h1 className="title">{process.env.INFERNO_APP_CONTEST_NAME}</h1>
      </Link>
      <ul className="navigation-list float-right">
        <a
          href="/scoreboard"
          className="navigation-link"
          style={{ color: "#9b4dca", fontWeight: "bolder" }}
        >
          Scoreboard
        </a>
        &nbsp; &nbsp;
        <a
          href="/logout"
          className="navigation-link"
          style={{ color: "#9b4dca", fontWeight: "bolder" }}
        >
          Logout
        </a>
      </ul>
    </section>
  </nav>
);
