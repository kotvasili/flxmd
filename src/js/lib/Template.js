const breadCrumbsTemplate = breadcrumbs => breadcrumbs.map(breadcrumb => 
  `<li class="breadcumbs__item">
		<a class='no-barba' href="${breadcrumb.link}">
			<span>${breadcrumb.name}</span>
		</a>
	</li>`)
    ;
export const Template = (template) => {
  if(template.image) {
    return `<div id=${template.id} class="grid__item w__${template.width} load-parent crsor-trgr" data-cursor-type="plus">
			<div class="portfolio__item touch-down not-move" style='background-color: ${template.bgimage}'>
				<a href="${template.internal}" class="portfolio__item-img">
					<img class='js-image' data-src="${template.image}" >
				</a>
				<div class="portfolio__item-header">
					<div class="breadcrumbs link-color">
						<ul>
							${breadCrumbsTemplate(template.breadcrumbs)}
						</ul>
					</div>
					<div class="link-color h2">
						<span>${template.title}</span>
					</div>
				</div>
				<div class="portfolio__item-footer">
					<a href="${template.external}" class="portfolio-item__link link-color" target='_blank'>
						<svg width="23.5" height="23.5" viewBox="0 0 23.5 23.5" xmlns="http://www.w3.org/2000/svg"><g><path d="m21.78148,11.36297l0,8.3c0,1.5 -1.2,2.8 -2.8,2.8l-15.2,0c-1.5,0 -2.8,-1.2 -2.8,-2.8l0,-15.3c0,-1.5 1.2,-2.8 2.8,-2.8l8.3,0" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/><polyline points="16.481476068496704,0.9629654884338379 22.481476068496704,0.9629654884338379 22.481476068496704,6.962967872619629 " stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/><line y2="0.96297" x2="22.48148" y1="12.76297" x1="10.68148" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/></g></svg>
					</a>
				</div>
			</div>
		</div>`;
  }
  if(template.video) {
    return `<div id=${template.id} class="grid__item w__${template.width} load-parent crsor-trgr" data-cursor-type="plus">
			<div class="portfolio__item touch-down not-move" style="background-color: ${template.bgimage}">
				<a href="${template.internal}" class="portfolio__item-video">
						<video class='js-image vid' loop="" muted="" preload="" autoplay="" class="video" data-src="${template.video}" type="video/mp4"></video>
						<img class='js-image vidcover' data-src="${template.videoimage}" >
				</a>
				<div class="portfolio__item-header">
					<div class="breadcrumbs link-color">
						<ul>
							${breadCrumbsTemplate(template.breadcrumbs)}
						</ul>
					</div>
					<div class="link-color h2">
						<span>${template.title}</span>
					</div>
				</div>
				<div class="portfolio__item-footer">
					<a href="${template.external}" class="portfolio-item__link link-color" target='_blank'>
						<svg width="23.5" height="23.5" viewBox="0 0 23.5 23.5" xmlns="http://www.w3.org/2000/svg"><g><path d="m21.78148,11.36297l0,8.3c0,1.5 -1.2,2.8 -2.8,2.8l-15.2,0c-1.5,0 -2.8,-1.2 -2.8,-2.8l0,-15.3c0,-1.5 1.2,-2.8 2.8,-2.8l8.3,0" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/><polyline points="16.481476068496704,0.9629654884338379 22.481476068496704,0.9629654884338379 22.481476068496704,6.962967872619629 " stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/><line y2="0.96297" x2="22.48148" y1="12.76297" x1="10.68148" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/></g></svg>
					</a>
				</div>
			</div>
		</div>`;
  }
};
