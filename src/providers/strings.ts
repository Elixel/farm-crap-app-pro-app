import { Injectable } from '@angular/core';

/*
  Generated class for the Strings provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Strings {
  data: Object = {
    'crop': {
        'spring-barley-incorporated': 'Spring barley, straw incorporated',
        'spring-barley-removed': 'Spring barley, straw removed',
        'winter-wheat-incorporated': 'Winter wheat, straw incorporated',
        'winter-wheat-removed': 'Winter whea, straw removed',
        'grass-cut': 'Grass cut (yield 6-8k, conc 1.5, stock med)',
        'grass-grazed': 'Grass grazed (yield 6-8k, conc 1.5, stock med)'
    },
    'soil': {
        'sandyshallow': 'Sandy/Shallow',
        'mediumshallow': 'Medium/Shallow',
        'deepclay': 'Deep Clay',
        'deepsilt': 'Deep Silt',
        'organic': 'Organic (10-20% organic matter)',
        'peat': 'Peat',
        'medium': 'Medium'
    },
    'previousCrop': {
        'cereals': 'Cereals',
        'low-n-veg': 'Low nitrogen veg',
        'forage': 'Forage crops (cut)',
        'sugarbeet': 'Sugar beet',
        'oilseed': 'Oilseed rape',
        'potatoes': 'Potatoes',
        'peas': 'Peas',
        'beans': 'Beans',
        'uncropped': 'Uncropped land',
        'medium-n-veg': 'Medium nitrogen veg',
        'high-n-veg': 'High nitrogen veg',
        'grass-low-n': 'Grass (low N/1 or more cuts)',
        'grass-high-n': 'Grass (3-5yr, high N, grazed)',
        'grass-other': 'Any other grass'
    },
    'soilNutrientCodeToText': {
      '0': '<60',
      '1': '61-80',
      '2': '81-100',
      '3': '101-120',
      '4': '121-160',
      '5': '161-240',
      '6': '>240',
      'grassland-high-sns': 'Grassland high SNS',
      'grassland-med-sns': 'Grassland medium SNS',
      'grassland-low-sns': 'Grassland low SNS'
    },
    'soilNutrientCodeToTextImperial': {
      '0': '<48',
      '1': '49-64',
      '2': '65-80',
      '3': '81-96',
      '4': '97-128',
      '5': '129-192',
      '6': '>193',
      'grassland-high-sns': 'Grassland high SNS',
      'grassland-med-sns': 'Grassland medium SNS',
      'grassland-low-sns': 'Grassland low SNS'
    }
  };

  constructor() {}

}
