import {TweenMax} from 'gsap';
import './domConf';

export default class PageLoader {
  constructor() {
    this.loaderContainer = document.getElementById('page-loader');
    this.color = document.querySelector('.barba-container');
    this.frame = document.querySelector('.root-frame');
    this.container = this.loaderContainer.querySelector('.loader-logo');
    this.containerW = this.container.offsetWidth;
    this.logo = this.container.querySelector('.loader-logo-icon');
    this.text = this.container.querySelector('.loader-logo-cont');
    this.textconts = Array.from(this.text.querySelectorAll('.logo-text'));
    this.scrollcont = this.container.querySelector('.loader-logo-cont-inner');
    this.height = this.text.querySelector('.logo-text').offsetHeight;
    console.log(this.height);
    this.lengt = this.textconts.length;

    this.init();
    TweenMax.lagSmoothing(1000, 16);
  }

  init() {
    this.setSettings();
    
  }

  setSettings() {
    TweenMax.to(this.loaderContainer, 0.1, {
      backgroundColor: this.color.getAttribute('data-loader')
    });
    TweenMax.set(this.logo, {
      // left: '50%',
      x: this.containerW /2- this.logo.offsetWidth /2, 
      scale: 0.7,
      autoAlpha: 0,
    });
    TweenMax.set(this.scrollcont, {
      x: - this.logo.offsetWidth,
      y: 0,
      autoAlpha: 0,
      className:'visible-1',
    });
    window.DOM.body[0].style.overflow = 'hidden';
    
  }
  startAnim() {
    TweenMax.to(this.logo,0.5,{
      delay: 0.6,
      autoAlpha: 1,
      scale: 1,
      ease: Power1.easeOut,
      clearProps: 'All',
      onComplete:() => {
        TweenMax.set(this.logo,{clearProps: 'All'});
        setTimeout(() => {
          this.lineAnimation();
        },100);
       
      }
    });
  }
  lineAnimation() {
    TweenMax.to(this.logo , 0.5, {
      x: 0,
      // lazy:true,
    });
    TweenMax.to(this.scrollcont , 0.5, {
      x: 0,
      y: 0,
    });
    TweenMax.to(this.scrollcont , 0.3, {
      delay: 0.1,
      autoAlpha: 1,
      
      onComplete:() => {
        TweenMax.to(this.scrollcont , 0.3, {
          x: 0,
          autoAlpha: 1,
          ease: Power1.easeOut,
          // lazy:true,
          onComplete: () => {
            TweenMax.to(this.scrollcont ,0.3, {
              delay: 0.2,
              y: -this.height ,
              ease: Power1.easeOut,
              className:'visible-2',
              // lazy:true,
              onComplete: () => {
                TweenMax.to(this.scrollcont ,0.3, {
                  delay: 0.2,
                  y: -(this.height *2), 
                  className:'visible-3',
                  ease: Power1.easeOut,
                  // lazy:true,
                  onComplete: () => {
                    TweenMax.to(this.scrollcont ,0.3, {
                      delay: 0.2,
                      y: -(this.height *3), 
                      className:'visible-4',
                      ease: Power1.easeOut,
                      // lazy:true,
                      // force3D: true,
                      onComplete: () => {
                        this.show();
                      }
                    }); 
                  }
                }); 
              }
            });  
          }
        });
      }
    });
    TweenMax.to(this.frame , 0.3, {
      delay: 0.5,
      autoAlpha: 1,
    });

  }

  show() {
    TweenMax.to(this.container , 0.3, {
      autoAlpha: 0,
      scale: 0.7,
      delay: 0.2,
      onComplete:() => {
        window.DOM.body[0].style.overflow = 'visible';
        TweenMax.to(this.loaderContainer, 0.5, {
          autoAlpha: 0,
          display: 'none',
        });
      }
    });

   
  }
}
