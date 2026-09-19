/* ================================================================
   LIMINAL NEW TAB
   Prototype interactions only.
   ================================================================ */


/* ================================================================
   THEME
   ================================================================ */

const USE_SYSTEM_THEME =
    true;

const THEME_OVERRIDE_KEY =
    "newtab-theme-override";

const themeToggle =
    document.getElementById("themeToggle");

const systemTheme =
    window.matchMedia("(prefers-color-scheme: dark)");


function getSystemTheme() {

    return systemTheme.matches
        ? "dark"
        : "light";

}


function getThemeOverride() {

    if (!USE_SYSTEM_THEME) {
        return null;
    }

    const override =
        localStorage.getItem(
            THEME_OVERRIDE_KEY
        );

    return override === "light" || override === "dark"
        ? override
        : null;

}


function applyTheme() {

    const override =
        getThemeOverride();

    const theme =
        override ??
        (USE_SYSTEM_THEME
            ? getSystemTheme()
            : "light");

    document.body.classList.toggle(
        "theme-dark",
        theme === "dark"
    );

    document.body.classList.toggle(
        "theme-light",
        theme === "light"
    );

}


themeToggle.addEventListener("click", () => {

    const currentTheme =
        document.body.classList.contains("theme-dark")
            ? "dark"
            : "light";

    const nextTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    localStorage.setItem(
        THEME_OVERRIDE_KEY,
        nextTheme
    );

    applyTheme();

});


if (USE_SYSTEM_THEME) {

    systemTheme.addEventListener(
        "change",
        () => {

            if (
                !getThemeOverride()
            ) {

                applyTheme();

            }

        }
    );

}


applyTheme();


/* ================================================================
   PLACES
   ================================================================ */

const PLACES_STORAGE_KEY =
    "newtab-places";

const DEFAULT_PLACES = [

    {
        name: "GitHub",
        url: "https://github.com",
        enabled: true
    },

    {
        name: "LinkedIn",
        url: "https://www.linkedin.com",
        enabled: true
    },

    {
        name: "Reddit",
        url: "https://www.reddit.com",
        enabled: true
    },

    {
        name: "Amazon",
        url: "https://www.amazon.co.uk",
        enabled: true
    },

    {
        name: "News",
        url: "https://news.google.com",
        enabled: true
    }
];

const siteGrid =
    document.getElementById("siteGrid");

const placesEdit =
    document.getElementById("placesEdit");

const placesModal =
    document.getElementById("placesModal");

const placesOptions =
    document.getElementById("placesOptions");

const placesClose =
    document.getElementById("placesClose");

const placesCancel =
    document.getElementById("placesCancel");

const placesSave =
    document.getElementById("placesSave");

const addSiteButton =
    document.getElementById("addSiteButton");

const newSiteName =
    document.getElementById("newSiteName");

const newSiteUrl =
    document.getElementById("newSiteUrl");


let places =
    loadPlaces();

let editingPlaces = [];


function normalisePlace(place) {

    if (!place || typeof place !== "object") {
        return null;
    }

    const name =
        String(place.name ?? "").trim();

    const url =
        String(place.url ?? "").trim();

    if (!name || !url) {
        return null;
    }

    return {
        name,
        url,
        enabled: place.enabled !== false
    };
}


function loadPlaces() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    PLACES_STORAGE_KEY
                )
            );

        if (Array.isArray(saved)) {

            const normalised =
                saved
                    .map(normalisePlace)
                    .filter(Boolean);

            if (normalised.length) {
                return normalised;
            }

        }

    } catch (error) {

        console.warn(
            "Unable to load saved Places:",
            error
        );

    }

    return DEFAULT_PLACES.map(place => ({ ...place }));
}


function savePlaces() {

    localStorage.setItem(
        PLACES_STORAGE_KEY,
        JSON.stringify(places)
    );

}


function getPlaceInitial(name) {

    const initial =
        [...name].find(
            character =>
                /[\p{L}\p{N}]/u.test(character)
        );

    return (
        initial ??
        "?"
    ).toUpperCase();
}


function getPlaceHostname(url) {

    try {

        return new URL(url).hostname
            .replace(/^www\./i, "");

    } catch {

        return url;

    }
}


function createPlaceElement(place, index) {

    const link =
        document.createElement("a");

    link.className =
        "site";

    link.href =
        place.url;

    link.target =
        "_blank";

    link.rel =
        "noopener noreferrer";


    const siteIndex =
        document.createElement("span");

    siteIndex.className =
        "site-index";

    siteIndex.textContent =
        String(index + 1).padStart(2, "0");


    const siteIcon =
        document.createElement("span");

    siteIcon.className =
        "site-icon";

    siteIcon.textContent =
        getPlaceInitial(place.name);


    const siteInfo =
        document.createElement("span");

    siteInfo.className =
        "site-info";


    const siteName =
        document.createElement("span");

    siteName.className =
        "site-name";

    siteName.textContent =
        place.name;


    const siteUrl =
        document.createElement("span");

    siteUrl.className =
        "site-url";

    siteUrl.textContent =
        getPlaceHostname(place.url);


    siteInfo.appendChild(siteName);
    siteInfo.appendChild(siteUrl);

    link.appendChild(siteIndex);
    link.appendChild(siteIcon);
    link.appendChild(siteInfo);

    return link;
}


function renderPlaces() {

    const visiblePlaces =
        places.filter(place => place.enabled);

    const fragment =
        document.createDocumentFragment();

    visiblePlaces.forEach((place, index) => {

        fragment.appendChild(
            createPlaceElement(place, index)
        );

    });

    siteGrid.replaceChildren(fragment);
}


function renderPlaceOptions() {

    placesOptions.replaceChildren();

    editingPlaces.forEach((place, index) => {

        const row =
            document.createElement("label");

        row.className =
            "places-option";


        const checkbox =
            document.createElement("input");

        checkbox.type =
            "checkbox";

        checkbox.checked =
            place.enabled;

        checkbox.addEventListener("change", () => {

            editingPlaces[index].enabled =
                checkbox.checked;

        });


        const icon =
            document.createElement("span");

        icon.className =
            "places-option-icon";

        icon.textContent =
            getPlaceInitial(place.name);


        const info =
            document.createElement("span");

        info.className =
            "places-option-info";


        const name =
            document.createElement("span");

        name.className =
            "places-option-name";

        name.textContent =
            place.name;


        const url =
            document.createElement("span");

        url.className =
            "places-option-url";

        url.textContent =
            getPlaceHostname(place.url);


        const remove =
            document.createElement("button");

        remove.className =
            "places-option-remove";

        remove.type =
            "button";

        remove.textContent =
            "×";

        remove.setAttribute(
            "aria-label",
            `Remove ${place.name}`
        );

        remove.addEventListener("click", event => {

            event.preventDefault();
            event.stopPropagation();

            editingPlaces.splice(index, 1);
            renderPlaceOptions();

        });


        info.appendChild(name);
        info.appendChild(url);

        row.appendChild(checkbox);
        row.appendChild(icon);
        row.appendChild(info);
        row.appendChild(remove);

        placesOptions.appendChild(row);

    });
}


function openPlaces() {

    editingPlaces =
        places.map(place => ({ ...place }));

    renderPlaceOptions();

    newSiteName.value = "";
    newSiteUrl.value = "";

    placesModal.hidden =
        false;

    document.body.classList.add("places-modal-open");

    window.setTimeout(() => {
        newSiteName.focus();
    }, 0);
}


function closePlaces() {

    placesModal.hidden =
        true;

    document.body.classList.remove("places-modal-open");
}


placesEdit.addEventListener("click", openPlaces);
placesClose.addEventListener("click", closePlaces);
placesCancel.addEventListener("click", closePlaces);


placesSave.addEventListener("click", () => {

    places =
        editingPlaces.map(place => ({ ...place }));

    savePlaces();
    renderPlaces();
    closePlaces();

});


addSiteButton.addEventListener("click", () => {

    const name =
        newSiteName.value.trim();

    let url =
        newSiteUrl.value.trim();

    if (!name || !url) {
        return;
    }

    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }

    try {
        new URL(url);
    } catch {
        return;
    }

    editingPlaces.push({
        name,
        url,
        enabled: true
    });

    renderPlaceOptions();

    newSiteName.value = "";
    newSiteUrl.value = "";
    newSiteName.focus();

});


placesModal.addEventListener("click", event => {

    if (event.target.matches("[data-places-close]")) {
        closePlaces();
    }

});


document.addEventListener("keydown", event => {

    if (
        event.key === "Escape" &&
        !placesModal.hidden
    ) {
        closePlaces();
    }

});


renderPlaces();


/* ================================================================
   SEARCH PROVIDER
   ================================================================ */

const providerButton =
    document.getElementById("providerButton");

const providerMenu =
    document.getElementById("providerMenu");

const providerName =
    document.getElementById("providerName");

const providerMark =
    document.getElementById("providerMark");

const providerOptions =
    document.querySelectorAll(".provider-option");


providerButton.addEventListener("click", event => {

    event.stopPropagation();

    const isOpen =
        providerMenu.classList.toggle("open");

    providerButton.setAttribute(
        "aria-expanded",
        isOpen
    );

});


providerOptions.forEach(option => {

    option.addEventListener("click", () => {

        providerName.textContent =
            option.dataset.provider;

        providerMark.textContent =
            option.dataset.mark;


        providerOptions.forEach(item => {

            item.classList.remove("active");

        });


        option.classList.add("active");

        providerMenu.classList.remove("open");

        providerButton.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


document.addEventListener("click", event => {

    if (
        !providerMenu.contains(event.target) &&
        !providerButton.contains(event.target)
    ) {

        providerMenu.classList.remove("open");

        providerButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

});


/* ================================================================
   WEATHER
   ================================================================ */

const weather =
    document.getElementById("weather");

const WEATHER_REFRESH_INTERVAL =
    15 * 60 * 1000;


function getWeatherSymbol(code, isDay) {

    if (code === 0) {
        return isDay ? "☀" : "☾";
    }

    if (code === 1) {
        return isDay ? "◔" : "☽";
    }

    if (code === 2) {
        return "⛅";
    }

    if (code === 3) {
        return "☁";
    }

    if (code === 45 || code === 48) {
        return "≋";
    }

    if (code >= 51 && code <= 57) {
        return "≋";
    }

    if (code >= 61 && code <= 67) {
        return "☂";
    }

    if (code >= 71 && code <= 77) {
        return "❄";
    }

    if (code >= 80 && code <= 82) {
        return "☂";
    }

    if (code === 85 || code === 86) {
        return "❄";
    }

    if (code >= 95 && code <= 99) {
        return "ϟ";
    }

    return "•";
}


function describeWeather(code) {

    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Rime fog",
        51: "Light drizzle",
        53: "Drizzle",
        55: "Heavy drizzle",
        56: "Light freezing drizzle",
        57: "Freezing drizzle",
        61: "Light rain",
        63: "Rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Freezing rain",
        71: "Light snow",
        73: "Snow",
        75: "Heavy snow",
        77: "Snow grains",
        80: "Light showers",
        81: "Showers",
        82: "Heavy showers",
        85: "Light snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Thunderstorm with heavy hail"
    };

    return descriptions[code] ?? "Weather unavailable";
}


async function updateWeather() {

    if (
        !navigator.geolocation ||
        !window.isSecureContext
    ) {
        weather.hidden = true;
        return;
    }


    try {

        const position =
            await new Promise((resolve, reject) => {

                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: false,
                        maximumAge: 15 * 60 * 1000,
                        timeout: 10000
                    }
                );

            });


        const latitude =
            position.coords.latitude;

        const longitude =
            position.coords.longitude;

        const params =
            new URLSearchParams({
                latitude: String(latitude),
                longitude: String(longitude),
                current: "weather_code,is_day",
                timezone: "auto"
            });

        const response =
            await fetch(
                "https://api.open-meteo.com/v1/forecast?" +
                params.toString(),
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                "Weather request failed: " +
                response.status
            );
        }

        const data =
            await response.json();

        const code =
            Number(data.current?.weather_code);

        const isDay =
            Number(data.current?.is_day) === 1;

        if (!Number.isFinite(code)) {
            throw new Error(
                "Weather code missing from response."
            );
        }

        weather.textContent =
            getWeatherSymbol(code, isDay);

        weather.title =
            describeWeather(code);

        weather.setAttribute(
            "aria-label",
            describeWeather(code)
        );

        weather.hidden = false;

    } catch (error) {

        console.warn(
            "Unable to load local weather:",
            error
        );

        weather.hidden = true;

    }
}


updateWeather();

window.setInterval(
    updateWeather,
    WEATHER_REFRESH_INTERVAL
);


/* ================================================================
   CLOCK
   ================================================================ */

const clock =
    document.getElementById("clock");


function updateClock() {

    const now =
        new Date();

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    clock.textContent =
        `${hours}:${minutes}`;

}


function startClock() {

    updateClock();

    const now =
        new Date();

    const millisecondsUntilNextMinute =
        (60 - now.getSeconds()) * 1000 -
        now.getMilliseconds();


    window.setTimeout(() => {

        updateClock();

        window.setInterval(
            updateClock,
            60000
        );

    }, millisecondsUntilNextMinute);

}


startClock();


/* ================================================================
   DATE
   ================================================================ */

const date =
    document.getElementById("date");


function updateDate() {

    const now =
        new Date();

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const year =
        String(
            now.getFullYear()
        ).slice(-2);


    date.textContent =
        `${day}.${month}.${year}`;

}


updateDate();


/* ================================================================
   SEARCH
   ================================================================ */

const searchForm =
    document.getElementById("searchForm");

const searchInput =
    document.getElementById("searchInput");


const searchEngines = {

    Google:
        "https://www.google.com/search?q=",

    Bing:
        "https://www.bing.com/search?q=",

    DuckDuckGo:
        "https://duckduckgo.com/?q=",

    Brave:
        "https://search.brave.com/search?q="

};


let selectedProvider =
    "Google";


providerOptions.forEach(option => {

    option.addEventListener("click", () => {

        selectedProvider =
            option.dataset.provider;

    });

});


searchForm.addEventListener("submit", event => {

    event.preventDefault();

    const query =
        searchInput.value.trim();

    if (!query) {
        return;
    }


    const baseUrl =
        searchEngines[selectedProvider];


    window.location.href =
        baseUrl +
        encodeURIComponent(query);

});

/* ================================================================
   ARTICLES
   ================================================================ */

const ARTICLES_PER_LOAD = 6;

const articleGrid =
    document.getElementById("articleGrid");

const articleTemplate =
    document.getElementById("articleTemplate");

const articleSentinel =
    document.getElementById("articleSentinel");


let articles = [];

let displayArticles = [];

let categoryCounts = new Map();

let renderedArticleCount = 0;

let isLoadingArticles = false;

let articleObserver = null;


function prepareArticles() {

    const groups =
        new Map();


    articles.forEach((article, index) => {

        if (
            !article ||
            typeof article !== "object"
        ) {
            return;
        }


        const category =
            String(
                article.category ?? "Uncategorised"
            ).trim() ||
            "Uncategorised";


        if (!groups.has(category)) {

            groups.set(
                category,
                []
            );

        }


        groups
            .get(category)
            .push({
                article,
                index,
                category
            });

    });


    categoryCounts =
        new Map(
            Array.from(
                groups.entries()
            ).map(
                ([category, entries]) =>
                    [
                        category,
                        entries.length
                    ]
            )
        );


    displayArticles =
        Array.from(
            groups.entries()
        )
            .sort(
                ([a], [b]) =>
                    a.localeCompare(
                        b,
                        undefined,
                        {
                            sensitivity: "base"
                        }
                    )
            )
            .flatMap(
                ([, entries]) =>
                    entries
            );

}


function renderCategoryMarker(category) {

    const marker =
        document.createElement("div");

    marker.className =
        "article-category-marker";


    const leftRule =
        document.createElement("span");

    leftRule.className =
        "article-category-rule";


    const label =
        document.createElement("span");

    label.className =
        "article-category-label";

    label.textContent =
        category;


    const count =
        document.createElement("span");

    count.className =
        "article-category-count";

    count.textContent =
        String(
            categoryCounts.get(category)
        ).padStart(2, "0");


    const rightRule =
        document.createElement("span");

    rightRule.className =
        "article-category-rule";


    marker.appendChild(
        leftRule
    );

    marker.appendChild(
        label
    );

    marker.appendChild(
        count
    );

    marker.appendChild(
        rightRule
    );


    return marker;
}


function renderArticle(article, index) {

    const item =
        articleTemplate.content.cloneNode(true);

    const link =
        item.querySelector(".article-link");

    const image =
        item.querySelector(".article-image-content");

    const imagePlaceholder =
        item.querySelector(".article-image-placeholder");

    const number =
        item.querySelector(".article-number");

    const title =
        item.querySelector(".article-title");

    const description =
        item.querySelector(".article-description");


    number.textContent =
        String(index + 1).padStart(3, "0");

    title.textContent =
        article.title ?? "";

    description.textContent =
        article.extract ?? "";

    link.href =
        article.link ?? "#";


    if (article.image) {

        image.src =
            article.image;

        image.alt =
            article.title ?? "";

        image.addEventListener(
            "error",
            () => {

                image.hidden =
                    true;

                imagePlaceholder.hidden =
                    false;

            },
            { once: true }
        );

        imagePlaceholder.hidden =
            true;

    } else {

        image.hidden =
            true;

    }


    return item;
}


function renderNextArticles() {

    if (
        isLoadingArticles ||
        renderedArticleCount >= displayArticles.length
    ) {
        return;
    }


    isLoadingArticles = true;


    const start =
        renderedArticleCount;

    const end =
        Math.min(
            start + ARTICLES_PER_LOAD,
            displayArticles.length
        );


    const fragment =
        document.createDocumentFragment();


    let lastCategory =
        start > 0
            ? displayArticles[start - 1].category
            : null;


    for (
        let index = start;
        index < end;
        index += 1
    ) {

        const entry =
            displayArticles[index];


        if (
            entry.category !== lastCategory
        ) {

            fragment.appendChild(
                renderCategoryMarker(
                    entry.category
                )
            );

            lastCategory =
                entry.category;

        }


        fragment.appendChild(
            renderArticle(
                entry.article,
                index
            )
        );

    }


    articleGrid.appendChild(
        fragment
    );


    renderedArticleCount =
        end;

    isLoadingArticles = false;


    if (
        renderedArticleCount >= displayArticles.length &&
        articleObserver
    ) {

        articleObserver.disconnect();

        articleSentinel.hidden =
            true;

    }

}


async function loadArticles() {

    try {

        const response =
            await fetch(
                "articles.json",
                {
                    cache: "no-cache"
                }
            );

        if (!response.ok) {

            throw new Error(
                `Unable to load articles.json: ${response.status}`
            );

        }


        const data =
            await response.json();


        if (!Array.isArray(data)) {

            throw new Error(
                "articles.json must contain an array"
            );

        }


        articles =
            data;

        renderedArticleCount =
            0;


        prepareArticles();

        articleGrid.replaceChildren();

        renderNextArticles();


        if (
            renderedArticleCount < displayArticles.length
        ) {

            articleObserver =
                new IntersectionObserver(
                    entries => {

                        if (
                            entries.some(
                                entry =>
                                    entry.isIntersecting
                            )
                        ) {

                            renderNextArticles();

                        }

                    },
                    {
                        rootMargin:
                            "400px 0px"
                    }
                );


            articleObserver.observe(
                articleSentinel
            );

        } else {

            articleSentinel.hidden =
                true;

        }


    } catch (error) {

        console.error(
            "Failed to load articles:",
            error
        );


        articleGrid.replaceChildren();


        const message =
            document.createElement("p");

        message.className =
            "article-error";

        message.textContent =
            "Unable to load articles.";

        articleGrid.appendChild(
            message
        );


        articleSentinel.hidden =
            true;

    }

}


loadArticles();
