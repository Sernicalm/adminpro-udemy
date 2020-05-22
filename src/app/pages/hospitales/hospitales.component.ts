import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { HospitalService } from '../../services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales:Hospital[] = [];
  desde:number = 0;
  totalRegistros:number = 0;
  cargando:boolean=true;
  termino:string='';

  constructor(
    public _hospitalService:HospitalService,
    public _modalUploadService:ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe(resp=>{
      this.cargarHospitales();
    })
  }

  cargarHospitales(){
    this.cargando = true;
    this._hospitalService.cargarHospitales(this.desde).subscribe((resp:any)=>{
     
      this.totalRegistros = resp.total;
      this.hospitales = resp.hospitales;

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
    this.cargarHospitales();
  }

  buscarHospital(termino:string){

    this.termino = termino;

    if(termino === ''){
      this.desde = 0;
      this.cargarHospitales();
    }else{
      this.cargando = true;
      this._hospitalService.buscarHospital(this.termino).subscribe((resp:any)=>{
        this.hospitales = resp.hospital;
        this.cargando = false;
      });
    }
   
  }

  borrarHospital(hospital:Hospital){

    Swal.fire({
      title: 'Esta seguro?',
      text: "Esta a punto de borrar " + hospital.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        this._hospitalService.borrarHospital(hospital._id).subscribe(resp=>{
          this.cargarHospitales()
        });

       
      }
    })

  }

  guardarHospital(hospital:Hospital){

    this._hospitalService.actualizarHospital(hospital).subscribe();

  }

  mostrarModal(hospital:Hospital){

    this._modalUploadService.mostrarModal('hospital',hospital._id);

  }

  nuevoHospital(){
    Swal.fire({
      title: 'Crear hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      showLoaderOnConfirm: true,
      preConfirm: (nombreHospital) => {

        if(nombreHospital.length > 0){
          return nombreHospital;
        }else{
          Swal.showValidationMessage(
              `Error: El nombre no puede quedar en blanco.`
          )
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {

      this._hospitalService.crearHospital(result.value).subscribe(resp=>{
        this.cargarHospitales();
      })

    })
  }

}