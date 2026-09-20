/* ================================================================
   LIMINAL NEW TAB
   Prototype interactions only.
   ================================================================ */


/* ================================================================
   THEME
   ================================================================ */

const THEME_STORAGE_KEY =
    "newtab-theme";

const LEGACY_THEME_STORAGE_KEY =
    "newtab-theme-override";

const systemTheme =
    window.matchMedia("(prefers-color-scheme: dark)");


function getSystemTheme() {

    return systemTheme.matches
        ? "dark"
        : "light";

}


function getThemePreference() {

    const saved =
        localStorage.getItem(
            THEME_STORAGE_KEY
        );

    if (
        saved === "system" ||
        saved === "light" ||
        saved === "dark"
    ) {

        return saved;

    }


    const legacy =
        localStorage.getItem(
            LEGACY_THEME_STORAGE_KEY
        );

    if (
        legacy === "light" ||
        legacy === "dark"
    ) {

        return legacy;

    }


    return "system";

}


function setThemePreference(preference) {

    if (
        preference !== "system" &&
        preference !== "light" &&
        preference !== "dark"
    ) {

        return;

    }

    localStorage.setItem(
        THEME_STORAGE_KEY,
        preference
    );

    applyTheme();

}


function applyTheme() {

    const preference =
        getThemePreference();

    const theme =
        preference === "system"
            ? getSystemTheme()
            : preference;

    document.body.classList.toggle(
        "theme-dark",
        theme === "dark"
    );

    document.body.classList.toggle(
        "theme-light",
        theme === "light"
    );

}


systemTheme.addEventListener(
    "change",
    () => {

        if (
            getThemePreference() === "system"
        ) {

            applyTheme();

        }

    }
);


applyTheme();


/* ================================================================
   EASTER EGGS
================================================================ */

const EASTER_EGG_DATE_PARAMETER =
    "fakeDate";


function getEffectiveDate() {

    const fakeDate =
        new URLSearchParams(
            window.location.search
        ).get(
            EASTER_EGG_DATE_PARAMETER
        );

    if (fakeDate) {

        const match =
            /^(\d{4})-(\d{2})-(\d{2})$/.exec(
                fakeDate
            );

        if (match) {

            const date =
                new Date(
                    Number(match[1]),
                    Number(match[2]) - 1,
                    Number(match[3])
                );

            if (
                date.getFullYear() === Number(match[1]) &&
                date.getMonth() === Number(match[2]) - 1 &&
                date.getDate() === Number(match[3])
            ) {

                return date;

            }

        }

    }

    return new Date();

}


function isChristmas(date) {

    return (
        date.getMonth() === 11 &&
        date.getDate() === 25
    );

}


function createChristmasSnow() {

    const existing =
        document.getElementById(
            "christmasSnow"
        );

    if (existing) {

        existing.remove();

    }

    const date =
        getEffectiveDate();

    if (!isChristmas(date)) {

        return;

    }

    const snow =
        document.createElement("div");

    snow.id =
        "christmasSnow";

    snow.className =
        "christmas-snow";

    snow.setAttribute(
        "aria-hidden",
        "true"
    );

    const snowflakeCount =
        128;

    for (
        let index = 0;
        index < snowflakeCount;
        index += 1
    ) {

        const flake =
            document.createElement("span");

        flake.className =
            "christmas-snowflake";

        flake.textContent =
            "❄";

        const size =
            8 + Math.random() * 10;

        const duration =
            24 + Math.random() * 18;

        const delay =
            -(Math.random() * duration);

        const drift =
            -40 + Math.random() * 80;

        const opacity =
            0.10 + Math.random() * 0.15;

        flake.style.setProperty(
            "--snow-size",
            size + "px"
        );

        flake.style.setProperty(
            "--snow-top",
            (Math.random() * 100) + "%"
        );

        flake.style.setProperty(
            "--snow-duration",
            duration + "s"
        );

        flake.style.setProperty(
            "--snow-delay",
            delay + "s"
        );

        flake.style.setProperty(
            "--snow-drift",
            drift + "px"
        );

        flake.style.setProperty(
            "--snow-opacity",
            opacity
        );

        flake.style.left =
            (Math.random() * 100) + "%";

        snow.appendChild(
            flake
        );

    }

    document.body.prepend(
        snow
    );

}


createChristmasSnow();


function isHalloween(date) {

    return (
        date.getMonth() === 9 &&
        date.getDate() === 31
    );

}


function createHalloweenBat() {

    const bat =
        document.createElement("div");

    bat.className =
        "halloween-bat";

    bat.innerHTML = `
        <div class="halloween-bat-visual">
            <div class="halloween-bat-motion">
                <img
                    class="halloween-bat-frame halloween-bat-frame-1"
                src="images/halloween/bat1.svg"
                alt=""
                aria-hidden="true"
            >
            <img
                class="halloween-bat-frame halloween-bat-frame-2"
                src="images/halloween/bat2.svg"
                alt=""
                aria-hidden="true"
            >
                <img
                    class="halloween-bat-frame halloween-bat-frame-3"
                    src="images/halloween/bat3.svg"
                    alt=""
                    aria-hidden="true"
                >
            </div>
        </div>
    `;

    return bat;

}


function createHalloweenBats() {

    const existing =
        document.getElementById("halloweenBats");

    if (existing) {
        existing.remove();
    }

    if (!isHalloween(getEffectiveDate())) {
        return;
    }

    const bats =
        document.createElement("div");

    bats.id =
        "halloweenBats";

    bats.className =
        "halloween-bats";

    bats.setAttribute(
        "aria-hidden",
        "true"
    );

    const batCount =
        8;

    for (
        let index = 0;
        index < batCount;
        index += 1
    ) {

        const bat =
            createHalloweenBat();

        const direction =
            index % 2 === 0
                ? "ltr"
                : "rtl";

        const duration =
            26 + Math.random() * 18;

        const delay =
            -(Math.random() * duration);

        const rise =
            1.2 + Math.random() * 0.8;

        const top =
            4 + Math.random() * 92;

        bat.classList.add(
            "halloween-bat-" + direction
        );

        bat.style.top =
            top + "%";

        bat.style.setProperty(
            "--bat-duration",
            duration + "s"
        );

        bat.style.setProperty(
            "--bat-delay",
            delay + "s"
        );

        bat.style.setProperty(
            "--bat-rise",
            rise + "px"
        );

        bats.appendChild(
            bat
        );

    }

    document.body.prepend(
        bats
    );

}


function createHalloweenPumpkin(theme) {

    const pumpkin =
        document.createElement("img");

    pumpkin.className =
        "halloween-pumpkin-" +
        theme;

    pumpkin.src =
        "images/halloween/pumpkin-" +
        theme +
        ".svg";

    pumpkin.alt =
        "";

    pumpkin.setAttribute(
        "aria-hidden",
        "true"
    );

    return pumpkin;

}


function addHalloweenPumpkinToSection(sectionHeader, side) {

    if (!sectionHeader) {
        return;
    }

    const cluster =
        document.createElement("span");

    cluster.className =
        "halloween-pumpkin-cluster halloween-pumpkin-" +
        side;

    cluster.setAttribute(
        "aria-hidden",
        "true"
    );

    const pumpkinCount =
        2 + Math.floor(Math.random() * 3);

    const positions =
        pumpkinCount === 2
            ? [28, 72]
            : pumpkinCount === 3
                ? [16, 50, 84]
                : [9, 36, 64, 91];

    positions.forEach(
        (position) => {

            const holder =
                document.createElement("span");

            holder.className =
                "halloween-pumpkin";

            holder.style.left =
                position + "%";

            holder.style.setProperty(
                "--pumpkin-scale",
                (
                    0.70 +
                    Math.random() * 0.34
                ).toFixed(2)
            );

            holder.style.setProperty(
                "--pumpkin-rotation",
                (
                    -6 +
                    Math.random() * 12
                ).toFixed(1) +
                "deg"
            );

            holder.style.setProperty(
                "--pumpkin-lift",
                (
                    -1 +
                    Math.random() * 3
                ).toFixed(1) +
                "px"
            );

            holder.appendChild(
                createHalloweenPumpkin(
                    "light"
                )
            );

            holder.appendChild(
                createHalloweenPumpkin(
                    "dark"
                )
            );

            cluster.appendChild(
                holder
            );

        }
    );

    sectionHeader.appendChild(
        cluster
    );

}


function createHalloweenPumpkins() {

    document
        .querySelectorAll(
            ".halloween-pumpkin-cluster"
        )
        .forEach(
            element =>
                element.remove()
        );

    if (!isHalloween(getEffectiveDate())) {
        return;
    }

    const sectionHeaders =
        Array.from(
            document.querySelectorAll(
                ".section-header"
            )
        );

    addHalloweenPumpkinToSection(
        sectionHeaders[0],
        "places"
    );

    addHalloweenPumpkinToSection(
        sectionHeaders[1],
        "elsewhere"
    );

}


function updateHalloweenDecorations() {

    const active =
        isHalloween(
            getEffectiveDate()
        );

    document.body.classList.toggle(
        "halloween-active",
        active
    );

    createHalloweenPumpkins();

}


createHalloweenBats();
updateHalloweenDecorations();


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

const saveSiteButton =
    document.getElementById("saveSiteButton");


let places =
    loadPlaces();

let editingIndex =
    null;

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

    return DEFAULT_PLACES.map(
        place => ({ ...place })
    );
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


function getPlaceNameFromUrl(url) {

    let hostname = "";

    try {

        hostname =
            new URL(url).hostname
                .replace(/^www\./i, "");

    } catch {

        return "";

    }


    const parts =
        hostname
            .split(".")
            .filter(Boolean);


    if (!parts.length) {
        return "";
    }


    const multiPartDomains =
        new Set([
            "co.uk",
            "org.uk",
            "ac.uk",
            "gov.uk",
            "com.au",
            "net.au",
            "org.au",
            "co.nz",
            "co.za",
            "com.br",
            "com.cn",
            "com.sg",
            "co.jp"
        ]);


    let name = "";

    if (
        parts.length >= 3 &&
        multiPartDomains.has(
            parts.slice(-2).join(".")
        )
    ) {

        name =
            parts[parts.length - 3];

    } else if (parts.length >= 2) {

        name =
            parts[parts.length - 2];

    } else {

        name =
            parts[0];

    }


    name =
        name
            .replace(/[-_]+/g, " ")
            .trim()
            .toLowerCase();


    return name
        ? name.charAt(0).toUpperCase() +
          name.slice(1)
        : "";

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

        const rawUrl =
            siteUrlInput.value.trim();

        const url =
            normaliseSiteUrl(
                rawUrl
            );

        if (!url) {

            placesEditorStatus.textContent =
                "Enter a valid URL.";

            placesEditorStatus.hidden =
                false;

            return;

        }


        let name =
            siteNameInput.value.trim();

        if (!name) {

            name =
                getPlaceNameFromUrl(
                    url
                );

        }

        if (!name) {

            placesEditorStatus.textContent =
                "Unable to determine a site name.";

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
    "blur",
    () => {

        if (
            siteNameInput.value.trim()
        ) {
            return;
        }


        const url =
            normaliseSiteUrl(
                siteUrlInput.value
            );

        if (!url) {
            return;
        }


        const name =
            getPlaceNameFromUrl(
                url
            );

        if (!name) {
            return;
        }


        siteNameInput.value =
            name;

        placesEditorStatus.textContent =
            "Name from URL.";

        placesEditorStatus.hidden =
            false;

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

const SEARCH_SETTINGS_KEY =
    "newtab-search-settings";

const SEARCH_ENGINE_DEFINITIONS = {
    Google: {
        name: "Google",
        mark: "G",
        url: "https://www.google.com/search?q={query}",
        placeholder: "Search the web..."
    },

    ChatGPT: {
        name: "ChatGPT",
        mark: "C",
        url: "https://chatgpt.com/?q={query}&hints=search",
        placeholder: "Ask ChatGPT..."
    },

    DuckDuckGo: {
        name: "DuckDuckGo",
        mark: "D",
        url: "https://duckduckgo.com/?q={query}",
        placeholder: "Search the web..."
    }
};


const SEARCH_ENGINE_IDS =
    Object.keys(
        SEARCH_ENGINE_DEFINITIONS
    );


function getDefaultSearchSettings() {

    return {
        order: [...SEARCH_ENGINE_IDS],
        placeholders: {},
        custom: {}
    };

}


function getSearchEngineDefinition(id) {

    if (
        SEARCH_ENGINE_DEFINITIONS[id]
    ) {

        return SEARCH_ENGINE_DEFINITIONS[id];

    }

    return (
        searchSettings.custom[id] ??
        null
    );

}


function getSearchEngineMark(name) {

    const initial =
        [...String(name ?? "")].find(
            character =>
                /[\p{L}\p{N}]/u.test(character)
        );

    return (
        initial ??
        "?"
    ).toUpperCase();

}


function loadSearchSettings() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    SEARCH_SETTINGS_KEY
                )
            );

        if (
            saved &&
            typeof saved === "object"
        ) {

            const custom = {};

            if (
                saved.custom &&
                typeof saved.custom === "object"
            ) {

                Object.entries(
                    saved.custom
                ).forEach(
                    ([id, engine]) => {

                        if (
                            !engine ||
                            typeof engine !== "object"
                        ) {
                            return;
                        }

                        const name =
                            String(
                                engine.name ?? ""
                            ).trim();

                        const url =
                            String(
                                engine.url ?? ""
                            ).trim();

                        const placeholder =
                            String(
                                engine.placeholder ?? ""
                            ).trim();

                        if (
                            id.startsWith("custom-") &&
                            name &&
                            url.includes("{query}")
                        ) {

                            custom[id] = {
                                name,
                                mark:
                                    getSearchEngineMark(
                                        name
                                    ),
                                url,
                                placeholder:
                                    placeholder ||
                                    "Search " + name + "..."
                            };

                        }

                    }
                );

            }


            const legacyEnabled =
                Array.isArray(saved.enabled)
                    ? saved.enabled.filter(
                        id =>
                            SEARCH_ENGINE_IDS.includes(
                                id
                            )
                    )
                    : null;

            let order =
                Array.isArray(saved.order)
                    ? saved.order.filter(
                        id =>
                            SEARCH_ENGINE_IDS.includes(id) ||
                            Boolean(custom[id])
                    )
                    : legacyEnabled
                        ? [...legacyEnabled]
                        : [...SEARCH_ENGINE_IDS];

            if (
                !Array.isArray(saved.order) &&
                saved.defaultProvider &&
                (
                    SEARCH_ENGINE_IDS.includes(
                        saved.defaultProvider
                    ) ||
                    Boolean(custom[saved.defaultProvider])
                )
            ) {

                order = [
                    saved.defaultProvider,
                    ...order.filter(
                        id =>
                            id !== saved.defaultProvider
                    )
                ];

            }


            [
                ...SEARCH_ENGINE_IDS,
                ...Object.keys(custom)
            ].forEach(
                id => {

                    if (!order.includes(id)) {
                        order.push(id);
                    }

                }
            );


            if (!order.length) {
                order.push("Google");
            }


            const placeholders =
                saved.placeholders &&
                typeof saved.placeholders === "object"
                    ? Object.fromEntries(
                        SEARCH_ENGINE_IDS
                            .filter(
                                id =>
                                    typeof saved.placeholders[id] === "string" &&
                                    saved.placeholders[id].trim()
                            )
                            .map(
                                id => [
                                    id,
                                    saved.placeholders[id].trim()
                                ]
                            )
                    )
                    : {};


            return {
                order,
                placeholders,
                custom
            };

        }

    } catch (error) {

        console.warn(
            "Unable to load search settings:",
            error
        );

    }


    return getDefaultSearchSettings();

}


function saveSearchSettings() {

    localStorage.setItem(
        SEARCH_SETTINGS_KEY,
        JSON.stringify(
            searchSettings
        )
    );

}


let searchSettings =
    loadSearchSettings();


const providerButton =
    document.getElementById("providerButton");

const providerMenu =
    document.getElementById("providerMenu");

const providerName =
    document.getElementById("providerName");

const providerMark =
    document.getElementById("providerMark");

const searchInput =
    document.getElementById("searchInput");


let selectedProvider =
    searchSettings.order[0] ?? "Google";


function getSearchEnginePlaceholder(provider) {

    const definition =
        getSearchEngineDefinition(
            provider
        );

    if (!definition) {
        return "";
    }

    return (
        provider in searchSettings.placeholders
            ? searchSettings.placeholders[provider]
            : definition.placeholder
    );

}


function getSearchEngineUrl(provider, query) {

    const definition =
        getSearchEngineDefinition(
            provider
        );

    if (!definition) {
        return "";
    }

    return definition.url.replaceAll(
        "{query}",
        encodeURIComponent(query)
    );

}


function getSearchEngineHostname(provider) {

    const definition =
        getSearchEngineDefinition(
            provider
        );

    if (!definition) {
        return "";
    }

    try {

        return new URL(
            definition.url.replaceAll(
                "{query}",
                "query"
            )
        ).hostname;

    } catch {

        return definition.url;

    }

}


function applySelectedProvider(provider) {

    if (
        !getSearchEngineDefinition(provider)
    ) {

        provider =
            searchSettings.order[0] ??
            "Google";

    }

    selectedProvider =
        provider;

    const definition =
        getSearchEngineDefinition(
            selectedProvider
        );

    providerName.textContent =
        definition.name;

    providerMark.textContent =
        definition.mark;

    searchInput.placeholder =
        getSearchEnginePlaceholder(
            selectedProvider
        );

    searchInput.setAttribute(
        "aria-label",
        getSearchEnginePlaceholder(
            selectedProvider
        )
    );

}


function renderProviderMenu() {

    providerMenu.replaceChildren();

    searchSettings.order.forEach(
        provider => {

            const definition =
                getSearchEngineDefinition(
                    provider
                );

            if (!definition) {
                return;
            }

            const option =
                document.createElement(
                    "button"
                );

            option.className =
                "provider-option";

            option.type =
                "button";

            option.dataset.provider =
                provider;

            option.dataset.mark =
                definition.mark;

            option.textContent =
                definition.name;

            option.classList.toggle(
                "active",
                provider === selectedProvider
            );

            providerMenu.appendChild(
                option
            );

        }
    );

}


providerButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        const isOpen =
            providerMenu.classList.toggle(
                "open"
            );

        providerButton.setAttribute(
            "aria-expanded",
            isOpen
        );

    }
);


providerMenu.addEventListener(
    "click",
    event => {

        const option =
            event.target.closest(
                ".provider-option"
            );

        if (!option) {
            return;
        }

        applySelectedProvider(
            option.dataset.provider
        );

        renderProviderMenu();

        providerMenu.classList.remove(
            "open"
        );

        providerButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }
);


document.addEventListener(
    "click",
    event => {

        if (
            !providerMenu.contains(event.target) &&
            !providerButton.contains(event.target)
        ) {

            providerMenu.classList.remove(
                "open"
            );

            providerButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


renderProviderMenu();
applySelectedProvider(
    selectedProvider
);

searchInput.focus();


/* ================================================================
   WEATHER
   ================================================================ */
/* ================================================================
   WEATHER
   ================================================================ */

const weather =
    document.getElementById("weather");

const WEATHER_SETTINGS_KEY =
    "newtab-weather-enabled";

const WEATHER_PERMISSION_REQUESTED_KEY =
    "newtab-weather-permission-requested";

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



async function getGeolocationPermissionState() {

    if (
        !navigator.permissions ||
        typeof navigator.permissions.query !== "function"
    ) {

        return "unknown";

    }

    try {

        const permission =
            await navigator.permissions.query({
                name: "geolocation"
            });

        return permission.state;

    } catch {

        return "unknown";

    }

}


async function requestCurrentPosition() {

    localStorage.setItem(
        WEATHER_PERMISSION_REQUESTED_KEY,
        "true"
    );

    return new Promise((resolve, reject) => {

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

}


async function updateWeather(options = {}) {

    const allowPermissionPrompt =
        Boolean(
            options.allowPermissionPrompt
        );

    if (
        !getWeatherEnabled() ||
        !navigator.geolocation ||
        !window.isSecureContext
    ) {

        weather.hidden = true;

        return;

    }

    const permissionState =
        await getGeolocationPermissionState();

    const permissionWasRequested =
        localStorage.getItem(
            WEATHER_PERMISSION_REQUESTED_KEY
        ) === "true";

    if (
        permissionState === "denied"
    ) {

        weather.hidden = true;

        localStorage.setItem(
            WEATHER_SETTINGS_KEY,
            "false"
        );

        return;

    }

    if (
        permissionState === "prompt" &&
        permissionWasRequested &&
        !allowPermissionPrompt
    ) {

        weather.hidden = true;

        return;

    }


    try {

        const position =
            await requestCurrentPosition();


        if (!getWeatherEnabled()) {

            weather.hidden = true;

            return;

        }


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

        if (!getWeatherEnabled()) {

            weather.hidden = true;

            return;

        }

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
            createWeatherIcon(
                code,
                isDay
            )
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


function getWeatherEnabled() {

    const saved =
        localStorage.getItem(
            WEATHER_SETTINGS_KEY
        );

    return (
        saved === null
            ? true
            : saved === "true"
    );

}


function setWeatherEnabled(enabled) {

    localStorage.setItem(
        WEATHER_SETTINGS_KEY,
        String(Boolean(enabled))
    );

    if (!enabled) {

        weather.hidden = true;

        return;

    }

    updateWeather({
        allowPermissionPrompt: true
    });

}


async function initialiseWeather() {

    weather.hidden =
        !getWeatherEnabled();

    if (
        getWeatherEnabled()
    ) {

        updateWeather();

    }

}


initialiseWeather();

window.setInterval(
    () => {

        if (
            getWeatherEnabled()
        ) {

            updateWeather();

        }

    },
    WEATHER_REFRESH_INTERVAL
);


/* ================================================================
   SETTINGS
   ================================================================ */

const settingsButton =
    document.getElementById("settingsButton");

const settingsModal =
    document.getElementById("settingsModal");

const settingsClose =
    document.getElementById("settingsClose");

const settingsDone =
    document.getElementById("settingsDone");

const themeSystem =
    document.getElementById("themeSystem");

const themeLight =
    document.getElementById("themeLight");

const themeDark =
    document.getElementById("themeDark");

const weatherToggleSetting =
    document.getElementById("weatherToggleSetting");

const searchEngineSettings =
    document.getElementById("searchEngineSettings");

const addSearchEngineButton =
    document.getElementById("addSearchEngineButton");

const searchEngineEditor =
    document.getElementById("searchEngineEditor");

const cancelSearchEngineButton =
    document.getElementById("cancelSearchEngineButton");

const searchEngineNameInput =
    document.getElementById("searchEngineNameInput");

const searchEngineUrlInput =
    document.getElementById("searchEngineUrlInput");

const searchEnginePlaceholderInput =
    document.getElementById("searchEnginePlaceholderInput");

const saveSearchEngineButton =
    document.getElementById("saveSearchEngineButton");

const searchEngineEditorStatus =
    document.getElementById("searchEngineEditorStatus");


function syncThemeSettings() {

    const preference =
        getThemePreference();

    themeSystem.checked =
        preference === "system";

    themeLight.checked =
        preference === "light";

    themeDark.checked =
        preference === "dark";

}


function syncWeatherSettings() {

    weatherToggleSetting.checked =
        getWeatherEnabled();

}


function getSearchEngineIdsInOrder() {

    return [
        ...searchEngineSettings.querySelectorAll(
            ".settings-engine-row"
        )
    ].map(
        row =>
            row.dataset.engine
    );

}


function saveSearchEngineOrder() {

    searchSettings.order =
        getSearchEngineIdsInOrder();

    if (!searchSettings.order.length) {
        searchSettings.order.push("Google");
    }

    saveSearchSettings();

    const defaultProvider =
        searchSettings.order[0];

    applySelectedProvider(
        defaultProvider
    );

    renderProviderMenu();
    renderSearchSettings();

}


function createSearchEnginePlaceholderEditor(
    row,
    id,
    definition
) {

    const placeholderPanel =
        document.createElement("div");

    placeholderPanel.className =
        "settings-engine-placeholder";

    const label =
        document.createElement("label");

    label.className =
        "settings-placeholder-field";

    const labelText =
        document.createElement("span");

    labelText.textContent =
        "Placeholder";

    const input =
        document.createElement("input");

    input.type =
        "text";

    input.value =
        searchSettings.placeholders[id] ?? "";

    input.placeholder =
        definition.placeholder;

    input.autocomplete =
        "off";

    input.addEventListener(
        "input",
        () => {

            const value =
                input.value.trim();

            if (value) {

                searchSettings.placeholders[id] =
                    value;

            } else {

                delete searchSettings.placeholders[
                    id
                ];

            }

            saveSearchSettings();

            if (
                selectedProvider === id
            ) {

                applySelectedProvider(
                    id
                );

            }

        }
    );

    label.appendChild(
        labelText
    );

    label.appendChild(
        input
    );

    placeholderPanel.appendChild(
        label
    );

    row.appendChild(
        placeholderPanel
    );

    return placeholderPanel;

}


function createSearchEngineRow(
    id,
    index
) {

    const definition =
        getSearchEngineDefinition(
            id
        );

    if (!definition) {
        return null;
    }

    const row =
        document.createElement("div");

    row.className =
        "settings-engine-row";

    row.dataset.engine =
        id;

    row.draggable =
        true;

    row.setAttribute(
        "aria-label",
        "Drag " + definition.name + " to reorder"
    );


    const handle =
        document.createElement("span");

    handle.className =
        "settings-engine-handle";

    handle.textContent =
        "⠿";

    handle.setAttribute(
        "aria-hidden",
        "true"
    );

    handle.title =
        "Drag to reorder";


    const engineInfo =
        document.createElement("div");

    engineInfo.className =
        "settings-engine-info";


    const mark =
        document.createElement("span");

    mark.className =
        "settings-engine-mark";

    mark.textContent =
        definition.mark;


    const copy =
        document.createElement("span");

    copy.className =
        "settings-engine-copy";


    const name =
        document.createElement("span");

    name.className =
        "settings-engine-name";

    name.textContent =
        definition.name;


    const url =
        document.createElement("span");

    url.className =
        "settings-engine-url";

    url.textContent =
        getSearchEngineHostname(
            id
        );


    const status =
        document.createElement("span");

    status.className =
        "settings-engine-status";

    status.textContent =
        index === 0
            ? "DEFAULT"
            : "";


    copy.appendChild(
        name
    );

    copy.appendChild(
        url
    );

    copy.appendChild(
        status
    );


    engineInfo.appendChild(
        mark
    );

    engineInfo.appendChild(
        copy
    );


    const controls =
        document.createElement("div");

    controls.className =
        "settings-engine-controls";


    const expandButton =
        document.createElement("button");

    expandButton.className =
        "settings-engine-expand";

    expandButton.type =
        "button";

    expandButton.textContent =
        "⌄";

    expandButton.setAttribute(
        "aria-label",
        "Customise " + definition.name + " placeholder"
    );

    expandButton.setAttribute(
        "aria-expanded",
        "false"
    );


    const removeButton =
        document.createElement("button");

    removeButton.className =
        "settings-engine-remove";

    removeButton.type =
        "button";

    removeButton.textContent =
        "×";

    removeButton.setAttribute(
        "aria-label",
        "Remove " + definition.name
    );

    removeButton.title =
        "Remove search engine";

    const isCustom =
        Boolean(
            searchSettings.custom[id]
        );

    removeButton.hidden =
        !isCustom;


    const placeholderPanel =
        createSearchEnginePlaceholderEditor(
            row,
            id,
            definition
        );

    placeholderPanel.hidden =
        true;


    expandButton.addEventListener(
        "click",
        () => {

            const open =
                placeholderPanel.hidden;

            placeholderPanel.hidden =
                !open;

            row.classList.toggle(
                "open",
                open
            );

            expandButton.setAttribute(
                "aria-expanded",
                open
            );

        }
    );


    removeButton.addEventListener(
        "click",
        () => {

            if (!searchSettings.custom[id]) {
                return;
            }

            delete searchSettings.custom[id];

            searchSettings.order =
                searchSettings.order.filter(
                    engineId =>
                        engineId !== id
                );

            delete searchSettings.placeholders[
                id
            ];

            saveSearchSettings();

            renderSearchSettings();

            applySelectedProvider(
                searchSettings.order[0]
            );

            renderProviderMenu();

        }
    );


    controls.appendChild(
        expandButton
    );

    controls.appendChild(
        removeButton
    );


    row.appendChild(
        handle
    );

    row.appendChild(
        engineInfo
    );

    row.appendChild(
        controls
    );


    row.appendChild(
        placeholderPanel
    );


    row.addEventListener(
        "dragstart",
        event => {

            row.classList.add(
                "is-dragging"
            );

            event.dataTransfer.effectAllowed =
                "move";

            event.dataTransfer.setData(
                "text/plain",
                id
            );

        }
    );


    row.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            const draggingRow =
                searchEngineSettings.querySelector(
                    ".settings-engine-row.is-dragging"
                );

            if (
                !draggingRow ||
                draggingRow === row
            ) {
                return;
            }

            const bounds =
                row.getBoundingClientRect();

            const insertBefore =
                event.clientY <
                bounds.top +
                bounds.height / 2;

            searchEngineSettings.insertBefore(
                draggingRow,
                insertBefore
                    ? row
                    : row.nextSibling
            );

        }
    );


    row.addEventListener(
        "dragend",
        () => {

            row.classList.remove(
                "is-dragging"
            );

            saveSearchEngineOrder();

        }
    );


    return row;

}


function renderSearchSettings() {

    const openIds =
        new Set();

    searchEngineSettings
        .querySelectorAll(
            ".settings-engine-row.open"
        )
        .forEach(
            row => {
                openIds.add(
                    row.dataset.engine
                );
            }
        );


    searchEngineSettings.replaceChildren();


    searchSettings.order =
        searchSettings.order.filter(
            id =>
                Boolean(
                    getSearchEngineDefinition(id)
                )
        );


    [
        ...SEARCH_ENGINE_IDS,
        ...Object.keys(
            searchSettings.custom
        )
    ].forEach(
        id => {

            if (!searchSettings.order.includes(id)) {
                searchSettings.order.push(id);
            }

        }
    );


    if (!searchSettings.order.length) {
        searchSettings.order.push("Google");
    }


    const fragment =
        document.createDocumentFragment();

    searchSettings.order.forEach(
        (id, index) => {

            const row =
                createSearchEngineRow(
                    id,
                    index
                );

            if (!row) {
                return;
            }

            if (openIds.has(id)) {

                row.querySelector(
                    ".settings-engine-placeholder"
                ).hidden = false;

                row.classList.add(
                    "open"
                );

                row.querySelector(
                    ".settings-engine-expand"
                ).setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

            fragment.appendChild(
                row
            );

        }
    );

    searchEngineSettings.appendChild(
        fragment
    );

    saveSearchSettings();

}


function resetSearchEngineEditor() {

    searchEngineNameInput.value =
        "";

    searchEngineUrlInput.value =
        "";

    searchEnginePlaceholderInput.value =
        "";

    searchEngineEditorStatus.textContent =
        "Use {query} where the search text should be inserted.";

}


function openSearchEngineEditor() {

    resetSearchEngineEditor();

    searchEngineEditor.hidden =
        false;

    addSearchEngineButton.hidden =
        true;

    window.setTimeout(
        () => {
            searchEngineNameInput.focus();
        },
        0
    );

}


function closeSearchEngineEditor() {

    searchEngineEditor.hidden =
        true;

    addSearchEngineButton.hidden =
        false;

    resetSearchEngineEditor();

}


function createCustomSearchEngineId() {

    return (
        "custom-" +
        Date.now().toString(36) +
        "-" +
        Math.random().toString(36).slice(2, 8)
    );

}


function normaliseSearchEngineUrl(value) {

    const url =
        value.trim();

    if (!url.includes("{query}")) {
        return "";
    }

    try {

        const parsed =
            new URL(
                url.replaceAll(
                    "{query}",
                    "query"
                )
            );

        if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
        ) {
            return "";
        }

    } catch {

        return "";

    }

    return url;

}


addSearchEngineButton.addEventListener(
    "click",
    openSearchEngineEditor
);


cancelSearchEngineButton.addEventListener(
    "click",
    closeSearchEngineEditor
);


saveSearchEngineButton.addEventListener(
    "click",
    () => {

        const name =
            searchEngineNameInput.value.trim();

        const url =
            normaliseSearchEngineUrl(
                searchEngineUrlInput.value
            );

        const placeholder =
            searchEnginePlaceholderInput.value.trim();


        if (!name) {

            searchEngineEditorStatus.textContent =
                "Enter a name.";

            searchEngineNameInput.focus();

            return;

        }


        if (!url) {

            searchEngineEditorStatus.textContent =
                "Use a valid HTTP(S) URL containing {query}.";

            searchEngineUrlInput.focus();

            return;

        }


        const id =
            createCustomSearchEngineId();

        const defaultPlaceholder =
            placeholder ||
            "Search " + name + "...";

        searchSettings.custom[id] = {
            name,
            mark:
                getSearchEngineMark(
                    name
                ),
            url,
            placeholder:
                defaultPlaceholder
        };

        searchSettings.order.push(
            id
        );

        saveSearchSettings();

        closeSearchEngineEditor();

        renderSearchSettings();
        applySelectedProvider(
            searchSettings.order[0]
        );
        renderProviderMenu();


        const addedRow =
            searchEngineSettings.querySelector(
                '[data-engine="' + CSS.escape(id) + '"]'
            );

        if (addedRow) {

            const expandButton =
                addedRow.querySelector(
                    ".settings-engine-expand"
                );

            if (expandButton) {
                expandButton.click();
            }

        }

    }
);


function openSettings() {

    syncThemeSettings();
    syncWeatherSettings();
    renderSearchSettings();

    searchEngineEditor.hidden =
        true;

    addSearchEngineButton.hidden =
        false;

    settingsModal.hidden =
        false;

    document.body.classList.add(
        "settings-modal-open"
    );

    window.setTimeout(
        () => {
            themeSystem.focus();
        },
        0
    );

}


function closeSettings() {

    settingsModal.hidden =
        true;

    document.body.classList.remove(
        "settings-modal-open"
    );

}


settingsButton.addEventListener(
    "click",
    openSettings
);

settingsClose.addEventListener(
    "click",
    closeSettings
);

settingsDone.addEventListener(
    "click",
    closeSettings
);


settingsModal.addEventListener(
    "click",
    event => {

        if (
            event.target.matches(
                "[data-settings-close]"
            )
        ) {

            closeSettings();

        }

    }
);


[themeSystem, themeLight, themeDark].forEach(
    control => {

        control.addEventListener(
            "change",
            () => {

                if (
                    control.checked
                ) {

                    setThemePreference(
                        control.value
                    );

                }

            }
        );

    }
);


weatherToggleSetting.addEventListener(
    "change",
    () => {

        setWeatherEnabled(
            weatherToggleSetting.checked
        );

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !settingsModal.hidden
        ) {

            closeSettings();

        }

    }
);


/* ================================================================
   CLOCK
   ================================================================
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
        getEffectiveDate();

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


searchForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const query =
            searchInput.value.trim();

        if (!query) {
            return;
        }

        const provider =
            getSearchEngineDefinition(
                selectedProvider
            )
                ? selectedProvider
                : searchSettings.order[0];

        const url =
            getSearchEngineUrl(
                provider,
                query
            );

        if (!url) {
            return;
        }

        window.location.href =
            url;

    }
);


/* ================================================================
   ARTICLES
   ================================================================
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

let placeholderAssignments =
    new Map();

let articleLoadSequence = 0;

let displayArticles = [];

let categoryCounts = new Map();

let renderedArticleCount = 0;

let isLoadingArticles = false;

let articleObserver = null;


function getArticlePlaceholderIdentity(
    article
) {

    return [
        article?.category ?? "",
        article?.link ?? "",
        article?.title ?? ""
    ].join("|");

}


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


    placeholderAssignments =
        new Map();


    groups.forEach(
        entries => {

            const assignmentOrder =
                [...entries].sort(
                    (a, b) =>
                        hashPlaceholderValue(
                            getArticlePlaceholderIdentity(
                                a.article
                            )
                        ) -
                        hashPlaceholderValue(
                            getArticlePlaceholderIdentity(
                                b.article
                            )
                        )
                );


            assignmentOrder.forEach(
                (entry, position) => {

                    placeholderAssignments.set(
                        getArticlePlaceholderIdentity(
                            entry.article
                        ),
                        (position % 12) + 1
                    );

                }
            );

        }
    );


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


function hashPlaceholderValue(value) {

    let hash =
        2166136261;

    for (const character of String(value)) {

        hash ^=
            character.charCodeAt(0);

        hash =
            Math.imul(
                hash,
                16777619
            );

    }

    return hash >>> 0;

}


function slugifyCategory(category) {

    return String(
        category ?? ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            "");

}


function getArticlePlaceholderUrl(article) {

    const category =
        String(
            article?.category ??
            ""
        ).trim();

    const slug =
        slugifyCategory(
            category
        );

    if (!slug) {

        return null;

    }


    const identity =
        getArticlePlaceholderIdentity(
            article
        );

    const fallbackSeed =
        hashPlaceholderValue(
            identity
        );

    const variant =
        placeholderAssignments.get(
            identity
        ) ??
        ((fallbackSeed % 12) + 1);


    return (
        "images/" +
        slug +
        "/" +
        String(variant).padStart(2, "0") +
        ".png"
    );

}


function showStaticArticlePlaceholder(
    image,
    imagePlaceholder,
    article
) {

    const placeholderUrl =
        getArticlePlaceholderUrl(
            article
        );

    if (!placeholderUrl) {

        image.hidden =
            true;

        imagePlaceholder.textContent =
            "IMAGE";

        imagePlaceholder.hidden =
            false;

        return;

    }


    image.alt =
        "";

    image.classList.remove(
        "article-source-image"
    );

    image.hidden =
        false;

    imagePlaceholder.hidden =
        true;

    image.src =
        placeholderUrl;


    image.addEventListener(
        "error",
        () => {

            image.hidden =
                true;

            imagePlaceholder.textContent =
                "IMAGE";

            imagePlaceholder.hidden =
                false;

        },
        { once: true }
    );

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

        image.classList.add(
            "article-source-image"
        );

        image.hidden =
            false;

        imagePlaceholder.hidden =
            true;

        image.addEventListener(
            "error",
            () => {

                showStaticArticlePlaceholder(
                    image,
                    imagePlaceholder,
                    article
                );

            },
            { once: true }
        );

    } else {

        showStaticArticlePlaceholder(
            image,
            imagePlaceholder,
            article
        );

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
