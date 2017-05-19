import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Field } from '../../providers/field';
import { Strings } from '../../providers/strings';
import { Settings } from '../../providers/settings';
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

  public graphWidth;
  public graphReady = false;
  public barChartLabels:string[];
  public barChartData:any[];
  public barChartOptions:any;;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fieldProvider: Field,
    private stringsProvider: Strings,
    private calcCore: CalcCore,
    private settingsProvider: Settings
  ) {
    // Load strings
    this.strings = stringsProvider.data;
    // Configure bar chart
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'month',
            displayFormats: {
              month: 'MM/YY'
            },
            round: 'month'
          },
          ticks: {
            minRotation: 90
          }
        }],
        yAxes: [{
          ticks: {
            min: 0
          },
          scaleLabel: {
            display: true,
            labelString: stringsProvider.data.units[settingsProvider.units].density + '/' + stringsProvider.data.units[settingsProvider.units].fieldSize.short
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
          left: 10,
          bottom: 0
        }
      }
    };
    // Get field data
    this.field = this.fieldProvider.fields[navParams.data.fieldIndex];
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
      barChartData[0].data.push(cropAvailable[1][0]);
      barChartData[1].data.push(cropAvailable[1][1]);
      barChartData[2].data.push(cropAvailable[1][2]);
      // Is this the highest or lowest date in the dataset?
      if (this.field.spreads[spreadIndex].spreadDate < minimumDate) {
        minimumDate = this.field.spreads[spreadIndex].spreadDate;
      }
      if (this.field.spreads[spreadIndex].spreadDate > maximumDate) {
        maximumDate = this.field.spreads[spreadIndex].spreadDate;
      }
    }
    // Display full years (01/01/2XXX - 31/12/2XXX)
    minimumDate = new Date(new Date(minimumDate).getFullYear(), 0, 1);
    maximumDate = new Date(new Date(maximumDate).getFullYear(), 11, 31);
    var years = 1 + maximumDate.getFullYear() - minimumDate.getFullYear();
    // Resize graph container to display one year per display width
    this.graphWidth = years * 100;
    // Update graph options
    this.barChartOptions.scales.xAxes[0].time.min = minimumDate;
    this.barChartOptions.scales.xAxes[0].time.max = maximumDate;
    // hacky fix to refresh the graph, bug where labels do not update after data change
    this.graph = false;
    this.graphReady = false;
    setTimeout(() => {
      this.barChartLabels = barChartLabels;
      this.barChartData = barChartData;
      this.graph = true;
      setTimeout(() => {
        this.graphReady = true;
      });
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
