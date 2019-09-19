import { css } from 'lit-element'

export default css`
  input, button {
    background-color: inherit;
    color: inherit;
    border-style: inherit;
    border-color: inherit;
    border-size: inherit;
    outline: none;
  }

  input[type="button"], button {
    cursor: pointer;
  }

  button:hover {
    border-color: #7ccaca;
  }
`