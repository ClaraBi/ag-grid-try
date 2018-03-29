import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
//import { IHeaderAngularComp } from "ag-grid-angular";
//import { IHeaderParams } from "ag-grid/main";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {

  params: any;

  ascSort = 'inactive';
  descSort = 'inactive';
  noSort = 'inactive';

  @ViewChild('menuButton', { read: ElementRef }) public menuButton;

  agInit(params): void {
    this.params = params;

    params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
    this.onSortChanged();
  }

  onMenuClicked() {
    this.params.showColumnMenu(this.menuButton.nativeElement);
  };

  onSortChanged() {
    this.ascSort = this.descSort = this.noSort = 'inactive';
    if (this.params.column.isSortAscending()) {
      
      this.ascSort = 'active';
    } else if (this.params.column.isSortDescending()) {
      this.descSort = 'active';
    } else {
      this.noSort = 'active';
    }
  }

  onSortRequested(order, event) {
    this.params.setSort(order, event.shiftKey);
  }

}
