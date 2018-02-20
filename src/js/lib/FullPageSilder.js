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

    // this.sections = $(this.options.screen);
    this.sections = Array.from(document.querySelectorAll(this.options.screen));
    this.sectionsLength = this.sections.length;
    this.navItem = $(this.options.navigationItem);
    this.swiper = $(this.options.swiperContainer);
    this.menuPrimary = $(this.options.mainMenu);
    this.logo = $('.logo');
    this.swiperInstances = [];
    this.colorChange = null;
    this.canScroll = false;
    this.scrollController = null;
    this.bgTargets;
    this.body = window.DOM.body;
    this.scene = document.getElementById('scene');
    // this.initSwiper();
    this.bgTargets = $('.scrollbar__container').find('span').add($('.hover-line'));
    this.setCurrentPage(this.options.currPage);
    this.setNavigationCurrItem(this.options.currPage);
    this.generateScrollBarPagination();
    this.setScrollBar(this.options.currPage);
    this.initEventHandler();
    this.scrollEvent();
    this.twn = new TimelineMax();
    this.slideTwn = new TimelineMax();


  },
  initEventHandler: function() {
    var self = this;

    this.navItem.each(function() {
    	let _ = $(this);
    	let a = _.find('a');
    	let parentIndex = _.index();
      console.log(self.sections);
    	a.on('click',(event) => {
    		event.preventDefault();
	      if(self.canScroll || _.hasClass('nav__active')) {
	        return false;
	      }
	      self.canScroll = true;

	      self.curr_slide = self.options.currPage;
	      self.next_slide = parentIndex;
	      self._curr_slide = self.sections[self.item_curr];
	      self._next_slide = self.sections[self.item_next];
	      self.goToSlide(self._curr_slide, self._next_slide);

	      self.setNavigationCurrItem(this.item_next);

	      self.options.currPage = this.item_next;
	      self.setScrollBar(this.item_next);

	      
    	});
    });

    $('.bar__item a').on('click', function(event) {

      if(self.canScroll || $(this).parent().hasClass('is-current')) {
        return false;
      }

      self.canScroll = true;

      self.curr_slide = self.options.currPage;
      self.next_slide = $(this).parent().index();

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
    this.element.on('mousewheel DOMMouseScroll',(e) => {
      e.preventDefault();
    });
    if(window.DOM.html.hasClass('firefox')) {
      this.element[0].addEventListener('DOMMouseScroll',(e) => debounce(self.checkDirection(e)));
    }else{
      this.element[0].addEventListener('mousewheel',(e) => debounce(self.checkDirection(e)));
    }
    
    
    // $(this.element).on('mousewheel.fp DOMMouseScroll.fp', (e) => debounce(self.checkDirection(e)));
  },
  removeEvents: function() {
    this.twn.kill();
    this.slideTwn.kill();
    this.element.off('mousewheel DOMMouseScroll');
    this.swiperInstances.forEach(item => {
      item.destroy();
    });
  },
  checkDirection: function(e) {
    // console.log(1);
    e.preventDefault();
    if(this.body.hasClass('menu-open')) {
      return false;
    }
    // console.log(2);
    if(!this.canScroll) {
      var delta = e.wheelDelta ? -e.wheelDelta : e.detail * 20;
      if(delta > 50 ) {
        this.curr_slide = this.options.currPage;
        this.next_slide = this.curr_slide + 1;
        this._curr_slide = this.sections[this.curr_slide];
        this._next_slide = this.sections[this.next_slide];
        this.canScroll = true;
        this.moveSection();
        return false;

      } else if(delta < -50) {
        
        this.curr_slide = this.options.currPage;
        this.next_slide = this.curr_slide - 1;
        this._curr_slide = this.sections[this.curr_slide];
        this._next_slide = this.sections[this.next_slide];
        console.log(this._curr_slide,this._next_slide);
        this.canScroll = true;
        this.moveSection();
        return false;

        // this.prevSection();
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

    this.sections.filter((child) => {
      child.classList.remove('section__active');
    });
    nextItem.classList.add('section__active');
    setTimeout(() => {
      this.canScroll = false;	
    }, 370);
  },
  goToSlide: function(curr, next) {
    var self = this;
    // let nxt = $(next);
    // let crr = $(curr);
    
    let nxtInd = this.curr_slide;
    let crrInd = this.next_slide;
    console.log(nxtInd,crrInd);
    let crrContent = curr.querySelector('.content__side');
    let nxtContent = next.querySelector('.content__side');
    let swiperActive = next.querySelector('.swiper-slide-active');
    // if(next.find('.swiper-container').length) {
    next.classList.add('section__active');
    if(swiperActive !== null) {
      this.setColor(swiperActive.getAttribute('data-bgcolor-item'), swiperActive.getAttribute('data-textcolor'));
    } else {
      this.setColor(next.dataset.bgcolor, next.dataset.textcolor);
    }

    if (next.dataset.dark !== null) {
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
        },500);
      }else{
        this.scene.classList.add('hidden');
        setTimeout(() => {
          this.scene.stp();
        },100);
      }
    }
    
    // curr.addClass('section__prev')
    if(crrInd > nxtInd) {
      // requestAnimationFrame(() => {

      this.twn
        .fromTo(curr, 1.2, {
          yPercent: 0
        }, {
          yPercent: -100,
          ease: Expo.easeInOut,
          force3D:true,
        })
        .fromTo(crrContent, 1.2,{
          yPercent: 0
        },{
          yPercent: 40,
          ease: Expo.easeInOut,

          // force3D:true,
        }, '-=1.2')
        .fromTo(next, 1.2, {
          // className: '+= section__active',
          yPercent: 100,
        }, {
          // className: '+=',
          yPercent: 0,
          ease: Expo.easeInOut,
          // rotation:0.001,
          force3D:true,
          // willChange: 'transform',
          // clearProps: 'All',
          //here

        }, '-=1.2')
        .fromTo(nxtContent, 1.2,{
          yPercent: -40
        },{
          yPercent: 0,
          ease: Expo.easeInOut,
          // force3D: true,
          // rotation:0.001,
          // willChange: 'transform',
          // clearProps: 'All',
          onComplete: () => {
            TweenMax.set(nxtContent,{clearProps:'all'});
            TweenMax.set(next,{clearProps:'all'});
            // TweenMax.set(crrContent,{clearProps:'all'});
            // TweenMax.set(curr,{clearProps:'all'});
            self.sapEnd(curr, next);
            // this.twn.kill();
          }
        }, '-=1.2'); 
      // });
    } else {
      // requestAnimationFrame(() => {
      this.twn
        .fromTo(curr, 1.2, {
          yPercent : 0
        }, {
          yPercent: 100,
          ease: Expo.easeInOut,
          force3D:true,
        })
        .fromTo(crrContent, 1.2,{
          yPercent: 0
        },{
          yPercent: -40,
          ease: Expo.easeInOut,
          // force3D:true,
        }, '-=1.2')
        .fromTo(next, 1.2, {
          // className: '+=section__prev section__active',
          yPercent: -100,
        }, {
          // className: '+=section__active',
          yPercent: 0,
          ease: Expo.easeInOut,
          force3D: true,
          // rotation:0.001,
          // clearProps: 'All',

        }, '-=1.2')
        .fromTo(nxtContent, 1.2,{
          yPercent: 40
        },{
          yPercent: 0,
          ease: Expo.easeInOut,
          // force3D:true,
          // willChange: 'transform',
          // clearProps: 'All',
          onComplete: () => {
            TweenMax.set(nxtContent,{clearProps:'all'});
            TweenMax.set(next,{clearProps:'all'});
            // TweenMax.set(crrContent,{clearProps:'all'});
            // TweenMax.set(curr,{clearProps:'all'});

            self.sapEnd(curr, next);
            // this.twn.kill();
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
      const $project = screenParent.find('.swiper-projects').find('.name-projects_item');
      const slideTwn = self.slideTwn;
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
            $project.eq(defaultCurrIndex).addClass('current');
            screenParent.attr('data-bgcolor', defaultColor);
            screenParent.attr('data-textcolor', defaultTextColor);
            $this.on({
              mouseenter: function() {
                // console.log(3434);
                $project.addClass('hover');
              },
              mouseleave: function() {
                // console.log(35554);
                $project.removeClass('hover'); 
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
                $project.eq(realInd).addClass('current').siblings().removeClass('current');
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
      this.swiperInstance = new Swiper('.instance-' + index, assignSettings);
      self.swiperInstances.push(this.swiperInstance);
      
    });
  },

  setCurrentPage: function(currPage) {
    if(currPage === null) {
      this.navItem.eq(0).addClass('nav__active');
      this.sections[0].classList.add('section__active');
    } else {
      this.navItem.eq(currPage).addClass('nav__active');
      this.sections[currPage].classList.add('section__active');
    }
    
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
