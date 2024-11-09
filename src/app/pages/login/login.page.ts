import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  mdl_correo: string = '';
  mdl_contrasena: string = '';
  mdl_nombre: string = '';
  mdl_apellido: string = '';
  mdl_carrera: string = '';

  constructor(private db: DbService,private router: Router,private api: ApiService,private toastController: ToastController) { }

  ngOnInit() {}

  limpiarFormulario() {
    this.mdl_correo = '';
    this.mdl_contrasena = '';
  }

  
  // Método para redirigir al usuario a la página de registro
  navegarRegistro() {
    this.router.navigate(['registro']);
  }
  

  async loginUsuario() {
    try {
      // Realiza la llamada a la API con los datos de login
      let datos = this.api.loginUsuario(this.mdl_correo, this.mdl_contrasena);
      let respuesta = await lastValueFrom(datos);
      let json_texto = JSON.stringify(respuesta);
      let json = JSON.parse(json_texto);
  
      if (json.status === 'success') {
        const { correo, contrasena, nombre, apellido, carrera } = json.usuario;
        console.log("HSC: Datos del usuario recibidos en login:", json.usuario);
    
        // Intentar almacenar el usuario
        await this.db.usuarioAlmacenar(correo, contrasena, nombre, apellido, carrera);
    
        // Verificar si se almacenó correctamente
        const usuarioGuardado = await this.db.obtenerUsuarioLogueado(correo);
        if (usuarioGuardado) {
            console.log("HSC: Usuario guardado en la base de datos:", usuarioGuardado);
            console.log("HSC: Datos del usuario recibidos en login:", JSON.stringify(json.usuario));

        } else {
            console.log("HSC: Falló el almacenamiento del usuario en USUARIO");
        }
    
        await this.db.sesionAlmacenar(correo);
        console.log("HSC: Correo almacenado en SESION:", correo);
    
        this.router.navigate(['principal']);
        this.limpiarFormulario();
    }
    
    
      else if (json.status === 'error') {
        // Mostrar mensaje de error de la API en el toast
        this.mostrarToast(json.message);
      }
    } catch (error) {
      this.mostrarToast("HSC: Error en la conexión o en el servidor");
      console.log("HSC: Error en la conexión o en el servidor:", error);
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


}


        


