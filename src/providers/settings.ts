import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';

import { Field } from './field';

/*
  Generated class for the Settings provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Settings {

  private _unitsKey: string = 'fca.settings.units';
  private _units: string;

  private _rainfallKey: string = 'fca.settings.rainfall';
  private _rainfall: string;

  private _fertiliserCostNitrogenKey: string = 'fca.settings.cost.nitrogen';
  private _fertiliserCostNitrogen: number;

  private _fertiliserCostPhosphorousKey: string = 'fca.settings.cost.phosphorous';
  private _fertiliserCostPhosphorous: number;

  private _fertiliserCostPotassiumKey: string = 'fca.settings.cost.potassium';
  private _fertiliserCostPotassium: number;

  private _customManureKey: string = 'fca.settings.manures';
  private _customManure: Object[];

  private _disclaimerAcceptedKey: string = 'fca.settings.disclaimer';
  private _disclaimerAccepted: Boolean;

  constructor(private localStorageService: LocalStorageService, private fieldProvider: Field) {}

  /**
   * Get units of measurement setting
   */
  public get units(): string {
    // Get from localStorage if undefined
    if (this._units === undefined) {
      this._units = <string>this.localStorageService.get(this._unitsKey);
    }
    // Default to Metric units
    if (!this._units) {
      this._units = 'metric';
    }
    return this._units;
  }

  /**
   * Set unit of measurement setting
   */
  public set units(newValue) {
    this._units = newValue;
    this.localStorageService.set(this._unitsKey, newValue);
  }

  /**
   * Get quantity of rainfall setting
   */
  public get rainfall(): string {
    // Get from localStorage if undefined
    if (this._rainfall === undefined) {
      this._rainfall = <string>this.localStorageService.get(this._rainfallKey);
    }
    // Default to medium rainfall
    if (!this._rainfall) {
      this._rainfall = 'medium';
    }
    return this._rainfall;
  }

  /**
   * Set quantity of rainfall setting
   */
  public set rainfall(newValue) {
    this._rainfall = newValue;
    this.localStorageService.set(this._rainfallKey, newValue);
  }

  /**
   * Get nitrogen cost setting
   */
  public get fertiliserCostNitrogen(): number {
    // Get from localStorage if undefined
    if (this._fertiliserCostNitrogen === undefined) {
      this._fertiliserCostNitrogen = <number>this.localStorageService.get(this._fertiliserCostNitrogenKey);
    }
    // Default to 0.79
    if (!this._fertiliserCostNitrogen) {
      this._fertiliserCostNitrogen = 0.79;
    }
    return this._fertiliserCostNitrogen;
  }

  /**
   * Set nitrogen cost setting
   */
  public set fertiliserCostNitrogen(newValue) {
    this._fertiliserCostNitrogen = newValue;
    this.localStorageService.set(this._fertiliserCostNitrogenKey, newValue);
  }

  /**
   * Get phosphorous cost setting
   */
  public get fertiliserCostPhosphorous(): number {
    // Get from localStorage if undefined
    if (this._fertiliserCostPhosphorous === undefined) {
      this._fertiliserCostPhosphorous = <number>this.localStorageService.get(this._fertiliserCostPhosphorousKey);
    }
    // Default to 0.62
    if (!this._fertiliserCostPhosphorous) {
      this._fertiliserCostPhosphorous = 0.62;
    }
    return this._fertiliserCostPhosphorous;
  }

  /**
   * Set phosphorous cost setting
   */
  public set fertiliserCostPhosphorous(newValue) {
    this._fertiliserCostPhosphorous = newValue;
    this.localStorageService.set(this._fertiliserCostPhosphorousKey, newValue);
  }

  /**
   * Get potassium cost setting
   */
  public get fertiliserCostPotassium(): number {
    // Get from localStorage if undefined
    if (this._fertiliserCostPotassium === undefined) {
      this._fertiliserCostPotassium = <number>this.localStorageService.get(this._fertiliserCostPotassiumKey);
    }
    // Default to 0.49
    if (!this._fertiliserCostPotassium) {
      this._fertiliserCostPotassium = 0.49;
    }
    return this._fertiliserCostPotassium;
  }

  /**
   * Set potassium cost setting
   */
  public set fertiliserCostPotassium(newValue) {
    this._fertiliserCostPotassium = newValue;
    this.localStorageService.set(this._fertiliserCostPotassiumKey, newValue);
  }

  /**
   * Get all cost settings as array
   */
  public get costs(): number[] {
    return [
      this.fertiliserCostNitrogen,
      this.fertiliserCostPhosphorous,
      this.fertiliserCostPotassium
    ];
  }

  /**
   * Get custom manure array setting
   */
  public get customManure(): any[] {
    // Get from localStorage if undefined
    if (this._customManure === undefined) {
      this._customManure = <any[]>this.localStorageService.get(this._customManureKey);
    }
    // Default to empty array
    if (!this._customManure) {
      this._customManure = [];
    }
    return this._customManure;
  }

  public addCustomManure(manureObject) {
    // Add manure object to manure array
    this._customManure.push(manureObject);
    // Save to localStorage
    this.localStorageService.set(this._customManureKey, this._customManure);
  }

  public deleteCustomManure(customManureIndex) {
    // Check through all spread events to make sure it isn't being used
    let found = false;
    for (let fieldIndex in this.fieldProvider.fields) {
      let spreads = (<any>this.fieldProvider.fields[fieldIndex]).spreads;
      for (let spreadIndex in spreads) {
        let spread = spreads[spreadIndex];
        if (spread.manureType === 'custom' && spread.manureQuality === customManureIndex) {
          // the manure to be deleted has been found in a spread, return false as delete is unsuccessful
          return false;
        }
      }
    }
    // Splice manure object from manure array
    this._customManure.splice(customManureIndex, 1);
    // Save to localStorage
    this.localStorageService.set(this._customManureKey, this._customManure);
    // Return delete successful
    return true;
  }

  public setCustomManure(customManureIndex, manureObject) {
    // Overwrite manure object to manure array
    this._customManure[customManureIndex] = manureObject;
    // Save to localStorage
    this.localStorageService.set(this._customManureKey, this._customManure);
  }

  public get disclaimerAccepted(): Boolean {
    // Get from localStorage if undefined
    if (this._disclaimerAccepted === undefined) {
      this._disclaimerAccepted = <Boolean>this.localStorageService.get(this._disclaimerAcceptedKey);
    }
    // Default to false
    if (!this._disclaimerAccepted) {
      this._disclaimerAccepted = false;
    }
    return this._disclaimerAccepted;
  }

  public set disclaimerAccepted(newValue) {
    this._disclaimerAccepted = newValue;
    this.localStorageService.set(this._disclaimerAcceptedKey, newValue);
  }

}
