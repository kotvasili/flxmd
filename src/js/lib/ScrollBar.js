import $ from 'jquery';
import Scrollbar from 'smooth-scrollbar';
import './domConf.js';
import TemplateBuilder from './TemplateBuilder';
// import Draggable from 'gsap/Draggable';
import Tabs from './Tabs.js';


export default function Scroller(el, options, bool) {
  this.el = el;
  this.bool = bool;
  this.timer;

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

  this.Scrollbar = Scrollbar;
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
      const portfolio = await this.ajaxLoadPortfolio();

      this.templateBuilder = new TemplateBuilder(portfolio, '#grid__container', '#project__names');
      this.templateBuilder.init();
    }


    if(this.param.scrollText) {
      this.calculateKoeff();
    }    

    if(this.param.tabs) {
      new Tabs();
    }
    
    this._onScroll = this.scrollEvent.bind(this);

    $(window).on('scroll', this._onScroll);
  },

  scrollEvent: function() {
    let scrolltop = $(window).scrollTop();
    
    if(this.param._ajax) {
      this.templateBuilder.updateTemplatesIfNeed(scrolltop);
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
    if(this.nextLink) {
      if(toPos > 500) {
        this.nextLink.classList.add('is-show');
      } else {
        this.nextLink.classList.remove('is-show');
      }
    };
  },

  animationElWhenVisible: function() {
    var self = this;
    [].forEach.call(document.querySelectorAll(this.param.animateClass), (_element) => {
      if( self.scrollbar.isVisible(_element) ) {
        _element.classList.remove('transition');
      } 
    });
  },

  ajaxLoadPortfolio: function() {
    return new Promise(res => {
      $.ajax({
        'async': true,
        'global': false,
        'url': '../json/projects.json',
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
    $(window).off('scroll', this._onScroll);
  }

};
