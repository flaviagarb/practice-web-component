const template = document.createElement("template");

template.innerHTML = `
<style>
  * {
  font-family: Arial, sans-serif;
  }
  .input-action {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-top: 1rem;
  }

  input {
    flex: 1;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    border: 1px solid #ccc;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: #aaa;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 20px;
    background-color: #a3d5ff; /* azul pastel */
    color: white;
    font-weight: bold;
    cursor: pointer;
  }

  button:hover:not(:disabled) {
    background-color: #87c8ff; /* más intenso al pasar el ratón */
  }

  button:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
</style>

<div class="input-action">
  <input type="text" placeholder="Write a task..." />
  <button disabled>ADD</button>
</div>
`;

class InputAction extends HTMLElement {

  constructor() {
    super();

    this.buttonLabel = this.getAttribute("button-label") ?? "Add";

    this.placeholder = this.getAttribute("placeholder") ?? "Write a task";

    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    const templateCopy = template.content.cloneNode(true);


    const input = templateCopy.querySelector("input");
    const button = templateCopy.querySelector("button");

    input.setAttribute("placeholder", this.placeholder);
    button.textContent = this.buttonLabel;


    button.addEventListener("click", () => {

      const inputValue = input.value;

      const event = new CustomEvent("input-action-submit", {
        detail: inputValue
      })

      this.dispatchEvent(event)

      input.value = ""
      button.setAttribute("disabled", "")
    })

    input.addEventListener("input", () => {
      const currentValue = input.value;
      if (currentValue) {
        button.removeAttribute("disabled")
      } else {
        button.setAttribute("disabled", "")
      }
    })

    this.shadowRoot.appendChild(templateCopy)
  }
}

window.customElements.define("input-action", InputAction)