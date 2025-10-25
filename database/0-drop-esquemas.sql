DROP SEQUENCE seq_evento_id;
DROP SEQUENCE seq_servidor_acceso_id;
DROP SEQUENCE seq_usuario_proyecto_id;
DROP SEQUENCE seq_servidor_id;
DROP SEQUENCE seq_proyecto_id;
DROP SEQUENCE seq_usuario_id;

DROP TABLE evento;
DROP TABLE servidor_acceso;
DROP TABLE usuario_proyecto;
DROP TABLE servidor;
DROP TABLE proyecto;
DROP TABLE usuario;
DROP TABLE rol;
DROP TABLE estado;
DROP TABLE tipo_evento;

-- commit
COMMIT;