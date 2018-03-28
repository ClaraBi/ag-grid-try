import { Injectable } from "@angular/core";
import { Http, RequestOptions, Headers, Response, URLSearchParams } from '@angular/http';



@Injectable()
export class DataService {


  private dataURL = 'http://localhost:3000/employees';
  
  
  constructor(private http: Http) {
    
  }

  getDataService(para, params, currentPage) {
    let myHeaders = new Headers();
    myHeaders.set('Content-Type', 'application/json');


    //try to generate same parameters below---------------------------

    var sortJSONP1 = JSON.stringify(para.sortModel).replace("colId", "property");
    var sortJSON = sortJSONP1.replace("sort", "direction");


    function FilterObject(operator,value,property) {       //create a new data type FilterObject 
      this.operator = operator;
      this.value = value;
      this.property = property;
    }

    var filterObjects =[];
    
    var nameFilterInstance = params.api.getFilterModel();
    console.log("nameFilterInstance", nameFilterInstance);//{model: {…}, price: {…}}
    var savedFilters = Object.keys(nameFilterInstance);
    console.log("savedFilters", savedFilters);//["model", "price"]
    
    for (var i = 0; i < savedFilters.length; i++) {
      var singleOperator = "like";
      var singleValue = "";
      var singleProperty = "";
      var transData = nameFilterInstance[savedFilters[i]];
      var myOperator = transData['type'];

      if (transData['filter']) {
        var myValue = transData['filter'];
      } else {
        var myValue = transData['value']
      }
      
      
      console.log("....", myOperator);
      console.log(".......", myValue);
      console.log(".............", savedFilters[i]);
      if (myOperator == "contains") {
        singleOperator = "like";
      }
      if (myOperator == "lessThan") {
        singleOperator = "lt";
        myValue = transData['dateFrom'];
      }
      if (myOperator == "greaterThan") {
        singleOperator = "gt";
        myValue = transData['dateFrom'];
      }
      if (myOperator == "equals") {
        singleOperator = "eq";
        myValue = transData['dateFrom'];
      }


      singleValue = myValue;
      singleProperty = savedFilters[i];

      var filterObjectsItem = new FilterObject(singleOperator, singleValue, singleProperty);
      filterObjects.push(filterObjectsItem);

    }

    

    //--------------------------------------generate end

    let myParams = new URLSearchParams();
    myParams.set('start', para.startRow);
    myParams.set('page', currentPage);
    myParams.set('limit', '50');
    myParams.set('sort', sortJSON);
    myParams.set('filter', JSON.stringify(filterObjects));
    
    

    let options = new RequestOptions({ headers: myHeaders, params: myParams });
    var newData;

    this.http.get(this.dataURL, options).subscribe(response => {
      console.log(options);

      var data = response;
      newData = data.json();
      newData.forEach(function (data, index) {
        newData.id = "R" + (index + 1);
      });
      var dataAfterSortingAndFiltering = this.sortAndFilter(newData, para.sortModel, para.filterModel);
      var rowsThisPage = dataAfterSortingAndFiltering.slice(para.startRow, para.endRow);
      //console.log(" rowsThisPage", rowsThisPage)

      var lastRow = -1;
      if (dataAfterSortingAndFiltering.length <= para.endRow) {
        lastRow = dataAfterSortingAndFiltering.length;
      }
      para.successCallback(rowsThisPage, lastRow);
    });
    

  }


  sortAndFilter(allOfTheData, sortModel, filterModel) {

    console.log("allOfTheData", allOfTheData);
   
    console.log("filterModel", filterModel);


    let filteredData = this.filterData(filterModel, allOfTheData)
    return this.sortData(sortModel, filteredData);

  }




  sortData(sortModel, data) {
    var sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
      return data;
    }
    var resultOfSort = data.slice();
  

    resultOfSort.sort(function (a, b) {
      for (var k = 0; k < sortModel.length; k++) {

        var sortColModel = sortModel[k];
     
        var valueA = a[sortColModel.colId];
      
        var valueB = b[sortColModel.colId];
      
        if (valueA == valueB) {
          continue;
        }
        var sortDirection = sortColModel.sort === "asc" ? 1 : -1;
      

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





  filterData(filterModel, data) {

    console.log("filterModel2", filterModel);
    console.log("data", data)
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
        
        if (item.make.toLowerCase().indexOf(filterModel.make.value) == -1) {
        //if (item.make.toLowerCase().indexOf(filterModel.make.type) == -1) {
          
          
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
 
}

