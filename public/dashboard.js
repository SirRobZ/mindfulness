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
    $('.score-tracker h2').html(currentUser.email);
  }

  function initiate() {
    loadAuthenticatedUser().then(function(userObject) {
      currentUser = userObject;

      displayUserInfo();
    }).catch(function() {
      localStorage.removeItem('x-auth');
      location.assign('/');
    });
  }

});
