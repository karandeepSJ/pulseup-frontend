import Component from "inferno-component";

class Timer extends Component {
  state = { time: {}, seconds: 300, epoch: 0, };
  timer=0;
  secondsToTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);

    const formattedTime = {
      "m": minutes,
      "s": seconds
    };
    return formattedTime;
  }

  async componentDidMount() {
    fetch(`${process.env.INFERNO_APP_BACKEND_URL}/dashboard`,{
      method: 'GET',
    })
    .then((response) => response.json())
    .then((response) => {this.setState({epoch: response.epoch});this.startTimer();});
  }

  async startTimer() {
    console.log(this.state.epoch);
    var timeLeft = new Date().getTime() - (this.state.epoch*1000);
    timeLeft/=1000;
    timeLeft = 1690 - timeLeft;
    console.log(timeLeft);
    this.setState({ time: this.secondsToTime(timeLeft),seconds: timeLeft });
    this.timer = setInterval(this.countDown, 1000);
  }

  countDown = () => {
    const seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    console.log(seconds);
    if (seconds <= 0) { 
      clearInterval(this.timer);
      alert("Time Up");
      fetch(`${process.env.INFERNO_APP_BACKEND_URL}/lock`,{
      method: 'GET',
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        alert(response.msg);
        window.location='/';
      });
    }
  }

  render() {
    return(
      <div>
        Time Left: {this.state.time.m} minutes, {this.state.time.s} seconds
      </div>
    );
  }
}


export default Timer;
