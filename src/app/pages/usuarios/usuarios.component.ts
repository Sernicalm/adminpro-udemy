import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios:Usuario[] = [];
  desde:number = 0;
  totalRegistros:number = 0;
  cargando:boolean=true;
  termino:string='';

  constructor(
    public _usuarioService:UsuarioService,
    public _modalUploadService:ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this._modalUploadService.notificacion.subscribe(resp=>{
      this.cargarUsuarios();
    })
  }

  cargarUsuarios(){
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde).subscribe((resp:any)=>{
     
      this.totalRegistros = resp.total;
      this.usuarios = resp.usuarios

      this.cargando = false;
    })
  }

  cargarDesde(valor:number){

    let desde = this.desde + valor;

    if(desde>=this.totalRegistros){
      return;
    }

    if(desde<0){
      return;
    }

    this.desde +=valor;
    this.cargarUsuarios();
  }

  buscarUsuario(termino:string){

    this.termino = termino;

    if(termino === ''){
      this.desde = 0;
      this.cargarUsuarios();
    }else{
      this.cargando = true;
      this._usuarioService.buscarUsuario(this.termino).subscribe((resp:any)=>{
        console.log(resp);
        this.usuarios = resp.usuario;
        this.cargando = false;
      });
    }
   
  }

  borrarUsuario(usuario:Usuario){

    if(usuario._id === this._usuarioService.usuario._id){
      Swal.fire({
        title: 'No se puede borrar el usuario:',
        text: 'No se puede borrar asi mismo',
        icon: 'warning'});
        return;
    }

    Swal.fire({
      title: 'Esta seguro?',
      text: "Esta a punto de borrar a " + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        this._usuarioService.borrarUsuario(usuario._id).subscribe(resp=>{
          this.cargarUsuarios()
        });

       
      }
    })

    console.log(usuario);
  }

  guardarUsuario(usuario:Usuario){

    this._usuarioService.actualizarUsuario(usuario).subscribe();

  }

  mostrarModal(usuario:Usuario){

    this._modalUploadService.mostrarModal('usuario',usuario._id);

  }

}
