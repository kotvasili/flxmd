
// export default class LazyElement {
//   init() {
//     this.imageSrc = document.querySelectorAll('img[data-src]');
//     this.videoSrc = document.querySelectorAll('video[data-src]');
//     this.videoSource = document.createElement('source');
//     if(this.videoSrc.length) {
      
//       this.lazyVideo(this.videoSrc);
//     }
//     if(this.imageSrc.length) {
//     	this.lazyImage(this.imageSrc);
//     }


    
//   }

//   lazyImage(_images) {
//   	[].forEach.call(_images, (img) => {
//       img.setAttribute('src', img.getAttribute('data-src'));
//       img.onload = () => {
//         img.removeAttribute('data-src');
//         // img.closest('.load-parent').classList.add('is-visible');
//       };
//     });
//   }

//   lazyVideo(_video) {
//     [].forEach.call(_video, (video) => {
//       let newSourse = this.videoSource.cloneNode();
//       newSourse.setAttribute('src', video.getAttribute('data-src'));
//       video.appendChild(newSourse);
//       video.onloadeddata = () => {
//         video.removeAttribute('data-src');
//         // video.closest('.load-parent').classList.add('is-visible');
//       };
      
//     });
//   }
// }
import 'intersection-observer';
export default window.DOM.LazyImage = () => {
  // Get all of the images that are marked up to lazy load
  let arr = document.querySelectorAll('.js-image');
  const videoSource = document.createElement('source');
  const video = document.createElement('video');
  let images = [];
  for(var i = 0; i < arr.length; i++) {
    images.push(arr[i]);
  }

  var config = {
    rootMargin: '10px 0px',
    threshold: 0.01
  };

  var imageCount = images.length;
  var observer = void 0;
  // If we don't have support for intersection observer, loads the images immediately
  // if (!('IntersectionObserver' in window) || window.navigator.userAgent.indexOf('Edge') > -1) {
  //   for(var i = 0; i < imageCount; i++) {
  //     preloadImage(images[i]);
  //   }
  // } else {
  // It is supported, load the images
  observer = new IntersectionObserver(onIntersection, config);

  for(var i = 0; i< imageCount; i++) {

    if (images[i].classList.contains('js-image-handled')) {
      // return;
    }
    else{

      observer.observe(images[i]);
    }
  }
  // }

  /**
   * Fetchs the image for the given URL
   * @param {string} url 
   */
  function fetchImage(url) {

    return new Promise((resolve, reject) => {
      var image = new Image();
      image.src = url;
      image.onload = resolve;
      image.onerror = reject;
    });
  }
  /**
   * Fetchs the video if needs for the given URL
   * @param {string} url 
   */
  function fetchVideo(image,url) {

    return new Promise((resolve, reject) => {
      let newSourse = videoSource.cloneNode();
      newSourse.setAttribute('src', url);
      image.appendChild(newSourse);
      image.onloadeddata = resolve;
      image.onerror = reject;
      // newSourse.addEventListener('error', reject);

    });
  }
  /**
   * Preloads the image
   * @param {object} image 
   */
  function preloadImage(image) {
    
    var src = image.dataset.src;

    if (!src) {

      return;
    }
    if(image.classList.contains('vid')) {
      return fetchVideo(image,src).then(() => {
        // alert();
        applyImage(image, src);
      });
    }else{
      return fetchImage(src).then(function() {

        applyImage(image, src);
      });
    }

  }

  /**
   * Load all of the images immediately
   * @param {array} images 
   */
  function loadImagesImmediately(images) {
    for(var i = 0; i< images.length; i++) {
      return preloadImage(images[i]);
    }
    // Array.from(images).forEach(function (image) {
    //  return preloadImage(image);
    // });
  }

  /**
   * Disconnect the observer
   */
  function disconnect() {
    if (!observer) {
      return;
    }

    observer.disconnect();
  }

  /**
   * On intersection
   * @param {array} entries 
   */
  function onIntersection(entries) {
    // Disconnect if we've already loaded all of the images
    if (imageCount === 0) {
      observer.disconnect();
    }

    // Loop through the entries

    entries.forEach(function(entry) {
      // Are we in viewport?
      if (entry.intersectionRatio > 0) {
        imageCount--;
        // Stop watching and load the image
        observer.unobserve(entry.target);
        preloadImage(entry.target);
      }
    });
  }

  /**
   * Apply the image
   * @param {object} img 
   * @param {string} src 
   */
  function applyImage(img, src) {
    // Prevent this from being lazy loaded a second time.
    img.classList.add('js-image-handled');
    let parent = img.closest('.load-parent');
    if(img.classList.contains('bg')) {
      img.style.backgroundImage = 'url('+src+')';

    }else if(img.classList.contains('vid')) {
      img.classList.add('vidloaded');
    }else{
      img.src = src;

    }
    // img.classList.add('fade-in');
    setTimeout(() => {
      parent.closest('.load-parent').classList.add('is-visible');
    },20);
    
  } 
};
