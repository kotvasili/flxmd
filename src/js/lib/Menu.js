import $ from 'jquery';
import './domConf.js';

export default function Menu() {
  var _this = this;
  var _activeColumns = 'is-hover';
  var _notHover = 'not-hover';

  _this.menuHandler = function() {
    _this.trigger.on('click', function() {
      if(_this.body.hasClass('menu-open')) {
        _this.closeMenu();
      } else {
        _this.openMenu();
      }
    });
    _this.overlay.add(_this.close).on('click', function() {
      _this.closeMenu();
    });
    _this.hoverItems.children().on('mouseenter', function() {
      _this.setActiveColumn(this.getAttribute('data-idx'), this);
    });

    _this.hoverItems.on('mouseleave', function() {
      _this.unsetActiveColumn();
    });

  };

  _this.openMenu = function() {
    _this.body.addClass('menu-open');
  };

  _this.closeMenu = function() {
    _this.body.removeClass('menu-open');
  };

  _this.setActiveColumn = function(idx, curr) {
    _this.hoverColumn.find('[data-hover= ' + idx + ']').addClass(_activeColumns).siblings().removeClass(_activeColumns);
    $(curr).removeClass(_notHover).siblings().addClass(_notHover);
  };

  _this.unsetActiveColumn = function() {
    _this.hoverColumn.children().removeClass(_activeColumns);
    _this.hoverItems.children().removeClass(_notHover);
  };

  _this.destroy = function() {
    _this.trigger.off('click');
    _this.overlay.add(_this.close).on('click');
    _this.hoverItems.children().on('mouseenter');
    _this.hoverItems.on('mouseleave',);
  };

  _this.init = function() {
    _this.trigger = $('.menu-trigger');
    _this.close = $('.menu-close');
    _this.overlay = $('.overlay');
    _this.menu = $('.menu');
    _this.body = window.DOM.body;
    _this.hoverColumn = $('.menu-hover__container');
    _this.hoverItems = $('.navigation-category');

    _this.menuHandler();
  };
};
