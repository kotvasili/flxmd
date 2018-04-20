import $ from 'jquery';

export default function scrollToEl() {
  const pad = 100;
  let destination;
  let scrollItem = window.location.hash.toString().replace('#','');
  let element = $(`[data-id="${scrollItem}"]`);
  // if(scrollItem.indexOf('tab_nav_') !== -1) {
  // 		let tabnum = scrollItem.substr(scrollItem.length - 1);
  //     	let tabTrigger = window.DOM.body.find('[data-nav="' + tabnum + '"]');
  //     	destination = tabTrigger.position().top;
  //     	tabTrigger.trigger('click');
  //     	$('html:not(:animated), body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: destination - pad}, 600);
  // }
  if(element.length) {
    window.scrollTo(0,0);
    setTimeout(() => {
      let destination;
      if(element.hasClass('tab__trigger')) {
        destination = element.closest('.tab__container').offset().top + pad -20;
        $(element).trigger('click');
      }else{
        destination = element.offset().top;
      }

      $('html:not(:animated),body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: destination - pad}, 600);
    }, 400);
  }
  $('.js-scroll-to').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if(window.DOM.body.hasClass('menu-open')) {
      window.DOM.body.removeClass('menu-open');
    }
    let elementClick = $(this).data('href');
    let target = window.DOM.body.find('[data-id="' + elementClick + '"]');
    if( $(this).hasClass('to-top')) {
      destination = 0;
      $('html:not(:animated), body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: destination}, 600);
    }
    // alert(elementClick,target.closest('.tab__container').length);
    if(target.length) {

      if(elementClick === 'order' && target.closest('.tab__container').length) {
        $('.tab__trigger').first().trigger('click');
        destination = target.closest('.tab__container').offset().top + pad -20;

      }else{
        destination = target.position().top;
      }
      $('html:not(:animated), body:not(:animated),.frame__side:last-child:not(:animated)').animate({scrollTop: destination - pad}, 600);
    }

  });
}
