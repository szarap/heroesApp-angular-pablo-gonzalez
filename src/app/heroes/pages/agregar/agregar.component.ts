import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators'; 

import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
  img{
    width: 100%;
    border-radius: 5px;
  }

  `]
})
export class AgregarComponent implements OnInit {

  publishers = [

    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    },

  ];

  heroes: Heroe = {

    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img:''

  }
  
  
  constructor( private HeroesService : HeroesService,
               private activatedRoute: ActivatedRoute,
               private router        : Router,
               private snackBar: MatSnackBar,
               private dialog: MatDialog) { }

  ngOnInit(): void {

    if ( !this.router.url.includes('editar')){
      return;
    }

    this.activatedRoute.params
    .pipe(
      switchMap( ({id}) => this.HeroesService.getHeroePorId ( id ) )
    )
    .subscribe( heroe => this.heroes = heroe   ) 

  }


  guardar(){
    if(this.heroes.superhero.trim().length === 0 ){
      return;
    }

    if( this.heroes.id){
      //Actualizar
      this.HeroesService.actualizarHeroe( this.heroes)
        .subscribe( heroe => this.mostrarSnackBar( 'Registro actualizado'));
    }else{
      //Crear
      this.HeroesService.agregarHeroe(this.heroes)
      .subscribe( heroes => {
        this.router.navigate(['/heroes/editar', heroes.id]);
        this.mostrarSnackBar( 'Registro creado'); 
      })
    }
  }

  borrarHeroe(){

    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.heroes
    });

    dialog.afterClosed().subscribe(
      (result) => {

        if ( result ){
          this.HeroesService.borrarHeroe( this.heroes.id! )
          .subscribe( resp => {
          this.router.navigate(['/heroes']);
          });
        }
        
      }
    )

  }


  mostrarSnackBar( mensaje: string ) {
    this.snackBar.open( mensaje, 'ok!', {
      duration: 2500
    })
  }

}
