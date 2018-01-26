import { TweenMax } from 'gsap';
import debounce from './debounce';

export default class SlipMouse {
  constructor() {
    this.handlerActivate = 'slip';
    this.initialize = '[slip-mouse]:not(.slip)';
    this.targetItem = '[slip-mouse-target]';
  }

  init() {
  	[].forEach.call(document.querySelectorAll(this.initialize), (_element) => {
      
  		if(_element.classList.contains(this.handlerActivate)) {
  			return false;
  		}
  		_element.classList.add(this.handlerActivate);
  		this.handlerEvents(_element);
  	});
  }

  handlerEvents(_element) {
  	_element.addEventListener('mouseenter', debounce(this.entryElement));
  	_element.addEventListener('mouseleave', debounce(this.exitElement));
  	_element.addEventListener('mousemove', debounce(this.moveElement));
  }

  moveElement(_move) {
  	let IdTarget = this.getAttribute('id');
    let pName = document.querySelector('[slip-mouse-target="' + IdTarget + '"]');
    let targetPosition = this.getBoundingClientRect().left;

    let targetW = this.offsetWidth;
    let pNameW = pName.offsetWidth;
    let parentW = document.querySelector('.frame___names-list').offsetWidth;

    TweenMax.to(document.querySelector('[slip-mouse-target="' + IdTarget + '"]'), 0.3, {
      x: -((pNameW - parentW) / targetW) * (_move.pageX - targetPosition)
    });
  }

  entryElement(_entry) {
  	let IdTarget = _entry.target.getAttribute('id');
    let pName = document.querySelector('[slip-mouse-target="' + IdTarget + '"]');
    let targetPosition = this.getBoundingClientRect().left;

    let targetW = this.offsetWidth;
    let pNameW = pName.offsetWidth;
    let parentW = document.querySelector('.frame___names-list').offsetWidth;

    TweenMax.set(document.querySelector('[slip-mouse-target="' + IdTarget + '"]'), {
      x: -((pNameW - parentW) / targetW) * (_entry.pageX - targetPosition)
    });

  	TweenMax.to(document.querySelector('[slip-mouse-target="' + IdTarget + '"]'), 1, {
  		autoAlpha: 1
  	});

  }

  exitElement(_exit) {
    let IdTarget = _exit.target.getAttribute('id');

  	TweenMax.to(document.querySelector('[slip-mouse-target="' + IdTarget + '"]'), 0.4, {
  		autoAlpha: 0
  	});
  }
}
