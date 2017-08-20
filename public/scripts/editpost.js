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


  function bindEvents() {

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
