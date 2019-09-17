import {LitElement, html, css, customElement, property} from 'lit-element'
import localforage from "localforage";

const HOURLY_RATE = 50

function displayDate(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function displayTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return hours + ':' + minutes + ' ' + ampm;
}

const store = {
  shifts: []
}

/*store.deleteRow = function(startTime) {
  // NOTE: assumes only one entry with given start time
  for (let i = 0; i < this.shifts.length; i++) {
    if (this.shifts[i].start === startTime) {
      this.shifts.splice(i, 1)
      break
    }
  }
}*/

function calculateTotalTime(shifts) {
  const sum = shifts.map((shift) => {
    return (shift.stop - shift.start)
  }).reduce((a, b) => a + b, 0)

  return sum
}

function timeToEarnings(time) {
  const sum = time * HOURLY_RATE / 3600000
  return Math.round(sum * 100) / 100
}

/*function calculateTotalEarnings(shifts) {
  const sum = calculateTotalTime(shifts) * HOURLY_RATE / 60 / 60 / 1000
  return Math.round(sum * 100) / 100
}*/

// 70s -> 0:1:10
// 3670 -> 1:1:10

function displayTimeDuration(msTimeDiff) {
  const totalSeconds = Math.floor(msTimeDiff / 1000)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

/*  const secondsDiff = Math.floor(msTimeDiff % 1000)
  const minutesDiff = Math.floor(secondsDiff % 60000)
  const hoursDiff = Math.floor(minutesDiff / 3600000)*/
  return `${hours}:${minutes}:${seconds}`
}

function displayEarnings(earnings) {
  return `$${earnings}`
}

@customElement('spreadsheet-cell')
class SpreadsheetCell extends LitElement {

  static get styles() {
    return css`
      :host {
      }
      .spreadsheet-cell {
        display: inline;
        margin-right: 1rem;
      }
    `
  }

  render() {
    return html`
      <div class="spreadsheet-cell">
        <slot></slot>
      </div>
    `
  }
}

@customElement('spreadsheet-row')
class SpreadsheetRow extends LitElement {
  @property({type: Object}) data = {}
  @property({type: Boolean}) highlight = false

  static get styles() {
    return css`
      :host {
      }

      .highlight {
        background-color: palegreen;
      }
    `
  }

  render() {
    let spreadsheetClass = 'spreadsheet-row'
    if (this.highlight) {
      spreadsheetClass += ' highlight'
    }
    return html`
      <div class=${spreadsheetClass}>
        <slot></slot>
      </div>
    `
  }
}

@customElement('timesheet-row')
class TimesheetRow extends LitElement {
  @property({type: Object}) data = {}
  @property({type: Boolean}) stillRunning = false

  render() {
    const { start, stop } = this.data
    const startDate = new Date(start)
    const stopDate = new Date(stop)
    const msDiff = stop - start

    if (this.stillRunning) {
      return html`
      <spreadsheet-row highlight="true">
        <spreadsheet-cell>${displayDate(startDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(startDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(stopDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTimeDuration(msDiff)}</spreadsheet-cell>
        <spreadsheet-cell>${displayEarnings(timeToEarnings(msDiff))}</spreadsheet-cell>
      </spreadsheet-row>
      `
    }

    //const minutesDiff = new Date(stop - start).getMinutes()

    return html`
      <spreadsheet-row>
        <spreadsheet-cell>${displayDate(startDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(startDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(stopDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTimeDuration(msDiff)}</spreadsheet-cell>
        <spreadsheet-cell>${displayEarnings(timeToEarnings(msDiff))}</spreadsheet-cell>
        <button style="user-select:none;" @click=${this.handleDeleteRow}>x</button>
      </spreadsheet-row>
    `
  }
}

@customElement('main-app')
class MainApp extends LitElement {
  @property({ type: Boolean }) timerRunning = false
  @property({ type: Number }) curTimeElapsed = 0
  @property({ type: Array }) shifts = []
  @property({ type: Object }) currentShift = {}

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

  constructor() {
    super()
    localforage.getItem('shifts', (err, val) => {
      if (val != null && Array.isArray(val)) {
        this.shifts = val
      }
    })

    this.handleDeleteRow = this.handleDeleteRow.bind(this)
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
            <timesheet-row .data=${shift} .handleDeleteRow=${() => this.handleDeleteRow(shift.start)}></timesheet-row>
          `)}
          ${this.timerRunning ? html`<timesheet-row stillRunning="true" .data=${currentShiftSoFar}></timesheet-row>` : ''}

          <button style="margin-top:1rem;" @click="${this.handleTimerBtn}">${this.timerRunning ? 'Clock Out' : 'Clock In'}</button>
        </section>
      </main>
      <footer-view></footer-view>
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