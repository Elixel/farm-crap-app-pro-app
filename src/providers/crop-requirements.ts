import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CropRequirements provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CropRequirements {
  data: any;
  dataPK: any;

  public cropRequirementsLabelMap = {
    'spring-barley-incorporated': 'Spring barley, straw incorporated',
    'spring-barley-removed': 'Spring barley, straw removed',
    'winter-wheat-incorporated': 'Winter wheat, straw incorporated',
    'winter-wheat-removed': 'Winter whea, straw removed',
    'grass-cut': 'Grass cut (yield 6-8k, conc 1.5, stock med)',
    'grass-grazed': 'Grass grazed (yield 6-8k, conc 1.5, stock med)'
  };

  constructor(public http: Http) {
    this.data = null;
    this.dataPK = null;
  }

  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('assets/json/crop-requirements-n.json')
      .map(resN => resN.json())
      .subscribe(dataN => {
        this.data = dataN;
        this.http.get('assets/json/crop-requirements-pk.json')
        .map(resPK => resPK.json())
        .subscribe(dataPK => {
          this.dataPK = dataPK;
          resolve(this.data);
        })
      });
    })
  }

  lookup(cropChoice, nutrientChoice, soilChoice, snsChoice) {
    if (nutrientChoice === 'nitrogen') {
      // Select the N dataset (crop-requirements-n.json)
      let cropTree = this.data.choices;
      // Ascend down tree leaves
      for (let cropIndex in cropTree) {
        // Compare crop choice
        if (cropTree[cropIndex].choice === cropChoice) {
          // Check if the value is a number or deeper tree
          if (isNaN(cropTree[cropIndex].value)) {
            // Progress down tree
            let soilTree = cropTree[cropIndex].value.choices;
            for (let soilIndex in soilTree) {
              // Compare soil choice
              if (soilTree[soilIndex].choice === soilChoice) {
                let snsTree = soilTree[soilIndex].value.choices;
                for (let snsIndex in snsTree) {
                  // Compare soil nitrogen supply choice
                  if (snsTree[snsIndex].choice === snsChoice) {
                    return snsTree[snsIndex].value;
                  }
                }
              }
            }
          } else {
            // Return value
            return cropTree[cropIndex].value;
          }
        }
      }
    } else if (nutrientChoice === 'phosphorous' || nutrientChoice === 'potassium') {
      // Select the PK dataset (crop-requirements-pk.json)
      let cropTree = this.dataPK.choices;
      // Ascend down tree leaves
      for (let cropIndex in cropTree) {
        // Compare crop choice
        if (cropTree[cropIndex].choice === cropChoice) {
          let nutrientTree = cropTree[cropIndex].value.choices;
          for (let nutrientIndex in nutrientTree) {
            // Compare nutrient choice
            if (nutrientTree[nutrientIndex].choice === nutrientChoice) {
              let soilIndexTree = nutrientTree[nutrientIndex].value.choices;
              for (let soilIndexIndex in soilIndexTree) {
                // Compare soil index choice
                if (soilIndexTree[soilIndexIndex].choice === soilChoice) {
                  return soilIndexTree[soilIndexIndex].value;
                }
              }
            }
          }
        }
      }
    }
  }

}
