import $ from 'jquery';

export default function scrollToEl() {
  const pad = 100;
  let destination;
  let scrollItem = window.location.hash.toString().replace('#','');
  let element = $(`[data-id="${scrollItem}"]`);
  if(element.length) {
    window.scrollTo(0,0);
    setTimeout(() => {
      let destinationж;
      if(scrollItem === 'order' && element.closest('.tab__container').length) {
        destination = element.closest('.tab__container').offset().top + pad -20;
      }else{
        destination = element.offset().top;
      }
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
      destination = target.position().top,
      console.log(destination);
      $('html:not(:animated), body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: destination - pad}, 600);
    }

  });
}
