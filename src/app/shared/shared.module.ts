import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';


//PIPES
import { PipesModule } from '../pipes/pipes.module';


@NgModule({
    declarations:[
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        NopagefoundComponent 
    ],
    exports: [
        HeaderComponent,
        SidebarComponent,
        BreadcrumbsComponent,
        NopagefoundComponent 
    ],
    imports: [
        RouterModule,
        CommonModule,
        PipesModule
    ]

})

export class SharedModule{};