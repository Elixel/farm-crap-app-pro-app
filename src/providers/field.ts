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
  private _fields: Object[];

  constructor(private localStorageService: LocalStorageService) {}

  public get fields(): Object[] {
    if (this._fields === undefined) {
      this._fields = <Object[]>this.localStorageService.get(this._fieldsKey);
    }
    return this._fields;
  }

  public set fields(newValue) {
    this._fields = newValue;
    this.localStorageService.set(this._fieldsKey, newValue);
  }

}
