+function(mf){

  function getToken(){
      return localStorage.getItem('x-auth');
  }

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
    var token = getToken();
    return new Promise(function(resolve, reject){
      var ajaxOptions = {
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
      };
      if(token){
        ajaxOptions.headers = {
          'x-auth': token
        };
      }
      $.ajax(ajaxOptions);
    });
  }


  // CRUD => Create Read Update Delete
  // falsy: '' null undefined 0 NaN false -0
  var reflections = {
    create: function(newReflection){
      var mindfulnessScore = _.get(newReflection, 'mindfulnessScore');
      var text = _.get(newReflection, 'text');
      if(!_.isNumber(mindfulnessScore) || !_.isString(text) || !text){
        console.log('to create a reflection we need a text and a score');
        return Promise.reject(Error('missing attribute'));
      }
      return postData('/reflections', newReflection)
        .then(function(result){
          debugger;
          console.log('>>> response: ', result.response);
          return result.response;
        });
    },
    readAll: function(){

    },
    readOne: function(){

    },
    update: function(){

    },
    remove: function(){

    }
  };

  var utils = {
    getToken: getToken,
    getFormData: getFormData,
    api: {
      postData: postData,
      postSignUpData: postSignUpData,
      postLoginData: postLoginData,
      reflections: reflections
    },
    auth: {
      logout: logout
    }
  };

  // expose to global scope
  mf.utils = utils;

}(window.mf);
