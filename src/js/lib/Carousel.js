import Swiper from 'swiper';
import SwiperSettings from './SliderSettings';

export default class Carousel {
  constructor() {
    this.slider = '.swiper-container';
  }

  init() {
    this.swiper = document.querySelectorAll(this.slider);
    this.carousel();
  }

  carousel() {
    [].forEach.call(this.swiper, (item, index) => {
      item.classList.add('image-rotator_' + index);
      const $btnPrev = $(item).parent().find('.swiper-button-prev');
      const $btnNext = $(item).parent().find('.swiper-button-next');
      const $pagi = $(item).parent().find('.swiper-pagination');
      this.carouselSetting = {
      	loop: false,
        navigation:{
          nextEl: $btnNext,
          prevEl: $btnPrev, 
          
        },
        pagination:{
          clickable: true,
          el: $pagi,
          bulletActiveClass: 'swiper-pagination-bullet-active',
          renderBullet: function(index) {
            return '<span class="swiper-pagination-bullet overlay__color"></span>';
          }
        },
        on:{

          transitionStart: function() {
            item.classList.add('animating');
          },
          transitionEnd: function() {
            item.classList.remove('animating');
          }  
        }

      };

      this.assign = Object.assign(this.carouselSetting, SwiperSettings);

      this.swiperCarousel = new Swiper('.image-rotator_' + index, this.assign);
    });
  }

}
