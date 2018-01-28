import VanillaTilt from 'vanilla-tilt';

export default class tiltCards {
  constructor() {
  	this.DeastroyArr=[];
    this.options ={
	    perspective: 1000,
	    scale: 0.93,
	    max: 10,
	    speed: 700,
	    transition: true,
	    axis: null,
	    glare: false,
	    easing: 'cubic-bezier(.03,.98,.52,.99)',
	    'max-glare': 0.8, 
    };
  }
  init() {
    this.elems = Array.from(document.querySelectorAll('.js-tilt'));
    this.elems.forEach((item) => {
      VanillaTilt.init(item,this.options);
      // item.classList.remove('js-tilt');
      this.DeastroyArr.push(item);
    });
  }
  destroy() {
    this.DeastroyArr.forEach((item) => {
      item.vanillaTilt.destroy();	
    });
  }
}
