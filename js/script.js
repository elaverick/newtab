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
