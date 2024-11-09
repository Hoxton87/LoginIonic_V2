import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';



@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  mdl_correo: string = '';
  mdl_contrasena: string = '';
  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_carrera: string = '';

  constructor(private db: DbService, private router: Router,private api: ApiService,private toastController: ToastController) { }
  

  ngOnInit() {
    console.log();
  }


  async crearUsuario() {
    try {
        let datos = this.api.crearUsuario(
            this.mdl_correo, 
            this.mdl_contrasena,
            this.mdl_nombre,
            this.mdl_apellido,
            this.mdl_carrera
        );

        let respuesta = await lastValueFrom(datos);
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);

        if (json.status === 'success') {
          // Mostrar mensaje de éxito de la API en el toast
          this.mostrarToast(json.message);  // Mensaje de la API
          await this.almacenarUsuario();
          this.limpiarFormulario(); // Limpiar los campos del formulario
          
        } else if (json.status === 'error') {
          // Mostrar mensaje de error de la API en el toast
          this.mostrarToast(json.message);
        }
    }catch (error) {
      this.mostrarToast("Error en la conexión o en el servidor");
      console.log("Error en la conexión o en el servidor:", error);
    }
  }

async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
        message: mensaje,
        duration: 3000,
        position: 'top'
    });
    toast.present();
}


async almacenarUsuario() {
  // Almacena los datos del usuario en la base de datos
  await this.db.usuarioAlmacenar(this.mdl_correo, this.mdl_contrasena, this.mdl_nombre, this.mdl_apellido, this.mdl_carrera);
  // Redirige al usuario a la página de inicio de sesión
  this.router.navigate(['login']);
}
  
  retroceder() {
    this.router.navigate(['login']);
  }

  limpiarFormulario() {
    this.mdl_correo = '';
    this.mdl_contrasena = '';
    this.mdl_nombre = '';
    this.mdl_apellido = '';
    this.mdl_carrera = '';
  }


}
