import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage implements OnInit {
  
  correo: string = '';
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';

  sedes: any[] = []; // Para almacenar la lista de sedes
   
 
  constructor(private api: ApiService,private router: Router, private db: DbService,private http: HttpClient) { }

  async ngOnInit() {
    console.log("ngOnInit iniciado");
    try {
        this.correo = await this.db.obtenerCorreoLogueado();
        console.log("Correo obtenido:", this.correo);

        let objeto = await this.db.obtenerUsuarioLogueado(this.correo);
        console.log("HSC: Datos del usuario obtenidos:", objeto);

        this.nombre = objeto.nombre;
        this.apellido = objeto.apellido;
        this.carrera = objeto.carrera;
        console.log("HSC: Nombre y apellido asignados:", this.nombre, this.apellido);

        await this.mostrarSedes();
    } catch (error) {
        console.error("HSC: Error en ngOnInit:", error);
    }
}

  
   
  async mostrarSedes() {
    try {
      const response: any = await this.api.obtenerSedes().toPromise();
      // La respuesta puede venir en el primer índice del array, por lo tanto accedemos a él
      this.sedes = response[0];
    } catch (error) {
      console.error("HSC: Error al obtener las sedes", error);
    }
  }
  
  

  navegarModificarUsuario(){
    this.router.navigate(["modificar-usuario"]);
  }

  async salir(){
    await this.db.cerrarSesion();
    this.router.navigate(["login"]);
  }
}
