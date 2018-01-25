import Component from "inferno-component";

class Timer extends Component {
  state = {
    time: {},
    seconds: 300,
    epoch: 0,
    score: 0
  };
  timer = 0;
  secondsToTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);

    const formattedTime = {
      m: minutes,
      s: seconds
    };
    return formattedTime;
  }

  async componentDidMount() {
    window
      .fetchWithAuth(`/dashboard`, {
        method: "GET"
      })
      .then(response => response.json())
      .then(response => {
        this.setState({ epoch: response.epoch, score: response.score });
        this.startTimer();
      });
  }

  startTimer() {
    var timeLeft = new Date().getTime() - this.state.epoch * 1000;
    timeLeft /= 1000;
    timeLeft = 300 - timeLeft;
    this.setState({ time: this.secondsToTime(timeLeft), seconds: timeLeft });
    this.timer = setInterval(this.countDown, 1000);
  }

  countDown = () => {
    const seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds
    });
    if (seconds <= 0) {
      clearInterval(this.timer);
      alert("Time Up");
      window
        .fetchWithAuth(`/lock`, {
          method: "GET"
        })
        .then(response => response.json())
        .then(response => {
          window.browserHistory.push(process.env.PUBLIC_URL);
          window.localStorage.removeItem("questions");
        });
    }
  };

  render() {
    return (
      <div>
        Time Left: {this.state.time.m} minutes, {this.state.time.s} seconds
        <br />
        Score: {this.state.score}
      </div>
    );
  }
}

export default Timer;
