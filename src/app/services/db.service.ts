import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  [x: string]: any;

    // Variable para almacenar la conexión a la base de datos SQLite
    private db: SQLiteObject | null = null;

  // Inyectamos el servicio SQLite para poder interactuar con la base de datos
  constructor(private sqlite: SQLite, private platform: Platform) { }

  // Método para abrir la base de datos, se asegura de que la conexión esté establecida
  async abrirDB() {
    console.log("Intentando abrir la base de datos...");
    this.db = await this.sqlite.create({
        name: "datos.db",
        location: "default"
    });
    console.log("HSC: Base de datos abierta correctamente");
}

  
  

  async crearTablaUsuario() {
    try {
      await this.abrirDB();
      await this.db?.executeSql("CREATE TABLE IF NOT EXISTS USUARIO (MAIL VARCHAR(75), PASS VARCHAR(30), NOMBRE VARCHAR(30), APELLIDO VARCHAR(30), CARRERA VARCHAR(75))", []);
      console.log("HSC: Tabla usuario creada OK");
    } catch (error) {
      console.error("Error al crear tabla USUARIO:", error);
    }
  }
  
  async crearTablaSesion() {
    try {
      await this.abrirDB();
      await this.db?.executeSql("CREATE TABLE IF NOT EXISTS SESION (MAIL VARCHAR(75))", []);
      console.log("HSC: Tabla sesion creada OK");
    } catch (error) {
      console.error("Error al crear tabla SESION:", error);
    }
  }
  
      

  // Método para almacenar un nuevo usuario en la base de datos
  async usuarioAlmacenar(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    await this.abrirDB();
    await this.db?.executeSql("INSERT INTO USUARIO VALUES(?, ?, ?, ?, ?)", [correo, contrasena, nombre, apellido, carrera]);
    console.log("HSC: Usuario almacenado OK");
  }
 
    // Método para obtener la cantidad de usuarios registrados
    async obtenerCantidadUsuarios() {
      await this.abrirDB();
      let respuesta = await this.db?.executeSql("SELECT COUNT(MAIL) AS CANTIDAD FROM USUARIO", []);
      console.log("HSC: " + JSON.stringify(respuesta.rows.item(0).CANTIDAD));
      return JSON.stringify(respuesta.rows.item(0).CANTIDAD); // Retorna la cantidad de usuarios como string
    }



  // Método para autenticar el login de un usuario
  async login(correo: string, contrasena: string) {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT COUNT(MAIL) AS CANTIDAD FROM USUARIO WHERE MAIL = ? AND PASS = ?", [correo, contrasena]);
    return JSON.stringify(respuesta.rows.item(0).CANTIDAD); // Retorna si existe o no el usuario
  }

  // Método para obtener la cantidad de sesiones activas
  async obtenerCantidadSesion() {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT COUNT(MAIL) AS CANTIDAD FROM SESION", []);
    return JSON.stringify(respuesta.rows.item(0).CANTIDAD); // Retorna la cantidad de sesiones activas
  }

  // Método para almacenar un correo en la tabla de sesión
  async sesionAlmacenar(correo: string) {
    try {
        await this.abrirDB();
        await this.db?.executeSql("INSERT INTO SESION VALUES(?)", [correo]);
        console.log("HSC: Correo almacenado en la base de datos de sesión:", correo);
    } catch (error) {
        console.log("HSC: Error al almacenar el correo en la sesión:", error);
    }
}

      
  // Método para obtener el correo del usuario logueado desde la tabla de sesión
  async obtenerCorreoLogueado() {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT MAIL FROM SESION", []);
    if (respuesta.rows.length > 0) {
        const mail = respuesta.rows.item(0).MAIL;
        console.log("HSC: Correo de sesión encontrado en Principal:", mail);
        return mail;
    } else {
        console.log("HSC: No se encontró ninguna sesión activa.");
        throw new Error("HSC: Sesión no encontrada");
    }
}




  // Método para obtener los datos (nombre y apellido) del usuario logueado
  async obtenerUsuarioLogueado(correo: string) {
    await this.abrirDB();
    let respuesta = await this.db?.executeSql("SELECT NOMBRE, APELLIDO, CARRERA FROM USUARIO WHERE MAIL = ?", [correo]);

    let objeto: any = {};
    objeto.nombre = respuesta.rows.item(0).NOMBRE;
    objeto.apellido = respuesta.rows.item(0).APELLIDO;
    objeto.carrera = respuesta.rows.item(0).CARRERA;

    return objeto; // Retorna un objeto con los datos del usuario
  }



    

  async cerrarSesion() {
  await this.abrirDB();
  await this.db?.executeSql("DELETE FROM SESION", []);
  console.log("HSC: Sesión cerrada");
}

async actualizarCarrera(correo: string, nuevaCarrera: string) {
  await this.abrirDB();
  await this.db?.executeSql("UPDATE USUARIO SET CARRERA = ? WHERE MAIL = ?", [nuevaCarrera, correo]);
  console.log("HSC: Carrera actualizada en la base de datos local");
}




}
