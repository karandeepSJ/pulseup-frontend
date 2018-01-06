import { Link } from "inferno-router";
import linkState from "linkstate";
import Component from "inferno-component";
var Remarkable = require("remarkable");
var md = new Remarkable({
  html: true,
  linkify: true,
  typographer: true
});

class QuestionViewer extends Component {
  state = {
    question: {},
    loading: true,
    error: "",
    total: 0,
    answer: ""
  };
  async componentDidMount() {
    await this.getNumberOfQs();
    await this.fetchQuestion();
  }
  async componentWillReceiveProps(nextProps) {
    await this.fetchQuestion(nextProps.params.qno);
  }
  async getNumberOfQs() {
    var res = await window.fetchWithAuth(
      `${process.env.INFERNO_APP_BACKEND_URL}questions/`
    );
    res = await res.json();
    if (!res.error) {
      this.setState({ total: res.length, loading: false });
    } else this.setState({ error: res.error, loading: false });
  }
  async fetchQuestion(qno = this.props.params.qno) {
    var res = await window.fetchWithAuth(
      `${process.env.INFERNO_APP_BACKEND_URL}questions/${qno}`
    );
    res = await res.json();
    if (!res.error) this.setState({ question: res, loading: false });
    else this.setState({ error: res.error, loading: false });
  }
  onChange = e => {
    this.setState({ answer: e.target.value });
  };
  checkAnswer = () => {
    // XXX: Need to fill in this stub
    // Read fetch documentation on how to send post request and
    // display output in window.alert
    const url = `${process.env.INFERNO_APP_BACKEND_URL}questions/${
      this.props.params.qno
    }/answer`;
    console.log(url);
    const { answer } = this.state;
    console.log("ANSWER");
    console.log(this.state.answer);
    var body = new FormData();
    body.append("answer", this.state.answer);
    fetch(url, {
      method: "POST",
      body: `answer=${answer}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        email: window.email,
        username: window.email
      }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json.response);
        if (json.response) alert("Correct Answer");
        else alert("WRong");
      });
  };

  render() {
    const { loading, question, error, answer, total } = this.state;
    const qno = parseInt(this.props.params.qno, 10);
    return (
      <div>
        {loading && <div>Loading...</div>}
        <h1>
          Q{question.qno}: {question.title}
        </h1>
        {error && <div className="error">ERROR: {error}</div>}
        <p>
          <div
            dangerouslySetInnerHTML={{ __html: md.render(`${question.body}`) }}
          />
        </p>
        <form onSubmit={this.checkAnswer}>
          <label for="answer">Answer</label>
          <input
            type="text"
            name="answer"
            value={answer}
            onChange={this.onChange}
          />
          <button class="button-primary float-right">Check</button>
        </form>
        <div class="clearfix" />
        {qno !== 1 && (
          <Link className="button float-left" to={`/question/${qno - 1}`}>
            Prev
          </Link>
        )}
        {qno !== total && (
          <Link className="button float-right" to={`/question/${qno + 1}`}>
            Next
          </Link>
        )}
      </div>
    );
  }
}

export default QuestionViewer;
