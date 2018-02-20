import $ from 'jquery';

export default function scrollToEl() {
  const pad = 80;
  let destination;
  let scrollItem = window.location.hash.toString().replace('#','');
  let element = $(`[data-id="${scrollItem}"]`);
  if(element.length) {
    window.scrollTo(0,0);
    setTimeout(() => {
      let destination = element.offset().top;
      $('html:not(:animated),body:not(:animated)').animate({scrollTop: destination - 100}, 600);
    }, 400);
  }  
  $('.js-scroll-to').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var elementClick = $(this).data('href');
    var target = window.DOM.body.find('[data-id="' + elementClick + '"]');
    if( $(this).hasClass('to-top')) {
      destination = 0;
      $('html:not(:animated), body:not(:animated)').animate({scrollTop: destination}, 600);
    }
    if(target.length) {
      destination = $(target).offset().top,
      $('html:not(:animated), body:not(:animated)').animate({scrollTop: destination - pad}, 600);
    }

  });
}
