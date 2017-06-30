/* globals $ */
var state = {
  isLandingPage: true
};

var page = {
  signupSuccessMessage: '#signup-form .signup-messages .alert-success',
  signupFailureMessage: '#signup-form .signup-messages .alert-danger',
  signupDefaultFailure: 'Sign up process did not work',
  signupDefaultSuccess: 'Signup Sucessful!',
  invalid409 : 'One of the values in the form is not valid'
};

function bindEvents() {
  $('.login-button').on('click', function(event) {
    event.preventDefault()
    state.isLandingPage = false;
    $('.signup-page').removeClass('hidden')
    router(state)
  })

  $('.login-form').on('submit', function(event) {
    event.preventDefault()
    state.isLandingPage = false;
    router(state)
  })

  // $('.form-signin').on('submit', function(event) {
  //   event.preventDefault()
  //   var payload = {}
  //   var formData = $( this ).serializeArray()
  //   formData.forEach(function(item) {
  //     payload[item.name] = item.value;
  //   })
  //   axios.post('/api/users', payload)
  //     .then(function(res) {
  //     })
  // })

  var form = $('#signup-form');
  form.on('submit', function(event) {
    event.preventDefault();
    sendSignupDataToAPI(form);
  });
}

function sendSignupDataToAPI(form) {
  var data = form.serializeArray().reduce((obj, item) => {
    obj[item.name] = item.value;
    return obj;
  }, {});
  if (data.password === data.passwordConfirm) {
    delete data.passwordConfirm;
    $.post('/api/users', data)
      .then(handleSuccess)
      .catch(handleError);
  } else {
    $('#signup-form .signup-messages .alert-success').text('Passwords must be identical')
  }
}

function handleSuccess(response){
  var messageEl = $(page.signupSuccessMessage);
  var errorMessageEl = $(page.signupFailureMessage);
  messageEl.html(page.signupDefaultSuccess);
  errorMessageEl.addClass('hidden');
  messageEl.removeClass('hidden');
}

function handleError(error) {
  var messageEl = $(page.signupFailureMessage);

  if (error.status === 409) {
    if(error.responseJSON.hasOwnProperty('attributeName')){
      messageEl.html(error.responseJSON.attributeName + ' should be unique!');
    } else {
      messageEl.html(page.invalid409);
    }
  } else {
    messageEl.html(page.signupDefaultFailure);
  }
  messageEl.removeClass('hidden');
}

function router(state) {
  if (state.isLandingPage) {
    $('.landing-page').removeClass('hidden')
  } else {
    $('.landing-page').addClass('hidden')
  }
}

function main() {
  bindEvents()
}

$(document).ready(function() {
  main()
})
