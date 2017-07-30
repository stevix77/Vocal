export class Timer{
  private minutes: number;
  private secondes: number;
  private interval: number;
  
  constructor(){
    this.minutes = 0;
    this.secondes = 0;
  }

  private pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }

  getTime() {
    this.secondes++;
    if(this.secondes >= 60) {
      this.minutes++;
      this.secondes = 0;
    }
    return `<span>${this.minutes}:${this.pad(this.secondes)}</span>`;
  }

  startTimer() {
    this.interval = setInterval(() => this.updateTimer(), 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  updateTimer() {
    document.getElementById('timer').innerHTML = this.getTime();
  }
}