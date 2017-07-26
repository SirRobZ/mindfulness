+ function(mf) {
  var utils = mf.utils;
  var reflections = mf.utils.api.reflections;

  function getLabels() {
    return reflections.readAll().then(function(list) {
      var labels = [];
      for (i = 0; i < list.length; i++) {
        labels.push(moment(list[i].completedAt).format("MMM D YY"));
      }
      return labels;
    }).catch(function() {});
  }

  function getData() {
    return reflections.readAll().then(function(list) {
      var data = [];
      for (i = 0; i < list.length; i++) {
        data.push(list[i].mindfulnessScore);
      }
      return data;
    }).catch(function() {});
  }

  var chartsOptions = {
    score: {
      canvasSelector: '#score-chart-canvas',
      config: {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: "Mindfulness Scores",
              backgroundColor: 'red',
              borderColor: 'red',
              data: [],
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Mindfulness Scores'
          },
          tooltips: {
            mode: 'index',
            intersect: false
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Score'
                }
              }
            ]
          }
        }
      }
    },
    homepage: {}
  };

  function MFChart(name, userOptions) {
    this.options = chartsOptions[name];
    var selector = _.get(userOptions, 'canvasSelector', this.options.canvasSelector);
    this.context = $(selector).get(0).getContext('2d');

    this.loadChart();
  }

  MFChart.prototype.loadChart = function() {
    var that = this;
    getData()
      .then(function(data) {
        that.setData(data);
        return getLabels();
      })
      .then(function(labels){
        that.setLabels(labels);
        that.createChart();
      });
  };

  MFChart.prototype.createChart = function () {
    if(_.isObject(this.options)){
      this.chart = new Chart(this.context, this.options.config);
    }
  };

  MFChart.prototype.setData = function(data) {
    if (_.isObject(this.options)) {
      _.set(this.options, 'config.data.datasets[0].data', data);
    }
  };

  MFChart.prototype.setLabels = function(labels) {
    if (_.isObject(this.options)) {
      _.set(this.options, 'config.data.labels', labels);
    }
  };

  mf.module('MFChart', MFChart);

}(window.mf);
