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
if (!Array.from) {

  Array.from = (function() {
    var toStr = Object.prototype.toString;
    var isCallable = function(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function(value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

      // Свойство length метода from равно 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Положим C равным значению this.
      var C = this;

      // 2. Положим items равным ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. Если mapfn равен undefined, положим mapping равным false.
      var mapFn = arguments[1];
      if (typeof mapFn !== 'undefined') {
        mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        // 5. иначе
        // 5. a. Если вызов IsCallable(mapfn) равен false, выкидываем исключение TypeError.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Положим lenValue равным Get(items, "length").
      // 11. Положим len равным ToLength(lenValue).
      var len = toLength(items.length);

      // 13. Если IsConstructor(C) равен true, то
      // 13. a. Положим A равным результату вызова внутреннего метода [[Construct]]
      //     объекта C со списком аргументов, содержащим единственный элемент len.
      // 14. a. Иначе, положим A равным ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Положим k равным 0.
      var k = 0;
      // 17. Пока k < len, будем повторять... (шаги с a по h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Положим putStatus равным Put(A, "length", len, true).
      A.length = len;
      // 20. Вернём A.
      return A;
    };
  }());
}
if (!Array.prototype.forEach) {
    
  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Положим O равным результату вызова ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Положим lenValue равным результату вызова внутреннего метода Get объекта O с аргументом "length".
    // 3. Положим len равным ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. Если IsCallable(callback) равен false, выкинем исключение TypeError.
    // Смотрите: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. Если thisArg присутствует, положим T равным thisArg; иначе положим T равным undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Положим k равным 0
    k = 0;

    // 7. Пока k < len, будем повторять
    while (k < len) {

      var kValue;

      // a. Положим Pk равным ToString(k).
      //   Это неявное преобразование для левостороннего операнда в операторе in
      // b. Положим kPresent равным результату вызова внутреннего метода HasProperty объекта O с аргументом Pk.
      //   Этот шаг может быть объединён с шагом c
      // c. Если kPresent равен true, то
      if (k in O) {

        // i. Положим kValue равным результату вызова внутреннего метода Get объекта O с аргументом Pk.
        kValue = O[k];

        // ii. Вызовем внутренний метод Call функции callback с объектом T в качестве значения this и
        // списком аргументов, содержащим kValue, k и O.
        callback.call(T, kValue, k, O);
      }
      // d. Увеличим k на 1.
      k++;
    }
    // 8. Вернём undefined.
  };
}

(function(ELEMENT) {
  ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
  ELEMENT.closest = ELEMENT.closest || function closest(selector) {
    if (!this) return null;
    if (this.matches(selector)) return this;
    if (!this.parentElement) {return null;}
    else return this.parentElement.closest(selector);
  };
}(Element.prototype));

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
      let frame = this.oldCont.find('.wrapper-frame');
      let overlayOuter = this.oldCont.find('.overlay__color').eq(0);

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
      let frame = this.newCont.find('.wrapper-frame');
      let overlayInner = this.newCont.find('.overlay__color').first();
      let overlayW =   overlayInner.innerWidth();
      let overlayColor = this.newCont.data('bgcolor');
      // let tlr = new TimelineMax();
      let home = this.newCont.data('namespace') === 'home' ? true : false;
      if(home) {
        this.newCont.find('.logo').addClass('light imp');
        setTimeout(() => {
          this.newCont.find('.logo').removeClass('imp');
        },100);
      }
      window.DOM.tlr
        .set(window.DOM.trnsContIN, {
          width: overlayW,
          x: -overlayW,
          backgroundColor: overlayColor
        })

        .set(frame, {
          y: 80,
          autoAlpha: 0,
          force3D: true,
        })
        // .set(overlayInner, {
        //   backgroundColor: 'none'
        // })
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
        .set(overlayInner,{
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
    $('#overlay').css('background-color',$('.barba-container').last().data('bgcolor'));
  },
  onEnterCompleted: function() {
    if(this.canv !== undefined && this.canv !== null) {
      // setTimeout(() => {
      window.DOM.CanvRender();
      this.canv.classList.remove('hidden');
      // },1000);
    }
    window.DOM.body.addClass('index-page');
    this.fullpage = new ScrollSlide('#work-wrapper');

  },
  onLeave: function() {
    
    if(this.canv !== undefined && this.canv !== null) {
      this.canv.classList.add('hidden');
      this.canv.renderer.forceContextLoss();
    }
    window.DOM.body.removeClass('index-page');
    // alert(this.fullpage);
    setTimeout(() => {
      // this.canv.renderer.forceContextLoss();
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
    setTimeout(() => {
      $(window).trigger('scroll');
    },350);
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
  // },300);

};
if (!window.Promise) {
  window.Promise = Promise;
}
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0,0);
  window.DOM.loader = new PageLoader();
});
// ready(() => {

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
