import { TweenMax } from 'gsap';
import './domConf.js';

export default class touchDown {
  constructor(el) {
    // this.el = Array.from(document.querySelectorAll('.touch-down'));
    this.el = el;
    this.innerEl = this.el.querySelector('.touch-down-elem') || this.el;
    console.log(this.innerEl);
    this.isPressed = false;
    this.mousemoved = el.classList.contains('not-move') ? false : true;
    this.initialize();
  }
  initialize() {
    this.el.addEventListener('touchstart',() => this.handleTouchStart, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.addEventListener('mousedown',() => this.handleTouchStart, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.addEventListener('touchend',() => this.handleTouchEnd, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.addEventListener('mouseup',() => this.handleTouchEnd, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.addEventListener('mouseleave',() => this.handleTouchEnd, window.DOM.passiveSupported ? { passive: true } : false);
    // this.mousemoved ? this.el.addEventListener('mouseenter',this.handleMouseEnter, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.classList.add('touch-handled');
  }
  destroy() {
    this.el.removeEventListener('touchstart',() => this.handleTouchStart, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.removeEventListener('mousedown',() => this.handleTouchStart, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.removeEventListener('touchend',() => this.handleTouchEnd, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.removeEventListener('mouseup',() => this.handleTouchEnd, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.removeEventListener('mouseleave',() => this.handleTouchEnd, window.DOM.passiveSupported ? { passive: true } : false);
    // this.mousemoved ? this.el.removeEventListener('mouseenter',this.handleMouseEnter, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.classList.remove('touch-handled');
  }
  handleTouchStart() {
    this.isPressed = true;
    // let innerEl = this.innerEl;
    // console.log(this.isPressed);
    alert();
    TweenMax.to(this.innerEl, 0.2, { scale: 0.96 });
  }
  handleMouseEnter() {

  }
  handleTouchEnd() {
    this.isPressed = false;
    // console.log(this.innerEl);
    // let innerEl = this.innerEl;
    TweenLite.to(this.innerEl, 0.2, { scale: 1 });
		
    // this.isMoved = false;
  }
}
