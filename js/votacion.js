if (localStorage.getItem("elecciones") !== null) {
        let html = '';
        html += `<div class="alert alert-info" role="alert">
            <h4 class="alert-heading">Elecciones en curso</h4>
            <p>No existen elecciones están actualmente en curso.</p>
            <hr>
            <p class="mb-0">Por favor, espere a que las elecciones finalicen para realizar estas acciones.</p>
        </div>`;
    } else {
        fetch("https://raw.githubusercontent.com/CesarMCuellarCha/apis/refs/heads/main/candidatos.json")
        .then(response => response.json())
        .then(data => {
            lista = data;
            mostrarCandidatos(lista);
        }).catch(error => console.error('Error al cargar los datos:', error));
    }

document.querySelector("#btnLogin").addEventListener("click", () => {
    window.location.href = "login.html";
});