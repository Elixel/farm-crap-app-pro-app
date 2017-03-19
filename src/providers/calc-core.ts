import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Settings } from '../providers/settings';

/*
  Generated class for the CalcCore provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CalcCore {
  soilNitrogenSupplyTree: any;
  previousGrassSoilNitrogenSupplyTree: any;
  cropRequirementsNitrogenTree: any;
  cropRequirementsPhosphorousPotassiumTree: any;
  nitrogenTotalTree: any;
  manureTree: any;
  
  grasslandHighSNS: number = 100;
  grasslandMedSNS: number = 101;
  grasslandLowSNS: number = 102;

  constructor(public http: Http, private settingsProvider: Settings) {}

  load() {
    // Load SNS dataset
    this.http.get('assets/json/soil-nitrogen-supply.json')
    .map(res => res.json())
    .subscribe(data => {
      this.soilNitrogenSupplyTree = data;
    });
    // Load previous grass SNS dataset
    this.http.get('assets/json/previous-grass-soil-nitrogen-supply.json')
    .map(res => res.json())
    .subscribe(data => {
      this.previousGrassSoilNitrogenSupplyTree = data;
    });
    // Load crop requirements (Nitrogen) dataset
    this.http.get('assets/json/crop-requirements-n.json')
    .map(resN => resN.json())
    .subscribe(data => {
      this.cropRequirementsNitrogenTree = data;
    });
    // Load crop requirements (Phosphorous & Potassium) dataset
    this.http.get('assets/json/crop-requirements-pk.json')
    .map(res => res.json())
    .subscribe(data => {
      this.cropRequirementsPhosphorousPotassiumTree = data;
    });
    // Load nitrogen totals dataset
    this.http.get('assets/json/n-total.json')
    .map(res => res.json())
    .subscribe(data => {
      this.nitrogenTotalTree = data;
    });
    // Load manure dataset
    this.http.get('assets/json/manure.json')
    .map(res => res.json())
    .subscribe(data => {
      this.manureTree = data;
    });
  }

  isPreviousCropGrass(crop) {
    if (crop === 'grass-low-n' || crop === 'grass-high-n' || crop === 'grass-other') {
      return true;
    } else {
      return false;
    }
  }

  isCropArable(crop) {
    if (crop === 'grass-cut' || crop === 'grass-grazed') {
      return false;
    } else {
      return true;
    }
  }

  grasslandModifier(soil, recentlyGrownGrass) {
    if (recentlyGrownGrass) {
      return this.grasslandHighSNS;
    } else if (soil === 'sandyshallow') {
      return this.grasslandLowSNS;
    } else {
      return this.grasslandMedSNS;
    }
  }

  snsSearch(tree, params, regularlyManure) {
    // do sns lookup on tree with params
    let sns = this.decision(tree, params);
    // If regularlyManure is true and the sns value is less than 6 (max) then add one
    if (regularlyManure && sns < 6) {
      sns++;
    }
    return sns;
  }

  // Calculate soil nitrogen supply
  calculateSNS(rainfall, soil, crop, previousCrop, regularlyManure, recentlyGrownGrass): number {
    // Define decision tree criteria
    let params = {
      rainfall: rainfall,
      soil: soil === 'medium' ? 'mediumshallow' : soil, // Soil 'medium' category does not exist in SNS tables, so substitute it for 'mediumshallow'
      'previous-crop': previousCrop
    };
    // Special options needed if previous crop is grass
    if (this.isPreviousCropGrass(previousCrop) && !this.isCropArable(crop)) { // grass -> grass (pp188) - The field is staying as grass
      return this.grasslandModifier(soil, recentlyGrownGrass);
    } else if (this.isCropArable(crop) && this.isPreviousCropGrass(previousCrop)) { // grass -> arable (pp94) - The field is converting from grassland to arable land
      return this.snsSearch(this.previousGrassSoilNitrogenSupplyTree, params, regularlyManure);
    } else {
      return this.snsSearch(this.soilNitrogenSupplyTree, params, regularlyManure);
    }
  }

  getCropRequirementsSupply(rainfall, crop, soil, previousCrop, regularlyManure, soilTestP, soilTestK, recentlyGrownGrass) {
    let sns = this.calculateSNS(rainfall, soil, crop, previousCrop, regularlyManure, recentlyGrownGrass);
    let choices = {
      sns: sns, // sns not used for grass requirement, ok to be grassland low/med/high
      rainfall: rainfall,
      soil: soil,
      crop: crop,
      'p-index': soilTestP,
      'k-index': soilTestK
    };
    let nitrogenRequirement = this.decision(this.cropRequirementsNitrogenTree, choices);
    // add/subtract based on table on pp188
    if (sns === this.grasslandHighSNS) nitrogenRequirement -= 30;
    if (sns === this.grasslandLowSNS) nitrogenRequirement += 30;
    let phosphorousRequirement = this.decision(this.cropRequirementsPhosphorousPotassiumTree, Object.assign({nutrient: 'phosphorous'}, choices));
    let potassiumRequirement = this.decision(this.cropRequirementsPhosphorousPotassiumTree, Object.assign({nutrient: 'potassium'}, choices));
    return {
      nitrogenRequirement: nitrogenRequirement,
      phosphorousRequirement: phosphorousRequirement,
      potassiumRequirement: potassiumRequirement,
      nitrogenSupply: sns
    }
  }

  getNutrients(type, amount, quality, season, crop, soil, application, soilTestP, soilTestK): Object {
    let params = {
      type: type,
      quality: quality,
      season: season,
      // IMPORTANT: we have to convert crop from the field types to send to manure
      crop: crop === 'grass-oilseed' || crop === 'grass' ? 'grass-oilseed' : 'normal',
		  // also we have to convert soil to the two types in manure (pp 66, note b)
      soil: soil === 'sandyshallow' || 'mediumshallow' ? 'sandyshallow' : 'mediumheavy',
      application: application
    };
    // get the total for pig or cattle slurry or poultry, then we apply the 
    // percent value later to get the crop available
    let total = type === 'pig' || type === 'cattle' || type === 'poultry' ? this.decision(this.nitrogenTotalTree, params) : 0;
    // high soil test means we're adding total
    let phosphorous = soilTestP === 'soil-p-2' || soilTestP === 'soil-p-3' ? 'p-total' : 'p-avail';
    let potassium = soilTestK === 'soil-k-2-' || soilTestK === 'soil-k-2+' || soilTestK === 'soil-k-3' ? 'k-total' : 'k-avail';
    // if pig or cattle slurry, then this is the percent value
    let n = this.decision(this.manureTree, Object.assign({nutrient: 'nitrogen'}, params));
    // N/A value
    if (n !== 'na') {
      // Apply percent or return straight value
      if (total !== 0) {
         n = this.pc(total, n);
      }
    }
    return this.processNutrients(
      amount,
      [
        n,
        this.decision(this.manureTree, Object.assign({nutrient: phosphorous}, params)),
        this.decision(this.manureTree, Object.assign({nutrient: potassium}, params))
      ]
    );
  }

  pc (v, p) {
    return (v / 100) * p;
  }

  processNutrients(amount, nutrients) {
    for (let nutrientIndex in nutrients) {
      if (!isNaN(nutrients[nutrientIndex])) {
        nutrients[nutrientIndex] = amount * nutrients[nutrientIndex];
      }
    }
    return nutrients;
  }

  // Searches through dataset tree with specified parameters
  decision(sourceTree, params) {
    function getBranch(tree, choice) {
      // Loop through current depth choices
      for (let index in tree.choices) {
        // Find correct choice node
        if (tree.choices[index].choice === choice) {
          // Check if final number or another layer
          if (typeof tree.choices[index].value === 'object') {
            return getBranch(tree.choices[index].value, params[tree.choices[index].value.decision]);
          } else {
            return tree.choices[index].value;
          }
        }
      }
      console.log('cannot find', choice);
    }
    // Start recursive search using first tree decision
    let end = getBranch(sourceTree, params[sourceTree.decision]);
    return end;
  }

  // Calculates the cost of a nutrient
  getCostStringFromNutrient(nutrientIndex, amounts, multiplier): String {
    if (!isNaN(amounts[nutrientIndex])) {
      return String((amounts[nutrientIndex] * this.settingsProvider.costs[nutrientIndex] * multiplier).toFixed(2));
    } else {
      return 'N/A';
    }
  }

}
