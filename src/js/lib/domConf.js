import $ from 'jquery/dist/jquery';

window.DOM = {
  body: $('body'),
  html: $('html'),
  docLang: $('html').attr('lang'),
  ajxCont : $('#barba-wrapper'),
  trnsContIN: $('#in'),
  trnsContOUT: $('#out'),
  __prevScrollTop: 0,
  hideScroll: function() {
    // let top = $(window).scrollTop();
    this.__prevScrollTop = $(window).scrollTop();
    this.body.css('top',-this.__prevScrollTop + 'px');
    window.scroll(0, this.__prevScrollTop);
    this.body.addClass('modal_open');
    $('.js-stick').trigger('sticky_kit:recalc');
  },
  showScroll: function() {
  	this.body.removeClass('modal_open');
    this.__prevScrollTop && (window.scroll(0, this.__prevScrollTop));
    this.__prevScrollTop = null;
    $('.js-stick').trigger('sticky_kit:recalc');
  },
  addListenerMulti(el, s, fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, false));
  },
};
