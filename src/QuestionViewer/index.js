import { Link } from "inferno-router";
import linkState from "linkstate";
import Component from "inferno-component";
import Timer from "../Timer";
import "./index.css";
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
    answer: "",
    number_of_q: 0,
    options: [],
    wait: true
  };
  async componentDidMount() {
    this.checkAnswer = this.checkAnswer.bind(this);
    var ques = await window.fetchWithAuth(
      `/access/${this.props.params.category}`
    );
    ques = await ques.json();
    if (ques.status === "ok") {
      this.setState({ wait: false });
      await this.fetchQuestion();
    } else {
      alert(ques.msg);
      window.location = "/";
    }
  }
  async componentWillReceiveProps(nextProps) {
    await this.fetchQuestion(nextProps.params.qno);
  }

  async fetchQuestion(qno = this.props.params.qno) {
    var qObj = JSON.parse(window.localStorage.questions);
    var ques = qObj.questions[qno - 1];
    this.setState({
      question: ques,
      loading: false,
      number_of_q: qObj.questions.length,
      options: ques.options
    });
  }

  handleAnswerChange = e => {
    this.setState({ answer: e.target.value });
  };

  async checkAnswer(e) {
    // alert("AA");
    e.preventDefault();
    var check = await window.fetchWithAuth(
      `/answer/${this.state.question.qid}/${this.state.answer}`
    );
    var response = await check.json();
    if (response.status === "ok") {
      alert("Answer Submitted");
      this.setState({ answer: "" });
      e.target["0"].checked = false;
      e.target["1"].checked = false;
      e.target["2"].checked = false;
      e.target["3"].checked = false;
    } else {
      alert(response.msg);
      window.location = "/";
    }
  }

  async lockCategory() {
    if (window.confirm("Are you sure you want to lock this category?")) {
      var lock = await window.fetchWithAuth("lock");
      lock = await lock.json();
      alert(lock.msg);
      window.location = "/";
    }
  }

  render() {
    const {
      loading,
      question,
      error,
      answer,
      number_of_q,
      options,
      wait
    } = this.state;
    const qno = parseInt(this.props.params.qno, 10);
    if (!wait) {
      return (
        <div>
          {loading && <div>Loading...</div>}
          <Timer />
          <h1>
            Q{qno}: {question.title}
          </h1>
          {error && <div className="error">ERROR: {error}</div>}
          <p>
            <div
              dangerouslySetInnerHTML={{
                __html: md.render(`${question.statement}`)
              }}
            />
          </p>
          <form onSubmit={this.checkAnswer}>
            <label for="answer">Answer</label>
            {options.map((option, idx) => (
              <label className="container">
                {option}
                <input
                  type="radio"
                  name="radio"
                  value={idx + 1}
                  onChange={this.handleAnswerChange}
                />
                <span className="checkmark" />
              </label>
            ))}
            <button class="button-primary float-right">Submit</button>
            <div class="clearfix" />
            {qno !== 1 && (
              <Link
                className="button float-left"
                to={`/category/${this.props.params.category}/question/${qno -
                  1}`}
              >
                Prev
              </Link>
            )}
            {qno !== number_of_q && (
              <Link
                className="button float-right"
                to={`/category/${this.props.params.category}/question/${qno +
                  1}`}
              >
                Next
              </Link>
            )}
          </form>
          <div class="clearfix" />
          <button
            class="button-primary"
            onclick={this.lockCategory}
            style={{
              marginLeft: "35%"
            }}
          >
            Lock Category
          </button>
        </div>
      );
    }
  }
}

export default QuestionViewer;
