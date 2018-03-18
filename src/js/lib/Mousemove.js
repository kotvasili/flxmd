import debounce from './debounce';

let win = {width: window.innerWidth, height: window.innerHeight};
let center = {x: win.width/2, y: win.height/2};
export default class MousemoveEl {
  constructor(elems, dir) {
    this.maxtranslate= {
    	X: 50,
    	Y: 50
    };
    this.items = document.querySelectorAll(elems);
    if(this.items.length) {
      this.init();
    }
  }
  init() {
    this.TotalItems = [];
    Array.from(this.items).forEach((item) => this.TotalItems.push(new MoveItem(item)));
    this.initEvents();
  }
  initEvents() {
    this.mousemove = this.onmousemove.bind(this);
    this.resize = debounce(this.onresize);
    document.addEventListener('mousemove',this.mousemove , window.DOM.passiveSupported ? { passive: true } : false);
    window.addEventListener('resize',this.resize, window.DOM.passiveSupported ? { passive: true } : false);
  }
  onresize() {
    win = {width: window.innerWidth, height: window.innerHeight};
    center = {x: win.width/2, y: win.height/2};
  }
  onmousemove(ev) {
    requestAnimationFrame(() => {
      const mousepos = getMousePos(ev);
      const transX = 2*this.maxtranslate.X/win.width*mousepos.x - this.maxtranslate.X;
      const transY = 2*this.maxtranslate.Y/win.height*mousepos.y - this.maxtranslate.Y;
      this.TotalItems.forEach((item) => {
        item.setTransform({translateX: transX, translateY: transY});
      });
				
    });	
  }
  destroy() {
    this.TotalItems.filter(item => {
      item.destroy();
      // console.log(item);
    });
    document.removeEventListener('mousemove', this.mousemove, false);
    window.removeEventListener('resize',this.resize, false);

  }
};
class MoveItem {
  constructor(el) {
    this.item = el;
    const bcr = this.item.getBoundingClientRect();
    this.itemCenter = {
      x: bcr.left + bcr.width/2,
      y: bcr.top + bcr.height/2
    };
    this.initEvents(); 
  }
  initEvents() {
    this.onres = debounce(this.onresize.bind(this));
    window.addEventListener('resize', this.onres);
  }
  onresize(ev) {
    const bcr = this.item.getBoundingClientRect();
    this.itemCenter = {
      x: bcr.left + bcr.width/2,
      y: bcr.top + bcr.height/2
    };
  }
  setTransform(transform) {
    const dist = distance(this.itemCenter.x, this.itemCenter.y, center.x, center.y);
    const tx = transform.translateX/win.width*dist || 0;
    const ty = transform.translateY/win.height*dist || 0;
    this.item.style.transform = `translateX(${tx}px) translateY(${ty}px)`;
  }
  destroy() {
    window.removeEventListener('resize', this.onres);
  }
}

const getMousePos = (e) => {
  let posx = 0;
  let posy = 0;
  if (!e) {let e = window.event;};
  if (e.pageX || e.pageY) 	{
    posx = e.pageX;
    posy = e.pageY;
  }
  else if (e.clientX || e.clientY) 	{
    posx = e.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
  }
  return {
    x : posx,
    y : posy
  };
};

const distance = (x1,x2,y1,y2) => {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a*a + b*b);
};
