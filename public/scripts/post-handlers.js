(function($, mf) {

  var answers;
  var state = {
    questions: [],
    currentQuestion: 0,
    currentScore: 0
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
      return ('<li>' +
        '<input type="radio" name="answer" value="' + answer + '" answerNumber="' + (index + 1) + '" id="answer ' + index + '">' + '<label for="answer ' + index + '">' + answer + '</label>' + '</li>')
    })
    $('.quiz-container .question').text(question.question);
    $('.quiz-container .questionNumber').text('question ' + (state.currentQuestion + 1) + ' of 15');
    $('.quiz-container ul').html(answerListHTML);
    $('.quiz-container .score').html(state.currentScore);
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
    if (reverse.includes((state.currentQuestion + 1))) {
      userChoice = 6 - userChoice;
      state.currentScore = state.currentScore + userChoice;
    } else {
      state.currentScore = state.currentScore + userChoice;
    }
  }

  function submitButtonHandler(event) {
    event.preventDefault();
    sendReflectionDataToAPI(form);
  }

  function sendReflectionDataToAPI(form) {}

  var postHandlers = {
    startButtonHandler: startButtonHandler,
    nextButtonHandler: nextButtonHandler,
    submitButtonHandler: submitButtonHandler
  };

  mf.postHandlers = postHandlers;

})(jQuery, window.mf);
