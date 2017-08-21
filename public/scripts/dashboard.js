+ function(mf) {
  var utils = mf.utils;
  var reflections = mf.utils.api.reflections;
  var MFChart = mf.MFChart;
  var HABITS = ['sleep', 'exercise', 'diet', 'meditation'];
  $(function() {

    initiate();

    var currentUser = null;
    var currentReflectionsList = [];

// authentication

    function loadAuthenticatedUser() {
      return new Promise(function(resolve, reject) {
        var token = localStorage.getItem('x-auth');
        $.ajax({
          url: '/api/users/me',
          method: 'GET',
          dataType: 'json',
          headers: {
            'x-auth': token
          },
          success: function(userObject) {
            resolve(userObject);
          },
          error: function(request, status, error) {
            reject(error);
          }
        });
      });
    }

    function displayUserInfo() {
      $('.score-tracker h2').html(currentUser.fullName);
    }

// Bind Click Events

    function bindEvents() {
      var form = $('.logout-form');
      form.on('submit', function(event) {
        event.preventDefault();
        mf.utils.auth.logout().then(function() {
          console.log('Successful logout');
        }).catch(function(e) {
          console.log('Error when logging out');
          console.log(e);
        });
      });

      var newReflection = $('.new-reflection');
      newReflection.on('submit', function(event) {
        event.preventDefault();
        location.assign('/newpost.html');
      })

      $(document).on('click', '.delete-button', deleteHandler);

      $('.reflections-list').on('click', '.edit-button', editHandler)

      $('.reflections-list').on('click', '.cancel-button', cancelHandler)

      $('.reflections-list').on('click', '.save-button', saveHandler)

      $('.my-reflections').submit(function() {
        event.preventDefault();
        $('html,body').animate({
          scrollTop: $(".reflections-list").offset().top
        }, 'slow');
      });
    }

// Delete Handling

    function deleteHandler(event) {
      event.preventDefault();
      if (confirm('Are you sure?')) {
        deleteReflection($(this));
      }
    }

    function deleteReflection(button) {
      var reflectionElement = button.closest('div[reflectionId]')
      var reflectionId = reflectionElement.attr('reflectionId');
      reflections.removeById(reflectionId).then(function() {
        $('.reflections-list').accordion('destroy');
        loadUserReflections();
      }).catch(function() {
        reflectionElement.find('p.error-message').removeClass('hidden').text('Reflection has not been deleted successfully!');
      });
    }

// Edit Handling

    function editHandler(event) {
      event.preventDefault();
      editReflection($(this));
    }

    function editReflection(button) {
      var reflectionElement = button.closest('div[reflectionId]');
      var reflectionId = reflectionElement.attr('reflectionId');
      var reflection = _.find(currentReflectionsList, function(item) {
        return item._id === reflectionId;
      });
      reflectionElement.html(renderReflectionHtml(reflection, true));
    }

    function cancelHandler(event) {
      event.preventDefault();
      cancelEdit($(this));

    }

    function cancelEdit(button) {
      var reflectionElement = button.closest('div[reflectionId]');
      var reflectionId = reflectionElement.attr('reflectionId');
      var reflection = _.find(currentReflectionsList, function(item) {
        return item._id === reflectionId;
      });
      reflectionElement.html(renderReflectionHtml(reflection, false));
    }

    function saveHandler(event) {
      event.preventDefault();
      if (confirm('Are you sure?')) {
        saveEdit($(this));
      }

    }

    function saveEdit(button) {
      var reflectionElement = button.closest('div[reflectionId]');
      var reflectionId = reflectionElement.attr('reflectionId');
      var text = reflectionElement.find('.reflection-edit-text').val();
      var habits = _.map(reflectionElement.find('.habits input[type=checkbox]:checked'), function(habitInput) {
        return habitInput.name;
      });

      var reflection = {
        _id: reflectionId,
        text: text,
        habits: habits
      }
      reflections.update(reflection).then(function() {
        location.reload();
      }).catch(function(info) {
        console.error(info);
      });
    }

// Rendering Reflection List

    function loadUserReflections() {
      reflections.readAll().then(function(list) {
        currentReflectionsList = list.reverse();
        var reflectionsHtml = _.map(currentReflectionsList, renderReflection).join('');

        $('.reflections-list').html(reflectionsHtml).accordion({heightStyle: "content"});
      }).catch(function() {});
    }

    function getHabitsChecks(reflection) {
      var list = _.isArray(reflection.habits)
        ? reflection.habits
        : [];
      return _.map(HABITS, function(habit) {
        var checked = list.indexOf(habit) > -1;
        var checkId = reflection._id + '_habits_' + habit;
        return `<input id="${checkId}" type="checkbox" name="${habit}" ${checked
          ? `checked`
          : ``} /><label for="${checkId}">${habit}</label>`;
      }).join('<br>');
    }

    function renderReflection(reflection) {
      return `<h3>
      <div class="reflection-date">${moment(reflection.completedAt).format("MMM D YYYY")} </div>
    </h3>
    <div reflectionId="${reflection._id}" class="reflectionDetail">
      ${renderReflectionHtml(reflection, false)}
    </div>`;
    }

    function renderReflectionHtml(reflection, editMode) {
      return `
    ${editMode
        ? (`
      <textarea class="reflection-edit-text">${reflection.text}</textarea>
    `)
        : (`
      <p class="reflection-text">${reflection.text}</p>
    `)}
    <div class="details-options">
      <div class="habits-score">
        ${editMode
          ? (`
          <p class="habits">${getHabitsChecks(reflection)}</p>
        `)
          : `
          <p class="reflection-habits"> Mindful habits: ${reflection.habits} </p>
        `}
        <br>
        <p class="reflection-score"> Mindfulness Score: ${reflection.mindfulnessScore} </p>
      </div>
      <div class="delete-edit">
        ${editMode
            ? (`
          <button class="save-button btn btn-success">Save</button>
          <button class="cancel-button btn btn-success">Cancel</button>
        `)
            : (`
          <button class="edit-button btn btn-success">Edit</button>
        `)}
        <button class="delete-button btn btn-success">Delete</button>
        <p class="error-message hidden">Error</p>
      </div>
    </div>
    `;
    }

// Getting overall score

    function getMindfulnessScore() {
      reflections.readAll().then(function(list) {
        var sum = 0;
        for (i = 0; i < list.length; i++) {
          sum = sum + list[i].mindfulnessScore;
        }
        score = Math.round(sum / list.length);
        $('.score').html(score);
      }).catch(function() {});
    }

// Initiate

    function initiate() {
      bindEvents();
      loadAuthenticatedUser().then(function(userObject) {
        currentUser = userObject;

        displayUserInfo();
      }).catch(function() {
        localStorage.removeItem('x-auth');
        location.assign('/');
      });
      loadUserReflections();
      getMindfulnessScore();

      new MFChart('score');
      new MFChart('habits');
      new MFChart('fivefacet');
    }

  });
}(window.mf);
