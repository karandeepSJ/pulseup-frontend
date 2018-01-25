import Component from "inferno-component";
class Scoreboard extends Component {
  state = {
    scores: [],
    error: ""
  };
  async componentDidMount() {
    var res = await window.fetchWithAuth("/leaderboard");
    res = await res.json();
    if (!res.error) this.setState({ scores: res });
    else this.setState({ error: res.error });
    console.log(res);
  }
  render() {
    const { scores, error } = this.state;
    return (
      <div>
        <table border="2">
          <col width="15%" />
          <col width="60%" />
          <col width="25%" />
          <tr>
            <th> Rank </th>
            <th> Name </th>
            <th> Score </th>
          </tr>
          {scores.map((user, idx) => (
            <tr>
              <td> {idx + 1}. </td>
              <td> {user.name} </td>
              <td> {user.score} </td>
            </tr>
          ))}
        </table>
        {error && <div className="error">ERROR: {error}</div>}
      </div>
    );
  }
}

export default Scoreboard;
