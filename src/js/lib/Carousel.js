import $ from 'jquery/dist/jquery';
import Swiper from 'swiper';
import SwiperSettings from './SliderSettings';

export default class Carousel {
  constructor() {
    this.slider = '.swiper-container';
    this.instances= [];
  }

  init() {
    this.swiper = document.querySelectorAll(this.slider);
    this.carousel();
    
  }

  carousel() {
    const self = this;
    [].forEach.call(this.swiper, (item, index) => {
      item.classList.add('image-rotator_' + index);
      const $btnPrev = $(item).parent().find('.swiper-button-prev');
      const $btnNext = $(item).parent().find('.swiper-button-next');
      const $pagi = $(item).parent().find('.swiper-pagination');
      const interleaveOffset = 0.8;
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
          progress: function() {
            var swiper = this;
            for (var i = 0; i < swiper.slides.length; i++) {
              const img = swiper.slides[i].querySelector('.image-container');
              var slideProgress = swiper.slides[i].progress;
              var innerOffset = swiper.width * interleaveOffset;
              var innerTranslate = slideProgress * innerOffset;
              TweenMax
                .set(img,{
                  x: innerTranslate,
                });
            }
          },
          setTransition: function(speed) {
            var swiper = this;
            for (var i = 0; i < swiper.slides.length; i++) {
              swiper.slides[i].style.transition = speed + 'ms';
              swiper.slides[i].querySelector('.image-container').style.transition =
                speed + 'ms';
            }
          },
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
      
      this.instances.push(this.swiperCarousel);
      console.log(this.instances);
    });
  }
  destroy() {
    this.instances.filter(item => {
      item.destroy();
    });
  }

}
