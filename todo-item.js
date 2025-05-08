const template = document.createElement("template");
template.innerHTML = `

<style>
input:checked + span {
  text-decoration: line-through;
}
</style>

  <div class="todo-item">
    <input type="checkbox" />
    <span></span>
    <button></button>
  </div>
`

class TodoItem extends HTMLElement {

    constructor() {
        super();

        this.text = this.getAttribute("text") ?? "Algo que hacer";
        this.isChecked = this.hasAttribute("is-checked");
        this.buttonLabel = this.getAttribute("button-label") ?? "Eliminar";
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