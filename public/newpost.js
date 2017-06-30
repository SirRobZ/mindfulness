(function($) {
  $(function() {
    var answers;
    var state = {
      questions: [],
      currentQuestion: 0,
      currentScore: 0
    };
    var questionsLoaded = false;
    function renderQuestion(state) {
      if (!questionsLoaded) {
        $.getJSON('questions.json').then(function(data) {
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
          '<input type="radio" name="answer" value="' + answer + '" id="answer ' + index + '">' + '<label for="answer ' + index + '">' + answer + '</label>' + '</li>')
      })
      $('.container .question').text(question.question);
      $('.container .questionNumber').text('question ' + (state.currentQuestion + 1) + ' of 15');
      $('.container ul').html(answerListHTML);
      $('.container .score').html(state.currentScore);
    }

    function bindStartButtonEvent() {
      $('.start button').on('click', function(event) {
        event.preventDefault();
        $('.start').toggleClass('hidden');
        $('.container').toggleClass('hidden');
        renderQuestion(state);
      })
    }

    function bindNextButtonEvent() {
      $('.container .nextButton').on('click', function(event) {
        event.preventDefault()
        if (state.currentQuestion < state.questions.length) {
          scoreAnswers();
          state.currentQuestion++;
          renderQuestion(state);
        } else {
          $('.container').toggleClass('hidden');
          $('.finish').toggleClass('hidden');
        }
      })
    }

    function scoreAnswers() {
      var userChoice = '';
      var answerChoice = document.getElementsByName('answer');
      for(i =0; i <answerChoice.length; i++){
        if(answerChoice[i].checked){
          userchoice = i+1;
        }
      }
      var reverse = [7, 3, 8, 13, 4, 9, 14];
      if(reverse.includes((state.currentQuestion + 1))) {
        userChoice = 6 - userChoice;
        state.currentScore = state.currentScore + userChoice;
      } else {
        state.currentScore = state.currentScore + userChoice;
      }
    }

    function bindSubmitButtonEvent() {
      $('.finish button').on('click', function(event) {
        event.preventDefault();
        sendReflectionDataToAPI(form);
      })
    }

    function sendReflectionDataToAPI(form) {

    }

    bindStartButtonEvent();
    bindNextButtonEvent();
    bindRetakeButtonEvent();
  });
})(jQuery);
