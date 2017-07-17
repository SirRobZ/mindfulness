+function(mf){


$(function() {

  initiate();

  var state = {
    isLandingPage: true
  };

  var page = {
    signupSuccessMessage: '#signup-form .signup-messages .alert-success',
    signupFailureMessage: '#signup-form .signup-messages .alert-danger',
    signupDefaultFailure: 'Sign up process did not work',
    signupDefaultSuccess: 'Signup Sucessful!',
    invalid409: 'One of the values in the form is not valid'
  };

  var auth = {
    saveToken,
    removeToken
  };

  function saveToken(token) {
    localStorage.setItem('x-auth', token);
  }

  function removeToken() {
    localStorage.removeItem('x-auth');
  }

  function bindEvents() {
    $('.login-button').on('click', function(event) {
      event.preventDefault()
      state.isLandingPage = false;
      $('.signup-page').removeClass('hidden')
      router(state)
    })

    var loginForm = $('#login-form');
    loginForm.on('submit', function(event) {
      event.preventDefault();
      var data = mf.utils.getFormData(loginForm);
      console.log(data);
      mf.utils.api.postLoginData(data)
        .then(handleLoginSuccess)
        .catch(handleLoginError);
    })


    var signupForm = $('#signup-form');
    signupForm.on('submit', function(event) {
      event.preventDefault();
      var data = mf.utils.getFormData(signupForm);
      if (data.password === data.passwordConfirm) {
        mf.utils.api.postSignUpData(data)
          .then(handleSuccess)
          .catch(handleError);
      } else {
        $('#signup-form .signup-messages .alert-danger').removeClass('hidden').text('Passwords must be identical')
      }
    });
  }



  function handleSuccess(args) {
    var response = args.response;
    var status = args.status;
    var request = args.request;
    var messageEl = $(page.signupSuccessMessage);
    var errorMessageEl = $(page.signupFailureMessage);
    messageEl.html(page.signupDefaultSuccess);
    errorMessageEl.addClass('hidden');
    messageEl.removeClass('hidden');

    var xAuth = request.getResponseHeader('x-auth');
    if (xAuth) {
      auth.saveToken(xAuth);

      setTimeout(() => {
        location.assign('/dashboard.html');
      }, 2000);
    } else {
      throw Error('Missing Token');
    }
  }

  function handleError(args) {
    var request = args.request;
    var status = args.status;
    var error = args.error;
    var messageEl = $(page.signupFailureMessage);
    if (args.request.status === 409) {
      if (error.responseJSON.hasOwnProperty('attributeName')) {
        messageEl.html(error.responseJSON.attributeName + ' should be unique!');
      } else {
        messageEl.html(page.invalid409);
      }
    } else {
      messageEl.html(page.signupDefaultFailure);
    }
    messageEl.removeClass('hidden');
  }

  function handleLoginSuccess(args) {
    var response = args.response;
    var status = args.status;
    var request = args.request;
    var xAuth = request.getResponseHeader('x-auth');
    if (xAuth) {
      auth.saveToken(xAuth);
      location.assign('/dashboard.html');
    } else {
      throw Error('Missing Token');
    }
  }

  function handleLoginError(args) {
    var request = args.request;
    var status = args.status;
    var error = args.error;

  }

  //

  function router(state) {
    if (state.isLandingPage) {
      $('.landing-page').removeClass('hidden')
    } else {
      $('.landing-page').addClass('hidden')
    }
  }

  function initiate() {
    bindEvents();
  }

});
}(window.mf);
