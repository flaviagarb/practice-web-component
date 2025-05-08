const template = document.createElement("template");
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

        const inputAction = templateCopy.querySelector("input-action");

        inputAction.addEventListener("input-action-submit", (event) => {
            const text = event.detail;

            const currentTodos = this.getStoredTodos()
            const newTodo = {
                text: text,
                isCompleted: false,
                id: crypto.randomUUID()
            }
            currentTodos.push(newTodo)
            localStorage.setItem("todos", JSON.stringify(currentTodos));

            this.addTodo(newTodo)
        })

        this.shadowRoot.appendChild(templateCopy)

        this.showStoredTodos();
    }

    getStoredTodos() {
        const todos = localStorage.getItem("todos");

        return todos ? JSON.parse(todos) : [];
    }

    showStoredTodos() {
        const todos = this.getStoredTodos();

        todos.forEach(todo => {
            this.addTodo(todo)
        });
    }

    addTodo(todo) {
        const newTodoItem = document.createElement("todo-item");
        this.shadowRoot.querySelector(".todo-items-wrapper").appendChild(newTodoItem)
        newTodoItem.setAttribute("text", todo.text);
        newTodoItem.setAttribute("id", todo.id);
        if (todo.isCompleted) {
            newTodoItem.setAttribute("is-checked", "");
        }

        newTodoItem.addEventListener("action-item-status-update", (event) => {
            const currentTodos = this.getStoredTodos();
            const updatedTodos = currentTodos.map(todo => {
                if (todo.id === event.detail.id) {
                    todo.isCompleted = event.detail.isChecked
                }
                return todo;
            });

            localStorage.setItem("todos", JSON.stringify(updatedTodos))
        })

        newTodoItem.addEventListener("action-item-remove", (event) => {
            const idToRemove = event.detail.id;
            const currentTodos = this.getStoredTodos();
            const updatedTodos = currentTodos.filter(todo => todo.id !== idToRemove)
            localStorage.setItem("todos", JSON.stringify(updatedTodos))
        })
    }
}

window.customElements.define("todo-list", TodoList)
