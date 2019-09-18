import {LitElement, html, css, customElement, property} from 'lit-element'

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