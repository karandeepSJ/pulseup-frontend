/* global fetchWithAuth */

import Component from "inferno-component";
import { Link } from "inferno-router";
class Category extends Component {
  state = {
    categories: [],
    loading: true,
    error: ""
  };
  async componentDidMount() {
    this.setState({
      categories: [
        { index: 1, name: "DLP" },
        { index: 2, name: "BEC" },
        { index: 3, name: "ML" },
        { index: 4, name: "Embedded" },
        { index: 5, name: "LEC" },
        { index: 6, name: "System" },
        { index: 7, name: "Signals" },
        { index: 8, name: "aaa" },
        { index: 9, name: "bbb" }
      ],
      loading: false
    });
    // var res = await fetchWithAuth("http://localhost:8080/questions/");
    // res = await res.json();
    // if (!res.error) this.setState({ questions: res, loading: false });
    // else this.setState({ error: res.error, loading: false });
  }
  render() {
    const { loading, categories, error } = this.state;
    return (
      <div>
        <h1>Choose a Category</h1>
        <div>
          {loading && <div>Loading...</div>}
          {categories.map(category => (
            <div
              style={{
                display: "inline-grid",
                width: "33%",
                paddingRight: "1%"
              }}
            >
              <Link
                to={``}
                className="waves-effect waves-light btn-large"
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "black",
                  fontWeight: "bold",
                  fontSize: "100%"
                }}
              >
                {category.name}
              </Link>
            </div>
          ))}
          {error && <div className="error">ERROR: {error}</div>}
        </div>
      </div>
    );
  }
}

export default Category;
