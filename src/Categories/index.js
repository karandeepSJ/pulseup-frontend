/* global fetchWithAuth */

import Component from "inferno-component";
import Link from "../Link";
class Category extends Component {
  state = {
    categories: [],
    loading: true,
    error: "",
    score: 0
  };
  async componentDidMount() {
    var res = await fetchWithAuth("/dashboard");
    res = await res.json();
    if (res.game_over)
      alert(
        "You scored less than 15 points in your last category. You are out of the competition."
      );
    this.setState({
      categories: res.categories,
      loading: false,
      score: res.score
    });
  }
  render() {
    const { loading, categories, error } = this.state;
    return (
      <div>
        <h1>Choose a Category</h1>
        Score: {this.state.score}
        <br />
        <div>
          {loading && <div>Loading...</div>}
          {categories.map(category => (
            <div
              style={{
                display: "inline-grid",
                width: "33%",
                paddingRight: "1%",
                paddingBottom: "1%"
              }}
            >
              <Link
                to={`category/${category.id}/`}
                className={category.locked ? "btn-large disabled" : "btn-large"}
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
