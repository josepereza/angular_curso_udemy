# Sección 6: Despliegues rápidos a producción

Este es un breve listado de los temas fundamentales:

- Generar build de producción
- Desplegarlo rápidamente
- Netlify

Aquí aprenderemos como generar el build de producción de nuestra aplicación y la desplegaremos en la web rápidamente usando Netlify, el proceso de despliegue en otros servidores es virtualmente el mismo, tomar nuestra carpeta DIST (que contiene la aplicación con archivos HTML, CSS y JS) y desplegarla mediante FTP (preferiblemente sFTP) en el hosting deseado.

## Generar build de producción

Es importante asegurarnos que nuestra versión de desarrollo funcione perfectamente, también en recomendable que no se presenten warnings en la consola, y que eliminemos dependencias o importaciones que no necesitamos. Para generar la versión de producción usamos el comando `ng build --prod`. Una vez termine el comando, se nos genera un directorio llamado `dist`.

## Desplegando en Netlify

Podemos ingresar a [Netlify](https://www.netlify.com/) y seguimos los pasos para hace un drag & drop de la carpeta de nuestro proyecto. Una vez termine de desplegarla en el hosting, podemos tomar el url que se genera para poder ingresar a la aplicación desde cualquier dispositivo en línea.
