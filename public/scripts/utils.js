// +function(global){

  var utils = {
    getFormData: getFormData,
    api: {
      postData: postData,
      postSignUpData: postSignUpData,
      postLoginData: postLoginData
    },
    auth: {
      logout: logout
    }
  };

  // expose to global scope
  // global.utils = utils;

  function logout() {
    var token = localStorage.getItem('x-auth');
    return new Promise(function(resolve, reject){
      $.ajax({
        url: '/users/me/token',
        method: 'DELETE',
        headers: {
          'x-auth': token
        },
        success: function(response, status, request) {
          localStorage.removeItem('x-auth');
          location.reload();
          resolve();
        },
        error: function(request, status, error) {
          reject(error);
        }
      });
    });
  }

  function getFormData(form){
    return form.serializeArray().reduce((obj, item) => {
      obj[item.name] = item.value;
      return obj;
    }, {});
  }

  function postSignUpData(data) {
    return postData('/users', data);
  }

  function postLoginData(data) {
    return postData('/users/login', data);
  }

  function postData(url, data) {
    return new Promise(function(resolve, reject){
      $.ajax({
        url: url,
        method: 'POST',
        dataType: 'json',
        data: data,
        success: function(response, status, request){
          resolve({
            response: response,
            status: status,
            request: request
          });
        },
        error: function(request, status, error){
          reject({
            request: request,
            status: status,
            error: error
          });
        }
      });
    });
  }

// }(this);
