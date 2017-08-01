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

  function getHabits() {
    return reflections.readAll().then(function(list) {
      var habits = [];
      for (i = 0; i < list.length; i++) {
        habits = habits.concat(list[i].habits)
      }
      var sleep = 0;
      var diet = 0;
      var exercise = 0;
      var meditation = 0;

      for (var i = 0; i < habits.length; i++) {
        if (habits[i] === "sleep") {
          sleep++;
        } else if (habits[i] === "diet") {
          diet++;
        } else if (habits[i] === "exercise") {
          exercise++;
        } else {
          meditation++;
        }
      }

      return [sleep, diet, exercise, meditation]
    }).catch(function() {});
  }

  function getFiveFacets() {
    return reflections.readAll().then(function(list) {
      var observeTotal = 0;
      var describeTotal = 0;
      var actingTotal = 0;
      var nonjudgingTotal = 0;
      var nonreactTotal = 0;

      for (i = 0; i < list.length; i++) {
        observeTotal = observeTotal + list[i].observeScore;
        describeTotal = describeTotal + list[i].describeScore;
        actingTotal = actingTotal + list[i].actingScore;
        nonjudgingTotal = nonjudgingTotal + list[i].nonjudgingScore;
        nonreactTotal = nonreactTotal + list[i].nonreactScore;
      }
      return [
        observeTotal / list.length,
        describeTotal / list.length,
        actingTotal / list.length,
        nonjudgingTotal / list.length,
        nonreactTotal / list.length
      ]
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
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Mindfulness over time'
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
    habits: {
      canvasSelector: '#habit-chart-canvas',
      config: {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [],
              backgroundColor: [
                'dodgerblue', 'lightcoral', 'sandybrown', 'mediumturquoise'
              ],
              label: 'Dataset 1'
            }
          ],
          labels: ["Proper Sleep", "Healthy Diet", "Regular Exercise", "Meditation"]
        },
        options: {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Mindful Habits'
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      }
    },
    fivefacet: {
      canvasSelector: '#fivefacet-chart-canvas',
      config: {
        type: 'radar',
        data: {
          labels: [
            ["Staying Present"],
            [
              "Describing", "thoughts & feelings"
            ],
            [
              "Acting with", "awareness"
            ],
            [
              "Nonjudgement of", "own experience"
            ],
            ["Controling", "emotions"]
          ],
          datasets: [
            {
              label: "Five Facet Mindfulness",
              backgroundColor: 'rgba(219, 242, 242, .5)',
              borderColor: 'mediumturquoise',
              pointBackgroundColor: 'mediumturquoise',
              data: []
            }
          ]
        },
        options: {
          maintainAspectRatio: true,
          scale: {
            ticks: {
              min: 0,
              max: 15
            }
          },
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Five Facet Mindfulness'
          }
        }
      }
    }
  };

  function MFChart(name, userOptions) {
    this.options = chartsOptions[name];
    var selector = _.get(userOptions, 'canvasSelector', this.options.canvasSelector);
    this.context = $(selector).get(0).getContext('2d');

    this.loadChart();
  }

  MFChart.prototype.loadChart = function() {
    var that = this;
    if (that.options.config.type === 'line') {
      getData().then(function(data) {
        that.setData(data);
        return getLabels();
      }).then(function(labels) {
        that.setLabels(labels);
        that.createChart();
      });
    } else if (that.options.config.type === 'doughnut') {
      getHabits().then(function(habits) {
        that.setHabits(habits);
        that.createChart();
      })
    } else if (that.options.config.type === 'radar') {
      getFiveFacets().then(function(facets) {
        that.setFacets(facets);
        that.createChart();
      })
    }
  };

  MFChart.prototype.createChart = function() {
    if (_.isObject(this.options)) {
      this.chart = new Chart(this.context, this.options.config);
    }
  };

  MFChart.prototype.setFacets = function(facets) {
    if (_.isObject(this.options)) {
      _.set(this.options, 'config.data.datasets[0].data', facets);
    }
  };

  MFChart.prototype.setHabits = function(habits) {
    if (_.isObject(this.options)) {
      _.set(this.options, 'config.data.datasets[0].data', habits);
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
