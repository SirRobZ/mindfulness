+function(mf){

  function getToken(){
      return localStorage.getItem('x-auth');
  }

  function logout() {
    var token = localStorage.getItem('x-auth');
    return new Promise(function(resolve, reject){
      $.ajax({
        url: '/api/users/me/token',
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

  function formatDate(timestamp){
    var date = new Date(timestamp);
    return date.toString();
  }

  function getFormData(form){
    return form.serializeArray().reduce((obj, item) => {
      obj[item.name] = item.value;
      return obj;
    }, {});
  }

  function postSignUpData(data) {
    return serveData('/api/users', 'POST', data);
  }

  function postLoginData(data) {
    return serveData('/api/users/login', 'POST', data);
  }

  function serveData(url, method, data) {
    var token = getToken();
    return new Promise(function(resolve, reject){
      var ajaxOptions = {
        url: url,
        method: method,
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
      return serveData('/api/reflections', 'POST', newReflection)
        .then(function(result){
          return result.response;
        });
    },
    readAll: function(){
      return serveData('/api/reflections', 'GET')
        .then(function(result){
          var list = _.get(result, 'response.reflections');
          if(_.isArray(list)){
            return list;
          }
          throw Error('Invalid Data');
        });
    },
    readOne: function(){

    },
    update: function(){

    },
    remove: function(){
      return serveData('/api/reflections/:id', 'DELETE')
        .then
    }
  };

  var utils = {
    formatDate: formatDate,
    getToken: getToken,
    getFormData: getFormData,
    api: {
      serveData: serveData,
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
