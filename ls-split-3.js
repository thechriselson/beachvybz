///////////////////////////
// LS => Listings System //
///////////////////////////

// Datepicker Setup
/*document.querySelectorAll("[data-ls-date]").forEach((e, i) => {
	let x = e.getAttribute("data-ls-date");
	if(!isNaN(x)) {x = Number(x)}
	else {x = i + 100}
	datepicker(e, {
		// options
		id: x,
		minDate: new Date(),
		customDays: ["S", "M", "T", "W", "T", "S", "S"],
		formatter: (input, date, instance) => {
			let v = date.toDateString().replace(/^\S+\s/, "");
			input.value = v
		}
	})
});*/

function lsActiveInactive(e, x) {
	let inac, ac, s1, s2, int;
	if(e.hasAttribute("data-ls-inactive")) {
		inac = e.getAttribute("data-ls-inactive").split("=")}
	if(e.hasAttribute("data-ls-active")) {
		ac = e.getAttribute("data-ls-active").split("=")}
	if(x === false) {s1 = ac; s2 = inac}
	else {s1 = inac; s2 = ac}
	if(s1 !== undefined) {
		if(s1.length >= 2) {
			if(s1[0] == "class") {e.classList.remove(s1[1])}
		}
	}
	if(s2 !== undefined) {
		if(s2.length >= 2) {
			if(s2[0] == "class") {e.classList.add(s2[1])}
			else if(s2[0] == "int") {int = s2[1]}
		}
	}
	if(int !== undefined && e.querySelector("[data-ls-int='" + int + "']")) {
		e.querySelector("[data-ls-int='" + int + "']").click()}
}

// lsUpdateURL

function lsUpdateCounters(lsId) {
	if(lsId === undefined) {return}
	lsRef.forEach(ls => {
		if(ls.id == lsId) {
			if(ls.hasOwnProperty("counters")) {
				let x = 0;
				if(ls.hasOwnProperty("listings")) {
					if(ls.hasOwnProperty("activeListings")) {x = ls.activeListings}
					else {x = ls.listings.length}
				}
				ls.counters.forEach(c => {c.textContent = x})
			}
		}
	})
}

function lsPagination(ev) {
	if(ev == undefined) {return}
	let x = ev.currentTarget, y, lsId;
	if(x.hasAttribute("data-ls-pg") && x.hasAttribute("data-ls-id")) {
		y = x.getAttribute("data-ls-pg");
		lsId = x.getAttribute("data-ls-id");
		lsRef.forEach(ls => {
			if(ls.id == lsId) {
				if(y == "previous") {
					if(ls.pg.page >= 2) {ls.pg.page--}
					else {ls.pg.page = 1}
				}
				else if(y == "next") {
					if(ls.pg.page <= ls.pg.pages - 1) {ls.pg.page++}
					else {ls.pg.page = ls.pg.pages}
				}
				else if(y == "number") {
					y = Number(x.getAttribute("data-ls-pg-num"));
					if(y <= 1) {ls.pg.page = 1}
					else if(y >= ls.pg.pages) {ls.pg.page = ls.pg.pages}
					else {ls.pg.page = y}
				}
				lsUpdateListings(lsId)
			}
		})
	}
}

function lsUpdatePg(lsId) {
	if(lsId === undefined) {return}
	lsRef.forEach(ls => {
		if(ls.id == lsId && ls.hasOwnProperty("pg")) {
			ls.pg.pages = Math.ceil(ls.activeListings / ls.pg.max);
			// numbers // prev // next
			if(ls.pg.hasOwnProperty("numbers")) {
				ls.pg.numbers.forEach((x, i) => {
					if(!Array.isArray(x)) {
						ls.pg.numbers[i] = [x];
						x = ls.pg.numbers[i]
					}
					for(let j = 0; j < ls.pg.pages; j++) {
						if(x[j] == undefined) {
							let y = x[0].cloneNode(true);
							x[0].parentNode.appendChild(y);
							ls.pg.numbers[i].push(y)
						}
						x = ls.pg.numbers[i];
						x[j].setAttribute("data-ls-pg-num", j + 1);
						update(x[j], (j + 1 == ls.pg.page));
						let y = x[j];
						if(y.querySelector("[data-ls-pg='numtext']")) {
							y.querySelector("[data-ls-pg='numtext']").textContent = j + 1}
						else {y.textContent = j = 1}
					}
					// cleanup
					for(let j = x.length - 1; j >= 1; j--) {
						if(j >= ls.pg.pages) {x[j].style.display = "none"}
						else {x[j].style.removeProperty("display")}
					}
				})
			}
			if(ls.pg.hasOwnProperty("prev")) {
				ls.pg.prev.forEach(e => {update(e, (ls.pg.page >= 2))})
			}
			if(ls.pg.hasOwnProperty("next")) {
				ls.pg.next.forEach(e => {update(e, (ls.pg.page <= ls.pg.pages - 1))})
			}
			function update(e, x) {
				e.setAttribute("data-ls-id", lsId);
				let y = false; if(x) {y = true}
				lsActiveInactive(e, y);
				e.addEventListener("click", lsPagination)
			}
		}
	})
}

function lsUpdateListings(lsId) {
	if(lsId === undefined) {return}
	lsRef.forEach(ls => {
		if(ls.id == lsId && ls.hasOwnProperty("listings")) {
			let x = 0, y;
			if(ls.hasOwnProperty("pg")) {
				y = [(ls.pg.max * (ls.pg.page - 1)) + 1, ls.pg.max * ls.pg.page]}
			ls.listings.forEach(e => {
				let z = false;
				if(!e.hasAttribute("data-ls-status")) {
					e.setAttribute("data-ls-status", "active")}
				if(e.getAttribute("data-ls-status") == "active") {
					x++;
					if(y != undefined) {
						if(x >= y[0] && x <= y[1]) {z = true}}
					else {z = true}
				}
				lsActiveInactive(e, z)
			});
			if(ls.hasOwnProperty("pg")) {lsUpdatePg(lsId)}
		}
	})
}

function lsDateCheck(lsId, e) {
	if(lsId === undefined || e === undefined) {return true}
	let ac = true;
	lsRef.forEach(ls => {
		if(ls.id == lsId && ls.hasOwnProperty("data") && e.querySelector("[data-ls-filter-name]")) {
			let a = e.querySelector("[data-ls-filter-name]").getAttribute("data-ls-filter-name"), b;
			if(ls.data.hasOwnProperty("properties")) {
				ls.data.properties.forEach(c => {if(c.name == a) {b = c.calendars; return}})}
			else {if(ls.data.name == a) {b = ls.data.calendars}}
			if(b !== undefined) {
				b.forEach(c => {
					if(c.hasOwnProperty("events")) {
						c.events.forEach(d => {
							let e = [new Date(d.start_time), new Date(d.end_time)];
							let x = [ls.activeFilters.start, ls.activeFilters.end];
							x.forEach(y => {
								if(y >= e[0] && y < e[1]) {ac = false; return}});
							if(!ac) {return}
						});
						if(!ac) {return}
					}
				})
			}
		}
	});
	return ac
}

function lsListingCheck(lsId) {
	if(lsId === undefined) {return}
	lsRef.forEach(ls => {
		if(ls.id == lsId && ls.hasOwnProperty("listings")) {
			ls.activeListings = 0;
			ls.listings.forEach(e => {
				let x = true, y;
				if(ls.hasOwnProperty("activeFilters") && e.hasAttribute("data-ls-filter")) {
					y = e.querySelector(e.getAttribute("data-ls-filter"));
					if(y !== null) {
						for(z in ls.activeFilters) {
							let a = ls.activeFilters[z];
							if(a instanceof Date) {
								if(z == "start" && ls.activeFilters.hasOwnProperty("end")) {
									x = lsDateCheck(lsId, e)}}
							else if(y.hasAttribute("data-ls-filter-" + z)) {
								let b = y.getAttribute("data-ls-filter-" + z);
								if(Array.isArray(a)) {
									if(a.length == 2) {
										if(!isNaN(a[0]) && !isNaN(a[1])) {
											if(b < a[0] || b > a[1]) {x = false}
										}
										else if(!isNaN(a[0])) {
											if(a[1] == "+") {
												if(b < a[0]) {x = false}
											}
											else if(a[1] == "-") {
												if(b > a[1]) {x = false}
											}
										}
									}
								}
								else {if(b != a) {x = false}}
							}
							if(!x) {break}
						}
					}
				}
				if(x) {x = "active"; ls.activeListings++}
				else {x = "inactive"}
				e.setAttribute("data-ls-status", x);
			})
		}
	})
}

function lsUpdateFilters(lsId) {
	if(lsId === undefined) {return}
	lsRef.forEach(ls => {
		if(ls.id == lsId && ls.hasOwnProperty("filters")) {
			ls.activeFilters = {}
			ls.filters.forEach(e => {
				if(e.value != "") {
					let x = e.value, y;
					if(e.hasAttribute("data-ls-type")) {
						y = e.getAttribute("data-ls-type")}
					// formatting
					if(y != undefined) {
						if(y == "number") {
							if(x.includes("+") || x.includes("-")) {
								let z = "-";
								if(x.includes("+")) {z = "+"}
								x = [Number(x.replace(z, "")), z]
							}
							else {x = Number(x)}
						}
						else if(y == "date") {x = new Date(x)}
						else if(y == "range") {
							x = x.split("-");
							x.forEach((z, i) => {x[i] = Number(z)})
						}
					}
					ls.activeFilters[e.getAttribute("data-ls-filter")] = x
				}
			})
		}
	});
	console.log("ACTIVEFILTERS UPDATED");
	console.log(lsRef)
}

function lsApplyFilters(lsId) {
	if(lsId === undefined) {return}
	lsRef.forEach(ls => {
		if(ls.id == lsId) {
			lsUpdateFilters(lsId);
			lsListingCheck(lsId);
			lsUpdateListings(lsId);
			lsUpdateCounters(lsId);
			lsUpdateURL()
		}
	})
}

function lsToArray(x) {
	let y = [];
	for(let i = 0; i < x.length; i++) {y.push(x[i])}
	return y
}

function lsGetApi(url, callback) {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.responseType = "json";
	xhr.onload = () => {
		let status = xhr.status;
		if(status === 200) {callback(null, xhr.response)}
		else {callback(status, xhr.response)}
	}
	xhr.send()
}

/*function lsUpdateURL() {
	let x = "?";
	lsRef.forEach(ls => {
		if(ls.hasOwnProperty("id") && ls.hasOwnProperty("activeFilters")) {
			let y = "";
			for(z in ls.activeFilters) {
				let a = ls.activeFilters[z], b;
				if(a instanceof Date) {
					let utc = [a.getFullYear(), a.getMonth(), a.getDate()];
					let c = new Date(Date.UTC(utc[0], utc[1], utc[2]));
					b = c.toISOString().split("T")[0]
				}
				else if(Array.isArray(a)) {
					b = "";
					a.forEach(c => {b += "_" + c});
					b = b.replace("_", "")
				}
				else {b = a}
				if(b !== undefined) {y += "&" + z + "=" + b}
			}
			if(y != "") {x += "id=" + ls.id + y}
		}
	});
	if(x == "?") {x = window.location.href.split("?")[0]}
	window.history.replaceState({}, "", x)
}

// Initial Setup
var lsRef = lsToArray(document.querySelectorAll("[data-ls='container']"));
lsRef.forEach((ls, lsId) => {
	ls.setAttribute("data-ls-id", lsId);
	lsRef[lsId] = {"cont": ls, "id": lsId, "activeListings": -1}
	ls = lsRef[lsId];
	// API request
	if(ls.cont.hasAttribute("data-ls-api")) {
		lsGetApi(ls.cont.getAttribute("data-ls-api"), (err, data) => {
			if(err !== null) {console.log("API GET Request error: " + err)}
			else {ls.data = data; lsApplyFilters(lsId)}
		})
	}
	// datepickers
	if(ls.cont.querySelector("[data-ls-date]")) {
		lsToArray(ls.cont.querySelectorAll("[data-ls-date]")).forEach((e, i) => {
			let x = e.getAttribute("data-ls-date");
			if(!isNaN(x)) {x = Number(x)}
			else {x = i + 100}
			if(!ls.hasOwnProperty("datepickers")) {ls.datepickers = []}
			ls.datepickers.push(datepicker(e, {
				id: x,
				minDate: new Date(),
				customDays: ["S", "M", "T", "W", "T", "S", "S"],
				formatter: (input, date, instance) => {
					let v = date.toDateString().replace(/^\S+\s/, "");
					input.value = v
				}
			}))
		})
	}
	// options // filters // listings // counters // updaters
	if(ls.cont.hasAttribute("data-ls-options")) {
		ls.cont.getAttribute("data-ls-options").split(",").forEach(o => {
			o = o.split("=");
			if(o.length >= 2) {
				o.forEach((x, i) => {if(!isNaN(x)) {o[i] = Number(x)}});
				if(o[0] == "pg") {
					ls.pg = {"max": o[1], "page": 1}
					let x = [
						{"a": "previous", "b": "prev"},
						{"a": "next", "b": "next"},
						{"a": "number", "b": "numbers"}
					];
					x.forEach(y => {
						let z = "[data-ls-pg='" + y.a + "']"
						if(ls.cont.querySelector(z)) {
							ls.pg[y.b] = lsToArray(ls.cont.querySelectorAll(z))}
					})
				}
				else {ls.pg[o[0]] = o[1]}
			}
			else {ls.pg[o[0]] = true}
		})
	}
	let x = [
		{"a": "filter", "b": "filters"},
		{"a": "listing", "b": "listings"},
		{"a": "counter", "b": "counters"},
		{"a": "update", "b": "updaters"}
	];
	x.forEach(y => {
		let z = "[data-ls='" + y.a + "']"
		if(ls.cont.querySelector(z)) {
			ls[y.b] = lsToArray(ls.cont.querySelectorAll(z))}
	});
	if(ls.hasOwnProperty("updaters")) {
		ls.updaters.forEach(e => {
			e.addEventListener("click", () => {lsApplyFilters(lsId)})})
	}
	// URL params
	if(window.location.href.includes("?") && ls.hasOwnProperty("filters")) {
		let y = window.location.href.split("?")[1].split("&"), id;
		y.forEach((z, i) => {
			z = z.split("=");
			if(z[0] == "id") {id = z[1]}
			else if(id == ls.id) {
				ls.filters.forEach(a => {
					if(a.getAttribute("data-ls-filter") == z[0]) {
						let b = a.getAttribute("data-ls-type");
						if(b == "date" && ls.hasOwnProperty("datepickers")) {
							ls.datepickers.forEach(dp => {
								if(a == dp.el) {
									let c = new Date(z[1]);
									dp.setDate(c, true);
									setTimeout(() => {
										a.value = c.toDateString().replace(/^\S+\s/, "")}, 0)
								}
							})
						}
						else if(b == "range") {a.value = z[1].replace("_", "-")}
						else {a.value = z[1]}
						a.value = z[1]
					}
				})
			}
		});
	}
	console.log(lsRef)
});*/
