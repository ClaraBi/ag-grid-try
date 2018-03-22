import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class MockService {
  constructor(public http: Http) {
  }

  getFakeUser(page, start, limit, sort, filter, searchText) {
    let URL = "https://operations.i-parcel.com/Logistics/MAWB/GetAllMawbs?_" + "page=" + page + "&start=" + start + "&limit=" + limit +"&sort=%5B%7B%22property%22%3A%22";
    return new Promise((resolve, reject) => {
      this.http.get(URL)
        .map(res => res.json())
        .subscribe(data => {
          // console.log(data)
          resolve(data);
        }, (error => {
          reject(error);
        }));
    });
  }
}
