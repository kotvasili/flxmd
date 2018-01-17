import $ from 'jquery/dist/jquery.min';
import Barba from 'barba.js/dist/barba.min';
import PageLoader from './lib/SiteLoader';
import ScrollSlide from './lib/FullPageSilder';
import Menu from './lib/Menu';
import Scroller from './lib/ScrollBar';
import Colorize from './lib/Colorize';
import Carousel from './lib/Carousel.js';
import RecentSlider from './lib/RecentSilder.js';
import browserDetection from '../../node_modules/browser-detection/src/browser-detection.js';
import { TweenMax, TimelineMax ,SlowMo} from 'gsap';
import Cursor from './lib/Cursor.js';
import './lib/domConf.js';
// import dragscroll from 'dragscroll';
import WOW from '../../node_modules/wow.js/dist/wow.min.js';

$.fn.hasAttr = function(name) {
  return this.attr(name) !== undefined;
};

var BarbaWitget = {
  init: function() {
    var scope = this;

    var wow = new WOW({
      callback:     function(box) {
        box.classList.add('animate');
      },
    });
    wow.init();
    this.menu = new Menu();
    this.menu.init();
    Barba.Pjax.start();
    Colorize();
    Barba.Pjax.getTransition = function() {
      return scope.MovePage;
    };
    Barba.Dispatcher.on('newPageReady', (currentStatus, oldStatus, container) => {
      
    });
    Barba.Dispatcher.on('transitionCompleted', (currentStatus, oldStatus, container) => {
      this.menu.destroy();
      delete this.menu;
      this.menu = new Menu();
      this.menu.init();
      
    });   
    console.log(Barba.Dispatcher.events);
  },
  MovePage: Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.pageOut()])
        .then(this.pageIn.bind(this));
    },
    pageOut: function() {
      var deferred = Barba.Utils.deferred();
      window.DOM.body.addClass('loading').css('overflow','hidden');

      // var top = window.pageYOffset;
      let tl = new TimelineMax({
        onComplete: () => {
          deferred.resolve();
        }
      });

      let transitionTemplate = `
        <div class="page-transition"><div id="outer" class="page page__out"><div id="out"></div></div><div id="inner" class="page page__in"><div id="in"></div></div></div>`;

      let uppendContainer = document.querySelector('.root-frame');

      $(uppendContainer).prepend(transitionTemplate);

      let frame = $(this.oldContainer).find('.wrapper-frame');
      let overlayOuter = $(this.oldContainer).find('.overlay__color');
      let overlayW = overlayOuter.innerWidth();
      let overlayColor = overlayOuter.css('backgroundColor');      

      let out = document.getElementById('out');

      if(window.DOM.body.hasClass('menu-open')) {
        tl.set(window.DOM.body, {
          className: '-=menu-open'
        });
        this.delay = 0.6;
      } else {
        this.delay = 0.3;
      }

      tl
        .set(out, {
          width: overlayW,
          backgroundColor: overlayColor
        })
        .set(window.DOM.body, {
          className: '-=menu-open'
        })
        .to(frame, 0.3, {
          delay: this.delay*2,
          y: -40,
          autoAlpha: 0,
          ease: new SlowMo(0.99,0.02,1,1)
        });

      return deferred.promise;

    },
    pageIn: function() {
      var self = this;
      let page = $('.page-transition');
      let frame = $(this.newContainer).find('.wrapper-frame');
      let overlayInner = $(this.newContainer).find('.overlay__color');
      let overlayW = overlayInner.innerWidth();
      let overlayColor = $(this.newContainer).data('bgcolor');
      let screenWidth = $(window).width();
      // let screenHeight = $(window).height();
      let _in = document.getElementById('in');
      let out = document.getElementById('out');

      let tl = new TimelineMax({
        onComplete: () => {
          // page.remove();
          self.done();
          TweenMax.to(frame, 0.6, {
            delay: 0.2,
            y: 0,
            autoAlpha: 1,
            clearProps: 'all',
            onComplete: () => {
              TweenMax.to(overlayInner, 0.3, {
                backgroundColor: overlayColor,
                onComplete: () => {
                  page.remove();
                  window.DOM.body.removeClass('loading').css('overflow','visible');
                  // document.body.style.overflow = 'visible';
                }
              });
            }
          });
        }
      });

      tl
        .set(_in, {
          width: overlayW,
          x: -overlayW,
          backgroundColor: overlayColor
        })
        .set(frame, {
          y: 80,
          autoAlpha: 0,
        })
        .set(overlayInner, {
          backgroundColor: 'none'
        })
        .to(out, 0.7, {
          width: screenWidth - screenWidth / 100 * 10,
          ease: new SlowMo(0.99,0.02,1,1)
        })
        .to(out, 0.7, {
          x: screenWidth,
          ease: new SlowMo(0.25,0.1,0.25,0.1)
        })
        .to(_in, 0.7, {
          x: 0,
          ease: new SlowMo(0.25,0.1,0.25,0.1)
        }, '-=0.7')
        .to(this.oldContainer, 0.3, {
          autoAlpha: 0,
          display: 'none'
        },0.3)
        .to(this.newContainer, 0.3, {
          autoAlpha: 1
        },0);
    }
  })

};

var IndexPage = Barba.BaseView.extend({
  namespace: 'home',
  onEnter: function() {
    window.DOM.body.addClass('index-page');
  },
  onEnterCompleted: function() {
    this.fullpage = new ScrollSlide('#work-wrapper');
    // Colorize();

  },
  onLeave: function() {
    // this.menu.destroy();
    window.DOM.body.removeClass('index-page');
    delete this.fullpage;
    // delete this.menu;
  },
  onLeaveComplete: function() {

  }
});

var PortfolioPage = Barba.BaseView.extend({
  namespace: 'portfolio',
  onEnter: function() {
    // this.menu = new Menu();
    // this.menu.init();
  },
  onEnterCompleted: function() {
    let scrollsMain = document.getElementById('scroll-container');

    this.portfolio = new Scroller(scrollsMain, {
      constant: '.layout_fixed',
      animElements: '.js-scroll',
      _ajax: true
    }, true);

    // Colorize();
  },
  onLeave: function() {

    console.log('PortfolioPage');
    this.portfolio.delete();
    // this.menu.destroy();
    delete this.portfolio;
    // delete this.menu;
  },
  onLeaveComplete: function() {

  }
});

var PortfolioInnerPage = Barba.BaseView.extend({
  namespace: 'portfolio-project',
  onEnter: function() {
    // this.menu = new Menu();
    // this.menu.init();
  },
  onEnterCompleted: function() {
    let scrollsMain = document.getElementById('scroll-container');

    this.portfolio = new Scroller(scrollsMain, {
      constant: '.layout_fixed',
      animElements: '.js-scroll',
      scrollText: true,
      grabScroll: true
    }, true);

    this.carousel = new Carousel();
    this.carousel.init();

    this.resent = new RecentSlider();
    // Colorize();
    
    if (typeof dragscroll !== 'undefined') {
      dragscroll.reset();  
    }
    
  },
  onLeave: function() {
    this.portfolio.delete();
    // this.menu.destroy();

    delete this.portfolio;
    delete this.carousel;
    // delete this.menu;
    delete this.resent;
  },
  onLeaveComplete: function() {

  }
});

var ContactsPage = Barba.BaseView.extend({
  namespace: 'contacts',
  onEnter: function() {
    // this.menu = new Menu();
    // this.menu.init();
  },
  onEnterCompleted: function() {
    var scrollsMain = document.getElementById('scroll-container');
    this.portfolio = new Scroller(scrollsMain, {
      constant: '.layout_fixed',
      animElements: '.js-scroll',
      scrollText: true,
      tabs: true
    }, true);

    
  },
  onLeave: function() {
    
    console.log('ContactsPage');
    this.portfolio.delete();
    // this.menu.destroy();
    
    delete this.portfolio;
    // delete this.menu;
  },
  onLeaveComplete: function() {

  }
});

 
function initSite() {
  // Colorize();
  browserDetection({
    addClasses: true
  });
  
  new PageLoader();
  ContactsPage.init();
  PortfolioPage.init();
  IndexPage.init();
  PortfolioInnerPage.init();
  BarbaWitget.init();
}

window.onload = () => {
  initSite();
};

document.addEventListener('DOMContentLoaded', () => {

});


