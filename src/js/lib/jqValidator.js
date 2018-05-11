import $ from 'jquery/dist/jquery';
import 'jquery-form-validator/form-validator/jquery.form-validator.min';
// import 'jquery-form-validator/form-validator/logic.js';

export default function validateForms() {
  let _form = $('.js-validate');
  if (_form.length) {
    _form.each(function() {
      let FormThis = $(this);
      let formHead = FormThis.parent().prev();
      let succesBlock = FormThis.parent().parent().parent().find('.form__request-back');
      let frontBlock = FormThis.parent();
      // var parent = Form_This.parent();
      $.validate({
        form: FormThis,
        modules: 'logic',
        borderColorOnError: true,
        scrollToTopOnError: true,
        inlineErrorMessageCallback:  function($input, errorMessage) {
          if (errorMessage) {
            singleErrorMessages($input, errorMessage);
          } else {
            singleRemoveErrorMessages($input);
          }
          return false; // prevent default behaviour
        },
        onValidate: () => {

        },
        onSuccess: () => {
          let offs = frontBlock.offset().top;
          let result = FormThis.serializeArray();
          $.post(window.location, result,( data ) => {
            if (data === 'Y') {
              formHead.fadeOut(300);
              frontBlock.fadeOut(300,() => {
                succesBlock.fadeIn(300);
                $('html:not(:animated), body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: offs}, 300);
              });
              if(gtag !== 'undefined') {
                gtag('event', 'zapros', {'event_category' : 'zapros', 'event_action': 'otpravit'});
              }
              if(typeof yaCounter25794059 !== undefined) {
                yaCounter25794059.reachGoal('otpravit_zapros');
              }
            }
          });
          return false;
        },
      });
    });
    function singleErrorMessages(item, errorMessage)
    {
      var currentElementParentObject = item.parent().parent();
      currentElementParentObject.find('.form-error').remove();
      currentElementParentObject.append(`<div class='help-block form-error'>${errorMessage}</div>`);
    }

    function singleRemoveErrorMessages(item)
    {
      var currentElementParentObject = item.parent().parent();
      currentElementParentObject.find('.form-error').remove();
    }
  }
}

