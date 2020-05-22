import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService } from '../../services/service.index';
import { HospitalService } from '../../services/service.index';
import { Medico } from '../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales:Hospital[] = [];
  medico:Medico = new Medico('','','','','');
  hospital:Hospital = new Hospital('');

  constructor(
    public _medicoService:MedicoService,
    public _hospitalService:HospitalService,
    public router:Router,
    public activatedRouted:ActivatedRoute,
    public _modalUploadService:ModalUploadService
  ) { 
    activatedRouted.params.subscribe(pars=>{
      let id = pars['id'];
      if(id !== 'nuevo'){
        this.obtenerMedico(id);
      }

    });
  }

  ngOnInit(): void {
    this._hospitalService.cargarHospitales(-1).subscribe((resp:any)=>{
      this.hospitales = resp.hospitales;
    });
    this._modalUploadService.notificacion.subscribe(resp=>{
      this.medico.img = resp.medico.img;
    });
  }

  guardarMedico(forma:NgForm){

    if(forma.invalid){
      return;
    }

   
    this._medicoService.guardarMedico(this.medico).subscribe((resp:any)=>{
      this.medico._id = resp._id
      this.router.navigate(['/medico',this.medico._id]);
    });
  }

  cambioHospital(id:string){
  
    this._hospitalService.obtenerHospital(id).subscribe((resp:any)=>{
      this.hospital = resp.hospital;
    });
  }

  obtenerMedico(id:string){
    this._medicoService.obtenerMedico(id).subscribe((resp:any)=>{
      this.medico = resp.medico;
      this.medico.hospital = resp.medico.hospital._id;
      this.cambioHospital(this.medico.hospital);
    });
  }

  cambiarFoto(){
    this._modalUploadService.mostrarModal('medico',this.medico._id);
  }

}
