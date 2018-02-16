import { Template } from './Template.js';
import { TemplateNames } from './TemplateNames.js';
import colorize from './Colorize.js';
// import LazyElement from './LazyImage.js';
import SlipMouse from './SlipMouse.js';
import { TweenMax } from 'gsap';
import './LazyImage';
// import tiltCards from './tilt.js';
// import VanillaTilt from './vanilla-tilt.js';
import './domConf';
import $ from 'jquery/dist/jquery';
// import Cursor from './Cursor.js';
import inView from 'in-view';

const ITEMS_PER_ADD = 9;
const HEIGHT_FOR_UPDATE = 600;

export default class TemplateBuilder {
  constructor(templates, gridContainerSelector, projectNamesSelector) {
    this.templates = templates;
    this.listCounter = 1;
    this.isInit = false;
    this.gridContainerSelector = document.querySelector(gridContainerSelector);
    this.projectNamesSelector = document.querySelector(projectNamesSelector);
    this.filterLinks = document.querySelectorAll('.filter-item a');
    // this.lazy = new LazyElement();
    this.mainMenuItems = document.querySelectorAll('.navigation-category__item.order_3 a');
    this.slip = new SlipMouse();
    this.filteredTemplate =[];
    this.preventClick = false;
    inView.offset({
      top: 10,
      bottom: 10,
    });
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (!mutation.addedNodes) {
          return;
        }
        // хуевое решение, но лучше чем было
        //TODO придумать как сократить квериселекты
        if (this.gridContainerSelector.querySelector('video')) {
          inView('video')
            .on('enter', (el) => {
              el.play();
              // .then(_ => {
              // });
            }).on('exit', (el) => {
              el.play().then(_ => {
                el.pause();
              });
            });
        }

        // inView('.grid__item')
        //   .on('enter', (el) => {
        //     if(!el.done) {
        //       el.classList.add('is-visible');
        //     }

        //     // .then(_ => {
        //     // });
        //   }).on('exit', (el) => {
        //     el.done = true;
        //   });
      });
    });
    this.observer.observe(this.gridContainerSelector, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
  }

  init() {

  	if(this.isInit) {
  		return;
  	}
    this.filtertext = window.location.hash.split('#')[1];
    if(this.filtertext !== undefined) {
      this.generateTamplates();
      if(this.filteredTemplate.length > 0) {
        this.updateActiveFilter($(this.filterLinks).filter(`[data-filter="${this.filtertext}"]`)[0]);
      }
    }else{
      this.filteredTemplate = this.templates;
    }
    const templates = this.filteredTemplate.slice().splice(0, ITEMS_PER_ADD);
  	this.updateHTMLWithTemplates(templates);
    // this.cursor.init();
    
    this.isInit = true;
    this.initFilter();
    // this.wow.init();
  }
  // methods for sort json
  isType(items,filterType) {
    let result =[];
    items.forEach(item => {
      let cur = item.breadcrumbs;
      cur.forEach(elem => {
        let name = elem.name.replace(/\s+/g, '').replace(/[^a-zA-Z - 0-9 ]+/g,'');
        if(name.toLowerCase() === filterType) {
          result.push(item);
        }
      });
    });
    return result;
  }
  sortTemplate(result) {
    result.sort((a,b) => {
      if (a.width < b.width) {
        return 1;
      }
      if (a.width > b.width) {
        return -1;
      }
      return a.width - b.width;

    });
    return result;
  }
  // end methods for sort json
  // init click for sort json
  initFilter() {
    let self = this;
    //вынести дерьмо внутри в отдельный метод
    this.mainMenuItems.forEach(item => {
      let filterType = item.textContent.toString().toLowerCase();
      filterType = filterType.replace(/\s+/g, '').replace(/[^a-zA-Z - 0-9 ]+/g,'');
      item.addEventListener('click',(e) => {
        if (this.preventClick) return false;
        this.preventClick = true;
        this.listCounter= 1;
        this.filtertext = filterType;
        $(this.gridContainerSelector).trigger('prevpos_update');
        this.filterTemplate(item);
        window.DOM.body.removeClass('menu-open');
        window.location.hash = filterType;
        e.preventDefault();
        e.stopPropagation();
        // alert();
      });
    });
    this.filterLinks.forEach(item => {
      let filterType = item.dataset.filter.toString().toLowerCase();
      filterType = filterType.replace(/\s+/g, '').replace(/[^a-zA-Z - 0-9 ]+/g,'');
      item.addEventListener('click',(e) => {
        // this.updateActiveFilter(item);
        if (this.preventClick) return false;
        this.preventClick = true;
        this.listCounter= 1;
        this.filtertext = filterType;
        $(this.gridContainerSelector).trigger('prevpos_update');
        this.filterTemplate(item);
        window.location.hash = filterType;
        e.preventDefault();
        e.stopPropagation();
        // alert();
      });
    });

    $(this.gridContainerSelector).on('click','.breadcumbs__item a',function() {
      let _ = $(this);
      
      let text = _.text().toString().toLowerCase();
      text = text.replace(/\s+/g, '').replace(/[^a-zA-Z - 0-9 ]+/g,'');

      $(self.filterLinks).each(function() {
        let _ = $(this);
        if (_.data('filter').toString() === text && !_.parent().hasClass('is-active')) {
          var event = new Event('click');
          _[0].dispatchEvent(event);
        }
      });
    });
  }
  filterTemplate(item) {

    if(item.parentNode.classList.contains('is-active')) return false;
    this.updateActiveFilter(item);
    this.generateTamplates();
    this.appendNewItems();;
    
  }
  generateTamplates() {
    if(this.filtertext === 'all') {
      this.filteredTemplate = this.templates;
    }else{
      this.filteredTemplate = this.isType(this.templates, this.filtertext);
      this.filteredTemplate = this.sortTemplate(this.filteredTemplate);
    }
    // alert(this.filteredTemplate.length);
  }
  updateActiveFilter(item) {
    let self = this;
    this.filterLinks.forEach(item => {item.parentNode.classList.remove('is-active');});
    item.parentNode.classList.add('is-active');
    $(this.mainMenuItems).removeClass('marker').each(function() {
      let _ = $(this);
      let text = _.text().toString().toLowerCase();
      text = text.replace(/\s+/g, '').replace(/[^a-zA-Z - 0-9 ]+/g,'');
      if(text === self.filtertext) {
        _.addClass('marker');
      }
    });
    if(item.classList.contains('catagory__link')) {
      this.filterLinks.forEach(elem => {
        let itemText = elem.dataset.filter;
        console.log(itemText,self.filtertext);
        if(itemText === self.filtertext) {
          elem.parentNode.classList.add('is-active');
        }
      });
    }
  }
  appendNewItems() {
    let scroll = $(window).scrollTop();
    let crollwindow;
    if(window.DOM.html.hasClass('firefox') || window.DOM.html.hasClass('chrome')) {
      crollwindow = window.DOM.html;
    }else if(window.DOM.html.hasClass('safari')) {
      crollwindow = $('.frame__side:last-child');
      scroll = $('.frame__side:last-child').scrollTop();
    }else{
      crollwindow = window.DOM.body;
    }
    // crollwindow[0].scrollIntoView({block: 'start', behavior: 'smooth'});
    crollwindow.animate({scrollTop: 0},scroll > 40 ? 350: 100,() => {
      TweenMax.to(this.gridContainerSelector,0.6,{
        y: 100,
        autoAlpha: 0,
        force3D: true,
        onComplete:() => {

          // $(this.gridContainerSelector).addClass('all-100');
          $(this.gridContainerSelector).empty();
          this.updateTemplates();
          this.preventClick = false;
          TweenMax.set(this.gridContainerSelector,{
            y: 0
          });
          TweenMax.to(this.gridContainerSelector,0.25,{
            delay: 0.15,
            autoAlpha: 1,
            clearProps: 'All',
            onComplete:() => {

            }
          });
        }
      }); 
    });
  }
  wHeight() {
    return this.gridContainerSelector.offsetHeight;
  }
  updateTemplatesIfNeed(status) {
  	if((this.containerHeight - status) - window.DOM.body[0].offsetHeight < HEIGHT_FOR_UPDATE) {
  		this.updateTemplates();
    }
  }
  updateTemplates() {
    
  	const prevLastItemPosition = (this.listCounter - 1) * ITEMS_PER_ADD;
  	const templates = this.filteredTemplate.slice().splice(prevLastItemPosition, ITEMS_PER_ADD);
  	this.updateHTMLWithTemplates(templates);
  }

  updateHTMLWithTemplates(templates) {

  	$(this.gridContainerSelector).append(templates.map(template => Template(template))).promise().done(() => {
      
      // this.slip.init();
      this.containerHeight = this.wHeight();
      // this.lazy.init();
    });
    $(this.projectNamesSelector).append(templates.map(template => TemplateNames(template)));
  	colorize();
    window.DOM.LazyImage();
   
    this.listCounter++;
    
    // console.log(this.listCounter);
    // if(this.isInit) {
    //   this.cursor.init();
    // }
        
  }
}
