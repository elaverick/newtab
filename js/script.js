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
        url: "https://github.com"
    },

    {
        name: "LinkedIn",
        url: "https://www.linkedin.com"
    },

    {
        name: "Reddit",
        url: "https://www.reddit.com"
    },

    {
        name: "Amazon",
        url: "https://www.amazon.co.uk"
    },

    {
        name: "News",
        url: "https://news.google.com"
    }
];

const siteGrid =
    document.getElementById("siteGrid");

const placesEdit =
    document.getElementById("placesEdit");

const placesModal =
    document.getElementById("placesModal");

const placesList =
    document.getElementById("placesList");

const placesClose =
    document.getElementById("placesClose");

const placesDone =
    document.getElementById("placesDone");

const placesEditorKicker =
    document.getElementById("placesEditorKicker");

const placesEditorStatus =
    document.getElementById("placesEditorStatus");

const siteNameInput =
    document.getElementById("siteNameInput");

const siteUrlInput =
    document.getElementById("siteUrlInput");

const removeSiteButton =
    document.getElementById("removeSiteButton");

const newSiteButton =
    document.getElementById("newSiteButton");

const saveSiteButton =
    document.getElementById("saveSiteButton");


let places =
    loadPlaces();

let editingIndex =
    null;

let nameLookupSequence =
    0;

let nameLookupTimer = null;


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
        url
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


function getNameFromUrl(url) {

    const hostname =
        getPlaceHostname(url)
            .split(".")[0]
            .replace(/[-_]+/g, " ")
            .trim();

    if (!hostname) {
        return "";
    }

    return hostname.replace(
        /\b\w/g,
        character => character.toUpperCase()
    );
}


function normaliseSiteUrl(url) {

    let value =
        url.trim();

    if (!value) {
        return "";
    }

    if (!/^https?:\/\//i.test(value)) {
        value =
            `https://${value}`;
    }

    try {

        return new URL(value).href;

    } catch {

        return "";

    }

}


async function fetchPageName(url, sequence) {

    placesEditorStatus.textContent =
        "Looking up page name...";

    placesEditorStatus.hidden =
        false;

    try {

        const response =
            await fetch(
                "https://r.jina.ai/" +
                url,
                {
                    headers: {
                        Accept:
                            "application/json"
                    },
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                `Page lookup failed: ${response.status}`
            );
        }

        const data =
            await response.json();

        const title =
            String(
                data.title ?? ""
            ).trim();

        if (
            sequence !== nameLookupSequence ||
            siteNameInput.value.trim() ||
            !title
        ) {
            return;
        }

        siteNameInput.value =
            title;

        placesEditorStatus.textContent =
            "Page name found.";

    } catch (error) {

        if (sequence !== nameLookupSequence) {
            return;
        }

        const fallback =
            getNameFromUrl(url);

        if (
            !siteNameInput.value.trim() &&
            fallback
        ) {
            siteNameInput.value =
                fallback;

            placesEditorStatus.textContent =
                "Name suggested from URL.";

        } else {

            placesEditorStatus.hidden =
                true;

        }

        console.warn(
            "Unable to fetch page name:",
            error
        );

    }

}


function requestPageName() {

    if (siteNameInput.value.trim()) {
        return;
    }

    const url =
        normaliseSiteUrl(
            siteUrlInput.value
        );

    if (!url) {

        placesEditorStatus.hidden =
            true;

        return;

    }

    let hostname = "";

    try {

        hostname =
            new URL(url).hostname;

    } catch {

        return;

    }

    if (
        !hostname ||
        hostname === "www." ||
        hostname.endsWith(".") ||
        !hostname.includes(".")
    ) {

        placesEditorStatus.hidden =
            true;

        return;

    }

    const sequence =
        ++nameLookupSequence;

    fetchPageName(
        url,
        sequence
    );

}


function renderPlaces() {

    const fragment =
        document.createDocumentFragment();

    places.forEach(
        (place, index) => {

            fragment.appendChild(
                createPlaceElement(
                    place,
                    index
                )
            );

        }
    );

    siteGrid.replaceChildren(
        fragment
    );

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


    siteInfo.appendChild(
        siteName
    );

    siteInfo.appendChild(
        siteUrl
    );


    link.appendChild(
        siteIndex
    );

    link.appendChild(
        siteIcon
    );

    link.appendChild(
        siteInfo
    );

    return link;

}


function renderPlaceList() {

    placesList.replaceChildren();

    if (!places.length) {

        const empty =
            document.createElement("p");

        empty.className =
            "places-empty";

        empty.textContent =
            "No places configured yet.";

        placesList.appendChild(
            empty
        );

        return;

    }


    places.forEach(
        (place, index) => {

            const button =
                document.createElement("button");

            button.className =
                "places-list-item";

            button.type =
                "button";

            button.classList.toggle(
                "active",
                editingIndex === index
            );


            const indexLabel =
                document.createElement("span");

            indexLabel.className =
                "places-list-index";

            indexLabel.textContent =
                String(index + 1).padStart(2, "0");


            const icon =
                document.createElement("span");

            icon.className =
                "places-list-icon";

            icon.textContent =
                getPlaceInitial(place.name);


            const info =
                document.createElement("span");

            info.className =
                "places-list-info";


            const name =
                document.createElement("span");

            name.className =
                "places-list-name";

            name.textContent =
                place.name;


            const url =
                document.createElement("span");

            url.className =
                "places-list-url";

            url.textContent =
                getPlaceHostname(place.url);


            info.appendChild(
                name
            );

            info.appendChild(
                url
            );


            button.appendChild(
                indexLabel
            );

            button.appendChild(
                icon
            );

            button.appendChild(
                info
            );


            button.addEventListener(
                "click",
                () => selectPlace(index)
            );

            placesList.appendChild(
                button
            );

        }
    );

}


function setEditorMode(index) {

    editingIndex =
        index;

    nameLookupSequence +=
        1;

    window.clearTimeout(
        nameLookupTimer
    );


    if (index === null) {

        placesEditorKicker.textContent =
            "ADD SITE";

        siteNameInput.value =
            "";

        siteUrlInput.value =
            "";

        placesEditorStatus.hidden =
            true;

        removeSiteButton.hidden =
            true;

        saveSiteButton.textContent =
            "Add site";

    } else {

        const place =
            places[index];

        placesEditorKicker.textContent =
            "EDIT SITE";

        siteNameInput.value =
            place.name;

        siteUrlInput.value =
            place.url;

        placesEditorStatus.hidden =
            true;

        removeSiteButton.hidden =
            false;

        saveSiteButton.textContent =
            "Save changes";

    }

    renderPlaceList();

}


function selectPlace(index) {

    setEditorMode(
        index
    );

    siteNameInput.focus();

}


function openPlaces() {

    setEditorMode(
        null
    );

    placesModal.hidden =
        false;

    document.body.classList.add(
        "places-modal-open"
    );

    window.setTimeout(() => {
        siteUrlInput.focus();
    }, 0);

}


function closePlaces() {

    placesModal.hidden =
        true;

    document.body.classList.remove(
        "places-modal-open"
    );

    nameLookupSequence +=
        1;

    window.clearTimeout(
        nameLookupTimer
    );

}


placesEdit.addEventListener(
    "click",
    openPlaces
);

placesClose.addEventListener(
    "click",
    closePlaces
);

placesDone.addEventListener(
    "click",
    closePlaces
);

newSiteButton.addEventListener(
    "click",
    () => {

        setEditorMode(
            null
        );

        siteUrlInput.focus();

    }
);


removeSiteButton.addEventListener(
    "click",
    () => {

        if (editingIndex === null) {
            return;
        }

        places.splice(
            editingIndex,
            1
        );

        savePlaces();
        renderPlaces();

        setEditorMode(
            null
        );

    }
);


saveSiteButton.addEventListener(
    "click",
    () => {

        const name =
            siteNameInput.value.trim();

        const url =
            normaliseSiteUrl(
                siteUrlInput.value
            );

        if (!name || !url) {

            placesEditorStatus.textContent =
                "Enter a name and valid URL.";

            placesEditorStatus.hidden =
                false;

            return;

        }


        const site = {
            name,
            url
        };


        if (editingIndex === null) {

            places.push(
                site
            );

        } else {

            places[editingIndex] =
                site;

        }


        savePlaces();
        renderPlaces();

        setEditorMode(
            null
        );

    }
);


siteUrlInput.addEventListener(
    "input",
    () => {

        window.clearTimeout(
            nameLookupTimer
        );

        if (siteNameInput.value.trim()) {

            placesEditorStatus.hidden =
                true;

            return;

        }


        const url =
            normaliseSiteUrl(
                siteUrlInput.value
            );

        if (!url) {

            placesEditorStatus.hidden =
                true;

            return;

        }


        nameLookupTimer =
            window.setTimeout(
                requestPageName,
                700
            );

    }
);


siteUrlInput.addEventListener(
    "blur",
    () => {

        if (
            !siteNameInput.value.trim()
        ) {
            requestPageName();
        }

    }
);


placesModal.addEventListener(
    "click",
    event => {

        if (
            event.target.matches(
                "[data-places-close]"
            )
        ) {

            closePlaces();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !placesModal.hidden
        ) {

            closePlaces();

        }

    }
);


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

        document.getElementById(
            "searchInput"
        ).placeholder =
            option.dataset.provider === "ChatGPT"
                ? "Ask ChatGPT..."
                : "Search the web...";


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


function createWeatherIcon(code, isDay) {

    const svg =

        (markup => {

            const template =
                document.createElement("template");

            template.innerHTML =
                markup.trim();

            return template.content
                .firstElementChild;

        })(getWeatherIconMarkup(code, isDay));


    svg.setAttribute(
        "aria-hidden",
        "true"
    );

    return svg;
}


function getWeatherIconMarkup(code, isDay) {

    const common =
        `<svg
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
        `;


    if (code === 0) {

        return common +
            (isDay
                ? `>
                    <circle cx="12" cy="12" r="4.5"/>
                    <line x1="12" y1="2" x2="12" y2="5"/>
                    <line x1="12" y1="19" x2="12" y2="22"/>
                    <line x1="2" y1="12" x2="5" y2="12"/>
                    <line x1="19" y1="12" x2="22" y2="12"/>
                    <line x1="4.9" y1="4.9" x2="7" y2="7"/>
                    <line x1="17" y1="17" x2="19.1" y2="19.1"/>
                    <line x1="19.1" y1="4.9" x2="17" y2="7"/>
                    <line x1="7" y1="17" x2="4.9" y2="19.1"/>
                </svg>`
                : `>
                    <path d="M17.5 16.5A6.5 6.5 0 0 1 8 8a6.5 6.5 0 1 0 9.5 8.5Z"/>
                    <line x1="17.5" y1="4" x2="17.5" y2="7"/>
                    <line x1="16" y1="5.5" x2="19" y2="5.5"/>
                </svg>`);

    }


    if (code === 1) {

        return common +
            (isDay
                ? `>
                    <circle cx="9" cy="12" r="4"/>
                    <line x1="9" y1="3" x2="9" y2="1"/>
                    <line x1="9" y1="23" x2="9" y2="21"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="15" y1="12" x2="17" y2="12"/>
                    <path d="M15 8.5A5 5 0 0 1 20.5 14"/>
                </svg>`
                : `>
                    <path d="M17.5 16.5A6.5 6.5 0 0 1 8 8a6.5 6.5 0 0 0-1 1"/>
                    <path d="M13 16.5h5.5a2.5 2.5 0 0 0 0-5 4.5 4.5 0 0 0-8.3-1.7"/>
                </svg>`);

    }


    if (code === 2) {

        return common + `>
            <circle cx="8" cy="8" r="3.2"/>
            <line x1="8" y1="2" x2="8" y2="4"/>
            <line x1="8" y1="12" x2="8" y2="14"/>
            <line x1="2" y1="8" x2="4" y2="8"/>
            <line x1="12" y1="8" x2="14" y2="8"/>
            <path d="M7 18.5h9a3.5 3.5 0 1 0-1-6.8 5.5 5.5 0 0 0-10.2 1.2"/>
        </svg>`;

    }


    if (
        code === 3 ||
        code === 45 ||
        code === 48
    ) {

        return common + `>
            <path d="M6 9.5h10a3.5 3.5 0 0 1 0 7H6a3.5 3.5 0 0 1 0-7Z"/>
            <line x1="4" y1="7" x2="9" y2="7"/>
            <line x1="12" y1="4.5" x2="18" y2="4.5"/>
            <line x1="7" y1="20" x2="11" y2="20"/>
            <line x1="14" y1="20" x2="18" y2="20"/>
        </svg>`;

    }


    if (
        (code >= 51 && code <= 57) ||
        (code >= 61 && code <= 67) ||
        (code >= 80 && code <= 82)
    ) {

        return common + `>
            <path d="M6 9.5h10a3.5 3.5 0 0 1 0 7H6a3.5 3.5 0 0 1 0-7Z"/>
            <line x1="8" y1="19" x2="7" y2="22"/>
            <line x1="13" y1="19" x2="12" y2="22"/>
            <line x1="18" y1="19" x2="17" y2="22"/>
        </svg>`;

    }


    if (
        code >= 71 && code <= 77 ||
        code === 85 ||
        code === 86
    ) {

        return common + `>
            <path d="M6 9.5h10a3.5 3.5 0 0 1 0 7H6a3.5 3.5 0 0 1 0-7Z"/>
            <path d="M8 20l-2 2M12 19l-2 3M17 20l-2 2"/>
            <path d="M8 19v-2M13 19v-2M18 19v-2"/>
        </svg>`;

    }


    if (code >= 95 && code <= 99) {

        return common + `>
            <path d="M6 9.5h10a3.5 3.5 0 0 1 0 7H6a3.5 3.5 0 0 1 0-7Z"/>
            <path d="M13 13l-2 4h2l-2 4 4-5h-2l2-3Z"/>
        </svg>`;

    }


    return common + `>
        <circle cx="12" cy="12" r="7"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <circle cx="12" cy="16.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>`;
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

        weather.replaceChildren(
            createWeatherIcon(code, isDay)
        );

        weather.title =
            describeWeather(code) +
            " — Weather data from Open-Meteo";

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

    ChatGPT:
        "https://chatgpt.com/?q=",

    DuckDuckGo:
        "https://duckduckgo.com/?q="

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

    const queryString =
        encodeURIComponent(query);

    window.location.href =
        selectedProvider === "ChatGPT"
            ? baseUrl +
              queryString +
              "&hints=search"
            : baseUrl +
              queryString;

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

const refreshArticles =
    document.getElementById("refreshArticles");


let articles = [];

let articleLoadSequence = 0;

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

    const source =
        item.querySelector(".article-source");


    number.textContent =
        String(index + 1).padStart(3, "0");

    title.textContent =
        article.title ?? "";

    description.textContent =
        article.extract ?? "";

    source.textContent =
        article.source ?? "";

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

    const loadSequence =
        ++articleLoadSequence;


    if (articleObserver) {

        articleObserver.disconnect();

        articleObserver =
            null;

    }


    articleSentinel.hidden =
        false;

    articleGrid.replaceChildren();

    renderedArticleCount =
        0;

    isLoadingArticles =
        false;


    try {

        const response =
            await fetch(
                "articles.json?refresh=" +
                Date.now(),
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                `Unable to load articles.json: ${response.status}`
            );

        }


        const data =
            await response.json();

        if (
            loadSequence !==
            articleLoadSequence
        ) {
            return;
        }


        if (!Array.isArray(data)) {

            throw new Error(
                "articles.json must contain an array"
            );

        }


        articles =
            data;

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

        if (
            loadSequence !==
            articleLoadSequence
        ) {
            return;
        }


        console.error(
            "Failed to load articles:",
            error
        );


        articleGrid.replaceChildren();


        const message =
            document.createElement(
                "p"
            );

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


refreshArticles.addEventListener(
    "click",
    loadArticles
);


loadArticles();
