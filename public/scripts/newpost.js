(function($, mf) {
  $(function() {
    $('.start button').on('click', mf.postHandlers.startButtonHandler);
    $('.quiz-container .nextButton').on('click', mf.postHandlers.nextButtonHandler);
    $('.finish button').on('click', mf.postHandlers.submitButtonHandler);
  });
})(jQuery, window.mf);
