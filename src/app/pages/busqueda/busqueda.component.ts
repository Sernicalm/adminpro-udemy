import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { AbstractWebDriver } from 'protractor/built/browser';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios:Usuario[] = [];
  hospitales:Hospital[] = [];
  medicos:Medico[] = [];
  
  constructor(
    public activatedRoute:ActivatedRoute,
    public http:HttpClient
  ) {
    this.activatedRoute.params.subscribe((params:any)=>{

      let termino = params.termino;
      this.buscar(termino);

    });
   }

  ngOnInit(): void {
  }

  buscar(termino:string){

    let url =`${URL_SERVICIOS}/busqueda/todo/${termino}`;

    this.http.get(url).subscribe((resp:any)=>{

      this.usuarios = resp.usuarios;
      this.hospitales = resp.hospitales;
      this.medicos = resp.medicos;
     
    });
  }

   

}
