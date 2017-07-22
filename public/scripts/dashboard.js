+function(mf){
  var utils = mf.utils;
  var reflections = mf.utils.api.reflections;
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
  }

  function loadUserReflections(){
    reflections.readAll()
    .then(function(list){
      var reflectionsHtml = _.map(list, renderReflection).join('');
      $('.reflections-list')
        .html(reflectionsHtml)
        .accordion();
    })
    .catch(function(){

    });
  }

  function renderReflection(reflection){
    return `<h3>${utils.formatDate(reflection.completedAt)}</h3>
    <div>
      <p>${reflection.text}</p>
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
  }

});
}(window.mf);
