const breedURL = 'https://dog.ceo/api/breeds/list/all';
const photoURL1 = 'https://dog.ceo/api/breed/';
const photoURL2 = '/images/random';


document.addEventListener("DOMContentLoaded", function (event) {
  console.log(event);
  console.log("DOM fully loaded and parsed");
  //Asignamos el atributo display a none.
  let x = document.getElementById("perros");
  if (x.style.display !== "none") {
    x.style.display = "none";
  }
});

let radios = document.getElementById('tipoconexion').getElementsByTagName('input');
let connectionType = null;
for (let i = 0; i < radios.length; i++) {
  radios[i].addEventListener('change', function () {
    //(connectionType) ? console.log(connectionType.value) : null;
    if (this !== connectionType) {
      connectionType = this;
      selectConnection(connectionType.value);
    }
    console.log(this.value)
    //Mostramos la sección de la lista de razas y el botón de nuevo perro.
    let x = document.getElementById("perros");
    if (x.style.display === "none") {
      x.style.display = "flex";
    }
  });
}

//!Crear event listeners para las opciones del select (la lista de perros)
let newDog = document.getElementById('newdog');
newDog.addEventListener('click', () => dogPhoto(dogs.value));

//!REVISAR
let selectedDog = document.getElementById('dogs');
selectedDog.addEventListener('change', () => dogPhoto(dogs.value));
/**
 * Ejecuta las llamadas a las funciones de la conexión seleccionada.
 * @param {String} type - Tipo de conexión marcada en el formulario de botones radio.
 */
function selectConnection(type) {
  switch (type) {
    case "xml": clearNodes(document.getElementById('fotoperro'));
      conexionXML(breedURL);
      break;
    case "fetch": {
      clearNodes(document.getElementById('fotoperro'));
      peticionFetch(breedURL)
        .then(response => JSON.parse(response))
        .then(data => {
          let breeds = Object.keys(data.message);
          breeds.forEach(dog => listarPerros(dog));
        })
        .finally(() => console.log("Terminado."))
        .catch(error => console.error(error));
      break;
    }
    case "jquery": clearNodes(document.getElementById('fotoperro'));
      var jsonJQuery = peticionJQuery(breedURL);
      console.log(jsonJQuery);
      break;
    default: console.log('Seleccione un tipo de conexión.');
  }
}

/**
 *Establece una primera conexión de tipo XMLHttp con la Dog API para obtener la lista de razas.
 *
 * @param {String} url - Ruta de acceso a la Dog API
 */
function conexionXML(url) {
  let dogexion = new XMLHttpRequest();
  dogexion.onreadystatechange = procesarEventos;
  dogexion.open('GET', url, true);
  dogexion.send();

  /**
   *Procesa los eventos de la conexión XML
   *
   */
  function procesarEventos() {
    if (dogexion.readyState == 4) {
      if (dogexion.status == 200) {
        let dogBreeds = JSON.parse(dogexion.responseText);
        let breeds = Object.keys(dogBreeds.message);
        console.log(breeds);
        let firstDog = breeds[0]; //Asignar el atributo selected
        breeds.forEach(dog => listarPerros(dog));
        dogPhoto(firstDog);
      }
      else {
        //!Ocultar spinner si lo hubiera
        alert(dogexion.statusText);
      }
    } else if (dogexion.readyState == 1 || dogexion.readyState == 2 || dogexion.readyState == 3) {
      console.log('Procesando...');
    }
  }
}

/**
 *Establece una segunda conexión de tipo XMLHttp con la Dog API para obtener una foto aleatoria de la raza seleccionada.
 *
 * @param {*} dog
 */
function dogPhoto(dog) {
  clearNodes(document.getElementById('fotoperro'));
  let dogexion = new XMLHttpRequest();
  dogexion.onreadystatechange = procesarEventos;
  dogexion.open('GET', photoURL1 + dog + photoURL2, true);
  dogexion.send();

  /**
   *Procesa los eventos de la conexión realizada en dogPhoto
   *
   */
  function procesarEventos() {
    if (dogexion.readyState == 4) {
      if (dogexion.status == 200) {
        let fotoPerro = JSON.parse(dogexion.responseText);
        console.log(fotoPerro.message);
        let foto = crearNodo("img", null, null, [], [{ name: 'src', value: fotoPerro.message }, { name: 'alt', value: dog }]);
        console.log(foto);
        document.getElementById('fotoperro').appendChild(foto);
      }
      else {
        //!Ocultar spinner si lo hubiera
        alert(dogexion.statusText);
      }
    } else if (dogexion.readyState == 1 || dogexion.readyState == 2 || dogexion.readyState == 3) {
      console.log('Procesando...');
    }
  }
}

/**
 * JQUERY - Conexión con API mediante Jquery
 * @param {String} path - URL de la API a la que nos queremos conectar mediante el métod JQuery
 */
function peticionJQuery(path) {
  $.ajax({
    url: path, //URL de la petición
    data: {}, //información a enviar, puede ser una cadena
    type: 'GET', //tipo de la petición: POST o GET
    dataType: 'json', //tipo de dato que se espera
    success: function (json) { //función a ejecutar si es satisfactoria 
      let breeds = Object.keys(json.message);
      breeds.forEach(dog => listarPerros(dog));
    }, error: function (jqXHR, status, error) { //función error 
      alert('Disculpe, existió un problema. Vuelva a intentarlo.');
    }, finally: function(){},
    // función a ejecutar sin importar si la petición falló o no 
    complete: function (jqXHR, status) { console.log('Petición realizada'); }
  });
}

/**
 * FETCH - Función asíncrona para realizar peticiones fetch. 
 * @param {*} url 
 */
const peticionFetch = async (url) => {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error("WARN", response.status);
  const data = await response.text();
  //console.log(data);
  return data;
}

//!Función para eliminar nodos
/**
 *Elimina los nodos hijo del nodo inidcado, para eliminar la foto del perro.
 *
 * @param {*} myNode - Nodo cuyos hijos deseamos eliminar.
 */
function clearNodes(myNode) {
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }
}

/**
 *Crea un nodo en el DOM con la etiqueta HTML y los atributos que queramos asignarle.
 *
 * @param {String} tagName - Nombre de la etiqueta HTML que deseamos crear.
 * @param {String} nodeText - Atributo texto del elemento HTML.
 * @param {String} nodeId - Atributo id del elemento HTML.
 * @param {Array} nodeClasses - Nombre de las clases en un array. Ejemplo: ['parchita', 'velo'] Resultado: class="parchita velo".
 * @param {Array} nodeAttributes - Array de clave-valor de los atributos adicionales a añadir. Ejemplo: [{name: 'parchita', key: 'velo'}, {name:'crazy', key:'wombat'}] Resultado: parchita="velo" crazy="wombat".
 * @return {*} - Nodo con la etiqueta y los atributos asignados.
 */
function crearNodo(tagName, nodeText, nodeId, nodeClasses, nodeAttributes) {
  let nodeElement = document.createElement(tagName);

  if (nodeText != null) {
    nodeElement.setAttribute("text", nodeText);
  }

  if (nodeId != null) {
    nodeElement.setAttribute("id", nodeId);
  }

  if (nodeClasses.length > 0) {
    nodeClasses.forEach(className => {
      nodeElement.classList.add(className);
    });
  }

  if (nodeAttributes.length > 0) {
    nodeAttributes.forEach(attribute => {
      nodeElement.setAttribute(attribute.name, attribute.value);
    });
  }

  return nodeElement;
}

const dogs = document.getElementById('dogs');
console.log(dogs);

/**
 * Crea y añade nodos al documento HTML en base a los datos del objeto recibido, ya sea utilizando HTML templates o la función crearNodo(), 
 * cuando el navegador no sea compatible con las templates.
 *
 * @param {Object} dog - Objeto con los datos que queremos renderizar en el DOM.
 */
function listarPerros(dog) {
  //Clonado de nodos:
  // Comprobar si el navegador soporta el elemento HTML template element chequeando
  // si tiene el atributo 'content'
  if ('content' in document.createElement('template')) {
    // Instanciar la lista
    // y su contenido con el template
    var perro = document.querySelector('#doglist'),
      opcion = perro.content.querySelectorAll("option");
    opcion[0].setAttribute("Value", dog)
    opcion[0].textContent = dog;

    // Clonar el nuevo perro e insertarlo en la lista
    var listaPerros = document.querySelector("#dogs");
    var clone = document.importNode(perro.content, true);
    listaPerros.appendChild(clone);
  }
  else {
    // Forma alternativa de añadir filas mediante DOM porque el
    // elemento template no está soportado por el navegador.
    //Creamos los nodos de perros
    let dogNode = crearNodo("option", null, null, [], [{ 'value': dog }]);
    dogNode.appendChild(document.createTextNode(dog));
    document.getElementById('dogs').appendChild(dogNode);
  }
}

/*
//!Demo de DogAPI
//https://dog.ceo/dog-api/breeds-list
function getDog() {
  var selectedDog = $('.dog-selector option:selected').val();
  dogURL = selectedDog.replace(/-/g, '/');
  $.getJSON('https://dog.ceo/api/breed/' + dogURL + '/images/random', function (result) {
    $('.demo-image').html('<img src=\'' + result.message + '\'>');
  });
}
function loadDogs() {
  $.getJSON('https://dog.ceo/api/breeds/list/all', function (result) {
    var breeds = result.message;
    firstDog = Object.keys(breeds)[0];
    $.each(breeds, function (dog, breed) {
      if (breeds[dog].length >= 1) {
        for (i = 0; i < breeds[dog].length; i++) {
          $('.dog-selector').append('<option value="' + dog + '-' + breeds[dog][i] + '">' + breeds[dog][i] + ' ' + dog + '</option>');
        }
      }
      else if (breeds[dog].length < 1) {
        $('.dog-selector').append('<option value="' + dog + '">' + dog + '</option>');
      }
    });
    $.getJSON('https://dog.ceo/api/breed/' + firstDog + '/images/random', function (result) {
      $('.demo-image').html('<img src=\'' + result.message + '\'>');
    });
  });
}
$('.dog-selector').change(function () {
  $('.dog-selector option:selected').each(function () {
    getDog();
  });
});
$('.get-dog').click(function () {
  getDog();
});
$(document).ready(function () {
  loadDogs();
});
*/