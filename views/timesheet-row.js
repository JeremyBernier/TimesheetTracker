import {LitElement, html, css, customElement, property} from 'lit-element'

import './spreadsheet-row'
import './spreadsheet-cell'

import { timeToEarnings, displayTimeDuration, displayEarnings, displayDate, displayTime } from '../src/utils'

@customElement('timesheet-row')
class TimesheetRow extends LitElement {
  @property({type: Object}) data = {}
  @property({type: Boolean}) stillRunning = false

  render() {
    const { start, stop, notes = '(notes)' } = this.data
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
        <spreadsheet-cell><span contenteditable="true">${notes}</span></spreadsheet-cell>
        <button style="user-select:none;" @click=${this.handleDeleteRow}>x</button>
      </spreadsheet-row>
    `
  }
}

export default TimesheetRow