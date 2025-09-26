let lista=[];

function mostrarCandidatos(candidatos) {
    console.log("Mostrando candidatos...");

    let html = '';
    candidatos.forEach(candidato => {
        let clave = `${candidato.nombre} ${candidato.apellido}`;
        html += `
        <div class="col">
            <div class="card h-100 candidato" data-clave="${clave}">
                <div class="card-header">
                    <h5 class="card-title">${clave}</h5>
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
    // Agregar evento de clic a cada tarjeta de candidato
    document.querySelectorAll('.candidato').forEach(card => {
        card.addEventListener('click', () => {
            let clave = card.dataset.clave;
            console.log(`Candidato seleccionado: ${clave}`);
            Swal.fire({
                title: `¿Deseas votar por ${clave}?`,
                icon: 'question',
                text: "No podrás cambiar tu voto después de confirmar.",
                showCancelButton: true,
                confirmButtonText: 'Sí, votar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Procesar el voto
                    console.log(`Voto confirmado por: ${clave}`);
                    let votosJson = JSON.parse(localStorage.getItem('votos')) || {};
                    if (votosJson[clave] !== undefined) {
                        votosJson[clave] = (parseInt(votosJson[clave], 10) + 1).toString();
                        localStorage.setItem("votos", JSON.stringify(votosJson));
                        Swal.fire("¡Voto registrado!", "Gracias por tu voto", "success").then(() => {
                            localStorage.setItem("validador", "true"); // Guardar estado en localStorage
                            location.reload();
                        });
                        
                    } else {
                        Swal.fire("Error", "Error en proceso, intenta de nuevo", "error").then(() => {
                            location.reload();
                        });
                        
                    }
                }
            })
        })
    });
}

if (localStorage.getItem("elecciones") === null) {
        console.log("No hay elecciones en curso");
        let html = '';
        html += `<div class="alert alert-info" role="alert">
            <h4 class="alert-heading">ATENCION</h4>
            <p>No existen elecciones están actualmente en curso.</p>
            <hr>
            <p class="mb-0">Por favor, espere a que las elecciones inicien para realizar estas acciones.</p>
        </div>`;
        document.querySelector('#candidatos').innerHTML = html;
    } else {
        console.log("Elecciones en curso");
        // Cargar los datos de los candidatos desde el archivo JSON
        fetch("https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/candidatos.json")
        .then(response => response.json())
        .then(data => {
            lista = data;
        }).catch(error => console.error('Error al cargar los datos:', error));

        if (localStorage.getItem("validador") === null || localStorage.getItem("validador") === "false") {
            localStorage.setItem("validador", "false"); // Guardar estado en localStorage
            document.querySelector("#confirm").innerHTML = `
            <div class="alert alert-warning" role="alert" style="margin-top: 20px;">
                <h4 class="alert-heading">ATENCION</h4>
                <p>Para poder votar, debes confirmar que eres un votante registrado.</p>
                <hr>
                <button id="btnConfirmar" class="btn btn-primary">Confirmar</button>
            </div>`;
            document.querySelector("#btnConfirmar").addEventListener("click", () => {
                swal.fire({
                    title: "Confirmado",
                    text: "Ahora puedes votar",
                    icon: "success"
                }).then(() => {
                    mostrarCandidatos(lista);
                    document.querySelector("#confirm").innerHTML = '';
                    document.querySelector(".col-md-8").style.display = "block";
                });
            });
        } else {
            document.querySelector("#confirm").innerHTML = `
            <div class= "card text-white bg-success mb-3" style="margin-top: 20px;">
                <div class="card-header">
                    <h5 class="card-title">Gracias por tu Voto</h5>
                </div>
                <div class="card-body">
                    <p class="card-text">Con tu voto apoyas la democracia..</p>
                </div>
            </div>`;
            
        }
        
    }

document.querySelector("#btnLogin").addEventListener("click", () => {
    window.location.href = "login.html";
});