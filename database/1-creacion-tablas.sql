-- estado

CREATE TABLE estado (
    id_estado NUMBER(10) NOT NULL,
    codigo VARCHAR2(50) NOT NULL UNIQUE,
    descripcion VARCHAR2(300),
    CONSTRAINT pk_estado PRIMARY KEY (id_estado)
);

-- rol

CREATE TABLE rol (
    id_rol NUMBER(10) NOT NULL,
    nombre VARCHAR2(50) NOT NULL UNIQUE,
    descripcion VARCHAR2(300),
    CONSTRAINT pk_rol PRIMARY KEY (id_rol)
);


-- commit
COMMIT;