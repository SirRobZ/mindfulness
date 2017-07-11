$(function() {

  initiate();

  // var utils = window.utils;

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

  function bindEvents() {
    var form = $('.logout-form');
    form.on('submit', function(event) {
      event.preventDefault();
      utils.auth.logout()
      .then(function(){
        console.log('Successful logout');
      })
      .catch(function(e){
        console.log('Error when logging out');
        console.log(e);
      });
    });
  }


});
