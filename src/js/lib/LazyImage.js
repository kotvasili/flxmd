import $ from 'jquery';

export default class LazyElement {
  init() {
    this.imageSrc = document.querySelectorAll('img[data-src]');
    this.videoSrc = document.querySelectorAll('video[data-src]');

    if(this.imageSrc.length) {
    	this.lazyImage(this.imageSrc);
    }

    if(this.videoSrc.length) {
      this.videoSource = document.createElement('source');
    	this.lazyVideo(this.videoSrc);
    }
    
  }

  lazyImage(_images) {
  	[].forEach.call(_images, (img) => {
      img.setAttribute('src', img.getAttribute('data-src'));
      img.onload = () => {
        img.removeAttribute('data-src');
        $(img).parents('.unload__item').removeClass('unload__item');
      };
    });
  }

  lazyVideo(_video) {
    [].forEach.call(_video, (video) => {
      this.videoSource.setAttribute('src', video.getAttribute('data-src'));
      video.appendChild(this.videoSource);
      video.onloadeddata = () => {
        video.removeAttribute('data-src');
        $(video).parents('.unload__item').removeClass('unload__item');
      };
    });
  }
}
