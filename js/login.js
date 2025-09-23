// Verificar si el usuario ya está logueado
if (localStorage.getItem("adminLogueado")==="true") {
    swal.fire({
      title: "Redireccionando...",
      text: "Ya estás logueado",
      icon: "info",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "manage.html"; // Redirigir a manage.html
    });
}


document.querySelector("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.querySelector("#usuario");
  const password = document.querySelector("#password");

  const res = await fetch("https://raw.githubusercontent.com/cesarmcuellar/Elecciones/refs/heads/main/administrador.json");
  const data = await res.json();
  // Verificar las credenciales
  if (usuario.value === data.username && password.value === data.password) {
    // Limpiar los campos del formulario
    usuario.value = "";
    password.value = "";
    // Usando SweetAlert para mostrar el mensaje de éxito
    swal.fire({
      title: "Login exitoso",
      text: "Credenciales correctas",
      icon: "success"
    }).then(() => {
      localStorage.setItem("adminLogueado", "true"); // Guardar estado de login en localStorage
      window.location.href = "manage.html";
    });
  } else {
    // Usando SweetAlert para mostrar el mensaje de error
    swal.fire({
      title: "Error de login",
      text: "Credenciales incorrectas",
      icon: "error"
    });

  }
});