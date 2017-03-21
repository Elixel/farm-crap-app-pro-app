import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SpreadAddPage } from '../spread-add/spread-add';
import { SpreadEditPage } from '../spread-edit/spread-edit';

import { Field } from '../../providers/field';
import { Strings } from '../../providers/strings';
import { CalcCore } from '../../providers/calc-core';

/*
  Generated class for the FieldDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-field-detail',
  templateUrl: 'field-detail.html'
})
export class FieldDetailPage {
  field: any;
  fieldIndex: number;
  
  strings: Object;

  public barChartLabels:string[];
  public barChartData:any[];
  public barChartOptions:any = {
    responsive: true,
    scales: {
      xAxes: [{
        barPercentage: 0.8,
        categoryPercentage: 0.25,
        type: 'time',
        time: {
          unit: 'month',
          displayFormats: {
            month: 'MMM \'YY'
          },
          round: 'week'
        },
        ticks: {
          minRotation: 45
        }
      }],
      yAxes: [{
        ticks: {
          min: 0
        }
      }]
    },
    tooltips: {
      enabled: false
    },
    layout: {
      padding: {
        top: 0,
        right: 20,
        left: 20,
        bottom: 0
      }
    }
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fieldProvider: Field,
    private stringsProvider: Strings,
    private calcCore: CalcCore
  ) {
    // Get field data
    this.field = this.fieldProvider.fields[navParams.data.fieldIndex];
    // Load strings
    this.strings = stringsProvider.data;
    // Create graph
    this.updateGraph();
  }

  ionViewWillEnter() {
    // Update field data (fixes issue where graph won't upload when new spread is added)
    this.field = this.fieldProvider.fields[this.navParams.data.fieldIndex];
    // Update graph if data loaded
    if (this.field) {
      this.updateGraph();
    }
  }

  updateGraph() {
    // Create empty template for graphs
    this.barChartLabels = [];
    this.barChartData = [{
      data: [],
      label: 'N'
    }, {
      data: [],
      label: 'P'
    }, {
      data: [],
      label: 'K'
    }];
    // Loop through spreads to populate graph
    for (let spreadIndex in this.field.spreads) {
      // Calculate graph data
      let cropAvailable = this.calcCore.calculateNutrients(
        this.field.spreads[spreadIndex].manureType,
        this.field.spreads[spreadIndex].manureDensity,
        this.field.spreads[spreadIndex].manureQuality,
        this.calcCore.getSeason(new Date(this.field.spreads[spreadIndex].spreadDate).getMonth() + 1),
        this.field.newCropType,
        this.field.soilType,
        this.field.spreads[spreadIndex].manureApplicationType,
        this.field.soilTestP,
        this.field.soilTestK
      );
      this.barChartLabels.push(this.field.spreads[spreadIndex].spreadDate);
      this.barChartData[0].data.push(cropAvailable[0]);
      this.barChartData[1].data.push(cropAvailable[1]);
      this.barChartData[2].data.push(cropAvailable[2]);
    }
  }

  addSpreadPressed() {
    this.navCtrl.push(SpreadAddPage, {
      fieldIndex: this.navParams.data.fieldIndex
    });
  }

  editSpreadPressed(spreadIndex) {
    this.navCtrl.push(SpreadEditPage, {
      fieldIndex: this.navParams.data.fieldIndex,
      spreadIndex: spreadIndex
    });
  }

  deleteSpreadPressed(spreadIndex) {
    this.fieldProvider.deleteSpread(this.navParams.data.fieldIndex, spreadIndex);
    this.updateGraph();
  }

}
