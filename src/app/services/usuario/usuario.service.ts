import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario:Usuario;
  token:string;
  menu:any[] = [];

  constructor(
    public http: HttpClient,
    public router:Router,
    public _subirArchivoService:SubirArchivoService
    ) {
      this.cargarStorage();

    }

  cargarStorage(){

    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    }else{
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  guardarStorage(id:string,token:string,usuario:Usuario,menu:any){
    localStorage.setItem('id',id);
    localStorage.setItem('token',token);
    localStorage.setItem('usuario',JSON.stringify(usuario));
    localStorage.setItem('menu',JSON.stringify(menu));

    this.cargarStorage();
  }

  logOut(){

    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);

  }

   loginGoogle(token:string){

    let url = `${URL_SERVICIOS}/login/google`;
    return this.http.post(url,{token:token}).pipe(
      map((resp:any)=>{
        
        this.guardarStorage(resp.id,resp.token,resp.usuario,resp.menu);
       
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
        this.guardarStorage(resp.id,resp.token,resp.usuario,resp.menu);
        return true;
      }
    ),
    catchError(err=>{
      Swal.fire({
        title: 'Error en el login:',
        text: err.error.mensaje,
        icon: 'error'});

      return Observable.throw(err);})
      );

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

        if(usuario._id === this.usuario._id){
          let usuarioResp:Usuario = resp.usuario;
          this.guardarStorage(usuarioResp._id,this.token,usuarioResp,this.menu);
        }  

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

   cargarUsuarios(desde:number){

    let url=`${URL_SERVICIOS}/usuario?desde=${desde}`;

    return this.http.get(url);

   }

   buscarUsuario(termino:string){

    let url=`${URL_SERVICIOS}/busqueda/coleccion/usuario/${termino}`;
    
    return this.http.get(url);   

   }

   borrarUsuario(id:string){

    let url=`${URL_SERVICIOS}/usuario/${id}`;
    url +=`?token=${this.token}`;

    return this.http.delete(url).pipe(
      map(resp=>{
        Swal.fire(
          'Borrado!',
          'El registro de ha borrado.',
          'success'
        )
        return true;
      }    
      )
    );

   }

  

}
