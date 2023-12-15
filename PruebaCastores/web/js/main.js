let noticias = [];
let comentarios = [];
let respuestas = [];

function inizializar() {
  getAllNoticias();
}

function fecha(){
  let fechaActual = new Date();
  let dia = fechaActual.getDate();
  let mes = fechaActual.getMonth() + 1;
  let anio = fechaActual.getFullYear();
  let fechaActualCadena = `${dia < 10 ? "0" + dia : dia}/${
    mes < 10 ? "0" + mes : mes
  }/${anio}`;
  return fechaActualCadena;
}

function agregarNota() {
  let currentUser = localStorage.getItem("currentUser");
  let usuario = JSON.parse(currentUser);
  if (usuario.rol == "Interno"){
    document.getElementById("noticias").classList.add("escondido");
    document.getElementById("formularioNoticia").classList.remove("escondido");
    document.getElementById("txtPersonal").value = usuario.nombreUsuario;
  }else{
    Swal.fire({
        icon: 'error',
        title: 'Error al agregar nota',
        text: 'Tu usuario no tiene los suficientes permisos'
      });
  }
}

function regresar() {
  document.getElementById("formularioNoticia").classList.add("d-none");
  document.getElementById("noticias").classList.remove("d-none");
}

function enviarNoticia() {
  let currentUser = localStorage.getItem("currentUser");
  let usuario = JSON.parse(currentUser);
  let datos = null;
  let params = null;
  let noticia = new Object();
  noticia.personal = new Object();
  noticia.titulo = document.getElementById("txtTitulo").value;
  noticia.contenido = document.getElementById("txtContenido").value;
  noticia.fechaPublicacion = fecha();
  noticia.personal.idPersonal = usuario.idUsuario;
  datos = {
    datos: JSON.stringify(noticia),
  };
  params = new URLSearchParams(datos);
  fetch("../api/noticia/agregar", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params,
  })
    .then((response) => {
    console.log("response", response);
      return response.json();
    })
    .then((data) =>{
      if (data.error){
          Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La noticia no se pudo generar',
      });
      }else{
          Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: 'La noticia se genero corractamente',
      });
        inizializar();
        regresar();
      }
    });
}

function getAllNoticias() {
  fetch("../api/noticia/getAll")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.error) {
           Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al solicitar los datos de noticia a la base de datos'
      });
      } else {
        loadTableNoticias(data);
      }
    });
}

function loadTableNoticias(data) {
  fetch("../api/comentario/getAll")
    .then((response) => {
      return response.json();
    })
    .then((dataC) => {
      if (dataC.error) {
          Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al solicitar los datos de noticia a la base de datos'
      });
      } else {
        comentarios = dataC;
        fetch("../api/respuesta/getAll")
          .then((response) => {
            return response.json();
          })
          .then((dataR) => {
            if (dataR.error) {
              Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al solicitar los datos de noticia a la base de datos'
      });
            } else {
              respuestas = dataR;
              let cuerpo = `<div class="boton"><button class="boton-nota" onclick="agregarNota();">Agregar una nueva noticia</button></div>`;

              noticias = data;
              noticias.forEach(function (noticia) {
                let comentariosNoticia = comentarios.filter(function (
                  comentario
                ) {
                  return comentario.noticia.idNoticia === noticia.idNoticia;
                });

                let registroComentarios = "";
                comentariosNoticia.forEach(function (comentario) {
                  registroComentarios +=
                    `<h4>` + comentario.texto +`</h4>
                    <input type="text" id="txtR` + comentario.idComentario + `" placeholder="Responder a este comentario"/>
                    <button class="boton-nota" onclick="enviarRespuesta(` + comentario.idComentario + `);">Responder</button>`;
                  let respuestasFiltradas = respuestas.filter(function (
                    respuesta
                  ) {
                    return (
                      respuesta.comentario.idComentario ===
                      comentario.idComentario
                    );
                  });

                  respuestasFiltradas.forEach(function (respuesta) {
                    registroComentarios +=
                      `<h5 class="text-comentario">` +
                      respuesta.texto +
                      `</h5>`;
                  });
                });

                 let registro = `
        <div class="tabla">
          <div class="tabla-titulo">
            <h3>${noticia.fechaPublicacion.substring(0, 10)}</h3>
            <h3>${noticia.titulo}</h3>
            <h3>${noticia.contenido}</h3>
            <h3>Escrito por ${noticia.personal.nombre}</h3>
            <h3>Comentarios</h3>
          </div>
          <div class="tabla-contenido">
            <div class="tabla-contenido-opcion">
              <p>${noticia.fechaPublicacion.substring(0, 10)}</p>
            </div>
            <div class="tabla-contenido-opcion">
              <p>${noticia.titulo}</p>
            </div>
            <div class="tabla-contenido-opcion">
              <p>${noticia.contenido}</p>
            </div>
            <div class="tabla-contenido-opcion">
              <p>${noticia.personal.nombre}</p>
            </div>
            <div class="tabla-contenido-opcion">
              <p>${registroComentarios}</p>
            </div>
          </div>
        </div>
      `;
      cuerpo += registro;
    });
    document.getElementById("llenarNoticias").innerHTML = cuerpo;
            }
          });
      }
    });
}

function enviarComentario(idNoticia) {
  let currentUser = localStorage.getItem("currentUser");
  let usuario = JSON.parse(currentUser);
  let comentarioText = "txtC" + idNoticia;

  let datos = null;
  let params = null;

  let comentario = new Object();
  comentario.noticia = new Object();
  comentario.usuario = new Object();

  comentario.texto = document.getElementById(comentarioText).value;
  comentario.fechayHora = fecha();
  comentario.noticia.idNoticia = idNoticia;
  comentario.usuario.idUsuario = usuario.idUsuario;

  datos = {
    datos: JSON.stringify(comentario),
  };

  params = new URLSearchParams(datos);

  fetch("../api/comentario/agregar",{
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.error) {
          Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar el comentario'
      });
      } else {
          Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: "Comentario generado con exito"
      });
        inizializar();
      }
    });
}

function enviarRespuesta(idComentario){
  let currentUser = localStorage.getItem("currentUser");
  let usuario = JSON.parse(currentUser);
  let respuestaText = "txtR" + idComentario;

  let datos = null;
  let params = null;

  let respuesta = new Object();
  respuesta.comentario = new Object();
  respuesta.usuario = new Object();

  respuesta.texto = document.getElementById(respuestaText).value;
  respuesta.fechayHora = fecha();
  respuesta.comentario.idComentario = idComentario;
  respuesta.usuario.idUsuario = usuario.idUsuario;

  datos = {
    datos: JSON.stringify(respuesta),
  };

  params = new URLSearchParams(datos);
  fetch("../api/respuesta/agregar", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: params,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.error) {
          Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al enviar la respuesta'
      });      } else {
          Swal.fire({
        icon: 'success',
        title: 'Completado',
        text: "La respuesta se generado con exito"
      });
          
        inizializar();
      }
    });
}