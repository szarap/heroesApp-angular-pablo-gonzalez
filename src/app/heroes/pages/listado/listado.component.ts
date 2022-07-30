import { Component, OnInit } from '@angular/core';
import { Heroe } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html'
})
export class ListadoComponent implements OnInit {

  heroes: Heroe[] = [];

  constructor( private heroesService: HeroesService) { }

  ngOnInit(): void {

    this.heroesService.getHeroes()
    .subscribe( heroes => this.heroes = heroes );
  }



}
