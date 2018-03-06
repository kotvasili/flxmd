import $ from 'jquery';

export default function scrollToEl() {
  const pad = 120;
  let destination;
  let scrollItem = window.location.hash.toString().replace('#','');
  console.log(scrollItem);
  let element = $(`[data-id="${scrollItem}"]`);
  if(element.length) {
    window.scrollTo(0,0);
    setTimeout(() => {
      let destination = element.offset().top;
      $('html:not(:animated),body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: destination - pad}, 600);
    }, 400);
  }  
  $('.js-scroll-to').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    let elementClick = $(this).data('href');
    let target = window.DOM.body.find('[data-id="' + elementClick + '"]');
    if( $(this).hasClass('to-top')) {
      destination = 0;
      $('html:not(:animated), body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: destination}, 600);
    }
    if(target.length) {
      destination = $(target).offset().top,
      $('html:not(:animated), body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: destination - pad}, 600);
    }

  });
}
