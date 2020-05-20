import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario:Usuario;

  imagenSubir:File;

  imagenTmp:string;

  constructor(
    public _usuarioService:UsuarioService
  ) { 
    this.usuario = this._usuarioService.usuario;
  }

  ngOnInit(): void {
  }

  guardar(forma:NgForm){

    this.usuario.nombre = forma.value.nombre;
    if(!this.usuario.google){
      this.usuario.email = forma.value.email;
    }
    
    this._usuarioService.actualizarUsuario(this.usuario).subscribe();
 
  }

  seleccionImagen(evento){

    

    if(!evento.target.files[0]){
      this.imagenSubir = null;
      return;
    }

    let archivo =  evento.target.files[0];

    if(archivo.type.indexOf('image') < 0){
      Swal.fire({
        title: 'Solo imagenes:',
        text: 'El archivo seleccionado no es una imagen!!',
        icon: 'warning'});
        this.imagenSubir = null;
        return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTmp = reader.readAsDataURL(archivo);
  
    reader.onloadend = () =>{
      this.imagenTmp = reader.result as string;
    } 
    
  }

  cambiarImagen(){
    this._usuarioService.cambiarImagen(this.imagenSubir,this.usuario._id);
  }

}
