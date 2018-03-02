import { Component, OnInit } from '@angular/core';

import { GridOptions } from "ag-grid/main";
//import "ag-grid-enterprise";

@Component({
  selector: 'app-waybill-items-grid',
  templateUrl: './waybill-items-grid.component.html',
  styleUrls: ['./waybill-items-grid.component.css']
})
export class WaybillItemsGridComponent implements OnInit {
  gridOptions: GridOptions;
  columnDefs: any[]
  rowData: any[];
 


  constructor() {

    this.gridOptions = <GridOptions>{};

    this.columnDefs = [
      { headerName: "Column A", field: "a" },
      { headerName: "Column B", field: "b" }
    ];


    this.rowData = [
     //{ make: "1Toyota", model: "Celica", price: 35700, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" }
    ]
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
  }

  selectAllRows() {
    this.gridOptions.api.selectAll();
  }

  ngOnInit() {
  }

}


 

