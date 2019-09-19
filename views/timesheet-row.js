import {LitElement, html, css, customElement, property} from 'lit-element'

import './spreadsheet-row'
import './spreadsheet-cell'

import { timeToEarnings, displayTimeDuration, displayEarnings,
  displayDate, displayTime, getTimeDiff } from '../src/utils'

@customElement('timesheet-row')
class TimesheetRow extends LitElement {
  @property({type: Object}) data = {}
  @property({type: Boolean}) stillRunning = false

  static get styles() {
    return css`
      :host {
      }
      .notes {
        color: rgb(230,230,230);
      }

      .btn-delete-row {
        user-select:none;
        background: transparent;
        color: rgb(170,170,170);
        border-style: groove;
        border-radius: 20%;
      }
      input {
        background-color: inherit;
        color: inherit;
        border-style: inherit;
        border-color: inherit;
        border-size: inherit;
      }
    `
  }

  render() {
    const { start, stop, notes, id } = this.data
    const msDiff = getTimeDiff(start, stop)

    if (this.stillRunning) {
      return html`
      <spreadsheet-row highlight="true">
        <spreadsheet-cell>${displayDate(start)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(start)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(stop)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTimeDuration(msDiff)}</spreadsheet-cell>
        <spreadsheet-cell>${displayEarnings(timeToEarnings(msDiff))}</spreadsheet-cell>
      </spreadsheet-row>
      `
    }

    //const minutesDiff = new Date(stop - start).getMinutes()

    let notesElem
    if (notes != null && notes !== '') {
      notesElem = html`<span class="notes" id="${id}-notes" contenteditable="true">${notes}</span>`
    } else {
      notesElem = html`<input id="${id}-notes" type="text" />`
    }

    return html`
      <spreadsheet-row>
        <spreadsheet-cell id="${id}-0" contenteditable="true">${displayDate(start)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(start)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTime(stop)}</spreadsheet-cell>
        <spreadsheet-cell>${displayTimeDuration(msDiff)}</spreadsheet-cell>
        <spreadsheet-cell>${displayEarnings(timeToEarnings(msDiff))}</spreadsheet-cell>
        <spreadsheet-cell>${notesElem}</spreadsheet-cell>
        <button class="btn-delete-row" @click=${this.handleDeleteRow}>x</button>
      </spreadsheet-row>
    `
  }
}

export default TimesheetRow