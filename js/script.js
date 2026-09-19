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

/* ================================================================
   ARTICLES
   ================================================================ */

const ARTICLES_PER_PAGE = 6;

const articleGrid =
    document.getElementById("articleGrid");

const articleTemplate =
    document.getElementById("articleTemplate");

const articlePagination =
    document.getElementById("articlePagination");

const previousArticles =
    document.getElementById("previousArticles");

const nextArticles =
    document.getElementById("nextArticles");

const articlePageStatus =
    document.getElementById("articlePageStatus");


let articles = [];

let currentArticlePage = 0;


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


function renderArticlePage() {

    const totalPages =
        Math.ceil(
            articles.length /
            ARTICLES_PER_PAGE
        );

    const start =
        currentArticlePage *
        ARTICLES_PER_PAGE;

    const end =
        Math.min(
            start + ARTICLES_PER_PAGE,
            articles.length
        );


    const fragment =
        document.createDocumentFragment();


    articles
        .slice(start, end)
        .forEach((article, index) => {

            if (
                !article ||
                typeof article !== "object"
            ) {
                return;
            }

            fragment.appendChild(
                renderArticle(
                    article,
                    start + index
                )
            );

        });


    articleGrid.replaceChildren(
        fragment
    );


    articlePageStatus.textContent =
        totalPages > 1
            ? `PAGE ${currentArticlePage + 1} / ${totalPages}`
            : "";


    previousArticles.disabled =
        currentArticlePage === 0;

    nextArticles.disabled =
        currentArticlePage >= totalPages - 1;


    articlePagination.hidden =
        totalPages <= 1;

}


function showArticlePage(page) {

    const totalPages =
        Math.ceil(
            articles.length /
            ARTICLES_PER_PAGE
        );

    if (
        page < 0 ||
        page >= totalPages
    ) {
        return;
    }


    currentArticlePage =
        page;

    renderArticlePage();

}


previousArticles.addEventListener(
    "click",
    () => {

        showArticlePage(
            currentArticlePage - 1
        );

    }
);


nextArticles.addEventListener(
    "click",
    () => {

        showArticlePage(
            currentArticlePage + 1
        );

    }
);


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

        currentArticlePage =
            0;

        renderArticlePage();


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


        articlePagination.hidden =
            true;

    }

}


articlePagination.hidden =
    true;

loadArticles();
