import {LitElement, html, css, customElement, property} from 'lit-element'
import localforage from "localforage"

import './timesheet-row'
import './footer-view'

import sharedStyles from '../src/styles/sharedStyles'

import { ShiftsModel } from '../src/store'

import { calculateTotalTime, timeToEarnings, displayTimeDuration, displayEarnings,
  UTCISOStringToTime, UTCISOStringToDate, LocalToUTCStr, getTimeDiff, UTCToLocal, UTCStrToLocalStr } from '../src/utils'

let nextId = 0

const colToField = {
  0: 'START_DATE',
}

// const msPerDay = 1000*60*60*24

/*const store = {
  shifts: []
}*/

@customElement('main-app')
class MainApp extends LitElement {
  @property({ type: Boolean }) timerRunning = false
  @property({ type: Number }) curTimeElapsed = 0
  @property({ type: Array }) shifts = []
  @property({ type: Object }) currentShift = {}
  @property({ type: Boolean }) darkTheme = true

  constructor() {
    super()

    this.shiftsModelObj = new ShiftsModel(this.shifts)

    localforage.getItem('shifts', (err, val) => {
      if (val != null && Array.isArray(val)) {
        this.shifts = val
        this.shiftsModelObj = new ShiftsModel(this.shifts)
      }

      if (this.shifts.length > 0) {
        const maxId = Math.max(...this.shifts.map(shift => shift.id))

        if (maxId != null && !isNaN(maxId)) {
          nextId = maxId + 1
        } else {
          // make sure all have ids. if not, add them and save
          for (let i = 0; i < this.shifts.length; i++) {
            const shiftId = this.shifts[i].id
            if (shiftId == null || isNaN(shiftId)) {
              this.shifts[i].id = nextId
              nextId++
            }
          }
        }
      }


      // if date is number, convert to UTC string
      for (let i = 0; i < this.shifts.length; i++) {
        const { start, stop } = this.shifts[i]
        if (typeof this.shifts[i]['start'] !== 'string') {
          this.shifts[i]['start'] = new Date(start).toISOString()
          this.shifts[i]['stop'] = new Date(stop).toISOString()
        }
      }

      if (val != this.shifts) {
          localforage.setItem('shifts', this.shifts)
      }
    })

    this.handleDeleteRow = this.handleDeleteRow.bind(this)
    this.handleInput = this.handleInput.bind(this)

    if (!document.body.classList.contains('theme-dark')) {
      this.darkTheme = false
    }
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
    const inputElem = event.composedPath()[0]
    const id = +inputElem.id.split('-')[0]
    const field = inputElem.id.split('-')[1]
    const value = inputElem.innerText || inputElem.value

    if (field === 'notes') {

      this.updateCell(id, field, value)

    } else if (colToField[field] === 'START_DATE') {

      const splitArr = value.split('-')

      let paddedMonths = splitArr[1]
      if (splitArr[1].length < 2) {
        paddedMonths = '0' + paddedMonths
      }

      let paddedDays = splitArr[2]
      if (splitArr[2].length < 2) {
        paddedDays = '0' + paddedDays
      }

      const formattedValue = `${splitArr[0]}-${paddedMonths}-${paddedDays}`
      const arrIndex = this.shiftsModelObj.getShiftById(id)
      // Note: This is UTC, while value is local
      const oldStartDate = this.shiftsModelObj.shifts[arrIndex]['start']
      const newStartISOStrLocal = formattedValue + UTCStrToLocalStr(oldStartDate).substring(10)
      const newStartISOStrUTC = LocalToUTCStr(newStartISOStrLocal)

      if (!isNaN(UTCISOStringToTime(newStartISOStrUTC))) {
        // legit date so let's do this

        const oldStopDate = this.shiftsModelObj.shifts[arrIndex]['stop']

        // this must remain constant
        const timeWorked = getTimeDiff(oldStartDate, oldStopDate)

        const newStopISOStrUTC = new Date(UTCISOStringToTime(newStartISOStrUTC) + timeWorked).toISOString()

        this.updateCell(id, 'start', newStartISOStrUTC)
        this.updateCell(id, 'stop', newStopISOStrUTC)

      } else {
        // don't change
      }
    }
  }

  updateCell(id, field, value) {
    // for now, id == startTime
    console.log('updateCell', id, field, value)
    this.shiftsModelObj.updateCell(id, field, value)
    localforage.setItem('shifts', this.shifts)
  }

  handleDeleteRow(id) {
    // NOTE: assumes only one entry with given start time
    this.shiftsModelObj.deleteRow(id)
    this.shifts = this.shiftsModelObj.shifts
    this.requestUpdate()
    localforage.setItem('shifts', this.shifts)
  }

  handleTimerBtn() {
    if (!this.timerRunning) {
      // start timer
      this.currentShift = {
        id: nextId,
        start: new Date().toISOString()
      }
      nextId++;
      this.timer = setInterval(() => {
        this.curTimeElapsed = this.curTimeElapsed + 1;
      }, 1000);
    } else {
      // stop timer
      this.currentShift.stop = new Date().toISOString()

      clearInterval(this.timer)
      this.curTimeElapsed = 0

      // save new shift
      this.shiftsModelObj.addShift(this.currentShift)
      // this.shifts.push(this.currentShift)
      this.currentShift = null
      localforage.setItem('shifts', this.shifts)
    }

    this.timerRunning = !this.timerRunning
  }

  toggleTheme() {
    document.body.classList.toggle('theme-dark')
    this.darkTheme = !this.darkTheme
  }

  render() {
    const totalTimeMs = calculateTotalTime(this.shifts)
    const curTime = new Date().toISOString()
    let currentShiftSoFar
    
    if (this.timerRunning) {
      currentShiftSoFar = {...this.currentShift, stop: curTime}
    }

    return html`
      <main class="main-wrapper">
        <section class="section-top">
          <div class="flex">
            <div>
              <div><span class="label-heading">Total Time:</span> ${displayTimeDuration(totalTimeMs + this.curTimeElapsed * 1000)}</div>
              <div><span class="label-heading">Total Earnings:</span> ${displayEarnings(timeToEarnings(totalTimeMs + this.curTimeElapsed * 1000))}</div>
            </div>
            <div>
              <button @click=${this.toggleTheme}>${this.darkTheme ? '🌛' : '🌞'}</button>
            </div>
          </div>
        </section>
        <section class="section-middle">
          ${this.shifts.map(shift => html`
            <timesheet-row
              .data=${shift}
              .handleDeleteRow=${() => this.handleDeleteRow(shift.id)}
            ></timesheet-row>
          `)}
          ${this.timerRunning ? html`
            <timesheet-row stillRunning="true" .data=${currentShiftSoFar}></timesheet-row>
          ` : ''}
          ${this.timerRunning ? 
            html`<button class="btn-clock out mt-1" @click="${this.handleTimerBtn}">Clock Out</button>` :
            html`<button class="btn-clock mt-1" @click="${this.handleTimerBtn}">Clock In</button>`}
        </section>
      </main>
      <footer-view></footer-view>
    `
  }

  static get styles() {
    return css`
      ${sharedStyles}
      :host {
      }
      .main-wrapper {
        position: relative;
        min-height: 85vh;
      }

      .section-top {
        border-bottom: 1px solid gray;
        margin-bottom:.5rem;
        background-color: var(--section-top-bg-color);
      }

      .section-top, .section-middle {
        padding: .6rem 2rem;
      }

      .label-heading {
        font-weight: bold;
      }

      .mt-1 {
        margin-top: 1rem;
      }

      .btn-clock {
        background: transparent;
        border-style: solid;
        color: white;
        padding: .3rem 1rem;
        cursor: pointer;
        transition: .15s all;
      }

      .btn-clock:hover {
        border-color: cyan;
        color: cyan;
      }

      .btn-clock.out:hover {
        border-color: red;
        color: red;
      }

      .flex {
        display: flex;
        justify-content: space-between;
      }
    `
  }
}