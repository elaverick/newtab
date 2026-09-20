# Liminal New Tab

A minimal, liminal personal new-tab page with a configurable search bar, frequently visited places, local weather and a rolling news feed.

The page is deliberately a **static website**, rather than a browser extension. There is no backend and no server-side application. The news feed is supplied by a JSON file that the page fetches at runtime.

The intention is that you can **fork this repository, personalise the page, and give your own fork its own AI-curated news feed**.

---

## What it looks like

The design is deliberately sparse and slightly archival:

- Off-white light mode / desaturated dark-blue dark mode
- `Special Elite` display typography
- `IBM Plex Mono` supporting typography
- Minimal borders and restrained UI
- Search as the primary interaction
- Configurable frequently visited sites
- Configurable search providers
- Optional local weather
- A rolling, category-based news feed

The site is designed to work well as a browser new-tab replacement without requiring an extension.

---

## How the news feed works

The news feed is intentionally separated from the webpage itself.

The flow is:

```
Scheduled ChatGPT Task
        |
        | research previous 48 hours
        v
articles.schema.json
        |
        | defines the data contract
        v
existing articles.json
        |
        | duplicate checking
        v
new article research
        |
        | title / source / extract / image / link / category / published
        v
validated articles.json
        |
        | replace file on main
        v
Static New Tab Page
        |
        | fetches articles.json
        v
Article grid
```

The scheduled task is external to this repository. It runs in ChatGPT and uses connected services to do the research and update the repository.

The task is configured to run every morning. In this example setup it runs at **06:00**.

The important design rule is:

> The scheduled task may modify **only `articles.json`**.

It can read `articles.schema.json` and the existing `articles.json`, but it should never modify the schema, HTML, CSS, JavaScript or any other repository file.

This keeps the website code and the news-generation process cleanly separated.

---

## The article data contract

The repository contains two important data files:

- [`articles.schema.json`](articles.schema.json) — the authoritative schema
- [`articles.json`](articles.json) — the current news feed

Every article has exactly these fields:

| Field | Purpose |
| --- | --- |
| `title` | Article headline |
| `source` | Publication name |
| `extract` | Short description of the article |
| `image` | Direct article image URL, or `null` |
| `link` | Canonical article URL |
| `category` | Feed category |
| `published` | Original publication timestamp in ISO 8601 format |

The schema deliberately describes **the shape of an article**, rather than editorial policy.

For example, the schema does not say that there must be six Automotive stories. That is an editorial decision belonging in the scheduled prompt, not in the data contract.

### Rolling window

The news task maintains a rolling **48-hour** feed.

On every run it should:

1. Read the existing `articles.json`.
2. Research new stories from the previous 48 hours.
3. Avoid repeating the same underlying story.
4. Remove articles that have fallen outside the 48-hour window.
5. Build a complete replacement `articles.json`.
6. Validate it against `articles.schema.json`.
7. Write only `articles.json` back to the repository.

This prevents the file from becoming a permanent news archive.

---

## Images

Images are part of the article data, rather than something the webpage has to discover.

For every selected article, the scheduled task should actively look for:

- the article's lead image
- its feature image
- an Open Graph image
- another directly associated article image

The task should store the **actual image URL** in the `image` field.

It should never invent an image URL.

It should not use generic stock imagery merely because it matches the subject.

It should not use unrelated site logos.

When an appropriate image genuinely cannot be obtained, `image` can be `null`.

The webpage then selects a static liminal placeholder from a matching category folder.

The optional placeholder library uses this structure:

```text
images/
├── automotive/
├── technology/
├── retro-computing/
├── retro-computing-projects/
└── music/
```

Each category folder is designed to contain twelve PNGs named `01.png` through `12.png`.

The frontend converts the article category into a folder name and assigns placeholder images deterministically from the twelve-image pool. Within the current feed, articles in the same category are assigned distinct images before the pool wraps, so the normal six-article category does not repeat an image. The assignment is repeatable for the same feed and does not depend on browser randomness.

This also makes the system straightforward to fork: create a folder whose name matches the frontend's category slug and add twelve PNG files named `01.png` to `12.png`. No JavaScript change is required for a new category.

### Colour grading

Images supplied by news articles are still used directly, but the frontend applies a subtle CSS colour grade to them:

- reduced saturation
- a slight sepia tint
- slightly softened contrast and brightness

This helps photographs from unrelated publications sit more naturally within the site's liminal palette without changing or re-hosting the source image. Static placeholder images are already colour graded and are not subjected to the same filter.

If a category has no matching image folder, or a selected placeholder cannot be loaded, the original `IMAGE` fallback is shown.

---

## Editorial categories

The current feed uses editorial categories, including Automotive, Technology, Retro Computing, Retro Computing Projects, Music and Watches. This list is not a technical limitation.

The frontend groups articles by category automatically.

The `category` field is deliberately open-ended. You can add new categories, remove categories or rename them without changing the JSON schema or article renderer, provided the category value remains a non-empty string and the resulting JSON conforms to the schema.

---

## Use as a Chrome New Tab page

The GitHub Pages site is a normal static website. Chrome does not let an ordinary website replace the built-in New Tab page, so the repository includes a tiny Manifest V3 extension that uses Chrome's supported `chrome_url_overrides.newtab` mechanism.

The extension is deliberately separate from the website. It does not contain a copy of the site; it only redirects Chrome's New Tab page to the configured GitHub Pages URL.

### Install the extension locally

1. Make sure your GitHub Pages site is working.
2. Open `extension/redirect.js` in a text editor.
3. Set `LIMINAL_NEW_TAB_URL` to the URL of your GitHub Pages site. For example:

```js
const LIMINAL_NEW_TAB_URL =
    "https://elaverick.github.io/newtab/";
```

4. Save the file.
5. Open `chrome://extensions` in Chrome.
6. Enable **Developer mode**.
7. Click **Load unpacked**.
8. Select the repository's `extension` folder.

Chrome will now use the extension whenever a new tab is opened.

The extension's New Tab page contains no application UI of its own. It immediately uses `window.location.replace()` to send the tab to the configured GitHub Pages URL.

### Updating the extension

Because the extension loads the website from GitHub Pages, changes to the website do not require the extension to be rebuilt.

When you change `extension/redirect.js`, return to `chrome://extensions` and click **Reload** on the Liminal New Tab extension.

### Forking

A fork only needs to change the URL in `extension/redirect.js`:

```js
const LIMINAL_NEW_TAB_URL =
    "https://your-user.github.io/your-repository/";
```

The rest of the extension can remain unchanged.

The extension is intended for personal or local unpacked use. Publishing an extension to the Chrome Web Store is a separate distribution step and is subject to Google's current extension policies.

---


## Building your own version

The easiest route is:

### 1. Fork the repository

Fork this repository into your own GitHub account.

Your fork becomes your personal new-tab site and your personal news-feed repository.

### 2. Personalise the page

The page itself is deliberately designed to be easy to customise.

Useful areas include:

- `index.html` — page structure
- `style/main.css` — visual design
- `js/script.js` — behaviour
- `articles.json` — current news data
- `articles.schema.json` — article contract

The Settings dialog also lets users customise things such as:

- Light / dark / system theme
- Weather on/off
- Search provider order
- Search provider placeholder text
- Custom search engines or AI agents

Frequently visited sites can be managed from the Places control.

### 3. Deploy the static site

Because the project is a normal static website, it can be hosted by any service that serves HTML, CSS, JavaScript and JSON.

GitHub Pages is a natural fit for a forked repository, but it is not required by the project.

### 4. Connect ChatGPT to your fork

Your scheduled news task needs access to the repository so it can read and update `articles.json`.

When you fork the repository, replace the repository reference in the example prompt below with your own repository.

The task should be given the narrowest repository permissions that allow the workflow to work.

### 5. Personalise the news prompt

The most important part of the fork is the editorial prompt.

You decide:

- which subjects matter
- which manufacturers, technologies or artists matter
- which sources you trust
- how many stories you want
- how old stories are allowed to be
- which categories you want
- whether Spotify should be used to identify your current favourite artists

The page does not make any of those decisions itself.

---

# Scheduled ChatGPT news task

The following is a starting point for building your own scheduled task.

Replace the bracketed sections with your own interests.

The repository rule is deliberately strict: **the task may only modify `articles.json`.**

## Example prompt

```text
Every day at 6:00am, populate the news feed for my personal new-tab page.

Your job is to research relevant articles published within the previous 48 hours, construct a valid `articles.json` file from those articles, and update the file in my GitHub repository.

## Repository rules

Repository: [YOUR GITHUB REPOSITORY]

Branch: `main`

The only file you are permitted to modify is:

`articles.json`

You may read other repository files when necessary, including:

`articles.schema.json`

Do not create, delete, rename or modify any other repository files.

Before doing anything else:

1. Read `articles.schema.json`.
2. Read the existing `articles.json`.

Treat `articles.schema.json` as the authoritative definition of the JSON structure.

## JSON requirements

The final `articles.json` must:

- Be a JSON array.
- Contain only objects matching `articles.schema.json`.
- Contain valid JSON only.
- Contain no Markdown, comments, explanatory text or trailing commas.
- Use exactly these fields for every article:

`title`
`source`
`extract`
`image`
`link`
`category`
`published`

Field definitions:

- `title`: the original article headline.
- `source`: the publication name.
- `extract`: a concise description of the article, normally one or two sentences.
- `image`: the best directly usable image URL associated with the article. Use `null` only when no suitable image can be obtained reliably.
- `link`: the canonical URL of the article.
- `category`: any non-empty editorial category name. There is no fixed category list in the schema.
- `published`: the original publication date and time as an ISO 8601 date-time.

Do not fabricate article URLs, publication dates, facts or image URLs.

Before updating the repository, validate the complete proposed `articles.json` against `articles.schema.json`.

If validation fails, correct the JSON before writing it.

## Image acquisition

Images are an important part of the feed.

For every selected article, actively attempt to obtain a suitable image.

Do not simply leave `image` as `null` because an image was not immediately available in the search results.

Open the article page where necessary and look for:

- the article's lead image
- the feature image
- an Open Graph image or equivalent article image

Prefer an image that is directly associated with the article itself.

The image URL placed into `image` must be the actual usable image URL, not the article URL.

Do not invent image URLs.

Do not use generic stock imagery merely because it matches the subject.

Do not use unrelated site logos.

If a suitable image genuinely cannot be obtained, use `null`.

## Time window and existing articles

Only include articles published within the previous 48 hours.

Use the existing `articles.json` as a rolling duplicate check before replacing it.

Do not repeat the same story within the 48-hour window.

A story being about the same company, person, artist, product or subject does not automatically make it the same story.

Distinguish genuinely new stories from follow-up coverage.

When several publications cover the same underlying event, normally select the strongest source rather than including several versions of the same story.

Remove articles that are now more than 48 hours old.

The resulting `articles.json` should therefore represent the current rolling 48-hour news window.

## Target article volume

Aim for approximately 6 good articles in each category.

The target is therefore approximately 30 articles total across five categories.

Treat this as a target, not permission to include weak stories.

Do not stop after finding only one or two stories in a category.

Actively search multiple relevant sources and continue researching until you have either:

- approximately 6 strong articles for the category, or
- exhausted the worthwhile stories published during the previous 48 hours.

A category with unusually little genuine news may contain fewer than 6 articles, but this should be the result of research rather than stopping early.

## Editorial policy — applies to EVERY category

Where stories are otherwise comparable, a humorous or entertaining article is preferable.

Prefer high-quality journalism, original reporting and specialist publications with genuine subject knowledge.

Prefer primary sources and first-hand reporting where practical.

Avoid publications where advertising is so intrusive that the article is unpleasant to read.

Avoid content farms, clickbait, low-value aggregation and articles that simply reproduce other publications without adding meaningful information.

Prefer interesting, substantive stories over trivial updates.

I generally prefer good news and positive developments.

Do not normally include routine job cuts, financial difficulties, restructuring, layoffs or other negative business stories unless they are catastrophic, industry-changing or otherwise something I genuinely need to know.

Do not include negative stories merely because they are dramatic.

Do not fill the feed with celebrity gossip, trivial social-media activity or low-value human-interest material.

## Editorial categories

Define the categories for this feed below. There is no fixed limit on the number of categories.

Do not force an article into a category where it does not genuinely belong.

## [CATEGORY 1]

[Describe the subjects, companies, people, products and types of story you want.]

Prioritise:

- [INTEREST]
- [INTEREST]
- [INTEREST]

Avoid:

- [EXAMPLE OF CONTENT YOU DO NOT WANT]

## [CATEGORY 2]

[Describe the subjects and editorial preferences.]

## [CATEGORY 3]

[Describe the subjects and editorial preferences.]

## [CATEGORY 4]

[Describe the subjects and editorial preferences.]

## [CATEGORY 5]

[Describe the subjects and editorial preferences.]

## Optional Spotify preference signal

Use Spotify to determine my current top five most-played artists when this task runs.

Search for recent news specifically relating to those artists.

Treat those artists as a current preference signal rather than a permanent list.

Prioritise meaningful developments such as:

- New releases
- Tours and significant live developments
- Announcements
- Reissues
- Archival discoveries
- Previously unreleased material
- Significant interviews
- Documentary projects
- Artist or band developments

Do not fill the feed with gossip or trivial social-media activity.

If Spotify is unavailable, use this fallback list:

- [ARTIST 1]
- [ARTIST 2]
- [ARTIST 3]
- [ARTIST 4]
- [ARTIST 5]

## Research process

For EACH category, actively research multiple relevant sources.

Do not assume that the first search results provide sufficient coverage.

Search broadly enough to identify approximately 6 worthwhile articles.

For every selected article, obtain:

- headline
- source
- concise extract
- canonical article URL
- publication date/time
- suitable article image URL where available
- editorial category

## Duplicate handling

Compare candidate stories against the existing `articles.json`.

Do not include a story that is substantially the same story already present in the existing file.

Do not confuse:

- the same subject with the same story
- a follow-up with a duplicate
- a new product announcement with an older announcement
- a new event result with an earlier preview
- a new release with earlier speculation

When in doubt, favour genuinely new information.

## Selection

Do not rank the stories.

Do not assign scores.

Do not produce a "best of" selection.

Do not produce a summary of the summary.

The output is the JSON file itself.

Aim for approximately 6 good articles per category.

Quality is more important than an arbitrary quota, but failure to reach the target should only happen after genuinely searching for additional relevant material.

## Final repository update

Construct the complete replacement `articles.json`.

Before writing it:

1. Validate the JSON syntax.
2. Validate the complete document against `articles.schema.json`.
3. Confirm every article contains exactly the required fields.
4. Confirm every `published` value is a real ISO 8601 publication timestamp.
5. Confirm every article is within the previous 48 hours.
6. Confirm there are no duplicate stories.
7. Confirm every `link` is a real article URL.
8. Confirm every non-null `image` is a real image URL associated with that article.
9. Confirm the article counts are approximately 6 per category where sufficient suitable material exists.

Only after all checks succeed, update `articles.json` in the repository on `main`.

Do not modify any other file.

Do not send a separate email digest from this task.

The only external change this task should make is the replacement of `articles.json`.
```

---

## Why the prompt is deliberately strict

There are three important boundaries between the webpage and the AI workflow.

### The webpage owns presentation

The HTML, CSS and JavaScript determine how articles are displayed.

The AI task does not need to understand the visual design beyond the JSON contract.

### The schema owns structure

`articles.schema.json` defines the data contract.

If the website changes its data requirements, update the schema and the renderer deliberately.

Do not rely on a long natural-language prompt as the only definition of the data structure.

### The scheduled task owns editorial decisions

The prompt decides what is interesting.

That includes:

- subjects
- categories
- sources
- article volume
- time window
- duplication rules
- image acquisition
- editorial preferences

This separation makes the project easier to fork and maintain.

---

## Repository structure

```text
.
├── articles.json
├── articles.schema.json
├── index.html
├── images/                         # optional static liminal placeholders
│   ├── automotive/
│   ├── technology/
│   ├── retro-computing/
│   ├── retro-computing-projects/
│   └── music/
├── js/
│   └── script.js
└── style/
    └── main.css
```

### `articles.json`

The current feed consumed by the page.

### `articles.schema.json`

The authoritative JSON Schema for the feed.

### `index.html`

The static page structure.

### `js/script.js`

Page behaviour, including:

- theme handling
- search providers
- Places
- weather
- settings
- article loading
- infinite article scrolling
- category rendering

### `style/main.css`

The visual design.

---

## Forking philosophy

This repository is intended to be a **starting point rather than a finished personal configuration**.

A fork can become:

- a different set of search providers
- a completely different Places list
- a different set of article categories
- a different editorial prompt
- a different number of stories
- a feed focused on one hobby
- a feed based on Spotify, RSS-like sources, technology interests, cars, games or anything else that can be researched and represented by the schema

The important part is that the frontend and the news workflow communicate through the same simple contract:

```
articles.schema.json
        +
articles.json
```

That makes it possible to change the editorial brain without rebuilding the website.

---

## Contributing

Changes to the website itself are welcome.

For the news feed, remember that `articles.json` is intended to be generated by the owner's scheduled workflow rather than manually maintained as application source.

When changing the article format:

1. Update `articles.schema.json`.
2. Update the frontend to consume the new fields.
3. Update the scheduled prompt.
4. Validate the generated JSON before publishing it.

---

## Licence

Add the licence you want to use for your fork.

The repository currently does not prescribe a licence; check the repository's current GitHub settings before redistributing it.
