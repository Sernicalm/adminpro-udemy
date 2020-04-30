import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  titulo:string;

  constructor(private routes:Router, private title:Title,private meta : Meta) {

    this.getDataRoute().subscribe(event =>{

      this.titulo = event.titulo;
      this.title.setTitle(event.titulo); //titol a la pestaña
      
      const metaTag : MetaDefinition ={
        name: 'description',
        content: this.titulo
      };

      this.meta.addTag(metaTag);
    });
   }

  ngOnInit(): void {
  }
  getDataRoute(){
    return this.routes.events.pipe(
      filter(evento =>{
        return evento instanceof ActivationEnd;
      }),
      filter((evento : ActivationEnd) =>{
        return evento.snapshot.firstChild === null;
      }),
      map((evento : ActivationEnd) =>{
        return evento.snapshot.data;
      })
    )
  }

}
