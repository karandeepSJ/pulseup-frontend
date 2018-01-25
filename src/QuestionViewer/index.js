import Link from "../Link";
import Component from "inferno-component";
import Timer from "../Timer";
// var Remarkable = require("remarkable");
// var md = new Remarkable({
//   html: true,
//   linkify: true,
//   typographer: true
// });

class QuestionViewer extends Component {
  state = {
    question: {},
    loading: true,
    error: "",
    answer: [],
    number_of_q: 0,
    options: [],
    wait: true,
    val: ""
  };
  async componentDidMount() {
    this.checkAnswer = this.checkAnswer.bind(this);
    this.lockCategory = this.lockCategory.bind(this);
    var ques = await window.fetchWithAuth(
      `/access/${this.props.params.category}`
    );
    ques = await ques.json();
    if (ques.status === "ok") {
      this.setState({ wait: false });
      await this.fetchQuestion();
    } else {
      alert(ques.msg);
      window.browserHistory.push(process.env.PUBLIC_URL);
    }
  }
  async componentWillReceiveProps(nextProps) {
    await this.fetchQuestion(nextProps.params.qno);
  }

  async fetchQuestion(qno = this.props.params.qno) {
    var qObj = JSON.parse(window.localStorage.questions);
    var ques = qObj.questions[qno - 1];
    var ans;
    if (window.localStorage.answers) {
      var a = JSON.parse(window.localStorage.answers);
      if (
        a.find((o, i) => {
          if (o.qid == ques.qid) {
            ans = o.answer;
            return true;
          }
          return false;
        })
      )
        this.setState({ answer: a, val: ans });
      else {
        this.setState({ val: "" });
      }
    }
    this.setState({
      question: ques,
      loading: false,
      number_of_q: qObj.questions.length,
      options: ques.options,
      val: ""
    });
  }

  handleAnswerChange = e => {
    var a = this.state.answer;
    if (
      !a.find((o, i) => {
        if (o.qid === this.state.question.qid) {
          a[i] = { qid: this.state.question.qid, answer: e.target.value };
          return true;
        }
        return false;
      })
    )
      a.push({ qid: this.state.question.qid, answer: e.target.value });
    var ch = e.target.value;
    this.setState({ answer: a, val: ch });
    window.localStorage.answers = JSON.stringify(a);
  };

  async checkAnswer(answer) {
    var check = await window.fetchWithAuth(
      `/answer/${answer.qid}/${answer.answer}`
    );
    var response = await check.json();
    if (response.status === "ok") {
      return "ok";
    } else return response.msg;
  }

  async lockCategory() {
    if (
      window.confirm(
        "Are you sure you want to submit your answers? This will lock the category"
      )
    ) {
      var answers = this.state.answer;
      for (var answer in answers) {
        var stat = await this.checkAnswer(answers[answer]);
        if (stat !== "ok") {
          alert(stat);
          return;
        }
      }
      var lock = await window.fetchWithAuth("lock");
      lock = await lock.json();
      alert(lock.msg);
      window.localStorage.removeItem("answers");
      window.browserHistory.push(process.env.PUBLIC_URL);
    }
  }

  render() {
    const { loading, question, error, number_of_q, options, wait } = this.state;
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
          <p>{question.statement}</p>
          <form onSubmit="return false">
            {options.map((option, idx) => (
              <div>
                {idx + 1}. {option}
              </div>
            ))}
            <label>Enter Option Number </label>
            <input
              type="text"
              name="answer"
              value={this.state.val}
              onChange={this.handleAnswerChange}
            />
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
            Submit My Answers
          </button>
        </div>
      );
    }
  }
}

export default QuestionViewer;
