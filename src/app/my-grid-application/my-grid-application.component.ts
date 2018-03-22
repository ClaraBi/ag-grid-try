import { Component, OnInit, ViewEncapsulation} from "@angular/core";
import { RedComponentComponent } from "../red-component/red-component.component";

import { CheckboxCellComponent } from '../checkbox-cell/checkbox-cell.component';

import { GridOptions } from "ag-grid/main";


//import { DataService } from '../services/data.service';

import { Http, RequestOptions, Headers, Response, URLSearchParams  } from '@angular/http';

import "ag-grid-enterprise";

import { HeaderComponent } from '../header-component/header.component';


@Component({
    selector: 'app-my-grid-application',
    templateUrl: './my-grid-application.component.html',
    styleUrls: ['./my-grid-application.component.css'],
    encapsulation: ViewEncapsulation.None
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
    cacheOverflowSize;
    maxBlocksInCache;
    rowDeselection;
    paginationPageSize;
    maxConcurrentDatasourceRequests;

    frameworkComponents;
    defaultColDef;

    //headerHeight

    getMainMenuItems;

    constructor(private http: Http) {

      
        this.gridOptions = <GridOptions>{};
        

        this.columnDefs = [
          {
            headerName: 'Refunded', field: 'refunded', suppressFilter: true,
            cellRendererFramework: CheckboxCellComponent,
            
            menuTabs: ["filterMenuTab", "columnsMenuTab"]
           
            //checkboxSelection: true
            
          },

          //checkboxSelection: true, 
          {
              headerName: "Make", field: "make",
              filter: 'agTextColumnFilter',
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["contains"]
              },
              //menuTabs: ["filterMenuTab", "columnsMenuTab"]
             
          },
            {
              headerName: "Model",
              field: "model",
              cellRendererFramework: RedComponentComponent,
              filter: 'agTextColumnFilter',
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["contain"]
              },
              menuTabs: ["filterMenuTab", "columnsMenuTab"]
            },
            {
              headerName: "Price",
              field: "price",
              filter: 'agNumberColumnFilter',
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["equals", "lessThan", "greaterThan"]
              },
              menuTabs: ["filterMenuTab", "columnsMenuTab"]
            },
            {
              headerName: "Date(MM/DD/YYYY)",
              field: "date",
              //suppressFilter: true,
              filter: "agDateColumnFilter",
              menuTabs: ["filterMenuTab", "columnsMenuTab"],

            },
            {
              headerName: "Number",
              field: "number",
              suppressFilter: true,
              menuTabs: ["filterMenuTab", "columnsMenuTab"]},
            {
              headerName: "ID",
              field: "id",
              filter: 'agTextColumnFilter',
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["contains"]
              },
              menuTabs: ["filterMenuTab", "columnsMenuTab"]
            },
            {
              headerName: "Location", field: "location",
              menuTabs: ["filterMenuTab", "columnsMenuTab"]},
            {
              headerName: "Notes", field: "notes",
              menuTabs: ["filterMenuTab", "columnsMenuTab"]},
            {
              headerName: "extra", field: "extra",
              menuTabs: ["filterMenuTab", "columnsMenuTab"]}
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


       this.frameworkComponents = { agColumnHeader: HeaderComponent };
       this.defaultColDef = {
         width: 100,
         headerComponentParams: { menuIcon: "fa-bars" }
       };

       //this.headerHeight= 100;
    

        //this.gridOptions.rowStyle = { background: 'Aliceblue' };
      
        

       
        /**this.rowData = [
          { make: "1Toyota", model: "Celica", price: 35700, date: "01/23/1993", number: 3, id: "7897243", location: "edision", notes: "some notes", extra: "extra messages" }

        ];*/

       this.getMainMenuItems = function getMainMenuItems(params) {
         switch (params.column.getId()) {
           case "make":
             return [
               {
                 name: 'asac',
                 action: function () {
                   this.params.setSort('asc')
                 },
                 
                 icon:'<i class="fas fa-arrow-alt-circle-up"></i>'
               },
               {
                 name: 'desac',
                 action: function () {
                   console.log('sort desc');
                 },

                 icon: '<i class="fas fa-arrow-alt-circle-down"></i>'
               }
             ];
         }
       };

        
        

        
    }

    


    onGridReady(params) {
      params.api.sizeColumnsToFit();

      this.gridApi = params.api;
      
    
      this.gridColumnApi = params.columnApi;
    
      let URL = 'http://localhost:3000/employees';
      let myHeaders = new Headers();
      myHeaders.set('Content-Type', 'application/json');
      let myParams = new URLSearchParams()
      myParams.set('sort', params.sortModel);
      myParams.set('filter', params.filterModel);
      let options = new RequestOptions({ headers: myHeaders, params: myParams });
      this.http.get(URL, options).subscribe(data => {
        console.log(data);

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

              console.log("sortModel: ", JSON.stringify(params.sortModel));
               console.log("filterModel: ", JSON.stringify(params.filterModel));
             
              console.log("--------------------------");

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
        console.log("sortModel: ", JSON.stringify(params.sortModel));
        console.log("filterModel: ", JSON.stringify(params.filterModel));
      });

   
  
   /*  this.http
        .get('assets/db.json')
        .subscribe(data => {

          console.log(data);

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

                //var str=JSON.stringify(params.sortModel);
               //console.log("sortModel: ", JSON.stringify(params.sortModel));
                //var try2=params.sortModel;
                //var try3 = try2[0];
                //console.log("try3", try3);
                //console.log("try3.colId",try3.sort);

                //console.log("filterModel: ", JSON.stringify(params.filterModel));
                //console.log(params.filterModel);
                //console.log("--------------------------");

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

    */
      }


    }

  
  
    
     
   /* selectAllRows() {
        this.gridOptions.api.selectAll();
    }

    onRemoveSelected() {
      var selectedRowData = this.gridApi.getSelectedRows();
      this.gridApi.updateRowData({ remove: selectedRowData });
    }

    */
   


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

    if (filterModel.id) {
      //console.log(filterModel.make);
      if (item.id.indexOf(filterModel.id.filter) == -1) {
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

