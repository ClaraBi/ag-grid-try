import {Component} from "@angular/core";
import {RedComponentComponent} from "../red-component/red-component.component";

import { GridOptions } from "ag-grid/main";



import { DataService } from '../services/data.service';
import { Response } from '@angular/http';

//import "ag-grid-enterprise";


@Component({
    selector: 'app-my-grid-application',
    templateUrl: './my-grid-application.component.html'
})
export class MyGridApplicationComponent {
    gridOptions: GridOptions;
    columnDefs: any[]
    rowData: any[];
    rowSelection;
    gridApi;
  

    constructor(private dataService:DataService) {
        this.gridOptions = <GridOptions>{};

        this.columnDefs = [
            { headerName: 'Refunded', field: 'refunded', checkboxSelection: true, },
            {headerName: "Make", field: "make"},
            {headerName: "Model", field: "model", cellRendererFramework: RedComponentComponent},
            { headerName: "Price", field: "price" },
            { headerName: "Date", field: "date" },
            { headerName: "Number", field: "number" },
            { headerName: "ID", field: "id" },
            { headerName: "Location", field: "location" },
            { headerName: "Notes", field: "notes" },
            { headerName: "extra", field: "extra" }
        ];

        this.rowSelection = "single";

        this.rowData = [
            {make: "1Toyota", model: "Celica", price: 35700, date:"01/23/1993", number:3,id:"7897243",location:"edision", notes:"some notes", extra:"extra messages"},
            { make: "2Ford", model: "Mondeo", price: 32430, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "3Ford", model: "Mondeo", price: 324300, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages"},
            { make: "34Ford", model: "Mondeo", price: 32000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "4Ford", model: "Mondeo", price: 5000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 3500, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 53000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 37000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 3290, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Porsche", model: "Boxter", price: 72000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 9000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 76000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 94000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 324000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 3800, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 3240, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 3100, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 3300, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 36000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 32600, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 32800, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 32500, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 32700, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 32000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" },
            { make: "Ford", model: "Mondeo", price: 32000, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" }
        ]
    }

    onGridReady(params) {
      params.api.sizeColumnsToFit();

      this.gridApi = params.api;
      this.onGet();
    }

    selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    onRemoveSelected() {
      var selectedRowData = this.gridApi.getSelectedRows();
      this.gridApi.updateRowData({ remove: selectedRowData });
    }

    onGet() {
      this.dataService.getData()
        .subscribe(
        (response: Response) => {

          const data = response.json();
          console.log(data);
        },
          (error)=>console.log(error)
        );
    }

   
}

