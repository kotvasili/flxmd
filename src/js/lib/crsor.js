import $ from 'jquery';
import { Spring } from 'wobble';
import { TimelineMax } from 'gsap';
import debounce from './debounce';
import './domConf.js';

const INITIAL_X = 0;
const INITIAL_Y = 0;

export default class Crsor {
  constructor() {
	this.el = document.querySelectorAll('.crsor');
	this.springs = [];
	this.balls = new Array(2).fill([]).map(() => ({ x: INITIAL_X, y: INITIAL_Y }));
	this.initEvents(); 
	this.tl = new TimelineMax();
	
  }
  initEvents() {
	window.DOM.body.addClass('no-cursor');
	window.addEventListener('mousemove',(ev) => debounce(this.handleMouseMove(ev)));
	window.addEventListener('touchmove',(ev) => this.handleMouseMove(ev));
	this.createFollowerSprings();
	this.springs[0].x.start();
	this.springs[0].y.start();

  };
  handleMouseMove(e) {
	requestAnimationFrame(() => {
	  const mousepos = getMousePos(e);
	  this.updateMoves(mousepos);
	}); 
  }
  updateMoves(mousepos) {
	this.balls[0].x = mousepos.x;
	this.balls[0].y = mousepos.y;
   
	this.springs[0].x
	  .updateConfig({
		toValue: mousepos.x
	  })
	  .start();
	this.springs[0].y
	  .updateConfig({
		toValue: mousepos.y
	  })
	  .start(); 
  }
  createFollowerSprings() {
	let springConfig = {
	  stiffness: 120,
	  damping: 12,
	  mass: 2
	};
	let newConfigX = {
	  fromValue: 0,
	  toValue: INITIAL_X
	};
	let newConfigY = {
	  fromValue: 0,
	  toValue: INITIAL_Y
	};
	let assignSettingsX = Object.assign(springConfig, newConfigX);
	let assignSettingsY = Object.assign(springConfig, newConfigY);
	// Follower springs
	for (let i = 0; i < this.balls.length -1; i++) {
	  const x = new Spring(
		assignSettingsX
		).onUpdate(s => this.onSpringUpdate(i, 'x', s));
	  const y = new Spring(
		assignSettingsY
		).onUpdate(s => this.onSpringUpdate(i, 'y', s));
	  this.springs.push({ x, y });
	}
  }
  onSpringUpdate(i, dim, s) {
	const val = s.currentValue;
	this.balls[i + 1][dim] = val;
	if (i < this.balls.length -2) {
	  this.springs[i+1][dim]
		.updateConfig({
		  toValue: val
		})
		.start();
	}
	this.updatePos();
  }
  updatePos() {
	this.el.forEach((item,i) => {
	  let elem = $(item);
	  this.tl.set(elem, {
		x: this.balls[i].x,
		y: this.balls[i].y,
	  }); 
	});
	console.log(this.balls);
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
