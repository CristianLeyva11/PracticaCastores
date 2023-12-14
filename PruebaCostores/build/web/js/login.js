function login() {
  let usuario = document.getElementById("nombre").value;
  let contrasenia = document.getElementById("password").value;
  let datos = JSON.stringify({nombreUsuario: usuario, contrasenia: contrasenia});
  params = new URLSearchParams({ datos: datos });
  console.log(datos);
  
  fetch("api/usuario/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
    body: params
  })
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    if (data.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Por favor, verifica tus credenciales'
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Hola ' + usuario.toString()
      });

      localStorage.setItem("currentUser", JSON.stringify(data));
      
      setTimeout(function () {
          window.location.href = "http://localhost:8080/PruebaCostores/Modules/home.html";
        }, 1000);
    }
  });
}
