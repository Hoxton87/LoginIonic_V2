
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DbService } from 'src/app/services/db.service'; // Asegúrate de tener este servicio inyectado
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.page.html',
  styleUrls: ['./modificar-usuario.page.scss'],
})
export class ModificarUsuarioPage implements OnInit {

  mdl_correo: string = ''; // El correo se mantendrá para uso interno
  mdl_contrasena: string = '';
  mdl_carrera: string = '';
  nombre_usuario: string = ''; // Para mostrar el nombre del usuario
  carrera_actual: string = ''; // Para mostrar ella carrera actual

  constructor(
    private router: Router,
    private api: ApiService,
    private db: DbService,  // Inyectamos el servicio de base de datos
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    // Obtener el correo del usuario logueado desde la base de datos SQLite
    const correoLogueado = await this.db.obtenerCorreoLogueado();
    this.mdl_correo = correoLogueado;

    // Obtener los datos del usuario logueado
    const usuario = await this.db.obtenerUsuarioLogueado(this.mdl_correo);

    this.carrera_actual = usuario.carrera;
  }

  async modificarUsuario() {
    try {
        // Llamada a la API para modificar el usuario con carrera y contraseña
        let datos = this.api.modificarUsuario(
            this.mdl_correo, 
            this.mdl_contrasena,
            this.mdl_carrera
        );
    
        let respuesta = await lastValueFrom(datos);
        let json_texto = JSON.stringify(respuesta);
        let json = JSON.parse(json_texto);
    
        if (json.status === 'success') {
            // Actualizamos carrera_actual con el nuevo valor y también en la base de datos local
            this.carrera_actual = this.mdl_carrera;
            await this.db.actualizarCarrera(this.mdl_correo, this.mdl_carrera); // Actualiza la carrera en SQLite
            this.mostrarToast(json.message);  // Mensaje de éxito
            this.router.navigate(['principal']);
            this.limpiarFormulario(); // Limpiar los campos del formulario
        } else if (json.status === 'error') {
            this.mostrarToast(json.message);  // Mostrar el error de la API
        }
    } catch (error) {
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
 
  retroceder() {
    this.router.navigate(['principal']);
  }

  limpiarFormulario() {
    this.mdl_contrasena = '';
    this.mdl_carrera = '';
  }
}
