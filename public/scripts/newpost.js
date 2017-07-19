(function($, mf) {
  $(function() {
    $('.start button').on('click', mf.postHandlers.startButtonHandler);
    $('.quiz-container .nextButton').on('click', mf.postHandlers.nextButtonHandler);
    $('#reflectionForm').on('submit', mf.postHandlers.submitButtonHandler);
  });
})(jQuery, window.mf);
