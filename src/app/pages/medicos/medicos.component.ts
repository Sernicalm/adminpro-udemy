import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos:Medico[] = [];
  desde:number = 0;
  totalRegistros:number = 0;
  cargando:boolean=true;
  termino:string='';

  constructor(
    public _medicoService:MedicoService,
    public _modalUploadService:ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this._modalUploadService.notificacion.subscribe(resp=>{
      this.cargarMedicos();
    })
  }

  cargarMedicos(){
    this.cargando = true;
     this._medicoService.cargarMedicos(this.desde).subscribe((resp:any)=>{
      this.totalRegistros = resp.total;
      this.medicos = resp.medicos;

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
    this.cargarMedicos();
  }

  buscarMedico(termino:string){

    this.termino = termino;

    if(termino === ''){
      this.desde = 0;
      this.cargarMedicos();
    }else{
      this.cargando = true;
      this._medicoService.buscarMedico(this.termino).subscribe((resp:any)=>{
        this.medicos = resp.medico;
        this.cargando = false;
      });
    }
   
  }

  borrarMedico(medico:Medico){

    Swal.fire({
      title: 'Esta seguro?',
      text: "Esta a punto de borrar " + medico.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        this._medicoService.borrarMedico(medico._id).subscribe(resp=>{
          this.cargarMedicos()
        });

       
      }
    })

  }

  // guardarMedico(medico:Medico){

  //   this._medicoService.actualizarMedico(medico).subscribe();

  // }

  editarMedico(medico:Medico){

  }

  mostrarModal(medico:Medico){

    this._modalUploadService.mostrarModal('medico',medico._id);

  }

  nuevoMedico(){
    Swal.fire({
      title: 'Crear medico',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      preConfirm: (nombreMedico) => {

        if(nombreMedico.length > 0){
          return nombreMedico;
        }else{
          Swal.showValidationMessage(
              `Error: El nombre no puede quedar en blanco.`
          )
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {

      this._medicoService.crearMedico(result.value).subscribe(resp=>{
        this.cargarMedicos();
      })

    })
  }

}
