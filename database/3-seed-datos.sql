INSERT INTO estado (id_estado, codigo, descripcion) VALUES (1, 'ACTIVO', 'Estado que indica que el registro está activo');
INSERT INTO estado (id_estado, codigo, descripcion) VALUES (2, 'INACTIVO', 'Estado que indica que el registro está inactivo');

INSERT INTO rol (id_rol, nombre, descripcion) VALUES (1, 'ADMIN', 'Rol para usuarios con privilegios administrativos');
INSERT INTO rol (id_rol, nombre, descripcion) VALUES (2, 'OPERADOR', 'Rol para usuarios con privilegios de operador estándar');

INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (1, 'LOGIN', 'Evento que indica un inicio de sesión exitoso');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (2, 'LOGIN_FALLIDO', 'Evento que indica un inicio de sesión fallido');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (3, 'USUARIO_AGREGAR', 'Cuando se agrega un nuevo usuario');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (4, 'USUARIO_MODIFICAR', 'Cuando se modifica un usuario');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (5, 'USUARIO_DESHABILITAR', 'Cuando se deshabilita un usuario');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (6, 'PROYECTO_AGREGAR', 'Cuando se crea un nuevo proyecto');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (7, 'PROYECTO_MODIFICAR', 'Cuando se modifica un proyecto');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (8, 'PROYECTO_DESHABILITAR', 'Cuando se deshabilita un proyecto');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (9, 'SERVIDOR_AGREGAR', 'Cuando se agrega un nuevo servidor');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (10, 'SERVIDOR_MODIFICAR', 'Cuando se modifica un servidor');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (11, 'SERVIDOR_DESHABILITAR', 'Cuando se deshabilita un servidor');
INSERT INTO tipo_evento (id_tipo_evento, nombre, descripcion) VALUES (12, 'SERVIDOR_ACCESO', 'Cuando se hace una reserva de acceso a un servidor');

INSERT INTO usuario (correo, nombre, password, id_rol, id_estado) VALUES ('admin@admin.com', 'Admin', 'adminadmin', 1, 1);

-- commit
COMMIT;