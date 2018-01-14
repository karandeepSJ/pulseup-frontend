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
    var res = await fetchWithAuth("/dashboard");
    res = await res.json();
    console.log(res);
    this.setState({categories: res.categories, loading: false});
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
                paddingRight: "1%",
                paddingBottom: '1%',
              }}
            >
              <Link
                to={`category/${category.id}/`}
                className= {category.locked? 'btn-large disabled' : 'btn-large'}
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
