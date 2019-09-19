import {LitElement, html, css, customElement, property} from 'lit-element'

@customElement('spreadsheet-cell')
class SpreadsheetCell extends LitElement {

  @property({type: String}) class

  static get styles() {
    return css`
      :host {
      }
      .spreadsheet-cell {
        display: inline;
        margin-right: 1rem;
      }

      .flex-grow {
      }
    `
  }

  render() {
    const classStr = this.class ? ` ${this.class}` : ''
    return html`
      <div class="spreadsheet-cell${classStr}">
        <slot></slot>
      </div>
    `
  }
}