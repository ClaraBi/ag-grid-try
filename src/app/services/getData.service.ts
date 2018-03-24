import { Injectable } from "@angular/core";
import { Http } from '@angular/http';



@Injectable()
export class GetDataService {
  constructor(private http: Http) { }
  getDataService(URL, options) {
    return this.http.get(URL, options);
  }
}
