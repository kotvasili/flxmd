import $ from 'jquery';
import { Spring } from 'wobble';

const INITIAL_X = 250;
const INITIAL_Y = 300;

export default class Crsor {
  constructor() {
    this.el = document.querySelector('.crsor');
    this.springs = [];
    this.balls = new Array(7).fill([]).map(() => ({ x: INITIAL_X, y: INITIAL_Y }));
    console.log(this.balls);
    this.initEvents(); 
  }
  initEvents() {
  	const self =this;
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchmove', this.handleTouchMove);
  };
  handleMouseMove(e) {

    var x = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft 
      , y = e.pageY || e.clientY + document.body.scrollTop+ document.documentElement.scrollTop;
    	console.log(x,y);
	    // n.springs[0].x.updateConfig({
	    //     toValue: t
	    // }).start(),
	    // n.springs[0].y.updateConfig({
	    //     toValue: r
	    // }).start()
  }
  handleTouchMove(e) {
  	// console.log(e.touches[0]);
  	this.handleMouseMove(e.touches[0]);
  }
  createFollowerSprings() {
    let springConfig = {
      stiffness: 120,
      damping: 14,
      mass: 1
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
    for (let i = 0; i < this.balls.length - 1; i++) {
      const x = new Spring(
      	assignSettingsX
      	).onUpdate(s => this.onSpringUpdate(i, 'x', s));
      const y = new Spring(
      	assignSettingsY
      	).onUpdate(s => this.onSpringUpdate(i, 'y', s));
      this.springs.push({ x, y });
    }
  }
}
