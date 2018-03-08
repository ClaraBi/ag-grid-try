import {Component, OnInit} from "@angular/core";
import { RedComponentComponent } from "../red-component/red-component.component";

import { CheckboxCellComponent } from '../checkbox-cell/checkbox-cell.component';

import { GridOptions } from "ag-grid/main";


//import { DataService } from '../services/data.service';
import { Response } from '@angular/http';
import { Http } from '@angular/http';

import "ag-grid-enterprise";


@Component({
    selector: 'app-my-grid-application',
    templateUrl: './my-grid-application.component.html',
    styleUrls:['./my-grid-application.component.css']
})
export class MyGridApplicationComponent  {
    gridOptions: GridOptions;
    columnDefs: any[]
    rowData: any[];
    rowSelection;
    gridApi;

    gridColumnApi;
    infiniteInitialRowCount;
    getRowNodeId;
    rowModelType;
    cacheOverflowSize
    maxBlocksInCache
    rowDeselection
    paginationPageSize
    maxConcurrentDatasourceRequests


  

   

    constructor(private http: Http) {

      
        this.gridOptions = <GridOptions>{};
        

        this.columnDefs = [
          {
            headerName: 'Refunded', field: 'refunded', suppressFilter: true,
            cellRendererFramework: CheckboxCellComponent,
            //headerCheckboxSelection: true,
            //checkboxSelection: true
            
          },

          //checkboxSelection: true, 
          {
              headerName: "Make", field: "make",
              filter: 'agTextColumnFilter',
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["contains"]
              }
          },
            {
              headerName: "Model",
              field: "model",
              cellRendererFramework: RedComponentComponent,
              filter: 'agTextColumnFilter',
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["contains"]
              }
            },
            {
              headerName: "Price",
              field: "price",
              filter: 'agNumberColumnFilter',
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["equals", "lessThan", "greaterThan"]
              }
            },
            {
              headerName: "Date(MM/DD/YYYY)",
              field: "date",
              suppressFilter: true
            },
            { headerName: "Number", field: "number" },
            {
              headerName: "ID",
              field: "id",
              filter: 'agTextColumnFilter',
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["contains"]
              }
            },
            { headerName: "Location", field: "location" },
            { headerName: "Notes", field: "notes" },
            { headerName: "extra", field: "extra" }
        ];

        this.rowSelection = "multiple";
        this.rowModelType = "infinite";
        this.paginationPageSize = 100;
        this.cacheOverflowSize = 2;
        this.maxConcurrentDatasourceRequests = 2;
        this.infiniteInitialRowCount = 1;
        this.maxBlocksInCache = 2;

      

       

        this.getRowNodeId = function (item) {
          return item.id;
        };
      
        

       
        /**this.rowData = [
          { make: "1Toyota", model: "Celica", price: 35700, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" }

        ];*/
        

        
    }

    onGridReady(params) {
      params.api.sizeColumnsToFit();

      this.gridApi = params.api;
      
    
      this.gridColumnApi = params.columnApi;

      this.http
        .get('assets/ngGridSampleData.json')
        .subscribe(data => {
          var newData = data.json();
          
          newData.forEach(function (data, index) {
            newData.id = "R" + (index + 1);
          });
          //params.api.setRowData(newData);
          var dataSource = {
            rowCount: null,
            getRows: function (params) {
              console.log("asking for " + params.startRow + " to " + params.endRow);
              setTimeout(function () {
                var dataAfterSortingAndFiltering = sortAndFilter(newData, params.sortModel, params.filterModel);
                var rowsThisPage = dataAfterSortingAndFiltering.slice(params.startRow, params.endRow);
                var lastRow = -1;
                if (dataAfterSortingAndFiltering.length <= params.endRow) {
                  lastRow = dataAfterSortingAndFiltering.length;
                }
                params.successCallback(rowsThisPage, lastRow);
              }, 500);
            }
          };
          params.api.setDatasource(dataSource);
        });


    }

  
  
    
     
   /* selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    onRemoveSelected() {
      var selectedRowData = this.gridApi.getSelectedRows();
      this.gridApi.updateRowData({ remove: selectedRowData });
    }

    */
   
}

function sortAndFilter(allOfTheData, sortModel, filterModel) {
  return sortData(sortModel, filterData(filterModel, allOfTheData));
}

function sortData(sortModel, data) {
  var sortPresent = sortModel && sortModel.length > 0;
  if (!sortPresent) {
    return data;
  }
  var resultOfSort = data.slice();
  //console.log(resultOfSort);

  resultOfSort.sort(function (a, b) {
    for (var k = 0; k < sortModel.length; k++) {

      var sortColModel = sortModel[k];
      //console.log(sortColModel);
      var valueA = a[sortColModel.colId];
      //console.log("valueA: "+valueA);
      var valueB = b[sortColModel.colId];
      //console.log("valueB: " + valueB);
      if (valueA == valueB) {
        continue;
      }
      var sortDirection = sortColModel.sort === "asc" ? 1 : -1;
      //console.log("sortDirection: " + sortDirection);

      if (sortColModel.colId == "date") {
        //below two lines is for date formate in MM/DD/YYYY
        valueA = new Date(valueA);
        valueB = new Date(valueB);


        //below two lines is for date formate in DD/MM/YYYY
        //valueA = valueA.split('/').reverse().join('');        
        //valueB = valueB.split('/').reverse().join('');
        

      }

      if (valueA > valueB) {
        return sortDirection;
      } else {
        return sortDirection * -1;
      }
    }
    return 0;
  });
  return resultOfSort;
}

function filterData(filterModel, data) {
  var filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }

 
  var resultOfFilter = [];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];

    if (filterModel.price) {
      var price = item.price;
      var allowedPrice = parseInt(filterModel.price.filter);
      if (filterModel.price.type == "equals") {
        if (price !== allowedPrice) {
          continue;
        }
      } else if (filterModel.price.type == "lessThan") {
        if (price >= allowedPrice) {
          continue;
        }
      } else {
        if (price <= allowedPrice) {
          continue;
        }
      } 
    }
    if (filterModel.make) {
      //console.log(filterModel.make);
      if (item.make.toLowerCase().indexOf(filterModel.make.filter) == -1) {
        //console.log("filterModel.make.filter: "+filterModel.make.filter);
        //console.log("item.make: "+item.make);
        //console.log(filterModel.make.filter.indexOf(item.make));
        continue;
      }
      
      
    }

    if (filterModel.make) {
      //console.log(filterModel.make);
      if (item.make.toLowerCase().indexOf(filterModel.make.filter) == -1) {
        //console.log("filterModel.make.filter: "+filterModel.make.filter);
        //console.log("item.make: "+item.make);
        //console.log(filterModel.make.filter.indexOf(item.make));
        continue;
      }


    }

    if (filterModel.model) {
      if (item.model.toLowerCase().indexOf(filterModel.model.filter) == -1) {
        continue;
      }


    }
    /*if (filterModel.country) {
      if (filterModel.country.indexOf(item.country) < 0) {
        continue;
      }
    }*/
    resultOfFilter.push(item);
}
  
  return resultOfFilter;
 
}

function RefundedCellRenderer(params) {
  return params.value;
}


