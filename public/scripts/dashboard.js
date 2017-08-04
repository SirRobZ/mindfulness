+function(mf){
  var utils = mf.utils;
  var reflections = mf.utils.api.reflections;
  var MFChart = mf.MFChart;
$(function() {

  initiate();

  var currentUser = null;

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



  function displayUserInfo(){
    $('.score-tracker h2').html(currentUser.fullName);
  }


  function bindEvents() {
    var form = $('.logout-form');
    form.on('submit', function(event) {
      event.preventDefault();
      mf.utils.auth.logout()
      .then(function(){
        console.log('Successful logout');
      })
      .catch(function(e){
        console.log('Error when logging out');
        console.log(e);
      });
    });

    var newReflection = $('.new-reflection');
      newReflection.on('submit', function(event) {
        event.preventDefault();
        location.assign('/newpost.html');
      })

    $(document).on('click', '.delete-button', deleteHandler)

    $('.my-reflections').submit(function() {
      event.preventDefault();
      $('html,body').animate({
        scrollTop: $(".reflections-list").offset().top},
        'slow');
});
  }

  function deleteHandler(event) {
    event.preventDefault();

    if(confirm('Are you sure?')){
      deleteReflection($(this));
    }

  }

  function deleteReflection(button){
    var reflectionElement = button.parent();
    var reflectionId = reflectionElement.attr('reflectionId');
    reflections.removeById(reflectionId)
      .then(function(){
        $('.reflections-list').accordion('destroy');
        loadUserReflections();
      })
      .catch(function(){
        reflectionElement
          .find('p.error-message')
          .removeClass('hidden')
          .text('Reflection has not been deleted successfully!');
      });
  }

  function loadUserReflections(){
    reflections.readAll()
    .then(function(list){
      var reflectionsHtml = _.map(list.reverse(), renderReflection).join('');
      $('.reflections-list')
        .html(reflectionsHtml)
        .accordion();
    })
    .catch(function(){
    });
  }

  function getMindfulnessScore(){
    reflections.readAll()
    .then(function(list){
      var sum = 0;
      for (i =0; i<list.length; i++) {
        sum = sum + list[i].mindfulnessScore;
      }
      score = Math.round(sum/list.length);
      $('.score').html(score);
    })
    .catch(function(){
    });
  }

  function renderReflection(reflection){
    return`<h3>
      <div class="reflection-date">${moment(reflection.completedAt).format("MMM D YYYY")} </div>

    </h3>
    <div reflectionId="${reflection._id}" class="reflectionDetail">
      <p class="reflection-text">${reflection.text}</p>
      <p class="reflection-habits"> Mindful habits: ${reflection.habits} </p>
      <br>
      <p class="reflection-score"> Mindfulness Score: ${reflection.mindfulnessScore} </p>
      <br>
      <button class="delete-button btn btn-success">Delete</button>
      <p class="error-message hidden">Error</p>
    </div>`;
  }

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
