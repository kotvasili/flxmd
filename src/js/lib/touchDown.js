import { TweenMax } from 'gsap';
import './domConf.js';

export default class touchDown {
  constructor(el) {
    // this.el = Array.from(document.querySelectorAll('.touch-down'));
    this.el = el;
    this.innerEl = this.el.querySelector('.touch-down-elem') || this.el;
    // console.log(this.innerEl);
    this.isPressed = false;
    this.isHovered = false;
    this.mousemoved = this.el.classList.contains('not-move') ? false : true;
    // console.log(this.mousemoved);
    this.initialize();
    
  }
  initialize() {
    // this.el.ontouchstart = () => {this.handleTouchStart(), window.DOM.passiveSupported ? { passive: true } : false;};
    // this.el.onmousedown = () => {this.handleTouchStart(), window.DOM.passiveSupported ? { passive: true } : false;};
    // this.el.ontouchend =() => {this.handleTouchEnd(), window.DOM.passiveSupported ? { passive: true } : false;};
    // this.el.onmouseup = () => {this.handleTouchEnd(), window.DOM.passiveSupported ? { passive: true } : false;};
    // this.el.onmouseleave =() => {this.handleTouchEnd(), window.DOM.passiveSupported ? { passive: true } : false;};
    this.el.addEventListener('touchstart',(ev) => this.handleTouchStart(), window.DOM.passiveSupported ? { passive: true } : false);
    this.el.addEventListener('mousedown',(ev) => this.handleTouchStart(), window.DOM.passiveSupported ? { passive: true } : false);
    this.el.addEventListener('touchend',(ev) => this.handleTouchEnd(), window.DOM.passiveSupported ? { passive: true } : false);
    this.el.addEventListener('mouseup',(ev) => this.handleTouchEnd(), window.DOM.passiveSupported ? { passive: true } : false);
    this.el.addEventListener('mouseleave',(ev) => this.handleMouseLeave(ev), window.DOM.passiveSupported ? { passive: true } : false);
    this.mousemoved ? this.el.addEventListener('mouseenter', (ev) => this.handleMouseEnter(), window.DOM.passiveSupported ? { passive: true } : false) : false;
    this.el.classList.add('touch-handled');
  }
  destroy() {
    this.el.removeEventListener('touchstart',(ev) => this.handleTouchStart(), window.DOM.passiveSupported ? { passive: true } : false);
    this.el.removeEventListener('mousedown',(ev) => this.handleTouchStart(), window.DOM.passiveSupported ? { passive: true } : false);
    this.el.removeEventListener('touchend',(ev) => this.handleTouchEnd(), window.DOM.passiveSupported ? { passive: true } : false);
    this.el.removeEventListener('mouseup',(ev) => this.handleTouchEnd(), window.DOM.passiveSupported ? { passive: true } : false);
    this.el.removeEventListener('mouseleave',(ev) => this.handleMouseLeave(), window.DOM.passiveSupported ? { passive: true } : false);
    // this.mousemoved ? this.el.removeEventListener('mouseenter',this.handleMouseEnter, window.DOM.passiveSupported ? { passive: true } : false);
    this.el.classList.remove('touch-handled');
  }
  handleTouchStart() {
    this.isPressed = true;
    TweenMax.to(this.innerEl, 0.2, { scale: 0.96 });
  }
  handleMouseEnter() {
  	this.isHovered = true;
  	TweenMax.to(this.innerEl, 0.2, { x: 10 });
  }
  handleMouseLeave(ev) {
  	if(ev.relatedTarget || ev.toElement) {
	  	this.isHovered = false;
	  	TweenMax.to(this.innerEl, 0.2, { x: 0 });
	  	if(!this.mousemoved) this.handleTouchEnd();
    }

  }
  handleTouchEnd() {
    this.isPressed = false;
    TweenLite.to(this.innerEl, 0.2, {scale: 1 });
  }
}
