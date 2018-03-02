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
import { DataService } from './services/data.service';

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
        WaybillItemsGridComponent
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
