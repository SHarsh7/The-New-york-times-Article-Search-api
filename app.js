import key from "./apikey.js";
let url;
let pagenum = 0;
let d = new Date();
let year = d.getFullYear();

let month = d.getMonth();
month < 10 ? (month = `0${month}`) : (month = `${month}`);

let day = d.getDate();
day < 10 ? (day = `0${day}`) : (day = `${day}`);

let today = year + month + day;

let fetchData = async (query) => {
	if (query === undefined) {
		url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${today}&fq=glocations.contains%3A(%22India%22%2C%22Asia%22)&page=${pagenum}&api-key=${key}`;
	} else {
		url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?end_date=${today}&page=${pagenum}&fq=%20glocations%3A(%22India%22)&q=${query}&api-key=${key}`;
	}

	await fetch(url)
		.then((resolve) => {
			return resolve.json();
		})
		.then((data) => {
			if (data.status == "OK") {
				let article = data.response.docs;
				displayArticle(article);
			}
		})
		.catch((err) => {
			console.log(err, "Error can't fetch");
		});
};
window.onload = async () => {
	await fetchData(); //Default call

	let upbtn = document.getElementById("upbtn");

	let nxtbtn = document.createElement("button");
	nxtbtn.classList.add("btn");
	nxtbtn.classList.add("btn-dark");
	nxtbtn.classList.add("fas");
	nxtbtn.classList.add("fa-arrow-right");
	nxtbtn.id = "next";

	let prevbtn = document.createElement("button");
	prevbtn.classList.add("btn");
	prevbtn.classList.add("btn-dark");
	prevbtn.classList.add("fas");
	prevbtn.classList.add("fa-arrow-left");
	prevbtn.id = "prev";

	upbtn.appendChild(prevbtn);
	upbtn.appendChild(nxtbtn);

	let nextButton = document.getElementById("next");
	nextButton.addEventListener("click", () => {
		pagenum++;
		fetchData();
	});

	let prevButton = document.getElementById("prev");
	prevButton.addEventListener("click", () => {
		if (pagenum > 0) {
			pagenum--;
			fetchData();
		} else {
			fetchData();
		}
	});
};

let search = document.getElementById("searchButton");
search.addEventListener("click", (e) => {
	e.preventDefault();
	let queryText = document.getElementById("queryText").value;
	let query = queryText;
	fetchData(query);
});

let displayArticle = (article) => {
	let main = document.getElementById("main");
	main.innerText = "";
	let length = Object.keys(article).length;
	if (length == 0) {
		alert("Sorry We are not able find anything!");
		document.getElementById("queryText").value = "";
		document.getElementById("queryText").focus();
	} else {
		article.forEach((ele) => {
			let source;
			if (ele.multimedia[0].hasOwnProperty("url")) {
				source = ele.multimedia[0].url;
			} else {
				source = ele.multimedia[0].uri;
			}
			let div = document.createElement("div");
			div.classList.add("container-sm");
			div.classList.add("text-center");
			div.classList.add("newsContainer");

			let article = document.createElement("article");

			let img = document.createElement("img");
			img.classList.add("img-fluid");
			img.src = `http://www.nytimes.com/${source}`;

			let headline = document.createElement("p");
			headline.classList.add("lead");
			headline.textContent = ele.headline.main;

			let para1 = document.createElement("p");
			para1.classList.add("leadPara");
			para1.textContent = ele.lead_paragraph;

			let author = document.createElement("p");
			author.classList.add("blockquote");
			author.classList.add("text-center");
			author.title = `Source Title`;
			author.textContent = `Source :${ele.source}`;

			let link = document.createElement("a");
			link.classList.add("btn");
			link.classList.add("btn-dark");
			link.textContent = "Know more";
			link.href = ele.web_url;

			article.appendChild(img);
			article.appendChild(headline);
			article.appendChild(para1);
			article.appendChild(author);
			article.appendChild(link);
			article.classList.add("artical-content");

			div.appendChild(article);
			main.appendChild(div);
		});
	}
};

let Scrolltop = document.querySelector(".Scrolltop");
window.addEventListener("scroll", () => {
	const scrollHeight = window.pageYOffset;
	if (scrollHeight > 900) {
		Scrolltop.classList.add("show-Scrolltop");
	} else {
		Scrolltop.classList.remove("show-Scrolltop");
	}
});
