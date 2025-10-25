INSERT INTO estado (id_estado, codigo, descripcion) VALUES (1, 'ACTIVO', 'Estado que indica que el registro está activo');
INSERT INTO estado (id_estado, codigo, descripcion) VALUES (2, 'INACTIVO', 'Estado que indica que el registro está inactivo');

INSERT INTO rol (id_rol, nombre, descripcion) VALUES (1, 'ADMIN', 'Rol para usuarios con privilegios administrativos');
INSERT INTO rol (id_rol, nombre, descripcion) VALUES (2, 'OPERADOR', 'Rol para usuarios con privilegios de operador estándar');

-- commit
COMMIT;