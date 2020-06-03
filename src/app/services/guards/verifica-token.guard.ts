import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  /**
   *
   */
  constructor(
    public _usuarioService:UsuarioService,
    public router:Router) {
    
    
  }
  canActivate():  Promise<boolean> | boolean {
    
    let token = this._usuarioService.token;
    //Busquem dins el token la part publica, que es el usuario, on ens diu el temps d´expiració
    let payload = JSON.parse(atob(token.split('.')[1]));
    let expirado = this.expirado(payload.exp);

    if(expirado){
      this.router.navigate(['/login']);
      //Si ha expirat, desacrivem pagina, per aixo retornem un false.
      return false;
    }


    return true;
  }

  verificaRenueva(fechaExp:number):Promise<boolean>{
    return new Promise((resolve,reject)=>{
      let tokenExp = new Date(fechaExp * 1000);

      let ahora = new Date();
      ahora.setTime(ahora.getTime() + (4 * 60 * 60 * 1000));

      if(tokenExp.getTime() > ahora.getTime()){
        resolve(true);
      }else{
        this._usuarioService.renuevaToken().subscribe(()=>{
          resolve(true);
        },()=>{
          reject(false);
          this.router.navigate(['/login']);
        });
      }

    });
  }

  expirado(fechaExp:number){
    //recollim la data amb milisegons, ho divicim entre 1000 per tindre els segons.
    let ahora = new Date().getTime() / 1000;
    if(fechaExp < ahora){
      return true;
    }else{
      return false;
    }

  }
  
}
