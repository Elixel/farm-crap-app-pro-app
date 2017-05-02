import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Field } from '../../providers/field';
import { Strings } from '../../providers/strings';
import { CalcCore } from '../../providers/calc-core';

@IonicPage({
  defaultHistory: ['HomePage'],
  segment: 'field-detail/:fieldIndex'
})
@Component({
  selector: 'page-field-detail',
  templateUrl: 'field-detail.html'
})
export class FieldDetailPage {
  field: any;
  fieldIndex: number;
  graph: Boolean = true;
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
    // Do not calculate if no spreads!
    if (!this.field.spreads.length) {
      return;
    }
    // Create empty template for graphs
    let barChartLabels = [];
    let barChartData = [{
      data: [],
      label: 'N'
    }, {
      data: [],
      label: 'P'
    }, {
      data: [],
      label: 'K'
    }];
    // Pre-initialise min/max with first spread date
    let minimumDate = this.field.spreads[0].spreadDate;
    let maximumDate = this.field.spreads[0].spreadDate;
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
      barChartLabels.push(this.field.spreads[spreadIndex].spreadDate);
      barChartData[0].data.push(cropAvailable[0]);
      barChartData[1].data.push(cropAvailable[1]);
      barChartData[2].data.push(cropAvailable[2]);
      // Is this the highest or lowest date in the dataset?
      if (this.field.spreads[spreadIndex].spreadDate < minimumDate) {
        minimumDate = this.field.spreads[spreadIndex].spreadDate;
      }
      if (this.field.spreads[spreadIndex].spreadDate > maximumDate) {
        maximumDate = this.field.spreads[spreadIndex].spreadDate;
      }
    }
    // Convert to date object
    minimumDate = new Date(new Date(minimumDate).setDate(1));
    maximumDate = new Date(new Date(maximumDate).setDate(1));
    // Extend  max range by a month
    maximumDate.setMonth(maximumDate.getMonth() + 2);
    // Update graph options
    this.barChartOptions.scales.xAxes[0].time.min = minimumDate;
    this.barChartOptions.scales.xAxes[0].time.max = maximumDate;
    // hacky fix to refresh the graph, bug where labels do not update after data change
    this.graph = false;
    setTimeout(() => {
      this.barChartLabels = barChartLabels;
      this.barChartData = barChartData;
      this.graph = true;
    });
  }

  addSpreadPressed() {
    this.navCtrl.push('SpreadAddPage', {
      fieldIndex: this.navParams.data.fieldIndex
    });
  }

  editSpreadPressed(spreadIndex) {
    this.navCtrl.push('SpreadEditPage', {
      fieldIndex: this.navParams.data.fieldIndex,
      spreadIndex: spreadIndex
    });
  }

  deleteSpreadPressed(spreadIndex) {
    this.fieldProvider.deleteSpread(this.navParams.data.fieldIndex, spreadIndex);
    this.updateGraph();
  }

}
