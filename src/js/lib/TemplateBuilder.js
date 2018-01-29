import { Template } from './Template.js';
import { TemplateNames } from './TemplateNames.js';
import colorize from './Colorize.js';
import LazyElement from './LazyImage.js';
import SlipMouse from './SlipMouse.js';
// import tiltCards from './tilt.js';
import VanillaTilt from './vanilla-tilt.js';
import './domConf';
import $ from 'jquery/dist/jquery.min';
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

    this.lazy = new LazyElement();
    this.slip = new SlipMouse();
    // this.tilt = new tiltCards();
    this.tiltOptions ={
      perspective: 1000,
      scale: 0.93,
      max: 10,
      speed: 700,
      transition: true,
      axis: null,
      glare: false,
      // easing: 'cubic-bezier(.03,.98,.52,.99)',
      // 'max-glare': 0.8, 
    };
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
        let tilts = this.gridContainerSelector.querySelector('.js-tilt');
        if (tilts) {
          inView('.js-tilt')
            .on('enter', (el) => {
              VanillaTilt.init(el,this.tiltOptions);

            }).on('exit', (el) => {
              if(el.vanillaTilt !== undefined ) {
                el.vanillaTilt.destroy();
                el.removeAttribute('style');
              } 
              
            });
          // tilts.classList.remove('js-tilt');
        }
        inView('.grid__item')
          .on('enter', (el) => {
            if(!el.done) {
              el.classList.add('is-visible');
            }

            // .then(_ => {
            // });
          }).on('exit', (el) => {
            el.done = true;
          });
      });
    });
    this.observer.observe(this.gridContainerSelector, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });

    // inView('.js-tilt').emit('enter', console.log(232));
    // inView('.grid__item').trigger('enter');
    // this.cursor = new Cursor();
  }

  init() {

  	if(this.isInit) {
  		return;
  	}

    const templates = this.templates.slice().splice(0, ITEMS_PER_ADD);

  	this.updateHTMLWithTemplates(templates);
    // this.cursor.init();
    
    this.isInit = true;
    window.DOM.html.add(window.DOM.body).animate({scrollTop: 1},100);
    // this.wow.init();
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
  	const templates = this.templates.slice().splice(prevLastItemPosition, ITEMS_PER_ADD);

  	this.updateHTMLWithTemplates(templates);
  }

  updateHTMLWithTemplates(templates) {
  	$(this.gridContainerSelector).append(templates.map(template => Template(template))).promise().done(() => {
      // this.tilt.init();
      this.lazy.init();
      // this.slip.init();
      this.containerHeight = this.wHeight();

    });
    $(this.projectNamesSelector).append(templates.map(template => TemplateNames(template)));
  	colorize();
    

    this.listCounter++;
    
    // console.log(this.listCounter);
    // if(this.isInit) {
    //   this.cursor.init();
    // }
        
  }
}
