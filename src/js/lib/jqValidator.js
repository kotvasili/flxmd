import $ from 'jquery/dist/jquery';
import 'jquery-form-validator/form-validator/jquery.form-validator.min';
// import 'jquery-form-validator/form-validator/logic.js';

export default function validateForms() {
  let _form = $('.js-validate');
  if (_form.length) {
    _form.each(function() {
      let FormThis = $(this);
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
          // CheckForSelect(form_this);
        },
        onSuccess: () => {
          // formResponse(form_this);
          // resetForm(form_this);
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

