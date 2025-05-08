const template = document.createElement("template");
template.innerHTML = `
 <style>
    * {
    font-family: Arial, sans-serif;
    }
    .todo-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1.5rem;
      background-color: #f9f9f9;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .todo-title {
      margin-bottom: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      text-align: center;
    }
    .todo-items-wrapper {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  </style>
  <div class="todo-container">
    <h2 class="todo-title">TO-DO LIST</h2>
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
