import { TweenLite } from 'gsap';
import $ from 'jquery';

export default class Tabs {
  constructor() {
    this.container = document.querySelector('.tabs-container');
    this.navItem = document.querySelectorAll('.tab__trigger');
    this.tabItem = document.querySelectorAll('.tab-container__item');
    this.slash = document.querySelector('.nav__line .line');
    this.flag = false;
    this.initialize();
  }
  
  initialize() {
    this.NavItem = Array.prototype.slice.call(this.navItem);
    this.TabItem = Array.prototype.slice.call(this.tabItem);
    this.NavItem[0].classList.add('is-active');
    this.TabItem[0].classList.add('is-active');
    this.handlerEvents();
  }
  
  handlerEvents() {
    Array.prototype.forEach.call(this.navItem, (_el) => {
      _el.addEventListener('click', this.eventClick.bind(this));
    });
  }
  
  eventClick(e) {
    if(!this.flag) {
      let node = e.target;
      this.setActiveClass(node.getAttribute('data-nav'));
      // this.flag = true;
    }
  }
  
  setActiveClass(_idx) {
    $(this.navItem).filter('[data-nav=' + _idx + ']').addClass('is-active').siblings().removeClass('is-active');
    $(this.tabItem).hide().removeClass('is-active').filter('[data-tab=' + _idx + ']').fadeIn().addClass('is-active');
    // $('[data-tab=' + _idx + ']').fadeIn({
    //   complete: () => {
    //     $('[data-tab=' + _idx + ']').addClass('is-active');
    //   }
    // })
    //   .siblings().fadeOut({
    //     complete: () => {
    //       $('[data-tab=' + _idx + ']').siblings().removeClass('is-active');
    //     }
    //   });
  }
  
  // getSizeElement() {
  //   this._w = document.querySelector('.nav-item.is-active').clientWidth;
  //   this._l = document.querySelector('.nav-item.is-active').offsetLeft;
  // }
  
  // setVisibleTab(_idx) {
  //   TweenLite.to(Array.prototype.filter.call(this.tabItem, (_el) => _el.dataset.tab !== _idx), 0.5, {
  //     autoAlpha: 0,
  //     display: 'none'
  //   });
  //   TweenLite.to(Array.prototype.find.call(this.tabItem, (_el) => _el.dataset.tab === _idx), 0.5, {
  //     delay: 0.5,
  //     autoAlpha: 1,
  //     display: 'block',
  //     onComplete: () => {
  //       this.flag = false;
  //     }
  //   });
  // }
  
};
