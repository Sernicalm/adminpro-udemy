import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital:Hospital;
  token:string;

  constructor(
    public http: HttpClient,
    public router:Router,
    public _subirArchivoService:SubirArchivoService,
    public _usuarioService:UsuarioService
    ) {
      
      this.token = this._usuarioService.token;

    }

   crearHospital(nombreHospital:string){

     let url=`${URL_SERVICIOS}/hospital`;
     url +=`?token=${this.token}`;
     
     return this.http.post(url,{nombre:nombreHospital}).pipe(
      map(resp=>{
        Swal.fire({
          title: 'Hospital creado:',
          text: nombreHospital,
          icon: 'success'});
          return resp;
      }
     ));

   }

   actualizarHospital(hospital:Hospital){
    
    let url=`${URL_SERVICIOS}/hospital/${hospital._id}`;
    url +=`?token=${this.token}`;

    return this.http.put(url,hospital).pipe(
      map((resp:any)=>{

        Swal.fire({
          title: 'Hospital actualizado:',
          text: hospital.nombre,
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

    this._subirArchivoService.upload(archivo,"hospital",id).subscribe((resp:any)=>{

      this.hospital.img = resp.hospital.img;

      Swal.fire({
        title: 'Imagen actualizada:',
        text: this.hospital.nombre,
        icon: 'success'});

        return true;

    },err=>{

    });
   }

   cargarHospitales(desde?:number){

    let url=`${URL_SERVICIOS}/hospital?desde=${desde}`;
      return this.http.get(url);

   }

   buscarHospital(termino:string){

    let url=`${URL_SERVICIOS}/busqueda/coleccion/hospital/${termino}`;
    
    return this.http.get(url);   

   }

   borrarHospital(id:string){

    let url=`${URL_SERVICIOS}/hospital/${id}`;
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

   obtenerHospital(	id:	string	){
     let url=`${URL_SERVICIOS}/hospital/${id}`;

     return this.http.get(url);
     
   }

  
}
