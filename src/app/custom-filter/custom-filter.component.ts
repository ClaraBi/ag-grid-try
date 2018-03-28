import { Component, ViewChild, ViewContainerRef } from "@angular/core";

import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from "ag-grid";
import { IFilterAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.css']
})
export class CustomFilterComponent  {

  constructor() { }

  private params: IFilterParams;
  private valueGetter: (rowNode: RowNode) => any;
  text: string = '';

  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
  }

  isFilterActive(): boolean {
    return this.text !== null && this.text !== undefined && this.text !== '';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return this.text.toLowerCase()
      .split(" ")
      .every((filterWord) => {
        return this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
      });
  }

  getModel(): any {
    return { value: this.text };
  }

  setModel(model: any): void {
    this.text = model ? model.value : '';
  }

  ngAfterViewInit(params: IAfterGuiAttachedParams): void {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    })
  }

  // noinspection JSMethodCanBeStatic
  componentMethod(message: string): void {
    alert(`Alert from CustomFilterComponent ${message}`);
  }

  onChange(newValue): void {
    if (this.text !== newValue) {
      this.text = newValue;
      this.params.filterChangedCallback();
    }
  }

  
}
