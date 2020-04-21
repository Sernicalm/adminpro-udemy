import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtProgress') txtProgress:ElementRef;

  @Input() leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
  cambiarValor(valor:number){
    if( this.progreso + valor>100){
      this.progreso = 100;
    }else if(this.progreso + valor<0){     
      this.progreso = 0;
    }else{
      this.progreso = this.progreso + valor;
    }
    this.cambioValor.emit(this.progreso);
    this.txtProgress.nativeElement.focus();
  }

  onChanges(valor:number){

    //let elementHTML:any = document.getElementsByName("txtProgreso")[0];


    if(valor>100){
      valor = 100;
    }
    if(valor<0){
      valor = 0
    }

    this.progreso = valor;

    //elementHTML.value = Number(this.progreso);

    this.txtProgress.nativeElement.value = this.progreso;

    this.cambioValor.emit(this.progreso);

  }
}
