import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ruta: string = 'https://www.s2-studio.cl';

  constructor(private http: HttpClient) { }

  crearUsuario(correo: string, contrasena: string, nombre: string, apellido: string, carrera: string) {
    let objeto: any = {};
    objeto.correo = correo;
    objeto.contrasena = contrasena;
    objeto.nombre = nombre;
    objeto.apellido = apellido;
    objeto.carrera = carrera;

    return this.http.post(this.ruta + '/api_duoc/usuario/usuario_almacenar', objeto).pipe()
  
  }
 
  loginUsuario(correo: string, contrasena: string) {
    let objeto: any = {
      correo: correo,
      contrasena: contrasena
    };

    return this.http.post(this.ruta + '/api_duoc/usuario/usuario_login', objeto).pipe();
  }

  modificarUsuario(correo: string, contrasena: string, carrera: string) {
    let objeto: any = {};
    objeto.correo = correo;
    objeto.contrasena = contrasena;
    objeto.carrera = carrera;

    return this.http.patch(this.ruta + '/api_duoc/usuario/usuario_modificar', objeto).pipe()
  
  }

  obtenerSedes() {
    return this.http.get(this.ruta + '/api_duoc/usuario/sedes_obtener').pipe();
  }
  


}
 