import $ from 'jquery/dist/jquery.min';
import Swiper from 'swiper/dist/js/swiper.js';
import extend from './Extends';
import debounce from './debounce';
import './domConf.js';
import SwiperSettings from './SliderSettings.js';
import { TimelineMax } from 'gsap';


export default function ScrollSlide(container, options) {
  this.element = $(container);

  this.default = {
    screen: '.screen',
    navigationItem: '.navigation__item',
    overlay: $('.overlay__color'),
    currPage: 0,
    swiperContainer: '.swiper-container',
    canScroll: true,
    sectionNext: 'section__next',
    sectionPrev: 'section__prev',
    mainMenu: '.menu-primary',
    linkColor: $('.link-color'),

  };

  this.options = extend( {}, this.default );
  extend( this.options, options );

  this.init();
}

ScrollSlide.prototype = {
  init() {

    this.sections = $(this.options.screen);
    this.sectionsLength = this.sections.length;
    this.navItem = $(this.options.navigationItem);
    this.swiper = $(this.options.swiperContainer);
    this.menuPrimary = $(this.options.mainMenu);
    this.logo = $('.logo');
    this.swiperInstances = {};
    this.colorChange = null;
    this.canScroll = false;
    this.scrollController = null;
    this.bgTargets;
    this.body = window.DOM.body;
    // this.initSwiper();

    this.setCurrentPage(this.options.currPage);
    this.setNavigationCurrItem(this.options.currPage);
    this.generateScrollBarPagination();
    this.setScrollBar(this.options.currPage);
    this.initEventHandler();
    this.scrollEvent();
    this.twn = new TimelineMax();



  },
  initEventHandler: function() {
    var self = this;

    this.navItem.find('a').on('click', function(event) {

      if(self.canScroll || $(this).parent().hasClass('nav__active')) {
        return false;
      }

      self.canScroll = true;

      this.item_curr = $(this).parent().siblings('.nav__active').index();
      this.item_next = $(this).parent().index();

      self._curr_slide = self.sections[this.item_curr];
      self._next_slide = self.sections[this.item_next];

      self.goToSlide(self._curr_slide, self._next_slide);

      self.setNavigationCurrItem(this.item_next);

      self.options.currPage = this.item_next;
      self.setScrollBar(this.item_next);

      event.preventDefault();

    });

    $('.bar__item a').on('click', function(event) {

      if(self.canScroll || $(this).parent().hasClass('is-current')) {
        return false;
      }

      self.canScroll = true;

      this.item_curr = $(this).parent().siblings('.is-current').index();
      this.item_next = $(this).parent().index();

      self._curr_slide = self.sections[this.item_curr];
      self._next_slide = self.sections[this.item_next];

      self.goToSlide(self._curr_slide, self._next_slide);

      self.setNavigationCurrItem(this.item_next);

      self.options.currPage = this.item_next;
      self.setScrollBar(this.item_next);

      event.preventDefault();

    });
  },
  scrollEvent: function() {
    var self = this;
    $(this.element).on('mousewheel.fp DOMMouseScroll.fp',(e) => {
      e.preventDefault();
    });
    $(this.element).on('mousewheel.fp DOMMouseScroll.fp', (e) => debounce(self.checkDirection(e)));
  },
  removeEvents: function() {
    $(this.element).off('mousewheel.fp DOMMouseScroll.fp');
  },
  checkDirection: function(e) {
    if(this.body.hasClass('menu-open')) {
      return false;
    }

    var delta = e.originalEvent.wheelDelta ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;
    if(delta > 50 && !this.canScroll) {
      this.canScroll = true;
      this.nextSection();
    } else if(delta < -50 && !this.canScroll) {
      this.canScroll = true;
      this.prevSection();
    }
  },

  nextSection: function() {

    this.curr_slide = this.options.currPage;
    this.next_slide = this.curr_slide + 1;

    this._curr_slide = this.sections[this.curr_slide];
    this._next_slide = this.sections[this.next_slide];

    if(typeof this._next_slide === 'undefined') {
      this.canScroll = false;
      return false;
    }

    this.goToSlide(this._curr_slide, this._next_slide);
    this.setNavigationCurrItem(this.next_slide);

    this.options.currPage = this.next_slide;
    this.setScrollBar(this.next_slide);
  },
  prevSection: function() {

    this.curr_slide = this.options.currPage;
    this.next_slide = this.curr_slide - 1;

    this._curr_slide = this.sections[this.curr_slide];
    this._next_slide = this.sections[this.next_slide];

    if(typeof this._next_slide === 'undefined') {
      this.canScroll = false;
      return false;
    }

    this.goToSlide(this._curr_slide, this._next_slide);
    this.setNavigationCurrItem(this.next_slide);

    this.options.currPage = this.next_slide;
    this.setScrollBar(this.next_slide);
  },
  sapEnd: function(currentItem, nextItem) {
    // var self = this;
    var remove = null;
    if(currentItem < nextItem) {
      remove = this.options.sectionNext;
    } else {
      remove = this.options.sectionPrev;
    }

    $(this.sections[nextItem]).removeClass(remove).siblings().removeClass('section__active');

    setTimeout(() => {
      this.canScroll = false;	
    }, 370);
  },
  goToSlide: function(curr, next) {
    var self = this;
    let nxt = $(next);
    let crr = $(curr);
    let nxtInd = nxt.index();
    let crrInd = crr.index();
    let crrContent = crr.find('.content__side').eq(0);
    let nxtContent = nxt.find('.content__side').eq(0);
    let swiperActive = nxt.find('.swiper-slide-active');
    if(nxt.find('.container-carousel').length) {
      this.setColor(swiperActive.data('bgcolor-item'), swiperActive.data('textcolor'));
    } else {
      this.setColor(nxt.data('bgcolor'), nxt.data('textcolor'));
    }

    if (nxt.data('dark')) {
      $(self.element).add(self.logo).removeClass('light');
    } else {
      $(self.element).add(self.logo).addClass('light');
    }

    if(nxtInd > crrInd) {
      requestAnimationFrame(() => {
        this.twn
          .fromTo(crr, 1.2, {
            y: '0%'
          }, {
            y: '-=100%',
            ease: Expo.easeInOut,
            force3D:true,
          })
          .fromTo(crrContent, 1.2,{
            y: '0%'
          },{
            y: '+=40%',
            ease: Expo.easeInOut,
          }, '-=1.2')
          .fromTo(nxt, 1.2, {
            className: '+=section__next',
            y: '100%',
          }, {
            className: '+=section__active',
            y: '-=100%',
            ease: Expo.easeInOut,
            force3D:true,
            clearProps: 'transform',
            onComplete: () => {
              self.sapEnd(crrInd, nxtInd);
            }
          }, '-=1.2')
          .fromTo(nxtContent, 1.25,{
            y: '-40%'
          },{
            y: '+=40%',
            ease: Expo.easeInOut,
            clearProps: 'transform',
          }, '-=1.2'); 
      });
    } else {
      requestAnimationFrame(() => {
        this.twn
          .fromTo(crr, 1.25, {
            y: '0%'
          }, {
            y: '+=100%',
            ease: Expo.easeInOut,
            force3D:true,
          })
          .fromTo(crrContent, 1.25,{
            y: '0%'
          },{
            y: '-=40%',
            ease: Expo.easeInOut,
          }, '-=1.25')
        
          .fromTo(nxt, 1.25, {
            className: '+=section__prev',
            y: '-100%',
          }, {
            className: '+=section__active',
            y: '+=100%',
            ease: Expo.easeInOut,
            force3D: true,
            clearProps: 'transform',
            onComplete: () => {
              self.sapEnd(crrInd, nxtInd);
            }
          }, '-=1.25')
          .fromTo(nxtContent, 1.25,{
            y: '40%'
          },{
            y: '-=40%',
            ease: Expo.easeInOut,
            clearProps: 'transform',
          }, '-=1.25');
      });
    }
  },
  initSwiper: function() {
    var self = this;
    
    this.swiper.each(function(index) {
      const $this = $(this);
      var $btnPrev = $this.parent().find('.swiper-button-prev');
      var $btnNext = $this.parent().find('.swiper-button-next');
      const screenParent = $this.closest(self.options.screen);
      const interleaveOffset = 0.8;
      $this.addClass('instance-' + index);
      const $project = screenParent.find('.swiper-projects');
      const slideTwn = new TimelineMax();
      let DefaultSettings = {
        navigation:{
          nextEl: $btnNext,
          prevEl: $btnPrev, 
        },
        fadeEffect: {
          crossFade: false
        },
        // reverseDirection: true,
        on:{
          progress: function() {
            var swiper = this;
            for (var i = 0; i < swiper.slides.length; i++) {
              const img = swiper.slides[i].querySelector('.image-container');
              var slideProgress = swiper.slides[i].progress;
              var innerOffset = swiper.width * interleaveOffset;
              var innerTranslate = slideProgress * innerOffset;
              slideTwn
                .set($(img),{
                  x: innerTranslate,
                });
            }
          },
          setTransition: function(speed) {
            var swiper = this;
            for (var i = 0; i < swiper.slides.length; i++) {
              swiper.slides[i].style.transition = speed + 'ms';
              swiper.slides[i].querySelector('.image-container').style.transition =
                speed + 'ms';
            }
          },
          init: function(swiper) {
            var defaultColor = $this.find('.swiper-slide-active').data('bgcolor-item');
            var defaultTextColor = $this.find('.swiper-slide-active').data('textcolor');
            var defaultCurrIndex = $this.find('.swiper-slide-active').data('swiper-slide-index');
            $project.find('.name-projects_item').eq(defaultCurrIndex).addClass('current');
            screenParent.attr('data-bgcolor', defaultColor);
            screenParent.attr('data-textcolor', defaultTextColor);
          },
          transitionStart: function() {
            if(screenParent.hasClass('section__active')) {

              requestAnimationFrame(() => {
                $this.addClass('animating');
                let realInd = $this[0].swiper.realIndex;
                var bgColor = $this.find('[data-swiper-slide-index="' + realInd + '"]').data('bgcolor-item');
                var textcolor = $this.find('[data-swiper-slide-index="' + realInd + '"]').data('textcolor');
                screenParent.attr('data-bgcolor', bgColor).attr('data-textcolor', textcolor);
                $project.find('.name-projects_item').eq(realInd).addClass('current').siblings().removeClass('current');
                self.setColor(bgColor, textcolor);
              });   
            }
          },

          transitionEnd: function(el) {
            requestAnimationFrame(() => {
              $this.removeClass('animating');
            });
          }
        },

      };

      let assignSettings = Object.assign(DefaultSettings, SwiperSettings);
      this.swiperInstances = new Swiper('.instance-' + index, assignSettings);
      
    });
  },

  setCurrentPage: function(currPage) {
    if(currPage === null) {
      this.navItem.eq(0).addClass('nav__active');
      this.sections.eq(0).addClass('section__active');
    } else {
      this.navItem.eq(currPage).addClass('nav__active');
      this.sections.eq(currPage).addClass('section__active');
    }
    this.bgTargets = $('.scrollbar__container').find('span').add($('.hover-line'));
    this.setColor(this.element.find('.section__active').data('bgcolor'), this.element.find('.section__active').data('textcolor'));
  },
  setNavigationCurrItem: function(currItem) {
    this.navItem.eq(currItem).addClass('nav__active').siblings().removeClass('nav__active');
  },
  setColor: function(bgColor, textcolor) {
    var self = this;
    this.options.overlay.css({
      'background-color': bgColor
    });

    this.options.linkColor.css({
      'color': textcolor
    });
    this.bgTargets.css({
      'background-color': bgColor
    });
    document.body.style.setProperty('--color-link', textcolor);

  },
  generateScrollBarPagination() {
    var container = document.createElement('div');
    container.setAttribute('class', 'work-wrapper__scrollbar');
    var scrollbar = document.createElement('ul');
    scrollbar.setAttribute('class', 'scrollbar__container');

    var fragment = document.createDocumentFragment();

    for(var i = 0; i < this.sectionsLength; i++) {
      
      var li = document.createElement('li');
      var a = document.createElement('a');
      var span = document.createElement('span');

      li.setAttribute('data-scrollbar-index', i);
      li.setAttribute('class', 'bar__item');
      a.setAttribute('href', 'javascript:void(0)');

      a.appendChild(span);
      li.appendChild(a);

      fragment.appendChild(li);
    }

    scrollbar.appendChild(fragment);

    container.appendChild(scrollbar);

    this.element.append(container);
    
  },
  setScrollBar(current) {
    var self = this;
    var indexItem = $('.bar__item').filter('[data-scrollbar-index=' + current + ']').data('scrollbar-index');
   
    
    $('.bar__item').each(function() {
      var _ = $(this);

      var item_index = _.data('scrollbar-index');

      _.removeClass('is-current is-up is-down').addClass(function() {
        if(indexItem === item_index) {
          _.addClass('is-current');
        } else if(indexItem > item_index) {
          _.addClass('is-down');
        } else {
          _.addClass('is-up');
        }
      });
    });
  }
};
