import { Component, OnInit, ViewEncapsulation} from "@angular/core";
import { RedComponentComponent } from "../red-component/red-component.component";

import { CheckboxCellComponent } from '../checkbox-cell/checkbox-cell.component';

import { GridOptions } from "ag-grid/main";


//import { DataService } from '../services/data.service';

import { Http, RequestOptions, Headers, Response, URLSearchParams  } from '@angular/http';

import "ag-grid-enterprise";

import { HeaderComponent } from '../header-component/header.component';

import { CustomFilterComponent } from '../custom-filter/custom-filter.component';

import { DataService } from '../services/getData.service';



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

    localeText;

    
    

    
    pp: any;

    //constructor(private http: Http) {
    constructor(private dataService: DataService) {


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
              //filter: 'agTextColumnFilter',
             //filterParams: {
               //newRowsAction: "keep",
               //filterOptions: ["contains"]
             //},
             filter: "CustomFilterComponent",
              
              menuTabs: ["filterMenuTab", "columnsMenuTab"]
             
          },
            {
              headerName: "Model",
              field: "model",
              cellRendererFramework: RedComponentComponent,
             // filter: 'agTextColumnFilter',
              filter: "CustomFilterComponent",
              filterParams: {
                newRowsAction: "keep",
                filterOptions: ["contains"]
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
              headerName: "Date",
              field: "date",
             
              filter: "agDateColumnFilter",
              filterParams: {
                
                filterOptions: ["equals", "lessThan", "greaterThan"],
                comparator: function (filterLocalDateAtMidnight, cellValue) {

                  var dateAsString = cellValue;
                  if (dateAsString == null) return -1;
                  var dateParts = dateAsString.split("-");
                 
                  var cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
                  if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
                    return 0;
                  }
                  if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                  }
                  if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                  }
                }
              },
              menuTabs: ["filterMenuTab", "columnsMenuTab"],

            },
            {
              headerName: "Number",
              field: "number",
              suppressFilter: true,
              menuTabs: ["filterMenuTab", "columnsMenuTab"]
            },

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
              menuTabs: ["filterMenuTab", "columnsMenuTab"],
              suppressFilter: true
            },
          
            {
              headerName: "extra", field: "extra",
              menuTabs: [ "columnsMenuTab"]}
        ];


      

        this.rowSelection = "multiple";

      //below for inifity scrolling---------------------start
       this.rowModelType = "infinite";
        this.paginationPageSize = 100;
        this.cacheOverflowSize = 2;
       this.maxConcurrentDatasourceRequests = 2;
       this.infiniteInitialRowCount = 1;
       this.maxBlocksInCache = 2;
      

       this.getRowNodeId = function (item) {
         return item.id;
       };
      //------------------------end

       this.frameworkComponents = { agColumnHeader: HeaderComponent, CustomFilterComponent: CustomFilterComponent };
       this.defaultColDef = {
         width: 100,
         headerComponentParams: { menuIcon: "fa-bars" }
       };

       
       var those = this;
 
       this.getMainMenuItems = function getMainMenuItems(params) {
         
         console.log("params: ", params);
         console.log(" those", those);
         switch (params.column.getId()) {
           
          
           case "make":
             return [
               {
                 name: 'asac',
                 action: function () {
                   console.log("paramsssssssssssssssss", this.pp)
                   this.pp.setSort('asac', 'false');
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




       this.localeText = {
         contains: "Filter"
       };

        
        

        
    }


    onPaginationChanged() {
      console.log("onPaginationPageLoaded");
      
    }

    
    agInit(params): void {
      this.pp = params;
      console.log("pp    ", this.pp)
      console.log("params", params)
      
    }
    
    onGridReady(params) {
      
      params.api.sizeColumnsToFit();

      this.gridApi = params.api;

      var currentPage = this.gridApi.paginationGetCurrentPage() + 1;
      console.log("current:", currentPage);

      let that = this;

      this.gridColumnApi = params.columnApi;
  
  /*   var dataSource = {
          rowCount: null,
          getRows: function (para) {
            console.log("asking for " + para.startRow + " to " + para.endRow);
            // setTimeout(function () {
            //console.log("http: ",that.http);

            let URL = 'http://localhost:3000/employees';
            let myHeaders = new Headers();
            myHeaders.set('Content-Type', 'application/json');


            //console.log("sortModel: ", JSON.stringify(para.sortModel));
            console.log("filterModel: ", JSON.stringify(para.filterModel));
            console.log("filterModel: ", para.filterModel)
            var sortJSONP1 = JSON.stringify(para.sortModel).replace("colId", "property");
            var sortJSON = sortJSONP1.replace("sort","direction");

                        



            console.log("sortJSON: ", sortJSON);

            var nameFilterInstance = params.api.getFilterModel();
            console.log(" nameFilterInstance",nameFilterInstance);
            var savedFilters = Object.keys(nameFilterInstance );
            console.log(" savedFilters", savedFilters);



            let myParams = new URLSearchParams();
            myParams.set('limit', '50');
            myParams.set('sort', sortJSON);
            myParams.set('filter',  JSON.stringify(para.filterModel));

           
            console.log("params: ",params);
            console.log("para: ",para);
            let options = new RequestOptions({ headers: myHeaders, params: myParams });
            var newData;
           // that.http.get(URL, options).subscribe(data => {

            that.dataService.getDataService(URL, options).subscribe(response => {
              console.log(options);
             // console.log(data);
              var data = response;
              newData = data.json();
              newData.forEach(function (data, index) {
                newData.id = "R" + (index + 1);
              });
              var dataAfterSortingAndFiltering = sortAndFilter(newData, para.sortModel, para.filterModel);
              var rowsThisPage = dataAfterSortingAndFiltering.slice(para.startRow, para.endRow);
              var lastRow = -1;
              if (dataAfterSortingAndFiltering.length <= para.endRow) {
                lastRow = dataAfterSortingAndFiltering.length;
              }
              para.successCallback(rowsThisPage, lastRow);
            })

           // console.log(options);
           
            console.log("--------------------------");
           
            
          }
      };
      params.api.setDatasource(dataSource);
      */
     var dataSource = {
       rowCount: null,
       getRows: function (para) {
         console.log("asking for " + para.startRow + " to " + para.endRow);
 
         that.dataService.getDataService(para, params, currentPage);
 
       }
     };

     params.api.setDatasource(dataSource);


      

     
  
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


/*my old server side sort and filter for inifinty scrolling-----------------------------start

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
        //below two lines is for date formate in MM/DD/YYYY or YYYY-MM-DD
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

/*
    if (filterModel.date) {
      //console.log(filterModel.date.type);
      //console.log(item.date);
      var itemDate = new Date(item.date);
      var dateFromDate = new Date(filterModel.date.dateFrom);

      if (filterModel.date.type == "equals" && filterModel.date.dateFrom != item.date) {
        continue;
      }
      if (filterModel.date.type == "lessThan" && itemDate >= dateFromDate) {
        continue;
      }
      if (filterModel.date.type == "greaterThan" && itemDate <= dateFromDate) {
        continue;
      }
    }

    resultOfFilter.push(item);
}
  
  return resultOfFilter;
 
}
old serverside sort and filter---------------------------------------------- end*/



function RefundedCellRenderer(params) {
  return params.value;
}


