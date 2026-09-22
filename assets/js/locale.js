/* Shared Arabic UI copy for dynamic and repeated chrome. Loaded by Arabic routes only. */
(function () {
  if (document.documentElement.lang !== "ar") return;

  const text = {
    "Home": "الرئيسية",
    "About Us": "من نحن",
    "Projects": "المشروعات",
    "Certificates": "الشهادات",
    "Services": "خدماتنا",
    "Products": "المنتجات",
    "Contact Us": "تواصل معنا",
    "Our Location": "موقعنا",
    "Download Catalog": "تحميل الكتالوج",
    "Search Results": "نتائج البحث",
    "Categories": "الفئات",
    "Featured Items": "منتجات مميزة",
    "All Products": "جميع المنتجات",
    "Related Products": "منتجات ذات صلة",
    "Back to products": "العودة إلى المنتجات",
    "Subscribe": "اشترك",
    "Click here": "اضغط هنا",
    "Get in Touch": "تواصل معنا",
    "Building Better Water Networks Starts Here.": "نبني شبكات مياه أفضل، من هنا تبدأ الحلول."
  };

  function translateNode(node) {
    const value = node.nodeValue;
    const key = value.trim();
    if (!text[key]) return;
    node.nodeValue = value.replace(key, text[key]);
  }

  function translateStaticCopy() {
    const arabicRoutes = new Set([
      "index.html", "about-us.html", "services.html", "projects.html",
      "certificates.html", "contact-us.html", "product-catalog.html",
      "product-detail.html", "search.html"
    ]);
    document.querySelectorAll("a[href], form[action]").forEach((element) => {
      const attribute = element.tagName === "FORM" ? "action" : "href";
      const raw = element.getAttribute(attribute);
      if (!raw || raw.startsWith("#") || /^(?:https?:|mailto:|tel:)/.test(raw)) return;
      const [path, suffix = ""] = raw.split(/(?=[?#])/);
      if (arabicRoutes.has(path)) element.setAttribute(attribute, "ar/" + path + suffix);
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        return parent && !parent.closest("script, style, noscript, table, .spec-table")
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateNode);

    document.querySelectorAll("input[placeholder]").forEach((input) => {
      if (input.placeholder === "Type words then press Enter") input.placeholder = "اكتب كلمات البحث ثم اضغط Enter";
      if (input.placeholder === "Your Email Address ") input.placeholder = "بريدك الإلكتروني";
      if (input.placeholder === "Search anything...") input.placeholder = "ابحث عن منتج...";
    });

    const backLink = document.getElementById("backLink");
    if (backLink) {
      backLink.href = "ar/product-catalog.html";
      backLink.textContent = "العودة إلى المنتجات";
    }
  }

  document.addEventListener("DOMContentLoaded", translateStaticCopy);
  if (document.readyState !== "loading") translateStaticCopy();
})();
