import {LitElement, html, css, customElement, property} from 'lit-element'

@customElement('spreadsheet-row')
class SpreadsheetRow extends LitElement {
  @property({type: Object}) data = {}
  @property({type: Boolean}) highlight = false

  static get styles() {
    return css`
      :host {
      }

      .highlight {
        background-color: var(--timesheet-running-bgcolor)
      }

      .spreadsheet-row {
        max-width: 600px;
      }
    `
  }

  render() {
    const highlightClass = this.highlight ? ' highlight' : ''
    return html`
      <div class="spreadsheet-row${highlightClass}">
        <slot></slot>
      </div>
    `
  }
}

export default SpreadsheetRow