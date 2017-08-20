(function($, mf) {
  $(function() {
    $('.start button').on('click', mf.postHandlers.startButtonHandler);
    $('.quiz-container .nextButton').on('click', mf.postHandlers.nextButtonHandler);
    $('.quiz-container .backButton').on('click', mf.postHandlers.backButtonHandler);
    $('#reflectionForm').on('submit', mf.postHandlers.submitButtonHandler);
    $('.logout-form').on('submit', mf.postHandlers.logoutButtonHandler);
    $('.home-form').on('submit', mf.postHandlers.homeButtonHandler);
  });
})(jQuery, window.mf);
