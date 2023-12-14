DROP DATABASE IF EXISTS blog_news;
CREATE DATABASE blog_news;
USE blog_news;

CREATE TABLE personal(
idPersonal INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
nombre 			VARCHAR(60) NOT NULL,
apePaterno 		VARCHAR(40) NOT NULL,
apeMaterno 		VARCHAR(40) NOT NULL,
direccion 		VARCHAR(120) NOT NULL,
fechaIngreso 	DATE NOT NULL
);
CREATE TABLE usuario(
	idUsuario			INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombreUsuario		VARCHAR(20) NOT NULL,
    contrasenia			VARCHAR(40) NOT NULL,
    correo				VARCHAR(45) NOT NULL,
    rol					VARCHAR(45) NOT NULL
);
CREATE TABLE noticia(
	idNoticia			INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    titulo				VARCHAR(45),
    contenido			VARCHAR(1000),
    fechaPublicacion	DATETIME,
    idPersonal			INT NOT NULL,
    CONSTRAINT noticia_idPersonal_fk FOREIGN KEY(idPersonal) REFERENCES personal(idPersonal)
);
CREATE TABLE comentario(
	idComentario		INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    texto				VARCHAR(1000) NOT NULL,
    fechayHora			DATETIME,
    idNoticia			INT NOT NULL,
    idUsuario			INT NOT NULL,
    CONSTRAINT comentario_idNoticia_fk FOREIGN KEY(idNoticia) REFERENCES noticia(idNoticia),
    CONSTRAINT comentario_idUsuario_fk FOREIGN KEY(idUsuario) REFERENCES usuario(idUsuario)
);
CREATE TABLE respuesta(
	idRespuesta			INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    texto				VARCHAR(1000) NOT NULL,
    fechayHora			DATETIME,
    idComentario		INT NOT NULL,
    idUsuario			INT NOT NULL,
    CONSTRAINT respuesta_idComentario_fk FOREIGN KEY(idComentario) REFERENCES comentario(idComentario),
    CONSTRAINT respuesta_idUsuario_fk FOREIGN KEY(idUsuario) REFERENCES usuario(idUsuario)
);
CREATE VIEW caja_comentarios AS SELECT r.* FROM respuesta r INNER JOIN comentario c ON r.idComentario=c.idComentario INNER JOIN usuario u ON r.idUsuario=u.idUsuario; 
INSERT INTO personal(apePaterno, apeMaterno, nombre, direccion, fechaIngreso) VALUES("Leyva","Collazo","Cristian Alejandro","Las compuertas",STR_TO_DATE("14/12/2023",'%d/%m/%Y'));
INSERT INTO usuario(nombreUsuario, contrasenia, correo, rol) VALUES("Leyva", ",admin", "cristianleyvacr7@gmail.com", "Externo");
INSERT INTO usuario(nombreUsuario, contrasenia, correo, rol) VALUES("Blanca", "1234", "blanca17@gmail.com", "Interno");