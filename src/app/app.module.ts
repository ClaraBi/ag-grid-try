import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AgGridModule} from "ag-grid-angular/main";
import {AppComponent} from "./app.component";
import {MyGridApplicationComponent} from "./my-grid-application/my-grid-application.component";
import {RedComponentComponent} from "./red-component/red-component.component";

import { AddFormComponent } from './add-form/add-form.component';

import { RouterModule, Routes } from '@angular/router';
import { WaybillItemsGridComponent } from './waybill-items-grid/waybill-items-grid.component';

import { HttpModule } from '@angular/http';

import { CheckboxCellComponent } from './checkbox-cell/checkbox-cell.component';
import { HeaderComponent } from './header-component/header.component';
import { CustomDateComponent } from './custom-date/custom-date.component';

import { DataService } from './services/getData.service';

const appRoutes: Routes = [
  { path: '', component: MyGridApplicationComponent },
  { path: 'addform', component: AddFormComponent}

];

@NgModule({
    declarations: [
        AppComponent,
        MyGridApplicationComponent,
        RedComponentComponent,
 
        AddFormComponent,
        WaybillItemsGridComponent,
        CheckboxCellComponent,
        HeaderComponent,
        CustomDateComponent
  ],
    entryComponents: [
      CheckboxCellComponent,
      HeaderComponent
    ],
    imports: [
        BrowserModule,
        AgGridModule.withComponents(
            [RedComponentComponent]
        ),
        RouterModule.forRoot(appRoutes),
        HttpModule
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
