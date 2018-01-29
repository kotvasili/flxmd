import $ from 'jquery/dist/jquery';

window.DOM = {
  body: $('body'),
  html: $('html'),
  docLang: $('html').attr('lang'),
  ajxCont : $('#barba-wrapper'),
  trnsContIN: $('#in'),
  trnsContOUT: $('#out'),
  passiveSupported: false,
  bodyScrollTop: null,
  scrollWidth: null,
  render: false,
  getScrollWidth: function() {
    // Узнаем ширину скролл панели
    const div = document.createElement('div');
    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';
    div.style.visibility = 'hidden';
    this.body[0].appendChild(div);
    this.scrollWidth = div.offsetWidth - div.clientWidth;
    this.body[0].removeChild(div);
    
  },
  hideScrollSimple: function() {
    if (this.body[0].offsetHeight < this.body[0].scrollHeight) {
      this.body.css('padding-right',this.scrollWidth + 'px');
    }
    this.body.addClass('loading');
  },
  showScrollSimple: function() {
    this.body.removeClass('loading');
    this.body[0].style.paddingRight = '';
  },
  hideScroll: function() {
    if (this.body[0].offsetHeight < this.body[0].scrollHeight) {
      this.body[0].paddingRight = this.scrollWidth + 'px';
    }
    this.bodyScrollTop = $(window).scrollTop();
    this.body.css('top',-this.bodyScrollTop + 'px');
    window.scroll(0, this.bodyScrollTop);
    this.body.addClass('modal_open');
    $('.js-stick').trigger('sticky_kit:recalc');
  },
  showScroll: function() {
  	this.body.removeClass('modal_open');
    this.bodyScrollTop && (window.scroll(0, this.bodyScrollTop));
    this.bodyScrollTop = null;
    this.body[0].style.paddingRight = '';
    $('.js-stick').trigger('sticky_kit:recalc');
  },
  addListenerMulti(el, s, fn) {
    s.split(' ').forEach(e => el.addEventListener(e, fn, window.DOM.passiveSupported ? { passive: true } : false));
  },
};
