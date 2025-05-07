const template = document.createElement("template");
// Primer paso añadimos input-action dentro de este componente
// Crear un nuevo componente todo-item-wrapper para insertar tareas
template.innerHTML = `
  <div class="todo-list">
    <input-action></input-action>
    <div class="todo-items-wrapper"></div>
  </div>
`

class TodoList extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        const templateCopy = template.content.cloneNode(true);
        // busca el componente de input-action
        const inputAction = templateCopy.querySelector("input-action");

        inputAction.addEventListener("input-action-submit", (event) => {
            const text = event.detail;

            const newTodoItem = document.createElement("div");

            newTodoItem.innerHTML = `<todo-item text="${text}"></todo-item>`
            this.shadowRoot.querySelector(".todo-items-wrapper").appendChild(newTodoItem)
        })

        this.shadowRoot.appendChild(templateCopy)
    }
}

window.customElements.define("todo-list", TodoList)