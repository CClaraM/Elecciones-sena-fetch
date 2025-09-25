
let lista=[];
let votosJson=null;
let intervaloResultados = null;

// Función para mostrar los candidatos en la página
function mostrarCandidatos(candidatos) {
    console.log("Mostrando candidatos...");
    if (localStorage.getItem("votos") !== null) {       
        votosJson = JSON.parse(localStorage.getItem('votos')) || {};
        console.log(votosJson)   
    } else {
        votosJson = {};
        localStorage.setItem("elecciones", "false"); // Inicializa elecciones como false
        document.querySelector("#btnIniciar").disabled = false; // Habilita el botón de iniciar elecciones
    }

    let html = '';
    candidatos.forEach(candidato => {
        let clave = `${candidato.nombre} ${candidato.apellido}`;
        //console.log(clave);
        let voto = votosJson[clave] ?? "0"; // si no existe lo crea con 0
        //console.log(voto);
        votosJson[clave] = voto; // asegura que la clave exista en el objeto
        //console.log("votos :",votosJson);
        html += `
        <div class="col">
            <div class="card h-100">
                <div class="card-header">
                    <h5 class="card-title">${clave}</h5>
                </div>
                <div class="card-body">
                    <img src="./img/noPicture.png" class="img-fluid rounded mx-auto d-block" alt="Foto de candidato">
                </div>
                <div class="card-footer">    
                    <p class="card-text">ficha: ${candidato.ficha}</p>
                    <p class="card-text">Programa: ${candidato.curso}</p>
                    <h5 id="${candidato.nombre}_${candidato.apellido}" class="card-title">Votos: ${voto} </h5>
                </div>
            </div>
        </div>`;
    })
    localStorage.setItem("votos", JSON.stringify(votosJson));
    document.querySelector('#candidatos').innerHTML = html;
    mostrarVotos()
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("adminLogueado");
  swal.fire({
      title: "Cerrando cesión...",
      text: "Seras redirigido al login",
      icon: "info",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "login.html"; // Redirigir a login.html
    });         
}

function mostrarVotos() {
    console.log("Mostrando votos...");

    if (localStorage.getItem("votos") !== null) {       
        votosJson = JSON.parse(localStorage.getItem('votos')) || {};  
    }

    let listado = document.querySelector("#tablaResultados");
    listado.innerHTML = ""; // Limpiar contenido previo

    lista.forEach(candidato => {
        let clave = `${candidato.nombre} ${candidato.apellido}`;
        let voto = votosJson[clave];

        let fila = document.createElement("tr");

        let columnaNom = document.createElement("td");
        columnaNom.textContent = clave;
        fila.appendChild(columnaNom);

        let columnaVotos = document.createElement("td");
        columnaVotos.textContent = voto;
        fila.appendChild(columnaVotos);

        listado.appendChild(fila);
        document.querySelector(`#${candidato.nombre}_${candidato.apellido}`).textContent = `Votos: ${voto}`;
    });
    
}

function iniciarMonitoreoResultados() {
  if (localStorage.getItem("elecciones") === "true") {
    mostrarVotos(); // primera carga inmediata
    intervaloResultados = setInterval(mostrarVotos, 1500);
  }
}

document.querySelector("#btnLogout").addEventListener("click", () => {
    swal.fire({
        title: "Desea cerrar cesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cerrar cesión",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
    }).then((result) => {
        if (result.isConfirmed) {
            cerrarSesion();
        }
    })
});

document.querySelector("#btnIniciar").addEventListener("click", () => {
    swal.fire({
        title: "Iniciar elecciones?",
        text: "Una vez inicien las elecciones no se podra revertir el proceso",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Iniciar elecciones"}).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem("elecciones", "true");
                document.querySelector("#btnIniciar").disabled = true;
                document.querySelector("#btnCerrar").disabled = false;
                iniciarMonitoreoResultados();
            }  
        })
});

document.querySelector("#btnCerrar").addEventListener("click", () => {
    //mostrarVotos()
    swal.fire({
        title: "Cerrar elecciones?",
        text: "Una vez cerradas las elecciones no se podra votar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Cerrar elecciones"}).then((result) => {
            if (result.isConfirmed) {
                localStorage.setItem("elecciones", "false");
                document.querySelector("#btnCerrar").disabled = true;
                document.querySelector("#btnIniciar").disabled = true;
                mostrarVotos()
                clearInterval(intervaloResultados);
                intervaloResultados = null;
            }
        })  
});

// Verificar si el usuario está logueado
if (localStorage.getItem("adminLogueado")!=="true") {
    const body = document.querySelector("body");
    body.innerHTML = ""; // Limpiar el contenido de la página
    body.innerHTML = "<h2 class='text-center mt-5'>Acceso no autorizado. Redirigiendo al login...</h2>";
    swal.fire({
      title: "Redireccionando...",
      text: "No estás logueado",
      icon: "error",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "login.html"; // Redirigir a login.html
    });
} else {
    fetch("https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/candidatos.json")
        .then(response => response.json())
        .then(data => {
            lista = data;
            mostrarCandidatos(lista);
        }
    ).catch(error => console.error('Error al cargar los datos:', error));
    if (localStorage.getItem("elecciones") === "true") {
        document.querySelector("#btnCerrar").disabled = false;
    }
}

if (localStorage.getItem("elecciones") === "true") {
        iniciarMonitoreoResultados();
    }