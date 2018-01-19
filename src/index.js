import { render } from "inferno";
import App from "./App";
import "./index.css";

import { Router, Route, IndexRoute } from "inferno-router";
import createBrowserHistory from "history/createBrowserHistory";
import Component from "inferno-component";

import { init as authinit, logout } from "./auth";
import "./fetchWithAuth";
import Category from "./Categories";
import QuestionsList from "./QuestionsList";
import QuestionViewer from "./QuestionViewer";
import Scoreboard from "./Scoreboard";

const browserHistory = createBrowserHistory();
window.browserHistory = browserHistory;

authinit();
const routes = (
  <Router history={browserHistory}>
    <Route path={process.env.PUBLIC_URL} component={App}>
      <IndexRoute component={Category} />
      <Route path="/category/:category" component={QuestionsList} />
      <Route
        path="/category/:category/question/:qno"
        component={QuestionViewer}
      />
      <Route path="/scoreboard" component={Scoreboard} />
      <Route path="/logout" component={logout} />
    </Route>
  </Router>
);
render(routes, document.getElementById("app"));
