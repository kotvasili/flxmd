import $ from 'jquery';
import { TimelineMax } from 'gsap';
import debounce from './debounce';
import './domConf.js';

export default class Crsor {
  constructor() {
    this.el = document.querySelector('.crsor');
    this.cursors = Array.from(this.el.querySelector('.crsor-elem'));
    this.defaultClass = 'cursor-default';
    this.tl = new TimelineMax();
    this.initEvents(); 
	
  }
  initEvents() {
    const self = this;
    window.DOM.body.addClass('no-cursor');
    window.addEventListener('mousemove',(ev) => debounce(this.handleMouseMove(ev)));
    window.addEventListener('touchmove',(ev) => this.handleMouseMove(ev));
    $(document).on({
      mouseenter: function() {
        let type = $(this).data('cursor-type');
        self.el.classList.remove(self.defaultClass);
        self.el.classList.add('cursor-' + type);
      },
      mouseleave: function() {
        let type = $(this).data('cursor-type');
        self.el.classList.remove('cursor-' + type);
        self.defaultType();
      }
    }, '.crsor-trgr');
    // $(document).on('mouseenter','a.cursor-plus', );
    // $(document).on('mouseleave','a.cursor-plus', (ev) => );
  }
  getType(elem) {
    
    this.clearClass();


  }
  defaultType() {
    $(this.el).removeClassPrefix('cursor-');
    this.el.classList.add(this.defaultClass);
  }
  // clearClass() {
  //   this.cursors.forEach((item) => {
  //     item.classList.remove(this.ActiveClass);
  //   });
  // }
  handleMouseMove(e) {
    requestAnimationFrame(() => {
	  const mousepos = getMousePos(e);
	  this.updatePos(mousepos);
    }); 
  }
  updatePos(mousepos) {
	  this.tl.set(this.el, {
      x: mousepos.x,
      y: mousepos.y,
	  }); 
  }
}

const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;
  if (!e) {let e = window.event;};
  if (e.clientX || e.clientY) {
  	posx = e.clientX;
  	posy = e.clientY;
  }
  return {
    x : posx,
    y : posy
  };
};
$.fn.removeClassPrefix = function(prefix) {
  this.each( function( i, it ) {
    var classes = it.className.split(' ').map(function(item) {
      return item.indexOf(prefix) === 0 ? '' : item;
    });
    it.className = classes.join(' ');
  });

  return this;
};
