import {LitElement, html, css, customElement, property} from 'lit-element'

import './spreadsheet-row'
import './spreadsheet-cell'

import { timeToEarnings, displayTimeDuration, displayEarnings, displayDate, displayTime } from '../src/utils'

@customElement('timesheet-row')
class TimesheetRow extends LitElement {
  @property({type: Object}) data = {}
  @property({type: Boolean}) stillRunning = false

  render() {
    const { start, stop, notes, id } = this.data
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

    let notesElem
    if (notes != null && notes !== '') {
      notesElem = html`<span style="color:rgb(115,115,115);" id="${id}-notes" contenteditable="true">${notes}</span>`
    } else {
      notesElem = html`<input id="${id}-notes" type="text" />`
    }

    return html`
      <spreadsheet-row>
        <spreadsheet-cell>${displayDate(startDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(startDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(stopDate)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTimeDuration(msDiff)}</spreadsheet-cell>
        <spreadsheet-cell>${displayEarnings(timeToEarnings(msDiff))}</spreadsheet-cell>
        <spreadsheet-cell>${notesElem}</spreadsheet-cell>
        <button style="user-select:none;" @click=${this.handleDeleteRow}>x</button>
      </spreadsheet-row>
    `
  }
}

export default TimesheetRow