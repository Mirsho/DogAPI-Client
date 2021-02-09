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
        alert(dogexion.statusText);
      }
    } else if (dogexion.readyState == 1 || dogexion.readyState == 2 || dogexion.readyState == 3) {
      console.log('Procesando...');
    }
  }
}

conexionXML('https://dog.ceo/api/breeds/list/all');

/**
 *Establece una segunda conexión de tipo XMLHttp con la Dog API para obtener una foto aleatoria de la raza seleccionada.
 *
 * @param {*} dog
 */
function dogPhoto(dog) {
  let dogexion = new XMLHttpRequest();
  dogexion.onreadystatechange = procesarEventos;
  dogexion.open('GET', 'https://dog.ceo/api/breed/' + dog + '/images/random', true);
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
        document.getElementById('fotoPerro').appendChild(foto);
      }
      else {
        alert(dogexion.statusText);
      }
    } else if (dogexion.readyState == 1 || dogexion.readyState == 2 || dogexion.readyState == 3) {
      console.log('Procesando...');
    }
  }
}
/*
$.getJSON('https://dog.ceo/api/breed/' + dogURL + '/images/random', function (result) {
  $('.demo-image').html('<img src=\'' + result.message + '\'>');
});
*/

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

console.log(document.getElementById(dogs));

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