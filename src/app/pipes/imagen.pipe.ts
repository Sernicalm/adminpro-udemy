import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICIOS } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen:string, tipo:string='usuario'): unknown {

    if(!imagen){
      imagen = '';
    }
    if(imagen.indexOf('http') >= 0){
      return imagen;
    }else{

      let url = `${URL_SERVICIOS}/img`;

      if(!imagen){

        return `${url}/usuario/xxx`;

      }else{

        switch (tipo){
          case 'usuario':
            url += `/usuario/${imagen}`;
          break;
          case 'medico':
            url += `/medico/${imagen}`;
          break;
          case 'hospital':
            url += `/hospital/${imagen}`;
          break;
        }
        return url;

      } 
    }
  }

}
