import $ from 'jquery/dist/jquery';
import Barba from 'barba.js/dist/barba.min';
import PageLoader from './lib/SiteLoader';
import ScrollSlide from './lib/FullPageSilder';
import Menu from './lib/Menu';
import Scroller from './lib/ScrollBar';
import Colorize from './lib/Colorize';
import Carousel from './lib/Carousel.js';
import Promise from './lib/Promise';
import scrollToEl from './lib/scrollToEl';
import RecentSlider from './lib/RecentSilder.js';
import './lib/LazyImage';
import browserDetection from 'browser-detection/src/browser-detection.js';
import { TweenMax, TimelineMax ,Circ, Sine} from 'gsap';
import './lib/domConf.js';
import CanvRender from './lib/canv';
import validateForms from './lib/jqValidator';
import touchDown from './lib/touchDown';
// import MousemoveEl from './lib/Mousemove';

$.fn.hasAttr = function(name) {
  return this.attr(name) !== undefined;
};

var BarbaWitget = {
  init: function() {
    var scope = this;

    this.touchEls = Array.from(document.querySelectorAll('.touch-down:not(.touch-handled)'));
    this.touchEls.filter(item => {
      new touchDown(item);
    });
    this.menu = new Menu();
    this.menu.init();
    Colorize();
    window.DOM.tl = new TimelineMax();
    window.DOM.tlr = new TimelineMax();

    Barba.Pjax.start();
    Barba.Prefetch.init();  
    Barba.Pjax.originalPreventCheck = Barba.Pjax.preventCheck;
    Barba.Pjax.preventCheck = (evt, element) => {
      if ($(element).attr('href') && $(element).attr('href').indexOf('#') > -1)
        return true;
      else
        return Barba.Pjax.originalPreventCheck(evt, element);
    };
    Barba.Dispatcher.on('linkClicked', function(elem) {
      let _t = $(elem);
      if(_t.attr('href').indexOf('/bitrix/admin/') !== -1 || _t.hasClass('no-barba')) {
        window.location.href = window.location.protocol + '//' + window.location.host+_t.attr('href');
      }
    });
    Barba.Dispatcher.on('newPageReady', (currentStatus, oldStatus, container) => {
      this.touchEls = Array.from(document.querySelectorAll('.touch-down:not(.touch-handled)'));
      this.touchEls.filter(item => {
        new touchDown(item);
      });
    });
    Barba.Dispatcher.on('transitionCompleted', (currentStatus, oldStatus, container) => {
      // window.DOM.cursor.defaultType();
      // setTimeout(() => {
      Colorize();
      // },0);
      window.DOM.LazyImage();
      this.menu.destroy();
      delete this.menu;
      this.menu = new Menu();
      this.menu.init();
      scrollToEl();
      validateForms();
    });  

    Barba.Pjax.getTransition = () => {
      return scope.MovePage;
    }; 
  },
  MovePage: Barba.BaseTransition.extend({
    start: function() {
      Promise
        .all([this.newContainerLoading, this.pageOut()])
        .then(this.pageIn.bind(this));
    },
    pageOut: function() {
      var deferred = Barba.Utils.deferred();
      
      this.oldCont = $(this.oldContainer);
      
      let fullwidth = this.oldCont.data('namespace') === 'home' ? true : false;
      let frame = this.oldCont.find('.wrapper-frame');
      let overlayOuter = this.oldCont.find('.overlay__color');

      let overlayW = overlayOuter.outerWidth();
      window.DOM.hideScrollSimple();
      let overlayColor = overlayOuter.css('backgroundColor');      
      
      if(window.DOM.body.hasClass('menu-open')) {
        window.DOM.tl.set(window.DOM.body, {
          className: '-=menu-open'
        });
        this.delay = 0.6;
      } else {
        this.delay = 0.3;
      }
      this.screenWidth = $(window).width();
      window.DOM.tl
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
          onComplete: () => {

            deferred.resolve();
          }
        });

      return deferred.promise;
    },
    pageIn: function() {
      var self = this;
      this.newCont = $(this.newContainer);
      let fullwidth = this.newCont.data('namespace') === 'home' ? true : false;
      let frame = this.newCont.find('.wrapper-frame');
      let overlayInner = this.newCont.find('.overlay__color');
      let overlayW =   overlayInner.innerWidth();
      let overlayColor = this.newCont.data('bgcolor');
      // let tlr = new TimelineMax();
      
      window.DOM.tlr
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
        .set(this.oldCont, {
          // autoAlpha: 0,
          display: 'none'
        })
        .set(this.newCont, {
          autoAlpha: 1
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
        .set(overlayInner, {
          backgroundColor: overlayColor,
          onComplete: () => {
            $(window).scrollTop(0,0);
            self.done();
            TweenMax.to(frame, 0.5, {
              y: 0,
              autoAlpha: 1,
              clearProps: 'all',
              onComplete: () => {
                window.DOM.showScrollSimple();
                // !fullwidth ? window.DOM.showScrollSimple(): false;
                TweenMax.set(window.DOM.trnsContOUT,{clearProps:'all'});
                TweenMax.set(window.DOM.trnsContIN,{clearProps:'all'});
                window.DOM.tl.kill();
                window.DOM.tlr.kill();
               
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
    this.canv = document.getElementById('scene');
    if(this.canv !== undefined && this.canv !== null) {
      setTimeout(() => {
        window.DOM.CanvRender();
        // this.canv.classList.remove('hidden');
      },1000);
    }
  },
  onEnterCompleted: function() {
    
   
    window.DOM.body.addClass('index-page');
    this.fullpage = new ScrollSlide('#work-wrapper');
    
  },
  onLeave: function() {
    
    if(this.canv !== undefined && this.canv !== null) {
      // this.canv.flyAway = true;
      setTimeout(() => {
       
      }, 1500);
    }
    window.DOM.body.removeClass('index-page');
    // alert(this.fullpage);
    setTimeout(() => {
      this.canv.renderer.forceContextLoss();
      this.fullpage.removeEvents();
      delete this.fullpage; 
    },1500);

  },
  onLeaveComplete: () => {


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
  },
  onLeave: function() {
    this.portfolio.delete();
    delete this.portfolio;
  },
  onLeaveComplete: function() {
    alert('PortfolioPage');
  }
});

var PortfolioInnerPage = Barba.BaseView.extend({
  namespace: 'portfolio-project',
  onEnter: function() {

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
  },
  onLeave: function() {
    setTimeout(() => {
      this.portfolio.delete();
      delete this.portfolio;
      this.carousel.destroy();
      delete this.carousel;
      this.resent.destroy();
      delete this.resent;
    },1500);

  },
  onLeaveComplete: () => {
    alert();
  }
});

var ContactsPage = Barba.BaseView.extend({
  namespace: 'contacts',
  onEnter: function() {
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
    delete this.portfolio;
  },
  onLeaveComplete: function() {
    alert();
  }
});
var Services = Barba.BaseView.extend({
  namespace: 'services',
  onEnter: function() {
  },
  onEnterCompleted: function() {
    // this.movedItems = new MousemoveEl('.js-mousemove');
  },
  onLeave: function() {
    // this.movedItems.destroy();
    // delete this.movedItems;
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

  // window.DOM.cursor = new Crsor();
  browserDetection({
    addClasses: true
  });
  
  window.DOM.loader = new PageLoader();
 
  ContactsPage.init();
  PortfolioPage.init();
  IndexPage.init();
  PortfolioInnerPage.init();
  Services.init();
  BarbaWitget.init();

}

window.onload = () => {
  scrollToEl();
  // setTimeout(() => {
  window.DOM.loader.startAnim();
  // },1000);

};
if (!window.Promise) {
  window.Promise = Promise;
}
document.addEventListener('DOMContentLoaded', () => {

});
// ready(() => {
window.scrollTo(0,0);
initSite();
window.DOM.LazyImage();
validateForms();
// ScrollAnim();
// });

// replacement for domcontentloaded event
// function ready(fn) {
//   if (document.readyState !== 'loading') {
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }
