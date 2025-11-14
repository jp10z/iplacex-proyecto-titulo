# Scripts de la base de datos

## Archivos

0-drop-esquemas.sql: Este archivo contiene las sentencias para eliminar (drop) todas las tablas relacionadas al proyecto.

1-creacion-tablas.sql: Este archivo contiene las sentencias para crear todas las tablas y relaciones del proyecto.

2-indices.sql: Este archivo contiene las sentencias para crear los indices y mejorar la eficiencia de lectura a los datos.

3-seed-datos.sql: Este archivo contiene las sentencias para poblar las tablas maestras con datos iniciales.

## Explicación

Se deben ejecutar los scripts del 1 al 3 para crear las tablas, relaciones, indices y poblar los datos iniciales (inserts). Esto sólo se debe hacer si se quiere implementar este proyecto con una Base de datos limpia.

El script 3-seed.datos.sql también creará un usuario administrador que podrá ser usado como primer login, se recomienda mucho crear un nuevo usuario desde la web y deshabilitar este usuario "Admin" predeterminado.

El correo del usuario Admin predeterminado es "admin@admin.com" y la contraseña es "adminadmin" sin comillas.

El script 0-drop-esquemas.sql sólo está incluído para efectos de pruebas, para eliminar todo y proceder luego con los scripts del 1 al 3, no se debe ejecutar a menos que sea en ambiente de prueba.