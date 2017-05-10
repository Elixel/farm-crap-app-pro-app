import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Settings } from '../providers/settings';
import { Strings } from '../providers/strings';

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

  constructor(
    public http: Http,
    private settingsProvider: Settings,
    private stringsProvider: Strings,
    private datePipe: DatePipe
  ) {}

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

  calculateNutrients(type, amount, quality, season, crop, soil, application, soilTestP, soilTestK): Object {
    if (type === 'custom') {
      let nutrients = this.processNutrients(amount, this.settingsProvider.customManure[quality].content);
      return [
        // total
        nutrients,
        // avail (duplicate)
        nutrients
      ]
    } else {
      return this.getNutrients(type, amount, quality, season, crop, soil, application, soilTestP, soilTestK);
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


    // Total values
    let totalValues = this.processNutrients(
      amount,
      [
        // if pig or cattle slurry, then this is the percent value
        total === 0 ? this.decision(this.manureTree, Object.assign({nutrient: 'n-total'}, params)) : total,
        this.decision(this.manureTree, Object.assign({nutrient: 'p-total'}, params)),
        this.decision(this.manureTree, Object.assign({nutrient: 'k-total'}, params))
      ]
    );

    // Crop available values
    let n2 = this.decision(this.manureTree, Object.assign({nutrient: 'nitrogen'}, params));
    // N/A value
    if (n2 !== 'na') {
      // Apply percent or return straight value
      if (total !== 0) {
         n2 = this.pc(total, n2);
      }
    }
    let cropAvailValues = this.processNutrients(
      amount,
      [
        n2,
        this.decision(this.manureTree, Object.assign({nutrient: phosphorous}, params)),
        this.decision(this.manureTree, Object.assign({nutrient: potassium}, params))
      ]
    );

    return [
      totalValues,
      cropAvailValues
    ];
  }

  pc (v, p) {
    return (v / 100) * p;
  }

  processNutrients(amount, nutrients) {
    let nutrientsArray: any[] = [];
    for (let nutrientIndex in nutrients) {
      if (!isNaN(nutrients[nutrientIndex])) {
        nutrientsArray.push(amount * nutrients[nutrientIndex]);
      }
    }
    return nutrientsArray;
  }

  // Searches through dataset tree with specified parameters
  decision(sourceTree, params) {
    function getBranch(tree, choice) {
      // If a default is found in branch, store it in this
      let defaultChoice;
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
        // If a default choice is encountered, store it just incase
        } else if (tree.choices[index].choice === 'default') {
          if (typeof tree.choices[index].value === 'object') {
            defaultChoice = getBranch(tree.choices[index].value, params[tree.choices[index].value.decision]);
          } else {
            defaultChoice = tree.choices[index].value;
          }
        }
      }
      // If the exact value was not found and a default was found
      if (defaultChoice) {
        console.info('CalcCore.decision(): Cannot find ' + choice + ' but found default', defaultChoice);
        return defaultChoice;
      // Nothing was found!
      } else {
        console.error('CalcCore.decision(): Cannot find ' + choice + ' no default found - data missing!');
      }
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

  findImage(type, amount) {
    let img = 'assets/images/crap/';
    switch(type) {
      case 'cattle': {
        img += 'cattle/';
        if (amount <= 25) img += '25m3';
        else if (amount <= 30) img += '30m3';
        else if (amount <= 50) img += '50m3';
        else img += '100m3';
        break;
      }
      case 'fym': {
        img += 'fym/';
        if (amount <= 25) img += '25t';
        else img += '50t';
        break;
      }
      case 'pig': {
        img += 'pig/';
        if (amount <= 25) img += '25m3';
        else if (amount <= 50) img += '50m3';
        else img += '75m3';
        break;
      }
      case 'poultry': {
        img += 'poultry/';
        if (amount <= 5) img += '5t';
        else img += '10t';
        break;
      }
      case 'compost': {
        img += 'compost/';
        if (amount <= 5) img += '5t';
        else if (amount <= 10) img += '10t';
        else if (amount <= 15) img += '15t';
        else if (amount <= 20) img += '20t';
        else if (amount <= 25) img += '25t';
        else if (amount <= 30) img += '30t';
        else if (amount <= 35) img += '35t';
        else if (amount <= 40) img += '40t';
        else if (amount <= 45) img += '45t';
        else img += '50t';
        break;

      }
      default: {
        img += 'cattle/25m3';
        break;
      }
    }
    img += '.jpg';
    return img;
  }

  getSeason(month) {
    switch (month) {
      case 12:
      case 1:
      case 2:
        return 'winter';
      case 3:
      case 4:
      case 5:
        return 'spring';
      case 6:
      case 7:
      case 8:
        return 'summer';
      case 9:
      case 10:
      case 11:
        return 'winter';
    };
  }

  metricTonToImperialTon(metricTon) {
    return metricTon * 0.984207;
  }

  imperialTonToMetricTon(imperialTon) {
    return imperialTon / 0.984207;
  }

  tonsAcreToTonsHectare(tonsAcre) {
    return tonsAcre * 2.4710538146717;
  }

  tonsHectareToTonsAcre(tonsHectare) {
    return tonsHectare / 2.4710538146717;
  }

  gallonsAcreToMetresCubedHectare(gallonsAcre) {
    return gallonsAcre * 0.0112336377;
  }

  metresCubedHectareToGallonsAcre(metresCubedHectare) {
    return metresCubedHectare / 0.0112336377;
  }

  kilogramHectareToUnitsAcre(kilogramHectare) {
    return kilogramHectare * 0.8;
  }

  unitsAcreToKilogramHectare(unitsAcre) {
    return unitsAcre / 0.8;
  }

  hectaresToAcres(hectares) {
    return hectares * 2.4710538146717;
  }

  acresToHectares(acres) {
    return acres / 2.4710538146717;
  }

  metresCubedToGallons(metresCubed) {
    return metresCubed * 219.969;
  }

  public toCSV(fields) {
    let csv = [];
    // Add headings
    csv.push([
      '"Field name"',
      '"Manure type"',
      '"Date"',
      '"Crop avail N"',
      '"Crop avail P"',
      '"Crop avail K"',
      '"Crop req N"',
      '"Crop req P"',
      '"Crop req K"',
      '"Total in manure N"',
      '"Total in manure P"',
      '"Total in manure K"',
      '"SNS"',
      '"Soil"',
      '"Field size"',
      '"Rate"',
      '"Manure quality"',
      '"Manure application"',
      '"Season"',
      '"Crop"'
    ]);
    // Loop through fields
    for (let fieldIndex in fields) {
      let field:any = fields[fieldIndex];
      // Loop through spreads
      for (let spreadIndex in field.spreads) {
        let spread = field.spreads[spreadIndex];
        // Do calculations
        let cropAvail = this.getCropRequirementsSupply(
          this.settingsProvider.rainfall,
          field.newCropType,
          field.soilType,
          field.oldCropType,
          field.organicManures,
          field.soilTestP,
          field.soilTestK,
          field.grassGrown
        );
        let cropReq = this.calculateNutrients(
          spread.manureType,
          spread.manureDensity,
          spread.manureQuality,
          this.getSeason(new Date(field.spreads[spreadIndex].spreadDate).getMonth() + 1),
          field.newCropType,
          field.soilType,
          spread.manureApplicationType,
          field.soilTestP,
          field.soilTestK
        );
        let sns = String(this.calculateSNS(
          this.settingsProvider.rainfall,
          field.soilType,
          field.newCropType,
          field.oldCropType,
          field.organicManures,
          field.grassGrown
        ));
        let season = this.getSeason(new Date(field.spreads[spreadIndex].spreadDate).getMonth() + 1);
        // Create row in CSV
        csv.push([
          '"' + field.name + '"',
          '"' + this.stringsProvider.data.type[spread.manureType] + '"',
          '"' + this.datePipe.transform(spread.spreadDate, 'dd/MM/yyyy') + '"',
          '"' + cropAvail.nitrogenRequirement + '"',
          '"' + cropAvail.phosphorousRequirement + '"',
          '"' + cropAvail.potassiumRequirement + '"',
          '"' + cropReq[1][0] + '"',
          '"' + cropReq[1][1] + '"',
          '"' + cropReq[1][2] + '"',
          '"' + cropReq[0][0] + '"',
          '"' + cropReq[0][1] + '"',
          '"' + cropReq[0][2] + '"',
          '"' + this.stringsProvider.data.soilNutrientCodeToText[this.settingsProvider.units][sns] + '"',
          '"' + this.stringsProvider.data.soil[field.soilType] + '"',
          '"' + field.hectares + '"',
          '"' + spread.manureDensity + '"',
          '"' + this.stringsProvider.data.quality[spread.manureType][spread.manureQuality] + '"',
          '"' + (spread.manureApplicationType ? this.stringsProvider.data.application[spread.manureType][spread.manureApplicationType] : 'N/A') + '"',
          '"' + this.stringsProvider.data.season[season] + '"',
          '"' + this.stringsProvider.data.crop[field.newCropType] + '"'
        ]);
      }
    }
    // Convert array to csv and return it
    return csv.join('\n');
  }

}
