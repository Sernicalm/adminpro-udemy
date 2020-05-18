import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UsuarioService } from '../services/service.index';

import Swal from 'sweetalert2'
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';



declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma:FormGroup;

  constructor(
    public _usuarioService:UsuarioService,
    public _router:Router
  ) { }

  ngOnInit(): void {
    init_plugins();

    this.forma=new FormGroup({
      nombre:new FormControl(null,Validators.required),
      email:new FormControl(null,[Validators.required,Validators.email]),
      password:new FormControl(null,Validators.required),
      password2:new FormControl(null,Validators.required),
      condiciones:new FormControl(false)
    },{
      validators: this.sonIguales
    });
  }

  sonIguales(group:FormGroup){
    let pass1 = group.controls['password'];
    let pass2 = group.controls['password2'];

    if (pass1.value === pass2.value){
      return null;
    }  
    return {
      noSonIguales:true
    };  
  }

  registrarUsuario(){

    if(this.forma.invalid){
      return;
    }

    if(!this.forma.value.condiciones){
      Swal.fire({
        title: 'Importante:',
        text: "Debe aceptar las condiciones!",
        icon: 'warning'
      });
      return;
    }
    

    let usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.email,
      this.forma.value.password);

      this._usuarioService.crearUsuario(usuario).subscribe(resp=>{

        console.log(resp);
        this._router.navigate(['/login']);

      });

    console.log(this.forma.value);

  }

}
