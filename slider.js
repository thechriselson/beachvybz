// Sliders

function slideSlider(slider, x) {
	var curSlide = Number(slider.dataset.sliderCurrent);
	// new slide
	if(typeof x == "string") {
		if(x == "+") {curSlide++}
		else if(x == "-") {curSlide--}
	}
	else if(typeof x == "number") {curSlide = x}
	// if valid, move slider to new slide
	if(curSlide >= 0 && curSlide < slider.querySelectorAll("[data-slider='slide']").length) {
		slider.querySelector("[data-slider='slides']").style.transform = "translateX(" + (curSlide * -100) + "%)";
		slider.querySelectorAll("[data-slider='thumbnail']").forEach((thumbnail, i) => {
			if(i == curSlide) {thumbnail.querySelector("[data-slider-thumbnail='overlay']").classList.add("active")}
			else {thumbnail.querySelector("[data-slider-thumbnail='overlay']").classList.remove("active")}
		});
		slider.dataset.sliderCurrent = "" + curSlide + ""
	}
}

function setupSlider(slider) {
	// slides
	slider.querySelectorAll("[data-slider='thumbnail").forEach((thumbnail, i) => {
		if(i == Number(slider.dataset.sliderCurrent)) {
			thumbnail.querySelector("[data-slider-thumbnail='overlay']").classList.add("active")
		}
		thumbnail.addEventListener("click", () => {slideSlider(slider, i)})
	});
	// prev & next
	slider.querySelectorAll("[data-slider-nav]").forEach((nav) => {
		nav.addEventListener("click", () => {
			if(nav.dataset.sliderNav == "prev") {slideSlider(slider, "-")}
			if(nav.dataset.sliderNav == "next") {slideSlider(slider, "+")}
		})
	})
}

document.querySelectorAll("[data-slider='slider']").forEach((slider) => {setupSlider(slider)});