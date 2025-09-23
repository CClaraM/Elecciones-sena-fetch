
let lista=[];
let votosJson={};

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

// Función para mostrar los candidatos en la página
function mostrarCandidatos(candidatos) {
    if (localStorage.getItem("votos") === null) {
        candidatos.forEach(candidato =>{
                let datoCandidato = `${candidato.nombre} ${candidato.apellido}`;
                votosJson[datoCandidato]="0";
        });
        votosJson["Voto en blanco"] = 0;
        localStorage.setItem("votos", JSON.stringify(votosJson));        
        console.log(votosJson)   
    }
    let html = '';
    candidatos.forEach(candidato => {
        html += `
        <div class="col">
            <div class="card h-100">
                <div class="card-header">
                    <h5 class="card-title">${candidato.nombre} ${candidato.apellido}</h5>
                </div>
                <div class="card-body">
                    <img src="./img/noPicture.png" class="img-fluid rounded mx-auto d-block" alt="Foto de candidato">
                </div>
                <div class="card-footer">    
                    <p class="card-text">ficha: ${candidato.ficha}</p>
                    <p class="card-text">Programa: ${candidato.curso}</p>
                </div>
            </div>
        </div>`;
    })
    document.querySelector('#candidatos').innerHTML = html;
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