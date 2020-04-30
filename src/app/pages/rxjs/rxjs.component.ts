import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscripcion : Subscription;

  constructor() {  

    // this.regresaObservable().pipe(
    //  // retry()  //Vuelve a intentar a ejecutar el subscribe indefinidamente mientras de error
    //   retry(2)  //Vuelve a intentar a ejecutar el subscribe 2 intentos mas mientras de error, si no, termina
    // ).subscribe(numero=>{
    //   console.log(numero);  //Next
    // },error =>{
    //   console.error(error);   //Error
    // },
    // ()=>{
    //   console.log("El observador termino!!") //complete
    // });


    this.subscripcion = this.regresaObservable2().pipe(
      // retry()  //Vuelve a intentar a ejecutar el subscribe indefinidamente mientras de error
       retry(2)  //Vuelve a intentar a ejecutar el subscribe 2 intentos mas mientras de error, si no, termina
     ).subscribe(numero=>{
       console.log(numero);  //Next
     },error =>{
       console.error(error);   //Error
     },
     ()=>{
       console.log("El observador termino!!") //complete
     });

  }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.subscripcion.unsubscribe();
    
  }

  regresaObservable(): Observable<number>{

    return new Observable(observer =>{
      
      let contador = 0;

      let intervalo = setInterval(()=>{
        contador +=1;
        observer.next(contador);  //pasa el parametro al subscribe
        
        if(contador === 3){
          clearInterval(intervalo); //Termia el intervalo
          observer.complete();  //Ejecuta el completado (no parametros)
        }

        if(contador === 2){
          clearInterval(intervalo);
          observer.error("Auxilio!!"); //Ejecuta error y termina el codigo
        }

      },1000);

    });
  }


  regresaObservable2(): Observable<any>{

    return new Observable((observer: Subscriber<any>) =>{
      
      let contador = 0;

      let intervalo = setInterval(()=>{
        contador +=1;

        const salida = {
          valor:contador
        };

        observer.next(salida);  //pasa el parametro al subscribe
        
        // if(contador === 3){
        //   clearInterval(intervalo); //Termia el intervalo
        //   observer.complete();  //Ejecuta el completado (no parametros)
        // }

      },1000);

    }).pipe(
      map(resp =>{
        return resp.valor;
      }),filter((resp,index)=>{
        if((resp %2)===1){
          //impar
          return true;
        }else{
          //par
          return false;
        }
      })
    );
  }

}
