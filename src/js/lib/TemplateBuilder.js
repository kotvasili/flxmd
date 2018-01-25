import { Template } from './Template.js';
import { TemplateNames } from './TemplateNames.js';
import colorize from './Colorize.js';
import LazyElement from './LazyImage.js';
import SlipMouse from './SlipMouse.js';
import $ from 'jquery';
import Cursor from './Cursor.js';

const ITEMS_PER_ADD = 9;
const HEIGHT_FOR_UPDATE = 200;

export default class TemplateBuilder {
  constructor(templates, gridContainerSelector, projectNamesSelector) {
    this.templates = templates;
    this.listCounter = 1;
    this.isInit = false;
    this.gridContainerSelector = gridContainerSelector;
    this.projectNamesSelector = projectNamesSelector;
    this.lazy = new LazyElement();
    this.slip = new SlipMouse();
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
    // this.wow.init();
  }

  wHeight() {
    return document.querySelector(this.gridContainerSelector).offsetHeight;
  }
  updateTemplatesIfNeed(status) {
  	if((this.containerHeight - status) - document.body.offsetHeight < HEIGHT_FOR_UPDATE) {
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
      this.lazy.init();
      this.slip.init();
      this.containerHeight = this.wHeight();
    });
    $(this.projectNamesSelector).append(templates.map(template => TemplateNames(template)));
  	colorize();
    this.listCounter++;
    console.log(this.listCounter);
    // if(this.isInit) {
    //   this.cursor.init();
    // }
        
  }
}
