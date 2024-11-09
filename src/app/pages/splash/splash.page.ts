import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from 'src/app/services/db.service';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router, private db: DbService) { }

  async ngOnInit() {
    console.log("HSC: Splash iniciado");
  
    try {
      await this.db.crearTablaUsuario();
      await this.db.crearTablaSesion();
      console.log("HSC: Tablas creadas");
  
      setTimeout(async () => {
        try {
          let cantidadSesion = await this.db.obtenerCantidadSesion();
          console.log("HSC: Cantidad de sesiones:", cantidadSesion);
  
          if (cantidadSesion == "0") {
            console.log("HSC: No hay sesiones activas, redirigiendo a login");
            this.router.navigate(['login']);
          } else {
            console.log("HSC: Sesión activa encontrada, redirigiendo a principal");
            this.router.navigate(['principal']);
          }
        } catch (error) {
          console.error("Error al obtener la cantidad de sesiones:", error);
        }
      }, 2000);
    } catch (error) {
      console.error("Error en la inicialización del splash:", error);
    }
  }
  

}
