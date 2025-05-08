const template = document.createElement("template");
template.innerHTML = `
  <style>
    * {
    font-family: Arial, sans-serif;
    }
    .todo-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background-color: #f5f1ed;
      border-radius: 8px;
      box-shadow: inset 0 -1px 0 #ddd;
    }

    .todo-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
    }

    input[type="checkbox"] {
      accent-color: orange;
      width: 1.2rem;
      height: 1.2rem;
    }

    input:checked + span {
      text-decoration: line-through;
      opacity: 0.5;
    }

    span {
      font-size: 1rem;
    }

    button {
    background: none;
    border: 2px solid #f88; /* marco rojo */
    color: #d88;
    cursor: pointer;
    font-size: 1.3rem;
    line-height: 1;
    border-radius: 6px;
    padding: 0.2rem 0.4rem;
    }
    button:hover {
    border-color: #c44;  /* marco más intenso al pasar */
    color: #c44;
    }
  </style>

  <div class="todo-item">
    <label class="todo-label">
      <input type="checkbox" />
      <span></span>
    </label>
    <button title="Delete task" aria-label="Delete task">Delete</button>
  </div>
`;

class TodoItem extends HTMLElement {

    constructor() {
        super();

        this.text = this.getAttribute("text") ?? "Algo que hacer";
        this.isChecked = this.hasAttribute("is-checked");
        this.buttonLabel = this.getAttribute("button-label") ?? "Delete";
        this._id = this.getAttribute("id") ?? null;

        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        const templateCopy = template.content.cloneNode(true);

        const checkbox = templateCopy.querySelector("input");
        const removeButton = templateCopy.querySelector("button");
        const text = templateCopy.querySelector("span")

        text.textContent = this.text;
        checkbox.checked = this.isChecked;
        removeButton.textContent = this.buttonLabel;

        removeButton.addEventListener("click", () => {
            const event = new CustomEvent("action-item-remove", {
                detail: {
                    id: this._id
                }
            });
            this.dispatchEvent(event)

            this.remove();
        })

        checkbox.addEventListener("change", () => {
            const event = new CustomEvent("action-item-status-update", {
                detail: {
                    isChecked: checkbox.checked,
                    text: text.textContent,
                    id: this._id
                }
            })

            this.dispatchEvent(event)
        })

        this.shadowRoot.appendChild(templateCopy)
    }

    static get observedAttributes() {
        return ["text", "is-checked", "id"]
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "text") {
            this.shadowRoot.querySelector("span").textContent = newValue
        }

        if (name === "is-checked") {
            this.shadowRoot.querySelector("input").checked = this.hasAttribute("is-checked")
        }

        if (name === "id" && oldValue === null) {
            this._id = newValue;
        }
    }
}

window.customElements.define("todo-item", TodoItem)