const template = document.createElement("template");
// Paso 1: Crear el template que tiene mi componente
template.innerHTML = `
  <div class="kc-component">
    <input type="text" (/>
    <button disabled></button>
  </div>
`

class InputAction extends HTMLElement {
  // Paso 2: Añadir atributos que recibo de fuera al componente
  constructor() {
    super();

    this.buttonLabel = this.getAttribute("button-label") ?? "Add";

    this.placeholder = this.getAttribute("placeholder") ?? "Write a task";

    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    const templateCopy = template.content.cloneNode(true);
    // Paso 3: Incluimos los 2 valores anteriores dentro del DOM

    const input = templateCopy.querySelector("input");
    const button = templateCopy.querySelector("button");

    input.setAttribute("placeholder", this.placeholder);
    button.textContent = this.buttonLabel;

    // Paso 4: recoger el texto que se escribe cuando se pula el boton "+" > por lo tanto añadir evento que escucha click, ver que valor tiene y disparar el evento
    button.addEventListener("click", () => {
      // coger lo que tiene input
      const inputValue = input.value;
      // creamos el evento con este valor y lo mandamos. Los párametros de CustomEvent son el nombre del evento y la propiedad DETAIL que añade el inputValue
      const event = new CustomEvent("input-action-submit", {
        detail: inputValue
      })
      // lanzamos el evento sobre el nodo del DOM
      this.dispatchEvent(event)
      //limpiar el input después de que el boton se pulse
      input.value = ""
      button.setAttribute("disabled", "")
    })
    // Paso 5: mantener el botón deshabilitado mientras no haya nada escrito. Escuchar cada vez que cambie
    input.addEventListener("input", () => {
      // sacamos la referencia que ya tenemos arriba del valor
      const currentValue = input.value;
      // si el input tiene valor, habilitar el botón
      if (currentValue) {
        button.removeAttribute("disabled")
        // si el input está vacío, deshabilitar el botón
      } else {
        button.setAttribute("disabled", "") // es un bool, hay que pasarle dos valores, el segundo siempre vacío
      }
    })

    this.shadowRoot.appendChild(templateCopy)
  }
}

window.customElements.define("input-action", InputAction)