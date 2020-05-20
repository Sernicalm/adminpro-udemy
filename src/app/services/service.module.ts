import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { 
  SettingsService,
  SidebarService, 
  SharedService,
  UsuarioService,
  SubirArchivoService,
  LoginGuardGuard 
} from './service.index';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers:[
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    SubirArchivoService,
    LoginGuardGuard
  ]
})
export class ServiceModule { }
