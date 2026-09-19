/* ================================================================
   LIMINAL NEW TAB
   Prototype interactions only.
   ================================================================ */


/* ================================================================
   THEME
   ================================================================ */

const themeToggle =
    document.getElementById("themeToggle");


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

});


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


updateClock();

setInterval(
    updateClock,
    30000
);


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