/* global fetchWithAuth */

import Component from "inferno-component";
import Link from "../Link";
import Timer from "../Timer";

class QuestionsList extends Component {
  state = {
    questions: [],
    loading: true,
    error: "",
    wait: true
  };
  async componentDidMount() {
    var ques = await fetchWithAuth(`/access/${this.props.params.category}`);
    ques = await ques.json();
    if (ques.status === "ok") {
      this.setState({
        wait: false,
        loading: false,
        questions: ques.msg.questions
      });
      window.localStorage.questions = JSON.stringify(ques.msg);
    } else {
      alert(ques.msg);
      window.location = process.env.PUBLIC_URL;
    }
  }

  render() {
    const { loading, questions, error, wait } = this.state;
    if (!wait) {
      return (
        <div>
          <div>
            {" "}
            <Timer />{" "}
          </div>
          <h1>Questions</h1>
          {loading && <div>Loading...</div>}
          <ul>
            {questions.map((question, index) => (
              <li>
                <Link to={`question/${index + 1}/`}>{question.statement}</Link>
              </li>
            ))}
          </ul>
          {error && <div className="error">ERROR: {error}</div>}
        </div>
      );
    }
  }
}

export default QuestionsList;
