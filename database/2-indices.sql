-- tabla evento, columna id_tipo_evento
CREATE INDEX idx_evento_id_tipo_evento
ON evento (id_tipo_evento);

-- tabla evento, columna id_usuario
CREATE INDEX idx_evento_id_usuario
ON evento (id_usuario);

-- tabla evento, columna id_usuario
CREATE INDEX idx_evento_id_servidor
ON evento (id_servidor);

-- tabla evento, columna fecha_creacion
CREATE INDEX idx_evento_fecha_creacion_asc
ON evento (fecha_creacion ASC);

/*
Hubo algunas columnas que no fue necesario incluirlas acá, como el correo de
la tabla usuario o los códigos de las tablas maestras, al especificar que estas
columnas son UNIQUE durante la creación de las tablas, automáticamente Oracle
crea sus respectivo indices
*/

COMMIT;