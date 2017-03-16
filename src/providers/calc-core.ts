import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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
  cropRequirementsPhosphorousPotassium: any;
  
  grasslandHighSNS: number = 100;
  grasslandMedSNS: number = 101;
  grasslandLowSNS: number = 102;

  constructor(public http: Http) {
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
      this.cropRequirementsPhosphorousPotassium = data;
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
    let phosphorousRequirement = this.decision(this.cropRequirementsPhosphorousPotassium, Object.assign({nutrient: 'phosphorous'}, choices));
    let potassiumRequirement = this.decision(this.cropRequirementsPhosphorousPotassium, Object.assign({nutrient: 'potassium'}, choices));
    return {
      nitrogenRequirement: nitrogenRequirement,
      phosphorousRequirement: phosphorousRequirement,
      potassiumRequirement: potassiumRequirement,
      nitrogenSupply: sns
    }
  }

  getNutrients(type, amount, quality, season, crop, soil, application, soilTest) {
    
  }

  // Searches through dataset tree with specified parameters
  decision(sourceTree, params): number {
    function getBranch(tree, choice) {
      // Loop through current depth choices
      for (let index in tree.choices) {
        // Find correct choice node
        if (tree.choices[index].choice === choice) {
          // Check if final number or another layer
          if (isNaN(tree.choices[index].value)) {
            return getBranch(tree.choices[index].value, params[tree.choices[index].value.decision]);
          } else {
            return tree.choices[index].value;
          }
        }
      }
    }
    // Start recursive search using first tree decision
    let end = getBranch(sourceTree, params[sourceTree.decision]);
    return end;
  }

}
