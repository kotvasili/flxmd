import $ from 'jquery';

export default function colorize() {
  let colorBg = $('.barba-container').data('bgcolor');
  let colorText = $('.barba-container').data('textcolor');
  let colorTitle = $('.barba-container').data('titlecolor');
    
  $('.overlay__color').css({
	  'background-color': colorBg
  });

  $('.scrollbar-thumb').css({
	  'background-color': colorBg
  });

  $('.color-bg').css({
    'background-color': colorBg
  });

  $('.link-color').css({
    'color': colorText
  });

  $('.title-color').css({
    'color': colorTitle
  });
  
  document.body.style.setProperty('--color-link', colorText);
  
}
