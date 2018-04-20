import $ from 'jquery';

export default class Tabs {
  constructor() {
    this.container = document.querySelector('.tabs-container');
    this.navItem = document.querySelectorAll('.tab__trigger');
    this.tabItem = document.querySelectorAll('.tab-container__item');
    this.attrs = ['order','brief','job'];
    this.flag = false;
    Array.prototype.forEach.call(this.navItem, (_el,index) => {
      _el.dataset.id = this.attrs[index];
    });
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
      let id = node.dataset.id || node.parentNode.dataset.id;
      let attr = node.getAttribute('data-nav') || node.parentNode.getAttribute('data-nav');
      window.location.hash = id;
      this.setActiveClass(attr);
      // this.flag = true;
    }
  }
  setActiveClass(_idx) {
    $(this.navItem).filter('[data-nav=' + _idx + ']').addClass('is-active').siblings().removeClass('is-active');
    $(this.tabItem).hide().removeClass('is-active').filter('[data-tab=' + _idx + ']').fadeIn().addClass('is-active');

  }
};
