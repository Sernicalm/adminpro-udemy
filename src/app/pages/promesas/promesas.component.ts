import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() { 

    let promesa = new Promise((res,rej)=>{

      let contador = 0;
      
      let intervalo = setInterval(()=>{
        contador += 1;
        console.log(contador);
        if(contador === 3){
          res('OK!');
          clearInterval(intervalo);
        }
      },1000);

    });

    promesa.then(res =>{
      console.log(res);
    }).catch(error=>{
      console.log(error);
    })

  }

  ngOnInit(): void {
  }

}
