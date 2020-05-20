import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  token:string;

  constructor(
    public http: HttpClient,
    public router:Router,
    public _subirArchivoService:SubirArchivoService
    ) {
      this.cargarStorage();
      console.log('Servicio usuario listo');
    }

  cargarStorage(){

    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario =JSON.parse(localStorage.getItem('usuario'));
    }else{
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage(id:string,token:string,usuario:Usuario){
    localStorage.setItem('id',id);
    localStorage.setItem('token',token);
    localStorage.setItem('usuario',JSON.stringify(usuario));

    this.cargarStorage();
  }

  logOut(){

    this.usuario = null;
    this.token = '';
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);

  }

   loginGoogle(token:string){

    let url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url,{token:token}).pipe(
      map((resp:any)=>{
        
        this.guardarStorage(resp.id,resp.token,resp.usuario);
       
        return true;
      })
    );

   }

  login(usuario:Usuario, recordar:boolean=false){


    if(recordar){
      localStorage.setItem('email',usuario.email);
    }else{
      localStorage.removeItem('email');
    }

    let url=`${URL_SERVICIOS}/login`;

    return this.http.post(url,usuario).pipe(
      map((resp:any)=>{
       
        this.guardarStorage(resp.id,resp.token,resp.usuario);
       
        return true;
      }
    ));
  }

   crearUsuario(usuario:Usuario){

     let url=`${URL_SERVICIOS}/usuario`;
     
     return this.http.post(url,usuario).pipe(
      map(resp=>{
        Swal.fire({
          title: 'Usuario creado:',
          text: usuario.email,
          icon: 'success'});
      }
     ));

   }

   actualizarUsuario(usuario:Usuario){
    
    let url=`${URL_SERVICIOS}/usuario/${usuario._id}`;
    url +=`?token=${this.token}`;

    return this.http.put(url,usuario).pipe(
      map((resp:any)=>{

        let usuarioResp:Usuario = resp.usuario;
        this.guardarStorage(usuarioResp._id,this.token,usuarioResp);

        Swal.fire({
          title: 'Usuario actualizado:',
          text: usuario.email,
          icon: 'success'});

          return true;
      })
    );
   }

   estaLogueado(){
     return (this.token.length > 5) ? true : false;
   }

   cambiarImagen(archivo:File, id:string){

    // this._subirArchivoService.subirArchivo(archivo,"usuario",id)
    //     .then(resp=>{
    //       console.log(resp);
    //     }).catch(resp=>{
    //       console.log("fallo:" + resp);
    //     });

    this._subirArchivoService.upload(archivo,"usuario",id).subscribe((resp:any)=>{

      this.usuario.img = resp.usuario.img;

      Swal.fire({
        title: 'Imagen actualizada:',
        text: this.usuario.email,
        icon: 'success'});

        return true;

    },err=>{

    });
   }

}
