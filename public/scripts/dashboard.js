+function(mf){

$(function() {

  initiate();

  var currentUser = null;

  function loadAuthenticatedUser() {
    return new Promise(function(resolve, reject) {
      var token = localStorage.getItem('x-auth');
      $.ajax({
        url: '/users/me',
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

  function initiate() {
    bindEvents();
    loadAuthenticatedUser().then(function(userObject) {
      currentUser = userObject;

      displayUserInfo();
    }).catch(function() {
      localStorage.removeItem('x-auth');
      location.assign('/');
    });
  }

});
}(window.mf);
