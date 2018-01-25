const breadCrumbsTemplate = breadcrumbs => breadcrumbs.map(breadcrumb => 
  `<li class="breadcumbs__item">
		<a href="${breadcrumb.link}">
			<span>${breadcrumb.name}</span>
		</a>
	</li>`)
    ;
export const Template = (template) => {
  if(template.image) {
    return `<div id=${template.id} class="grid__item unload__item w__${template.width} wow fadeInUp crsor-trgr" slip-mouse="${template.id}" data-cursor-type="plus" data-wow-duration=".8s">
			<div class="portfolio__item-bg" style="background-color: ${template.bgimage}"></div>
			<div class="portfolio__item ">
				<div class="portfolio__item-inner" data-tilt data-tilt-glare data-tilt-max-glare="0.8" data-tilt-scale="0.9">
					<a href="portfolio-project.html" class="portfolio__item-img" data-namespace="portfolio-project" data-scale="false">
						<img data-src="${template.image}" >
					</a>
					<div class="portfolio__item-header">
						<div class="breadcrumbs">
							<ul>
								${breadCrumbsTemplate(template.breadcrumbs)}
							</ul>
						</div>
						<a href="portfolio-project.html" class="link-color h2" data-namespace="portfolio-project" data-scale="false">
							<span>${template.title}</span>
						</a>
					</div>
					<div class="portfolio__item-footer">
						<a href="tut.by" class="portfolio-item__link" target='_blank'>
							<svg width="23.5" height="23.5" viewBox="0 0 23.5 23.5" xmlns="http://www.w3.org/2000/svg"><g><path d="m21.78148,11.36297l0,8.3c0,1.5 -1.2,2.8 -2.8,2.8l-15.2,0c-1.5,0 -2.8,-1.2 -2.8,-2.8l0,-15.3c0,-1.5 1.2,-2.8 2.8,-2.8l8.3,0" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/><polyline points="16.481476068496704,0.9629654884338379 22.481476068496704,0.9629654884338379 22.481476068496704,6.962967872619629 " stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/><line y2="0.96297" x2="22.48148" y1="12.76297" x1="10.68148" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/></g></svg>
						</a>
					</div>
					<div class="cross"></div>
				</div>
			</div>
		</div>`;
  }
  if(template.video) {
    return `<div id=${template.id} class="grid__item unload__item w__${template.width} wow fadeInUp crsor-trgr" slip-mouse="${template.id}" data-cursor-type="plus" data-wow-duration=".8s">
			<div class="portfolio__item-bg" style="background-color: ${template.bgimage}"></div>
			<div class="portfolio__item">
				<div class="portfolio__item-inner" data-tilt data-tilt-glare data-tilt-max-glare="0.8" data-tilt-scale="0.9">
					<a href="portfolio-project.html" class="portfolio__item-video" data-namespace="portfolio-project" data-scale="false">
						<video loop="" muted="" preload="" autoplay="" class="video" data-src="${template.video}" type="video/mp4"></video>
					</a>
					<div class="portfolio__item-header">
						<div class="breadcrumbs">
							<ul>
								${breadCrumbsTemplate(template.breadcrumbs)}
							</ul>
						</div>
						<a href="portfolio-project.html" class="link-color h2" data-namespace="portfolio-project" data-scale="false">
							<span>${template.title}</span>
						</a>
					</div>
					<div class="portfolio__item-footer">
						<a href="tut.by" class="portfolio-item__link" target='_blank'>
							<svg width="23.5" height="23.5" viewBox="0 0 23.5 23.5" xmlns="http://www.w3.org/2000/svg"><g><path d="m21.78148,11.36297l0,8.3c0,1.5 -1.2,2.8 -2.8,2.8l-15.2,0c-1.5,0 -2.8,-1.2 -2.8,-2.8l0,-15.3c0,-1.5 1.2,-2.8 2.8,-2.8l8.3,0" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/><polyline points="16.481476068496704,0.9629654884338379 22.481476068496704,0.9629654884338379 22.481476068496704,6.962967872619629 " stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/><line y2="0.96297" x2="22.48148" y1="12.76297" x1="10.68148" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" fill="none"/></g></svg>
						</a>
					</div>
					<div class="cross"></div>
				</div>
			</div>
		</div>`;
  }
};
