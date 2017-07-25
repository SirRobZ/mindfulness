+ function(mf) {
  var utils = mf.utils;
  var reflections = mf.utils.api.reflections;

  function getLables() {
    reflections.readAll().then(function(list) {
      var lables = []
      for (i = 0; i < list.length; i++) {
        lables.push(utils.formatDate(list[i].completedAt));
      }
      return lables;
    }).catch(function() {});
  }

  var chartsOptions = {
    score: {
      canvasSelector: '#score-chart-canvas',
      config: {
        type: 'line',
        data: {
          labels: getLables(),
          datasets: [
            {
              label: "Mindfullness Scores",
              backgroundColor: 'red',
              borderColor: 'red',
              data: [
                1, 2, 3, 4
              ],
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Mindfullness Scores'
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
                  labelString: 'Month'
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Value'
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
    var options = chartsOptions[name];
    var selector = _.get(userOptions, 'canvasSelector', options.canvasSelector);
    this.context = $(selector).get(0).getContext('2d');
    this.chart = new Chart(this.context, options.config);
  }

  mf.module('MFChart', MFChart);

}(window.mf);
