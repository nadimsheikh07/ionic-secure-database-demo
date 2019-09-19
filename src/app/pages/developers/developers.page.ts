import { Component, OnInit } from '@angular/core';


import { DatabaseService, Dev } from './../../services/database.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-developers',
  templateUrl: './developers.page.html',
  styleUrls: ['./developers.page.scss'],
})
export class DevelopersPage implements OnInit {

  developers: Dev[] = [];

  products: Observable<any[]>;

  developer = {
    skills: '',
    name: '',
    img: '',
  };
  product = {
    name: '',
    creator: ''
  };

  selectedView = 'devs';

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getDevs().subscribe(devs => {
          this.developers = devs;
        });
        this.products = this.db.getProducts();
      }
    });
  }

  addDeveloper() {
    let skills = this.developer.skills.split(',');
    skills = skills.map(skill => skill.trim());

    const data = this.db.addDeveloper(this.developer.name, skills, this.developer.img);
    console.log(data);
    // .then(_ => {
    //   this.developer = {
    //     skills: '',
    //     name: '',
    //     img: '',
    //   };
    // });
  }

  addProduct() {
    this.db.addProduct(this.product.name, this.product.creator)
      .then(_ => {
        this.product = {
          name: '',
          creator: ''
        };
      });
  }

}
