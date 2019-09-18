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

export default SpreadsheetRow