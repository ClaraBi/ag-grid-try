import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-checkbox-cell',
  templateUrl: './checkbox-cell.component.html',
  styleUrls: ['./checkbox-cell.component.css']
})
export class CheckboxCellComponent {

  @ViewChild('checkbox') checkbox: ElementRef;

  public params: any;
 
  constructor() { }

  agInit(params: any): void {
    this.params = params;
  }

  public onChange(event) {
    this.params.data[this.params.colDef.field] = event.currentTarget.checked;
  }
}


