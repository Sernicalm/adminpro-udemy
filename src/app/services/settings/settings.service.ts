import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl:"assets/css/colors/default.css",
    tema:"default"
  };

  constructor(@Inject(DOCUMENT) private _document) { }

  guardarAjustes(){
    localStorage.setItem('Ajustes',JSON.stringify(this.ajustes));
  }
  cargarAjustes(){
    if(localStorage.getItem('Ajustes')){
      this.ajustes =JSON.parse( localStorage.getItem('Ajustes'));
      this.aplicarTema(this.ajustes.tema);
    }else{

    }
  }

  aplicarTema(color:string){
    let url = `assets/css/colors/${color}.css`;
    this._document.getElementById('tema').setAttribute('href',url)

    this.ajustes.temaUrl = url;
    this.ajustes.tema = color;
    this.guardarAjustes();
  }

}

interface Ajustes{
  temaUrl:string;
  tema:string;
};
