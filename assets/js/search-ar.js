/* Arabic search route: Arabic site copy plus English technical product names. */
(function () {
  const pages = [
    "ar/index.html", "ar/about-us.html", "ar/services.html", "ar/projects.html",
    "ar/certificates.html", "ar/product-catalog.html", "ar/contact-us.html"
  ];
  const searchIndex = [];

  async function buildPagesIndex() {
    for (const page of pages) {
      try {
        const response = await fetch(page);
        if (!response.ok) continue;
        const doc = new DOMParser().parseFromString(await response.text(), "text/html");
        doc.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
        searchIndex.push({
          type: "page",
          title: doc.querySelector("title")?.textContent || page,
          url: page,
          text: doc.body.textContent.replace(/\s+/g, " ").trim()
        });
      } catch (error) {
        console.error("تعذر فهرسة الصفحة:", page, error);
      }
    }
  }

  function buildProductsIndex() {
    if (typeof PRODUCTS === "undefined") return;
    PRODUCTS.forEach((product) => {
      const arabicDescription = window.PRODUCTS_AR?.[product.id]?.description || "";
      searchIndex.push({
        type: "product",
        title: product.title,
        url: `ar/product-detail.html?id=${product.id}`,
        text: `${product.title} ${product.tag} ${product.category} ${product.sub} ${product.description || ""} ${arabicDescription}`
          .replace(/<[^>]+>/g, " ")
      });
    });
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlight(value, keyword) {
    return value.replace(new RegExp(`(${escapeRegex(keyword)})`, "gi"), "<mark>$1</mark>");
  }

  function performSearch(keyword) {
    const title = document.getElementById("searchTitle");
    const results = document.getElementById("results");
    title.innerHTML = `نتائج البحث عن "<strong>${keyword}</strong>"`;
    results.innerHTML = "";
    if (!keyword) {
      results.innerHTML = "<p>يرجى إدخال كلمة للبحث.</p>";
      return;
    }

    const normalized = keyword.toLowerCase();
    const matches = searchIndex.filter((item) =>
      item.title.toLowerCase().includes(normalized) || item.text.toLowerCase().includes(normalized)
    );
    if (!matches.length) {
      results.innerHTML = "<p>لا توجد نتائج مطابقة.</p>";
      return;
    }

    matches.sort((a, b) => Number(b.title.toLowerCase().includes(normalized)) - Number(a.title.toLowerCase().includes(normalized)));
    matches.forEach((item) => {
      const haystack = item.text;
      const index = haystack.toLowerCase().indexOf(normalized);
      const snippet = index > 80 ? haystack.substring(index - 80, index + 180) : haystack.substring(0, 220);
      const badge = item.type === "product" ? "منتج" : "صفحة";
      results.insertAdjacentHTML("beforeend", `
        <div class="search-item">
          <h4><a href="${item.url}">${item.title}</a><span class="badge badge-${item.type === "product" ? "primary" : "secondary"}">${badge}</span></h4>
          <p>${highlight(snippet, keyword)}...</p>
        </div>`);
    });
  }

  (async function init() {
    await buildPagesIndex();
    buildProductsIndex();
    const keyword = (new URLSearchParams(window.location.search).get("q") || "").trim();
    performSearch(keyword);
  })();
})();
