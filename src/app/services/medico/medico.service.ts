import { Injectable } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubirArchivoService} from '../subir-archivo/subir-archivo.service';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  medico:Medico;
  token:string;

  constructor(
    public http: HttpClient,
    public router:Router,
    public _subirArchivoService:SubirArchivoService,
    public _usuarioService:UsuarioService
  ) { 
    this.token = this._usuarioService.token;
  }

  crearMedico(nombreMedico:string){

    let url=`${URL_SERVICIOS}/medico`;
    url +=`?token=${this.token}`;
    
    return this.http.post(url,{nombre:nombreMedico}).pipe(
     map(resp=>{
       Swal.fire({
         title: 'Medico creado:',
         text: nombreMedico,
         icon: 'success'});
         return resp;
     }
    ));
  }

  actualizarMedico(medico:Medico){
    
    let url=`${URL_SERVICIOS}/medico/${medico._id}`;
    url +=`?token=${this.token}`;

    return this.http.put(url,medico).pipe(
      map((resp:any)=>{

        Swal.fire({
          title: 'Medico actualizado:',
          text: medico.nombre,
          icon: 'success'});

          return true;
      })
    );
   }

   cambiarImagen(archivo:File, id:string){

    // this._subirArchivoService.subirArchivo(archivo,"usuario",id)
    //     .then(resp=>{
    //       console.log(resp);
    //     }).catch(resp=>{
    //       console.log("fallo:" + resp);
    //     });

    this._subirArchivoService.upload(archivo,"medico",id).subscribe((resp:any)=>{

      this.medico.img = resp.medico.img;

      Swal.fire({
        title: 'Imagen actualizada:',
        text: this.medico.nombre,
        icon: 'success'});

        return true;

    },err=>{

    });
   }

   cargarMedicos(desde:number){

    let url=`${URL_SERVICIOS}/medico?desde=${desde}`;

    return this.http.get(url);

   }

   buscarMedico(termino:string){

    let url=`${URL_SERVICIOS}/busqueda/coleccion/medico/${termino}`;
    
    return this.http.get(url);   

   }

   borrarMedico(id:string){

    let url=`${URL_SERVICIOS}/medico/${id}`;
    url +=`?token=${this.token}`;

    return this.http.delete(url).pipe(
      map(resp=>{
        Swal.fire(
          'Borrado!',
          'El registro se ha borrado.',
          'success'
        )
        return true;
      }    
      )
    );

   }

   obtenerMedico(	id:	string	){
     let url=`${URL_SERVICIOS}/medico/${id}`;

     return this.http.get(url);
     
   }

   guardarMedico(medico:Medico){
    let url=`${URL_SERVICIOS}/medico`;

    if(medico._id){
    //Actualizar
      url +=`/${medico._id}?token=${this.token}`;
      return this.http.put(url,medico).pipe(
        map((resp:any)=>{
          Swal.fire(
            'Medico:',
            'Medico actualizado',
            'success'
          )
          return resp.medico;
        })
      );

    }else{
    //Crear
      url +=`?token=${this.token}`;
      return this.http.post(url,medico).pipe(
        map((resp:any)=>{
          Swal.fire(
            'Medico:',
            'Medico creado',
            'success'
          )
          return resp.medico;
      })
      );
    }
    

    
   }
}
