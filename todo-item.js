const template = document.createElement("template");
// Paso 1: Añadimos las propiedades al template
// aplicamos el estilo con style solo cuando está deshabilitado o cuando tiene cheque (para que se tache)
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
        // añadir atributos que recibo de fuera
        this.text = this.getAttribute("text") ?? "Task";
        this.isChecked = this.hasAttribute("is-checked");
        this.buttonLabel = this.getAttribute("button-label") ?? "Delete";

        this.attachShadow({ mode: "open" })
    }

    // Rellenar el template con los valores que he almacenado procedentes de los atributos
    connectedCallback() {
        const templateCopy = template.content.cloneNode(true);

        const checkbox = templateCopy.querySelector("input");
        const removeButton = templateCopy.querySelector("button");

        templateCopy.querySelector("span").textContent = this.text; // este no se guarda en variable xq no vamos a hacer nada especial con ello
        checkbox.checked = this.isChecked; // comprobar que está chequeado con propiedad de checkbos llamada checked
        removeButton.textContent = this.buttonLabel;

        removeButton.addEventListener("click", () => {
            // emitir evento action-item-remove
            const event = new CustomEvent("action-item-remove")
            this.dispatchEvent(event)
            // borrar cuando se pulse el boton de borrar
            this.remove();

            // añadimos "action-item-status-update" para cada vez que completamos el evento
            checkbox.addEventListener("change", () => {
                const event = new CustomEvent("action-item-status-update", {
                    detail: {
                        isChecked: checkbox.checked // si esta habilitado es true, si no es false
                    }
                })
                this.dispatchEvent(event)
            })
        })

        this.shadowRoot.appendChild(templateCopy)
    }
}
window.customElements.define("todo-item", TodoItem)