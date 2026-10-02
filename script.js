const titles = [
  { id: 1, title: "The Red Sleeve", type: "show", era: "joseon", genres: ["romance", "political"], services: ["Hulu", "Viki"] },
  { id: 2, title: "Mr. Sunshine", type: "show", era: "joseon", genres: ["political", "romance"], services: ["Netflix", "Viki"] },
  { id: 3, title: "Kingdom", type: "show", era: "joseon", genres: ["action"], services: ["Netflix", "Disney+"] },
  { id: 4, title: "The Admiral: Roaring Currents", type: "movie", era: "joseon", genres: ["action"], services: ["Hulu", "Kocowa"] },
  { id: 5, title: "Moon Embracing the Sun", type: "show", era: "joseon", genres: ["romance", "comedy"], services: ["Hulu", "Viki"] },
  { id: 6, title: "Jumong", type: "show", era: "three-kingdoms", genres: ["action", "political"], services: ["Disney+", "Kocowa"] },
  { id: 7, title: "Empress Ki", type: "show", era: "goryeo", genres: ["revenge", "romance"], services: ["Netflix", "Kocowa"] },
];

const posterStyles = ["poster-jade", "poster-rose", "poster-ochre", "poster-blue", "poster-plum", "poster-copper"];
const eraNames = {
  "three-kingdoms": "Three Kingdoms",
  goryeo: "Goryeo",
  joseon: "Joseon",
};

const titleGrid = document.querySelector("#titleGrid");
const titleSearch = document.querySelector("#titleSearch");
const typeFilters = document.querySelectorAll("input[name='typeFilter']");
const eraFilters = document.querySelectorAll("input[name='eraFilter']");
const genreFilters = document.querySelectorAll("input[name='genreFilter']");
const serviceFilters = document.querySelectorAll("input[name='serviceFilter']");
const serviceSearch = document.querySelector("#serviceSearch");
const serviceSearchEmpty = document.querySelector("#serviceSearchEmpty");
const resultsCount = document.querySelector("#resultsCount");
const searchForm = document.querySelector(".nav-search-form");

function formatLabel(value) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function createTitleCard(title, index) {
  const column = document.createElement("div");
  column.className = "col";

  const card = document.createElement("article");
  card.className = "card drama-card";
  card.tabIndex = 0;

  const poster = document.createElement("div");
  poster.className = `poster-art ${posterStyles[index % posterStyles.length]}`;
  poster.setAttribute("aria-hidden", "true");

  const posterLockup = document.createElement("div");
  posterLockup.className = "poster-lockup";

  const posterNumber = document.createElement("span");
  posterNumber.className = "poster-emblem";
  posterNumber.textContent = String(title.id).padStart(2, "0");

  const posterTitle = document.createElement("span");
  posterTitle.className = "poster-wordmark";
  posterTitle.textContent = title.title;
  posterLockup.append(posterNumber, posterTitle);
  poster.append(posterLockup);

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h2");
  cardTitle.className = "card-title";
  cardTitle.textContent = title.title;

  const cardType = document.createElement("p");
  cardType.className = "card-type";
  cardType.textContent = title.type === "show" ? "TV Show" : formatLabel(title.type);

  const cardReveal = document.createElement("div");
  cardReveal.className = "card-reveal";

  const cardDetails = document.createElement("p");
  cardDetails.className = "card-meta";
  cardDetails.textContent = `${eraNames[title.era] ?? formatLabel(title.era)} / ${title.genres.map(formatLabel).join(", ")}`;

  const cardServices = document.createElement("p");
  cardServices.className = "card-services";
  cardServices.textContent = `Sample services: ${title.services.join(", ")}`;

  cardReveal.append(cardDetails, cardServices);
  cardBody.append(cardTitle, cardType, cardReveal);
  card.append(poster, cardBody);
  column.append(card);

  return column;
}

function renderTitles() {
  const query = titleSearch.value.trim().toLowerCase();
  const selectedServices = selectedValues(serviceFilters);
  const selectedTypes = selectedValues(typeFilters);
  const selectedEras = selectedValues(eraFilters);
  const selectedGenres = selectedValues(genreFilters);

  const visibleTitles = titles.filter((title) => {
    const matchesSearch = title.title.toLowerCase().includes(query);
    const matchesService = selectedServices.length === 0
      || selectedServices.some((service) => title.services.includes(service));
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(title.type);
    const matchesEra = selectedEras.length === 0 || selectedEras.includes(title.era);
    const matchesGenre = selectedGenres.length === 0
      || selectedGenres.some((genre) => title.genres.includes(genre));

    return matchesSearch && matchesService && matchesType && matchesEra && matchesGenre;
  });

  titleGrid.replaceChildren(...visibleTitles.map(createTitleCard));
  resultsCount.textContent = `${visibleTitles.length} ${visibleTitles.length === 1 ? "title" : "titles"}`;
}

function selectedValues(checkboxes) {
  return [...checkboxes]
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function filterServices() {
  const query = serviceSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  serviceFilters.forEach((checkbox) => {
    const option = checkbox.closest(".filter-option");
    const isVisible = checkbox.checked || checkbox.value.toLowerCase().includes(query);
    option.hidden = !isVisible;
    visibleCount += Number(isVisible);
  });

  serviceSearchEmpty.hidden = visibleCount > 0;
}

titleSearch.addEventListener("input", renderTitles);
serviceSearch.addEventListener("input", filterServices);
[...typeFilters, ...eraFilters, ...genreFilters].forEach((checkbox) => {
  checkbox.addEventListener("change", renderTitles);
});
serviceFilters.forEach((checkbox) => checkbox.addEventListener("change", renderTitles));
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderTitles();
});

renderTitles();