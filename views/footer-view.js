import {LitElement, html, css, customElement, property} from 'lit-element'

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
        background-color: var(--footer-bg-color);
      }

      a {
        color: var(--footer-a-color);
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }

      a.style-2 {
        color: var(--footer-a-color2);
      }
    `
  }
  render() {
    return html`
      <footer>
        <div>Made by <a href="https://www.jbernier.com">Jeremy Bernier</a>.
        The code is <a class="style-2" href="https://github.com/JeremyBernier/TimesheetTracker">open source.</a></div>
      </footer>
    `
  }
}