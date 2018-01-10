import { TweenMax } from 'gsap';

export default class Cursor {
  constructor() {
    this._cursor = document.querySelector('.cursor');
    isInit: false;
  }

  init() {
  	[].forEach.call(document.querySelectorAll('[cursor-type]:not(._cursor)'), (cursor) => {
      if(!cursor.classList.contains('_cursor')) {
        cursor.classList.add('_cursor');
        this.eventHandler(cursor);
      }
    });
  }

  eventHandler(cursor) {
  	cursor.addEventListener('mouseenter', this.on.bind(this));
  	cursor.addEventListener('mouseleave', this.off.bind(this));
  	cursor.addEventListener('mousemove', this.move.bind(this));
  }

  move(_el) {
    this.setPosition(_el.clientX, _el.clientY);
  }

  on(_el) {
    this._cursor.classList.add('cursor--' + _el.target.getAttribute('cursor-type'));
  }

  off(_el) {
    this._cursor.classList.remove('cursor--' + _el.target.getAttribute('cursor-type'));
  }

  setPosition(_x, _y) {
  	TweenMax.set(this._cursor, {
  		x: _x,
  		y: _y
  	});
  }
}
