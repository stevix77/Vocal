import { Events } from 'ionic-angular';

export class Timer{
  private minutes: number;
  private secondes: number;
  private interval: number;
  
  constructor(public events:Events){
    this.minutes = 0;
    this.secondes = 0;
    this.startTimer();
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
    return `${this.minutes}:${this.pad(this.secondes)}`;
  }

  startTimer() {
    this.interval = setInterval(() => this.updateTimer(), 1000);
  }

  stopTimer() {
    clearInterval(this.interval);
  }

  updateTimer() {
    this.events.publish('update:timer', this.getTime());
    //document.querySelector('[data-timer]').innerHTML = this.getTime();
  }
}