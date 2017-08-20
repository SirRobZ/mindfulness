(function($, mf) {
  var utils = mf.utils;
  var reflections = mf.utils.api.reflections;

  var answers;
  var state = {
    questions: [],
    currentQuestion: 0,
    currentTotalScore: 0,
    currentObserveScore: 0,
    currentDescribeScore: 0,
    currentActingScore: 0,
    currentNonjudgingScore: 0,
    currentNonreactScore: 0
  };
  var questionsLoaded = false;
  function renderQuestion(state) {
    if (!questionsLoaded) {
      $.getJSON('/scripts/questions.json').then(function(data) {
        state.questions = data.questions;
        // data.questions.forEach(function(question) {
        //   question.answers = data.answers;
        // });
        answers = data.answers;
        questionsLoaded = true;
        renderQuestion(state);
      });
      return;
    }
    //based on Current question index retrieve question from questions array
    var index = state.currentQuestion;
    var question = state.questions[index];
    var answerListHTML = answers.map(function(answer, index) {
      return (
            `<li>
            <input type="radio" name="answer" value="${answer}" answerNumber="${index + 1}" id="answer+${index}"> <label for="answer${index}"> ${answer} </label>
          </li>`)
    })
    $('.quiz-container .question').text(question.question);
    $('.quiz-container .questionNumber').text('question ' + (state.currentQuestion + 1) + ' of 15');
    $('.quiz-container ul').html(answerListHTML);
    // $('.quiz-container .score').html(state.currentTotalScore);
  }

  function startButtonHandler(event) {
    event.preventDefault();
    $('.start').toggleClass('hidden');
    $('.quiz-container').toggleClass('hidden');
    renderQuestion(state);
  }

  function nextButtonHandler(event) {
    event.preventDefault()
    if (state.currentQuestion < (state.questions.length - 1)) {
      scoreAnswers();
      state.currentQuestion++;
      renderQuestion(state);
    } else {
      $('.quiz-container').toggleClass('hidden');
      $('.finish').toggleClass('hidden');
    }
  }

  function backButtonHandler(event) {
    event.preventDefault()
    if (state.currentQuestion > 0) {
      state.currentQuestion--;
      renderQuestion(state);
    } else {
      alert('This is the first question.');
    }
  }


  function scoreAnswers() {
    var userChoice = $('input[type=radio]:checked').attr('answerNumber');
    if(!userChoice){
      console.log('No answer has been selected!');
      return;
    }
    userChoice = parseInt(userChoice);

    var reverse = [
      7,
      3,
      8,
      13,
      4,
      9,
      14
    ];

    var observe = [1, 6, 11];
    var describe = [2, 7, 12];
    var acting = [3, 8, 13];
    var nonjudging = [4, 9, 14];
    var nonreact = [5, 10, 15];

    if (reverse.includes(state.currentQuestion + 1)) {
      if (observe.includes(state.currentQuestion + 1)) {
        userChoice = 6 - userChoice;
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentObserveScore = state.currentObserveScore + userChoice;
      } else if (describe.includes(state.currentQuestion + 1)) {
        userChoice = 6 - userChoice;
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentDescribeScore = state.currentDescribeScore + userChoice;
      } else if (acting.includes(state.currentQuestion + 1)) {
        userChoice = 6 - userChoice;
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentActingScore = state.currentActingScore + userChoice;
      } else if (nonjudging.includes(state.currentQuestion + 1)) {
        userChoice = 6 - userChoice;
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentNonjudgingScore = state.currentNonjudgingScore + userChoice;
      } else if (nonreact.includes(state.currentQuestion + 1)) {
        userChoice = 6 - userChoice;
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentNonreactScore = state.currentNonreactScore + userChoice;
      }
    } else {
      if (observe.includes(state.currentQuestion + 1)) {
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentObserveScore = state.currentObserveScore + userChoice;
      } else if (describe.includes(state.currentQuestion + 1)) {
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentDescribeScore = state.currentDescribeScore + userChoice;
      } else if (acting.includes(state.currentQuestion + 1)) {
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentActingScore = state.currentActingScore + userChoice;
      } else if (nonjudging.includes(state.currentQuestion + 1)) {
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentNonjudgingScore = state.currentNonjudgingScore + userChoice;
      } else if (nonreact.includes(state.currentQuestion + 1)) {
        state.currentTotalScore = state.currentTotalScore + userChoice;
        state.currentNonreactScore = state.currentNonreactScore + userChoice;
      }
    }
  }

  function submitButtonHandler(event) {
    event.preventDefault();
    var form = $(this);
    sendReflectionDataToAPI(form);
  }

  function logoutButtonHandler(event) {
      event.preventDefault();
      mf.utils.auth.logout()
      .then(function(){
        console.log('Successful logout');
      })
      .catch(function(e){
        console.log('Error when logging out');
        console.log(e);
      });
  }

  function homeButtonHandler(event) {
    event.preventDefault();
    location.assign('/dashboard.html');
  }



  function sendReflectionDataToAPI(form) {
    var text = form.find('*[name=text]').val();
    var habits = _.map(form.find('.habit input[type=checkbox]:checked'), function(habitInput) {
      return habitInput.name;
    });

    var newReflection = {
      mindfulnessScore: state.currentTotalScore,
      observeScore: state.currentObserveScore,
      describeScore: state.currentDescribeScore,
      actingScore: state.currentActingScore,
      nonjudgingScore: state.currentNonjudgingScore,
      nonreactScore: state.currentNonreactScore,
      text: text,
      habits: habits
    };

    reflections.create(newReflection).then(function() {
      location.assign('/dashboard.html');
    }).catch(function(info) {
      console.error(info);

    });
  }

  var postHandlers = {
    renderQuestion: renderQuestion,
    startButtonHandler: startButtonHandler,
    nextButtonHandler: nextButtonHandler,
    backButtonHandler: backButtonHandler,
    submitButtonHandler: submitButtonHandler,
    logoutButtonHandler: logoutButtonHandler,
    homeButtonHandler: homeButtonHandler
  };

  mf.postHandlers = postHandlers;

})(jQuery, window.mf);
