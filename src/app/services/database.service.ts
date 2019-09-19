import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';



declare let sqlitePlugin: any;

export interface Dev {
  id: number;
  name: string;
  skills: any[];
  img: string;
}


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  developers = new BehaviorSubject([]);
  products = new BehaviorSubject([]);

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.database = sqlitePlugin.openDatabase({
        name: 'developers.db',
        key: 'developer',
        location: 'default'
      });

      this.seedDatabase();
    });
  }

  seedDatabase() {
    this.database.sqlBatch([
      'CREATE TABLE IF NOT EXISTS developer(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,skills TEXT,img TEXT)',
      ['INSERT INTO developer VALUES (?,?,?)', ['Nadim', 'ionic', 'https://www.gkmit.co/images/team/nadim.png']],
      ['INSERT INTO developer VALUES (?,?,?)', ['Neha', 'android', 'https://www.gkmit.co/images/team/neha.png']],
      ['INSERT INTO developer VALUES (?,?,?)', ['Ajay', 'html', 'https://www.gkmit.co/images/team/ajay.png']],
    ]);

    this.database.sqlBatch([
      'CREATE TABLE IF NOT EXISTS product(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,creatorId INTEGER)',
      ['INSERT INTO product VALUES (?,?)', ['ionic', 1]],
      ['INSERT INTO product VALUES (?,?)', ['ionic 2', 2]],
      ['INSERT INTO product VALUES (?,?)', ['ionic 3', 3]],
    ]);

    this.loadDevelopers();
    this.loadProducts();
    this.dbReady.next(true);
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getDevs(): Observable<Dev[]> {
    return this.developers.asObservable();
  }

  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }

  loadDevelopers() {
    return this.database.transaction((tx) => {
      tx.executeSql('SELECT * FROM developer', [], (data) => {
        const developers: Dev[] = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            let skills = [];
            if (data.rows.item(i).skills !== '') {
              skills = JSON.parse(data.rows.item(i).skills);
            }
            developers.push({
              id: data.rows.item(i).id,
              name: data.rows.item(i).name,
              skills,
              img: data.rows.item(i).img
            });
          }
        }
        this.developers.next(developers);
      }, (error) => {
        console.log('SELECT error: ' + error.message);
      });
    });
  }

  addDeveloper(name, skills, img) {
    const data = [name, JSON.stringify(skills), img];

    return this.database.transaction((tx) => {
      tx.executeSql('INSERT INTO developer (name, skills, img) VALUES (?, ?, ?)', data, () => {
        this.loadDevelopers();
      }, (error) => {
        console.log('SELECT error: ' + error.message);
      });
    });
  }

  getDeveloper(id): Promise<Dev> {
    return this.database.transaction((tx) => {
      tx.executeSql('SELECT * FROM developer WHERE id = ?', [id], (data) => {
        let skills = [];
        if (data.rows.item(0).skills !== '') {
          skills = JSON.parse(data.rows.item(0).skills);
        }

        return {
          id: data.rows.item(0).id,
          name: data.rows.item(0).name,
          skills,
          img: data.rows.item(0).img
        };
      }, (error) => {
        console.log('SELECT error: ' + error.message);
      });
    });
  }

  deleteDeveloper(id) {
    return this.database.transaction((tx) => {
      tx.executeSql('DELETE FROM developer WHERE id = ?', [id], () => {
        this.loadDevelopers();
        this.loadProducts();
      }, (error) => {
        console.log('SELECT error: ' + error.message);
      });
    });
  }

  updateDeveloper(dev: Dev) {
    const data = [dev.name, JSON.stringify(dev.skills), dev.img];

    return this.database.transaction((tx) => {
      tx.executeSql(`UPDATE developer SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`, data, () => {
        this.loadDevelopers();
      }, (error) => {
        console.log('SELECT error: ' + error.message);
      });
    });
  }

  loadProducts() {
    // tslint:disable-next-line: max-line-length
    const query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId';

    return this.database.transaction((tx) => {
      tx.executeSql(query, [], (data) => {
        const products = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            products.push({
              name: data.rows.item(i).name,
              id: data.rows.item(i).id,
              creator: data.rows.item(i).creator,
            });
          }
        }
        this.products.next(products);
      }, (error) => {
        console.log('SELECT error: ' + error.message);
      });
    });
  }

  addProduct(name, creator) {
    const data = [name, creator];

    return this.database.transaction((tx) => {
      tx.executeSql('INSERT INTO product (name, creatorId) VALUES (?, ?)', data, () => {
        this.loadProducts();
      }, (error) => {
        console.log('SELECT error: ' + error.message);
      });
    });
  }
}
