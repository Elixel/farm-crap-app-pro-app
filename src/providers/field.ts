import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

/*
  Generated class for the Field provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Field {

  private _fieldsKey: string = 'fields';
  private _fields: any[];

  constructor(private localStorageService: LocalStorageService) {}

  public get fields(): Object[] {
    if (this._fields === undefined) {
      this._fields = <Object[]>this.localStorageService.get(this._fieldsKey);
    }
    if (!this._fields) {
      this._fields = [];
    }
    return this._fields;
  }

  public add(fieldObject) {
    // Add field object to field array
    this._fields.push(fieldObject);
    // Save to localStorage
    this.localStorageService.set(this._fieldsKey, this._fields);
  }

  public set(fieldObject, fieldIndex) {
    // Overwrite field object in field array
    this._fields[fieldIndex] = fieldObject;
    // Save to localStorage
    this.localStorageService.set(this._fieldsKey, this._fields);
  }

  public deleteField(fieldIndex) {
    // Splice field object from field array
    this._fields.splice(fieldIndex, 1);
    // Save to localStorage
    this.localStorageService.set(this._fieldsKey, this._fields);
  }

  public addSpread(fieldIndex, spread) {
    // Add spread object to field object
    this._fields[fieldIndex].spreads.push(spread);
    // Save to localStorage
    this.localStorageService.set(this._fieldsKey, this._fields);
  }

  public setSpread(fieldIndex, spreadIndex, spread) {
    // Overwrite spread object on field object
    this._fields[fieldIndex].spreads[spreadIndex] = spread;
    // Save to localStorage
    this.localStorageService.set(this._fieldsKey, this._fields);
  }

  public deleteSpread(fieldIndex, spreadIndex) {
    // Splice spread object from field object
    this._fields[fieldIndex].spreads.splice(spreadIndex, 1);
    // Save to localStorage
    this.localStorageService.set(this._fieldsKey, this._fields);
  }

}
