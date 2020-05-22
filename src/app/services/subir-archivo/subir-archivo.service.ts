import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor(public http:HttpClient) { }

  //Subir archivo con Vanilla
  subirArchivo(archivo:File,tipo:string,id:string){

    return new Promise((resolve,reject) => {

      let formData = new FormData();
      let xhr = new XMLHttpRequest();

      formData.append('imagen',archivo,archivo.name);

      xhr.onreadystatechange = function(){

        if(xhr.readyState === 4){
          if(xhr.status === 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }
        }
      };

      let url = `${URL_SERVICIOS}/upload/${tipo}/${id}`;


      
      xhr.open('PUT', url, true);
     // xhr.setRequestHeader("enctype", "multipart/form-data");

     
      xhr.send(formData);

    });

    
  }


  //Subir archivo con Angular  
  //https://www.ahmedbouchefra.com/angular/angular-9-8-tutorial-example-upload-files-with-formdata-httpclient-rxjs-and-material-progressbar/
  public upload(archivo:File,tipo:string,id:string) {
    
    let formData = new FormData();
    formData.append('imagen',archivo);

    let url = `${URL_SERVICIOS}/upload/${tipo}/${id}`;

    return this.http.put(url, formData);

  }
}
