import {TweenLite,TweenMax } from 'gsap';

export default class PageLoader {
  constructor() {
    this.loaderContainer = document.getElementById('page-loader');
    this.color = document.querySelector('.barba-container');
    this.frame = document.querySelector('.root-frame');
    this.line = document.querySelector('.line');
    this.logo = document.getElementById('svgo');
    this.path = document.getElementById('path');
    this.init();
  }

  init() {
    this.setSettings();
    this.lineAnimation();
  }

  setSettings() {
    TweenLite.to(this.loaderContainer, 0.3, {
      backgroundColor: this.color.getAttribute('data-loader')
    });

    this.logo.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
    
  }

  logoAnimation() {
    this.logo.drawsvg();
  }

  lineAnimation() {
    TweenMax.to(this.frame , 1, {
      delay: 0.5,
      autoAlpha: 1
    });
    TweenMax.fromTo(this.line, 1, {
      scaleX: 0
    }, {
      scaleX: 1,
      onComplete: () => {
        this.show();
      }
    });
  }

  show() {
    TweenMax.to(this.loaderContainer, 0.5, {
      autoAlpha: 0,
      display: 'none'
    });
    document.body.style.overflow = 'visible';
    
  }
}
