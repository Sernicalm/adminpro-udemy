import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader:ElementRef;
  
  imagenSubir:File;

  imagenTmp:string;

  constructor(
    public _subirArchivoService:SubirArchivoService,
    public _modalUploadService:ModalUploadService
  ) { }

  ngOnInit(): void {
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

  cerrarModal(){
    this.imagenSubir = null;
    this.imagenTmp = null;
    
    this.fileUploader.nativeElement.value = null;

    this._modalUploadService.ocultarModal();
    
  }

  subirImagen(){

    this._subirArchivoService.subirArchivo(this.imagenSubir,this._modalUploadService.tipo,this._modalUploadService.id)
        .then(resp=>{


          this._modalUploadService.notificacion.emit(resp);
          this.cerrarModal();
              
        }).catch(err=>{
          
        });
  }

}
