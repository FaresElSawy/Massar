// ================================
// HTML pages to search
// ================================
const pages = [
    "index.html",
    "about-us.html",
    "projects.html",
    "certificates.html",
    "product-catalog.html",
    "contact-us.html"
];

const searchIndex = [];

// ================================
// Build HTML pages index
// ================================
async function buildPagesIndex() {

    for (const page of pages) {

        try {

            const response = await fetch(page);

            if (!response.ok) continue;

            const html = await response.text();

            const doc = new DOMParser().parseFromString(html, "text/html");

            doc.querySelectorAll("script,style,noscript").forEach(el => el.remove());

            const title =
                doc.querySelector("title")?.textContent || page;

            const text = doc.body.textContent
                .replace(/\s+/g, " ")
                .trim();

            searchIndex.push({
                type: "page",
                title,
                url: page,
                text
            });

        } catch (e) {

            console.error("Couldn't index page:", page);

        }

    }

}

// ================================
// Build products index
// ================================
function buildProductsIndex() {

    if (typeof PRODUCTS === "undefined") return;

    PRODUCTS.forEach(product => {

        searchIndex.push({

            type: "product",

            title: product.title,

            url: `product-detail.html?id=${product.id}`,

            text: `
                ${product.title}
                ${product.tag}
                ${product.category}
                ${product.sub}
                ${product.description}
            `

        });

    });

}

// ================================
// Highlight keyword
// ================================
function highlight(text, keyword) {

    const regex = new RegExp(`(${keyword})`, "gi");

    return text.replace(regex, "<mark>$1</mark>");

}

// ================================
// Search
// ================================
function performSearch(keyword) {

    const title = document.getElementById("searchTitle");
    const results = document.getElementById("results");

    title.innerHTML = `Search results for "<strong>${keyword}</strong>"`;

    results.innerHTML = "";

    if (!keyword) {

        results.innerHTML = "<p>Please enter a search term.</p>";

        return;

    }

    const matches = searchIndex.filter(item => {

        return (
            item.title.toLowerCase().includes(keyword) ||
            item.text.toLowerCase().includes(keyword)
        );

    });

    if (!matches.length) {

        results.innerHTML = "<p>No results found.</p>";

        return;

    }

    matches.sort((a, b) => {

        const aTitle = a.title.toLowerCase().includes(keyword) ? 1 : 0;
        const bTitle = b.title.toLowerCase().includes(keyword) ? 1 : 0;

        return bTitle - aTitle;

    });

    matches.forEach(item => {

        const index = item.text.toLowerCase().indexOf(keyword);

        let snippet;

        if (index > 80) {

            snippet = item.text.substring(index - 80, index + 180);

        } else {

            snippet = item.text.substring(0, 220);

        }

        snippet = highlight(snippet, keyword);

        const badge = item.type === "product"
            ? '<span class="badge badge-primary">Product</span>'
            : '<span class="badge badge-secondary">Page</span>';

        results.innerHTML += `

            <div class="search-item">

                <h4>

                    <a href="${item.url}">

                        ${item.title}

                    </a>

                    ${badge}

                </h4>

                <p>${snippet}...</p>

            </div>

        `;

    });

}

// ================================
// Init
// ================================
(async function () {

    await buildPagesIndex();

    buildProductsIndex();

    const params = new URLSearchParams(window.location.search);

    const keyword = (params.get("q") || "").toLowerCase().trim();

    performSearch(keyword);

})();