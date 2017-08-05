# TopicImages

By: Daniel Rendon Montaño - drendon9@eafit.edu.co

# 1. Descripción de aplicación

* Aplicación web que permite a los usuarios la gestion completa de imágenes.
* Los usuarios pueden crear una cuenta para ingresar a la aplicación, igualmente la pueden eliminar si lo desean.
* Los usuarios que entren con una cuenta podrán subir sus imágenes de manera pública o privada. El contenido público
podrá ser visualizado por cualquier usuario en el sistema, mientras el privado sólo podra ser visualizado por
el propietario de éste.
* El pripietario del contenido tiene la capacidad de cambiar un contenido de público a privado y viceversa.
* Las imágenes se manejan a nivel de metadatos.
* La aplicación permite la navegación en la pantalla general, montrando el contenido público, y ademas se cuenta
con una barra de búsquedas para filtrar dicho contenido por usuario.

# 2. Análisis

## 2.1 Requisitos funcionales:

1. Permitir crear, actualizar y eliminar la cuenta a cada usuario.
2. Permitir subir y eliminar imágenes.
3. Permitir decidir el tipo de contenido (público o privado).
4. Permitir cambiar el estado de los contenidos propios (de público a privado y viceversa).
5. Permitir navegar por el contenido público de otros usuarios.
6. Permitir la búsqueda de contenidos de algún usuario.
7. Permitir ver el contenido privado sólo al usuario que lo subio.
8. Autoregistrar usuarios.
9. Login de usuarios.
10. Logout de usuarios.

## 2.2 Definición de tecnología de desarrollo y ejecución para la aplicación:

* Lenguaje de Programación: Javascript
* Framework web backend: NodeJS - Express
* Framework web frontend: No se usa - se utilizará Templates HTML
* Base de datos: MongoDB
* Web App Server: NodeJS
* Web Server: NGINX

# 3. Pruebas

en el Data Center Academico (DCA):

1. Se instaló nvm local para el usuario danrendon

    fuente: https://www.liquidweb.com/kb/how-to-install-nvm-node-version-manager-for-node-js-on-centos-7/

2. Se instaló la version de node:

    $ nvm install v6.11.1

3. Se instaló el servidor mongodb como root:

    # yum install mongodb-server -y

# 4. Diseño:

## 4.1 Modelo de datos:

    Imagen:
    {
      usuario: String,
      titulo: String,
      descripcion: String,
      imagen: String,
      privado: String
    }

    User:
    {
        username: String,
        password: String,
        email: String,
        name: String
    }

## 4.2 Servicios Web


     /* Servicio Web: Entrada al formato de Registro de usuarios.
          Método: GET
          URI: /register
     */

     /* Servicio Web: Entrada al formato de Inicio de sesión.
          Método: GET
          URI: /login
     */

     /* Servicio Web: Finaliza la sesión actual y redirige al formato de Inicio de sesión.
          Método: GET
          URI: /logout
     */

     /* Servicio Web: Busca y muestra los datos del usuario en la Base de datos.
          Método: GET
          URI: /account
     */

     /* Servicio Web: Entrada al formato de subir una imagen.
          Método: GET
          URI: /upload
     */

     /* Servicio Web: Busca y muestra todas las imagenes en estado publico subidos por los usuarios
                      en la Base de datos.
          Método: GET
          URI: /public
     */

     /* Servicio Web: Despliega la lista de imagenes subidos por el usuario en la sesión actual.
          Método: GET
          URI: /perfil
     */

     /* Servicio Web: Entrada al formato de actualización de los datos de la publicación.
          Método: GET
          URI: /edit/:id
     */

    /* Servicio Web: Inserta un Nuevo Usuario en la Base de datos
      Método: POST
      URI: /registrar
    */

    /* Servicio Web: Realiza la autenticación del usuario para ingresar.
      Método: POST
      URI: /login
    */

     /* Servicio Web: Almacena en la base de datos la referencia a la imagen junto con sus atributos.
          Método: POST
          URI: /upload
     */

    /* Servicio Web: Modifica la contraseña en la Base de datos.
      Método: POST
      URI: /changePassword
    */

    /* Servicio Web: Modifica los datos del usuario en la Base de datos.
      Método: POST
      URI: /account
    */

     /* Servicio Web: Filtra las imagenes publicas por usuario y los muestra.
          Método: POST
          URI: /buscar
     */

     /* Servicio Web: Modifica los campos que se hayan cambiado en la publicación.
          Método: POST
          URI: /edit/:id
     */

    /* Servicio Web: Elimina el usuario y sus archivos de la Base de datos.
      Método: DELETE
      URI: /deleteAccount
    */

    /* Servicio Web: Elimina la publicación de la Base de datos.
      Método: DELETE
      URI: /delete/:id
    */


# 5. Implementación o Despliegue (DCA y PaaS):

## 5.1 despliegue en el data center academico (DCA):

1. Se instaló un manejador de procesos de NodeJS: PM2 (http://pm2.keymetrics.io/)

    $ npm install -g pm2
    $ cd articulosEM
    $ pm2 start app.ps
    $ pm2 list

2. Se puso como un servicio, para cuando se reinicie el sistema:

    $ pm2 startup systemd

3. Se abrieron los puertos en el firewall que utilizará la aplicación:

    # firewall-cmd --zone=public --add-port=3000/tcp --permanent
    # firewall-cmd --reload
    # firewall-cmd --list-all

4. Se instaló NGINX:

    # yum install -y nginx

    # systemctl enable nginx
    # systemctl start nginx

5. Se abrió el puerto 80

    # firewall-cmd --zone=public --add-port=80/tcp --permanent
    # firewall-cmd --reload

6. Se deshabilitó SELINUX

    # vim /etc/sysconfig/selinux

          SELINUX=disabled

    # reboot






