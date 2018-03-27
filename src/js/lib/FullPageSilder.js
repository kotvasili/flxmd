import $ from 'jquery/dist/jquery';
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

    // this.sections = $(this.options.screen);
    this.sections = Array.from(document.querySelectorAll(this.options.screen));
    this.sectionsLength = this.sections.length;
    this.sides=[];
    
    this.sections.filter(section => {
      this.sides.push(section.querySelector('.content__side'));
    });
    this.navItem = $(this.options.navigationItem);
    this.swiper = $(this.options.swiperContainer);
    this.menuPrimary = $(this.options.mainMenu);
    this.logo = $('.logo');
    this.body = window.DOM.body;
    this.scene = document.getElementById('scene');
    this.slidewrap = document.getElementById('side-page');
    this.sideElems = Array.from(this.slidewrap.querySelectorAll('.content__side'));
    this.bgTargets = $('.scrollbar__container').find('span').add($('.hover-line'));
    this.ScrollDown = document.querySelector('.icon-scroll');
    this.setCurrentPage(this.options.currPage);
    this.swiperInstances = [];
    this.colorChange = null;
    this.canScroll = false;
    this.scrollController = null;
    this.setNavigationCurrItem(this.options.currPage);
    this.generateScrollBarPagination();
    this.setScrollBar(this.options.currPage);
    this.initEventHandler();
    this.scrollEvent();
    this.initSwiper();
    this.twn = new TimelineMax();

  },
  initEventHandler: function() {
    var self = this;

    this.navItem.each(function() {
    	let _ = $(this);
    	let a = _.find('a');
    	let parentIndex = _.index();

    	a.on('click',(event) => {
    		event.preventDefault();
	      if(self.canScroll || _.hasClass('nav__active')) {
	        return false;
	      }
	      self.canScroll = true;

	      self.curr_slide = self.options.currPage;
	      self.next_slide = parentIndex;
	      self._curr_slide = self.sections[self.curr_slide];
	      self._next_slide = self.sections[self.next_slide];
	      self.goToSlide(self._curr_slide, self._next_slide);
        
	      self.setNavigationCurrItem(self.next_slide);

	      self.options.currPage = self.next_slide;
	      self.setScrollBar(self.next_slide);

	      
    	});
    });

    $('.bar__item a').on('click', function(event) {

      if(self.canScroll || $(this).parent().hasClass('is-current')) {
        return false;
      }

      self.canScroll = true;

      self.curr_slide = self.options.currPage;
      self.next_slide = $(this).parent().index();

      self._curr_slide = self.sections[self.curr_slide];
      self._next_slide = self.sections[self.next_slide];

      self.goToSlide(self._curr_slide, self._next_slide);

      self.setNavigationCurrItem(self.next_slide);

      self.options.currPage = self.next_slide;
      self.setScrollBar(self.next_slide);
      event.preventDefault();
    });
    this.ScrollDown.addEventListener('click',(event) => {
      if(self.canScroll) {
        return false;
      }
      self.canScroll = true;
      self.curr_slide = self.options.currPage;
      self.next_slide = 1;
      self._curr_slide = self.sections[self.curr_slide];
      self._next_slide = self.sections[self.next_slide];

      self.goToSlide(self._curr_slide, self._next_slide);

      self.setNavigationCurrItem(self.next_slide);

      self.options.currPage = self.next_slide;
      self.setScrollBar(self.next_slide);
    });
  },
  scrollEvent: function() {
    var self = this;
    this.element.on('mousewheel DOMMouseScroll wheel',(e) => {
      e.preventDefault();
    });
    // if(window.DOM.html.hasClass('firefox')) {
    //   this.element[0].addEventListener('wheel',(e) => debounce(self.checkDirection(e)));
    // }else{
    this.element[0].addEventListener('wheel',(e) => debounce(self.checkDirection(e)), window.DOM.passiveSupported ? { passive: true } : false);
    // }

  },
  removeEvents: function() {
    this.twn.kill();
    this.swiperInstances.filter(item => {

      item.destroy();
    });
  },
  checkDirection: function(e) {
    if(this.body.hasClass('menu-open')) {
      return false;
    };
    if(!this.canScroll) {
      var delta = e.deltaY;
      if(delta > 0 ) {
        this.curr_slide = this.options.currPage;
        this.next_slide = this.curr_slide + 1;

        this._curr_slide = this.sections[this.curr_slide];
        this._next_slide = this.sections[this.next_slide];

        this.canScroll = true;
        this.moveSection();
        return false;

      } else if(delta < 0) {
        
        this.curr_slide = this.options.currPage;
        this.next_slide = this.curr_slide - 1;

        this._curr_slide = this.sections[this.curr_slide];
        this._next_slide = this.sections[this.next_slide];

        this.canScroll = true;
        this.moveSection();
        return false;

      }
    }

  },

  moveSection: function() {
    if(typeof this._next_slide === 'undefined') {
      this.canScroll = false;
      return false;
    }
    
    this.setNavigationCurrItem(this.next_slide);

    this.goToSlide(this._curr_slide, this._next_slide);
    
    this.options.currPage = this.next_slide;
    this.setScrollBar(this.next_slide);
  },
  sapEnd: function(currentItem, nextItem) {
    currentItem.classList.remove('section__active');
    setTimeout(() => {
      this.canScroll = false;	
    }, 100);
  },
  goToSlide: function(curr, next) {
    var self = this;
    // let nxt = $(next);
    // let crr = $(curr);
    next.classList.add('section__active');

    let nxtInd = this.next_slide;
    let crrInd = this.curr_slide;
    this.sideElems[crrInd].classList.remove('section__active');
    this.sideElems[nxtInd].classList.add('section__active');
    let crrContent = this.sides[crrInd];
    let nxtContent = this.sides[nxtInd];
    let swiperActive = next.querySelector('.swiper-slide-active');
    if(swiperActive !== null) {
      this.setColor(swiperActive.getAttribute('data-bgcolor-item'), swiperActive.getAttribute('data-textcolor'));
    } else {
      this.setColor(next.dataset.bgcolor, next.dataset.textcolor);
    }
    if (next.dataset.dark === 'true') {
      this.element.add(this.logo).removeClass('light');
    } else {
      this.element.add(this.logo).addClass('light');
    }
    if(this.scene !== null) {
      if(nxtInd === 0) {
        setTimeout(() => {
          this.scene.ply();
          requestAnimationFrame(this.scene.render);
          this.scene.classList.remove('hidden'); 
        },1200);
      }else{
        this.scene.classList.add('hidden');
        setTimeout(() => {
          this.scene.stp();
        },100);
      }
    }
    
    // curr.addClass('section__prev')
    if(nxtInd > crrInd) {
      // requestAnimationFrame(() => {

      this.twn
        .fromTo(curr, 1.2, {
          y: '0%'
        }, {
          y: '-=100%',
          ease: Expo.easeInOut,
          force3D: true,
          // rotation:0.001,
        })
        .fromTo(crrContent, 1.2,{
          y: '0%'
        },{
          y: '+=40%',
          ease: Expo.easeInOut,
        }, '-=1.2')
        .fromTo(next, 1.2, {
          y: '100%',
        }, {
          y: '-=100%',
          ease: Expo.easeInOut,
          force3D: true,
        }, '-=1.2')
        .fromTo(nxtContent, 1.2,{
          y: '-40%'
        },{
          y: '+=40%',
          ease: Expo.easeInOut,
          onComplete: () => {
            TweenMax.set(nxtContent,{clearProps:'all'});
            TweenMax.set(next,{clearProps:'all'});
            // TweenMax.set(crrContent,{clearProps:'all'});
            // TweenMax.set(curr,{clearProps:'all'});
            
            self.sapEnd(curr, next);
            this.twn.clear();
          }
        }, '-=1.2'); 
      // });
    } else {
      // requestAnimationFrame(() => {
      this.twn
        .fromTo(curr, 1.2, {
          // yPercent : 0
          y: '0%'
        }, {
          // yPercent: 100,
          y: '+=100%',
          ease: Expo.easeInOut,
          force3D: true,
          // rotation:0.001,
        })
        .fromTo(crrContent, 1.2,{
          // yPercent: 0
          y: '0%'
        },{
          // yPercent: -40,
          y: '-=40%',
          ease: Expo.easeInOut,
        }, '-=1.2')
        .fromTo(next, 1.2, {
          // yPercent: -100,
          y: '-100%',
        }, {
          // yPercent: 0,
          y: '+=100%',
          ease: Expo.easeInOut,
          force3D: true,
          // rotation:0.001,
        }, '-=1.2')
        .fromTo(nxtContent, 1.2,{
          // yPercent: 40
          y: '40%'
        },{
          // yPercent: 0,
          y: '-=40%',
          ease: Expo.easeInOut,
          onComplete: () => {
            TweenMax.set(nxtContent,{clearProps:'all'});
            TweenMax.set(next,{clearProps:'all'});
            // TweenMax.set(crrContent,{clearProps:'all'});
            // TweenMax.set(curr,{clearProps:'all'});
            self.sapEnd(curr, next);
            this.twn.clear();
          }
        }, '-=1.2');
      // });
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
      const $project = Array.from(self.sideElems[index + 1].querySelectorAll('.name-projects_item'));
      let DefaultSettings = {
        navigation:{
          nextEl: $btnNext,
          prevEl: $btnPrev, 
        },
        simulateTouch:false,
        watchOverflow: true,
        allowTouchMove: false,
        preventClicks: false,
        roundLengths : false,
        // reverseDirection: true,
        on:{
          progress: function() {
            var swiper = this;
            for (var i = 0; i < swiper.slides.length; i++) {
              const img = swiper.slides[i].querySelector('.image-container');
              var slideProgress = swiper.slides[i].progress;
              var innerOffset = swiper.width * interleaveOffset;
              var innerTranslate = slideProgress * innerOffset;
              TweenMax
                .set(img,{
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
          init: function() {
            var defaultColor = $this.find('.swiper-slide-active').data('bgcolor-item');
            var defaultTextColor = $this.find('.swiper-slide-active').data('textcolor');
            var defaultCurrIndex = $this.find('.swiper-slide-active').data('swiper-slide-index');
            $project[defaultCurrIndex].classList.add('current');
            screenParent.attr('data-bgcolor', defaultColor);
            screenParent.attr('data-textcolor', defaultTextColor);
            $this.on({
              mouseenter: function() {
                $project.filter(item => {
                  item.classList.add('hover');
                });
                
              },
              mouseleave: function() {
                $project.filter(item => {
                  item.classList.remove('hover');
                });
                // $project[defaultCurrIndex].classList.remove('hover'); 
              }
            });
          },
          transitionStart: function() {
            if(screenParent.hasClass('section__active')) {
              requestAnimationFrame(() => {
                $this.addClass('animating');
                let realInd = $this[0].swiper.realIndex;
                var bgColor = $this.find('[data-swiper-slide-index="' + realInd + '"]').data('bgcolor-item');
                var textcolor = $this.find('[data-swiper-slide-index="' + realInd + '"]').data('textcolor');
                screenParent.attr('data-bgcolor', bgColor).attr('data-textcolor', textcolor);
                $project.filter(item => {
                  item.classList.remove('current');
                });
                $project[realInd].classList.add('current');
                // $project.eq(realInd).addClass('current').siblings().removeClass('current');
                self.setColor(bgColor, textcolor);
              });   
            }
          },

          transitionEnd: function(el) {
            requestAnimationFrame(() => {
              $this.removeClass('animating');

              // .removeInlineCss('transition-duration');
            });
          }
        },
        beforeDestroy: function() {
          // alert();
          // let images = $this[0].querySelectorAll('.image-container');
          // images.filter(item => {
          //   item.removeAttribute('style');
          // });
        },

      };

      let assignSettings = Object.assign(DefaultSettings, SwiperSettings);
      this.swiperInstance = new Swiper('.instance-' + index, assignSettings);
      self.swiperInstances.push(this.swiperInstance);
      
    });
  },

  setCurrentPage: function(currPage) {
    this.scene.classList.remove('hidden');
    if (this.sections[currPage].dataset.dark === 'true') {
      this.element.add(this.logo).removeClass('light');
    } else {
      this.element.add(this.logo).addClass('light');
    }
    if(currPage === null) {
      this.navItem.eq(0).addClass('nav__active');
      this.sections[0].classList.add('section__active');
      this.sideElems[0].classList.add('section__active');
    } else {
      this.navItem.eq(currPage).addClass('nav__active');
      this.sections[currPage].classList.add('section__active');
      this.sideElems[currPage].classList.add('section__active');
    }

    setTimeout(() => {
      this.setColor(this.element.find('.section__active').data('bgcolor'), this.element.find('.section__active').data('textcolor'));
    },800);
   
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
