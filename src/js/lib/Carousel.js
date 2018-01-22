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

      this.carouselSetting = {
      	loop: false,
      	pagination: '.swiper-pagination',
      	paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
      	paginationBulletRender: function() {
          return '<span class="swiper-pagination-bullet overlay__color"></span>';
        },
        onTransitionStart: function() {
          item.classList.add('animating');
        },
        onTransitionEnd: function() {
          item.classList.remove('animating');
        }
      };

      this.assign = Object.assign(this.carouselSetting, SwiperSettings);

      this.swiperCarousel = new Swiper('.image-rotator_' + index, this.assign);
    });
  }

}
