import $ from 'jquery/dist/jquery.min';
import Barba from 'barba.js/dist/barba.min';
import PageLoader from './lib/SiteLoader';
import ScrollSlide from './lib/FullPageSilder';
import Menu from './lib/Menu';
import Scroller from './lib/ScrollBar';
import Colorize from './lib/Colorize';
import Carousel from './lib/Carousel.js';
import Promise from './lib/Promise';
import RecentSlider from './lib/RecentSilder.js';
import Crsor from './lib/Crsor.js';
import browserDetection from 'browser-detection/src/browser-detection.js';
import { TweenMax, TimelineMax ,Circ, Sine} from 'gsap';
import Cursor from './lib/Cursor.js';
import './lib/domConf.js';
import CanvRender from './lib/canv';
// import dragscroll from 'dragscroll';
// import WOW from '../../node_modules/wow.js/dist/wow.min.js';
import inView from 'in-view';
$.fn.hasAttr = function(name) {
  return this.attr(name) !== undefined;
};

var BarbaWitget = {
  init: function() {
    var scope = this;

    // var wow = new WOW({
    //   callback: function(box) {
    //     box.classList.add('animate');
    //     box.removeAttribute('style');
    //   },
    // });
    // wow.init();
    this.menu = new Menu();
    this.menu.init();
    Barba.Pjax.start();
    Barba.Prefetch.init();
    Colorize();
    Barba.Pjax.getTransition = function() {
      return scope.MovePage;
    };
    // var myEase:Function = CustomEase.create("SlowMo", [{s:0,cp:0.394,e:0.644},{s:0.644,cp:0.894,e:1}]);
    Barba.Dispatcher.on('newPageReady', (currentStatus, oldStatus, container) => {

    });
    Barba.Dispatcher.on('transitionCompleted', (currentStatus, oldStatus, container) => {
      window.DOM.cursor.defaultType();
      // setTimeout(() => {
      Colorize();
      // },0);
      this.menu.destroy();
      delete this.menu;
      this.menu = new Menu();
      this.menu.init();

    });    
  },
  MovePage: Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.pageOut()])
        .then(this.pageIn.bind(this));
    },
    pageOut: function() {
      var deferred = Barba.Utils.deferred();
      let tl = new TimelineMax({
        onComplete: () => {
          deferred.resolve();
        }
      });
      this.oldCont = $(this.oldContainer);
      window.DOM.hideScrollSimple();
      let frame = this.oldCont.find('.wrapper-frame');
      let overlayOuter = this.oldCont.find('.overlay__color');
      let overlayW = overlayOuter.outerWidth();
      let overlayColor = overlayOuter.css('backgroundColor');      

      if(window.DOM.body.hasClass('menu-open')) {
        tl.set(window.DOM.body, {
          className: '-=menu-open'
        });
        this.delay = 0.6;
      } else {
        this.delay = 0.3;
      }
      this.screenWidth = $(window).width();
      tl
        .set(window.DOM.trnsContOUT, {
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
          ease: Sine.easeOut,
        })
        .to(window.DOM.trnsContOUT, 1.5, {
          width: parseInt(this.screenWidth),
          ease: Circ.easeIn.Power2,
        });

      return deferred.promise;
    },
    pageIn: function() {
      var self = this;
      this.newCont = $(this.newContainer);
      let frame = this.newCont.find('.wrapper-frame');
      let overlayInner = this.newCont.find('.overlay__color');
      let overlayW = overlayInner.innerWidth();
      let overlayColor = this.newCont.data('bgcolor');
      let tlr = new TimelineMax();

      tlr

        .set(window.DOM.trnsContIN, {
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
        .to(window.DOM.trnsContOUT, 0.7, {
          // width: screenWidth - screenWidth / 100 * 10,
          scaleX: 0,
          transformOrigin:'right center',
          ease: Circ.easeIn.Power2,
        })
        .to(window.DOM.trnsContIN, 0.7, {
          x: 0,
          ease: Circ.easeIn.Power2,
        }, '-=0.7')

        .set(this.oldCont, {
          autoAlpha: 0,
          // display: 'none'
        })
        .set(overlayInner, {
          backgroundColor: overlayColor,
        })
        .set(this.newCont, {
          autoAlpha: 1,
          onComplete: () => {
           
            self.done();
            TweenMax.to(frame, 0.5, {
              y: 0,
              autoAlpha: 1,
              clearProps: 'all',
              onComplete: () => {
                window.DOM.showScrollSimple();
                TweenMax.set(window.DOM.trnsContOUT,{clearProps:'all'});
                TweenMax.set(window.DOM.trnsContIN,{clearProps:'all'});
                
                tlr.kill();
               
                // document.body.style.overflow = 'visible';
              }
            });

            
          }
        });
    }
  })
};

var IndexPage = Barba.BaseView.extend({
  namespace: 'home',
  onEnter: function() {
      
    
  },
  onEnterCompleted: function() {
    this.fullpage = new ScrollSlide('#work-wrapper'); 
    window.DOM.body.addClass('index-page');
    CanvRender();
    
    // Colorize();
    setTimeout(() => {
      this.fullpage.initSwiper(); 
    },500);


  },
  onLeave: function() {
    // this.menu.destroy();
    this.fullpage.removeEvents();
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
    
    this.portfolio.delete();
    
    // delete this.menu;
  },
  onLeaveComplete: function() {
    console.log('PortfolioPage');
    
    // this.menu.destroy();
    delete this.portfolio;
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
  window.DOM.getScrollWidth();
  try {
    var options = Object.defineProperty({}, 'passive', {
      get: function() {
        window.DOM.passiveSupported = true;
      }
    });
    window.addEventListener('test', null, options);
  } catch(err) {}

  window.DOM.cursor = new Crsor();
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
if (!window.Promise) {
  window.Promise = Promise;
}
document.addEventListener('DOMContentLoaded', () => {

});


