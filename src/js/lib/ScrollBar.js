import $ from 'jquery';
// import Scrollbar from 'smooth-scrollbar';
import './domConf';
import TemplateBuilder from './TemplateBuilder';
// import debounce from './debounce';
// import Draggable from 'gsap/Draggable';
import Tabs from './Tabs.js';


export default function Scroller(el, options, bool) {
  this.el = el;
  this.bool = bool;
  this.timer;
  this.prevScrolltop = 0;
  this.default = {
    constant: null,
    animElements: null,
    window: 'window',
    _ajax: false,
    animateClass: '.transition',
    scrollText: false,
    text: '.js-text',
    scrollHeight: '.js-scroll-height',
    grabScroll: false,
    grabElement: '.grab-container',
    tabs: false
  };
  this.param = Object.assign(this.default, options);

  this.init();
}

Scroller.prototype = {
  init: async function() {
    $(window).scrollTop(0);

    this.mac = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;

    this.fixedElement = document.querySelector(this.param.constant);
    this.windowHeight = this.windowValue();
    this.nextLink = document.querySelector('.navigation__project');
    this.isScrolling;
    this.body = window.DOM.body[0];

    if(this.param._ajax) {
      let mainGridCont = document.querySelector('#grid__container');
      const portfolio = await this.ajaxLoadPortfolio(mainGridCont.dataset.url);

      this.templateBuilder = new TemplateBuilder(portfolio, '#grid__container', '#project__names');
      this.templateBuilder.init();
      $(mainGridCont).on('prevpos_update',() => {
        setTimeout(() => {
          this.prevScrolltop = 0;
        },600);
        
      });
    }


    if(this.param.scrollText) {
      setTimeout(() => {
        this.calculateKoeff();
      },300);
      
    }    

    if(this.param.tabs) {
      new Tabs();
    }
    
    this._onScroll = this.scrollEvent.bind(this);
    this.scrollContainer = $('.frame__side:last-child')[0].offsetHeight <= $(window).height() && window.DOM.html.hasClass('safari')? $('.frame__side:last-child')[0]: document;
    this.scrollContainer.addEventListener('scroll', this._onScroll, window.DOM.passiveSupported ? { passive: true } : false);
    // console.log(this.scrollContainer);
  },

  scrollEvent: function() {
    let scrolltop = $(window).scrollTop() || this.scrollContainer.scrollTop;
    if(this.param._ajax) {
      if(scrolltop > this.prevScrolltop) {
        this.templateBuilder.updateTemplatesIfNeed(scrolltop);
        this.prevScrolltop = scrolltop;
      }
    }
    if(this.param.scrollText) {
      this.setPositionText(scrolltop);
      this.fixedPositionSidebar(scrolltop);
    }
  },

  windowValue: function() {
    return window.innerHeight;
  },

  fixedPositionSidebar: function(state) {
    var toPos = state;
    // console.log(toPos);
    if(this.nextLink) {
      if(toPos > 500) {
        this.nextLink.classList.add('is-show');
      } else {
        this.nextLink.classList.remove('is-show');
      }
    };
  },
  ajaxLoadPortfolio: function(url) {
    return new Promise(res => {
      $.ajax({
        'async': true,
        'global': false,
        'url': url,
        'dataType': 'json',
        'success': function(json) {
          res(json.portfolio);
        }
      });
    });
  },

  calculateKoeff: function() {
    this.textParentWidth = $(this.fixedElement).innerWidth();
    this.textWidth = $(this.param.text).find('.frame__name').width();
    this.offsetLeft = $(this.param.text).find('.frame__name').offset().left;
    this.pageHeight = $(this.param.scrollHeight).height();
  },

  setPositionText: function(state) {
    var offsetTop = state;
    var text = $(this.param.text).find('.frame__name');

    var position = ((this.textWidth - this.textParentWidth + this.offsetLeft) / this.pageHeight) * offsetTop;
    
    $(text).css({'left': -position});
  },

  delete: function() {
    this.scrollContainer.removeEventListener('scroll', this._onScroll, window.DOM.passiveSupported ? { passive: true } : false);
  }

};
