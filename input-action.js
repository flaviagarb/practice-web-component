const template = document.createElement("template");

template.innerHTML = `
  <div class="kc-component">
    <input type="text" (/>
    <button disabled></button>
  </div>
`

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