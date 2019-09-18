import {LitElement, html, css, customElement, property} from 'lit-element'
import localforage from "localforage"

import './timesheet-row'

import { ShiftsModel } from '../src/store'

import { calculateTotalTime, timeToEarnings, displayTimeDuration, displayEarnings } from '../src/utils'

/*const store = {
  shifts: []
}*/

@customElement('main-app')
class MainApp extends LitElement {
  @property({ type: Boolean }) timerRunning = false
  @property({ type: Number }) curTimeElapsed = 0
  @property({ type: Array }) shifts = []
  @property({ type: Object }) currentShift = {}

  constructor() {
    super()

    localforage.getItem('shifts', (err, val) => {
      if (val != null && Array.isArray(val)) {
        this.shifts = val
      }
    })

    this.handleDeleteRow = this.handleDeleteRow.bind(this)
    this.handleInput = this.handleInput.bind(this)
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('input', this.handleInput);
  }

  disconnectedCallback() {
    document.removeEventListener('input', this.handleInput);
    super.disconnectedCallback();
  }

  handleInput(event) {
    console.log('input event', event.composedPath()[0])
  }

  addNote(startTime, note) {
    // for now, id == startTime

    // localforage.setItem('shifts', this.shifts)
  }

  handleDeleteRow(startTime) {
    // NOTE: assumes only one entry with given start time
    for (let i = 0; i < this.shifts.length; i++) {
      if (this.shifts[i].start === startTime) {
        this.shifts.splice(i, 1)
        break
      }
    }
    this.requestUpdate()
    localforage.setItem('shifts', this.shifts)
  }

  handleTimerBtn() {
    if (!this.timerRunning) {
      // start timer
      this.currentShift = {
        start: new Date().getTime()
      }
      this.timer = setInterval(() => {
        this.curTimeElapsed = this.curTimeElapsed + 1;
      }, 1000);
    } else {
      // stop timer
      this.currentShift.stop = new Date().getTime()

      clearInterval(this.timer)
      this.curTimeElapsed = 0

      // save new shift
      this.shifts.push(this.currentShift)
      this.currentShift = null
      localforage.setItem('shifts', this.shifts)
    }

    this.timerRunning = !this.timerRunning
  }

  render() {
    const totalTimeMs = calculateTotalTime(this.shifts)
    const curTime = new Date().getTime()
    let currentShiftSoFar
    if (this.timerRunning) {
      currentShiftSoFar = {...this.currentShift, stop: curTime}
    }

    return html`
      <main class="main-wrapper">
        <section class="section-top">
          <div><span class="label-heading">Total Time:</span> ${displayTimeDuration(totalTimeMs + this.curTimeElapsed * 1000)}</div>
          <div><span class="label-heading">Total Earnings:</span> ${displayEarnings(timeToEarnings(totalTimeMs + this.curTimeElapsed * 1000))}</div>
        </section>
        <section class="section-middle">
          ${this.shifts.map(shift => html`
            <timesheet-row
              .data=${shift}
              .handleDeleteRow=${() => this.handleDeleteRow(shift.start)}
            ></timesheet-row>
          `)}
          ${this.timerRunning ? html`
            <timesheet-row stillRunning="true" .data=${currentShiftSoFar}></timesheet-row>
          ` : ''}

          <button style="margin-top:1rem;" @click="${this.handleTimerBtn}">${this.timerRunning ? 'Clock Out' : 'Clock In'}</button>
        </section>
      </main>
      <footer-view></footer-view>
    `
  }

  static get styles() {
    return css`
      :host {
      }
      .main-wrapper {
        position: relative;
        min-height: 85vh;
      }

      .section-top {
        border-bottom: 1px solid gray;
        margin-bottom:.5rem;
        background-color: #e6ecff;
      }

      .section-top, .section-middle {
        padding: .6rem 2rem;
      }

      .label-heading {
        font-weight: bold;
      }
    `
  }
}

@customElement('footer-view')
class FooterView extends LitElement {
  static get styles() {
    return css`
      :host {
      }
      footer {
        margin-top: 2rem;
        padding: 2rem 2rem;
        border-top: 1px solid rgb(230,230,230);
        background-color: rgb(240,240,240);
      }

      a {
        color: navy;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    `
  }
  render() {
    return html`
      <footer>
        <div>Made by <a href="https://www.jbernier.com">Jeremy Bernier</a>. The code is <a href="https://github.com/jeremybernier">open source.</a></div>
      </footer>
    `
  }
}