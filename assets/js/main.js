/*---------------------------
      Table of Contents
    --------------------
    
    01- Mobile Menu
    02- Sticky Navbar
    03- Module Search 
    04- Scroll Top Button
    05- Equal Height Elements
    06- Set Background-img to section 
    07- Add active class to accordions
    08- Load More Items
    09 - Add Animation to About Img
    10- Owl Carousel
    11- Popup Video
    12- CounterUp
    13- Projects Filtering and Sorting
     
 ----------------------------*/

//   <!-- JavaScript to manage the loading state -->
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader-container");
  // Add the class that triggers the CSS fade-out transition
  preloader.classList.add("loader-hidden");
});

$(function () {
  "use strict";

  // Global variables
  var $win = $(window);

  /*==========   Language Switcher   ==========*/
  // The Arabic site is a parallel static tree at /ar/. Deriving its target from
  // the current filename keeps deep links, product IDs, search queries and hash
  // anchors intact without hard-coding every page here.
  function addLanguageSwitcher() {
    if (document.querySelector(".language-switcher")) return;

    var html = document.documentElement;
    var isArabic =
      html.getAttribute("dir") === "rtl" ||
      (html.getAttribute("lang") || "").toLowerCase().indexOf("ar") === 0;
    var pathname = window.location.pathname;
    var filename = pathname.substring(pathname.lastIndexOf("/") + 1);

    if (!filename || !/\.html$/i.test(filename)) filename = "index.html";

    var suffix = window.location.search + window.location.hash;
    var languageLinks = {
      en: (isArabic ? "../" : "") + filename + suffix,
      ar: "ar/" + filename + suffix
    };
    var labels = isArabic
      ? { trigger: "اللغة", en: "الإنجليزية", ar: "العربية" }
      : { trigger: "Language", en: "English", ar: "Arabic" };
    var targetLanguage = isArabic ? "en" : "ar";

    function createDesktopSwitcher() {
      var item = document.createElement("li");
      item.className = "nav__item with-dropdown language-switcher language-switcher--desktop d-none d-lg-block";

      var toggle = document.createElement("button");
      toggle.className = "language-switcher__toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-haspopup", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<span class="language-switcher__label">' + labels.trigger + '</span><i class="fa fa-angle-down" aria-hidden="true"></i>';

      var menu = document.createElement("ul");
      menu.className = "dropdown-menu language-switcher__menu list-unstyled";
      menu.setAttribute("role", "menu");

      ["en", "ar"].forEach(function (language) {
        var menuItem = document.createElement("li");
        menuItem.className = "nav__item";
        var link = document.createElement("a");
        link.className = "nav__item-link";
        link.href = languageLinks[language];
        link.lang = language;
        link.hreflang = language;
        link.textContent = labels[language];
        link.setAttribute("role", "menuitem");
        if ((isArabic && language === "ar") || (!isArabic && language === "en")) {
          link.setAttribute("aria-current", "page");
        }
        menuItem.appendChild(link);
        menu.appendChild(menuItem);
      });

      toggle.addEventListener("click", function () {
        var isOpen = item.classList.toggle("language-switcher--open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });

      toggle.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          item.classList.remove("language-switcher--open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });

      document.addEventListener("click", function (event) {
        if (!item.contains(event.target)) {
          item.classList.remove("language-switcher--open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });

      item.appendChild(toggle);
      item.appendChild(menu);
      return item;
    }

    function createMobileHeaderSwitcher() {
      var item = document.createElement("div");
      item.className = "language-switcher language-switcher--mobile-header d-lg-none";

      var toggle = document.createElement("button");
      toggle.className = "module__btn language-switcher__toggle";
      toggle.type = "button";
      toggle.setAttribute("aria-haspopup", "true");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<span class="language-switcher__label">' + (isArabic ? "اللغة" : "Lang") + '</span><i class="fa fa-angle-down" aria-hidden="true"></i>';

      var menu = document.createElement("ul");
      menu.className = "dropdown-menu language-switcher__menu list-unstyled";
      menu.setAttribute("role", "menu");

      ["en", "ar"].forEach(function (language) {
        var menuItem = document.createElement("li");
        menuItem.className = "nav__item";
        var link = document.createElement("a");
        link.className = "nav__item-link";
        link.href = languageLinks[language];
        link.lang = language;
        link.hreflang = language;
        link.textContent = labels[language];
        link.setAttribute("role", "menuitem");
        if ((isArabic && language === "ar") || (!isArabic && language === "en")) {
          link.setAttribute("aria-current", "page");
        }
        menuItem.appendChild(link);
        menu.appendChild(menuItem);
      });

      toggle.addEventListener("click", function () {
        var isOpen = item.classList.toggle("language-switcher--open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });

      document.addEventListener("click", function (event) {
        if (!item.contains(event.target)) {
          item.classList.remove("language-switcher--open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });

      item.appendChild(toggle);
      item.appendChild(menu);
      return item;
    }

    var desktopList = document.querySelector(".modules__btns-list");
    if (desktopList) {
      desktopList.appendChild(createDesktopSwitcher());
    }

    var mobileSearch = document.querySelector(
      ".navbar > .container-fluid > .module__btn-search.d-lg-none"
    );
    if (mobileSearch) {
      mobileSearch.parentNode.insertBefore(createMobileHeaderSwitcher(), mobileSearch);
    }
  }

  addLanguageSwitcher();

  /*==========   Mobile Menu   ==========*/
  var $navToggler = $(".navbar-toggler");
  $navToggler.on("click", function () {
    $(this).toggleClass("actived");
  });
  $navToggler.on("click", function () {
    $(".navbar-collapse").toggleClass("menu-opened");
  });

  /*==========   Sticky Navbar   ==========*/
  $win.on("scroll", function () {
    if ($win.width() >= 992) {
      var $navbar = $(".sticky-navbar");
      if ($win.scrollTop() > 80) {
        $navbar.addClass("fixed-navbar");
      } else {
        $navbar.removeClass("fixed-navbar");
      }
    }
  });

  // my
  const header = document.getElementById("header");
  const logo = document.querySelectorAll(".navbar-brand img");

  window.addEventListener("scroll", () => {
    const scroll = Math.min(window.scrollY, 120);

    // const size = 86 - scroll * 0.17;
    const size = 86;

    logo.forEach((img) => {
      img.style.height = size + "px";
    });

    if (window.scrollY > 80) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  /*==========  Module Search   ==========*/
  var $moduleBtnSearch = $(".module__btn-search"),
    $moduleSearchContainer = $(".module__search-container");
  // Show Module Search
  $moduleBtnSearch.on("click", function (e) {
    e.preventDefault();
    $moduleSearchContainer
      .toggleClass("active", "inActive")
      .removeClass("inActive");
  });
  // Close Module Search
  $(".close-search").on("click", function () {
    $moduleSearchContainer.removeClass("active").addClass("inActive");
  });

  /*==========   Scroll Top Button   ==========*/
  var $scrollTopBtn = $("#scrollTopBtn");
  // Show Scroll Top Button
  $win.on("scroll", function () {
    if ($(this).scrollTop() > 700) {
      $scrollTopBtn.addClass("actived");
    } else {
      $scrollTopBtn.removeClass("actived");
    }
  });
  // Animate Body after Clicking on Scroll Top Button
  $scrollTopBtn.on("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      500,
    );
  });

  /*==========   Equal Height Elements   ==========*/
  var maxHeight = 0;
  $(".equal-height").each(function () {
    if ($(this).height() > maxHeight) {
      maxHeight = $(this).height();
    }
  });
  $(".equal-height").height(maxHeight);

  /*==========   Set Background-img to section   ==========*/
  $(".bg-img").each(function () {
    var imgSrc = $(this).children("img").attr("src");
    $(this)
      .parent()
      .css({
        "background-image": "url(" + imgSrc + ")",
        "background-size": "cover",
        "background-position": "center",
      });
    $(this).parent().addClass("bg-img");
    $(this).remove();
  });

  /*==========   Add active class to accordions   ==========*/
  $(".accordion__item-header").on("click", function () {
    $(this).parent(".accordion-item").addClass("opened");
    $(this).parent(".accordion-item").siblings().removeClass("opened");
  });
  $(".accordion__item-title").on("click", function (e) {
    e.preventDefault();
  });

  /*==========   Load More Items  ==========*/
  function loadMore(loadMoreBtn, loadedItem) {
    $(loadMoreBtn).on("click", function (e) {
      e.preventDefault();
      $(this).fadeOut();
      $(loadedItem).fadeIn();
    });
  }

  loadMore(".loadMoreBlog", ".hidden-blog-item");
  loadMore(".loadMoreServices", ".hidden-service");
  loadMore(".loadMoreProjects", ".project-hidden > .project-item");

  /*==========   Add Animation to About Img ==========*/
  if ($win.width() >= 992) {
    if ($(".about-2").length > 0) {
      $(window).on("scroll", function () {
        var aboutOffset = $(".about").offset().top - 300,
          aboutHight = $(this).outerHeight(),
          winScrollTop = $(window).scrollTop();
        if (
          winScrollTop > aboutOffset - 1 &&
          winScrollTop < aboutOffset + aboutHight - 1
        ) {
          $(".about__img").addClass("animated-img");
        }
      });
    }
  } else {
    $(".about__img").addClass("animated-img");
  }

  /*==========   Owl Carousel  ==========*/
  $(".carousel").each(function () {
    $(this).owlCarousel({
      nav: $(this).data("nav"),
      dots: $(this).data("dots"),
      loop: $(this).data("loop"),
      margin: $(this).data("space"),
      center: $(this).data("center"),
      dotsSpeed: $(this).data("speed"),
      autoplay: $(this).data("autoplay"),
      transitionStyle: $(this).data("transition"),
      animateOut: $(this).data("animate-out"),
      animateIn: $(this).data("animate-in"),
      rtl: document.documentElement.dir === "rtl",
      autoplayTimeout: 4000,
      responsive: {
        0: {
          items: 1,
        },
        400: {
          items: $(this).data("slide-sm"),
        },
        700: {
          items: $(this).data("slide-md"),
        },
        1000: {
          items: $(this).data("slide"),
        },
      },
    });
  });

  // Owl Carousel With Thumbnails
  $(".thumbs-carousel").owlCarousel({
    thumbs: true,
    thumbsPrerendered: true,
    loop: true,
    margin: 0,
    autoplay: $(this).data("autoplay"),
    nav: $(this).data("nav"),
    dots: $(this).data("dots"),
    dotsSpeed: $(this).data("speed"),
    transitionStyle: $(this).data("transition"),
    animateOut: $(this).data("animate-out"),
    animateIn: $(this).data("animate-in"),
    rtl: document.documentElement.dir === "rtl",
    autoplayTimeout: 15000,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });

  /*==========  Popup Video  ==========*/
  $(".popup-video").magnificPopup({
    mainClass: "mfp-fade",
    removalDelay: 0,
    preloader: false,
    fixedContentPos: false,
    type: "iframe",
    iframe: {
      markup:
        '<div class="mfp-iframe-scaler">' +
        '<div class="mfp-close"></div>' +
        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
        "</div>",
      patterns: {
        youtube: {
          index: "youtube.com/",
          id: "v=",
          src: "//www.youtube.com/embed/%id%?autoplay=1",
        },
      },
      srcAction: "iframe_src",
    },
  });

  /*==========   counterUp  ==========*/
  $(".counter").counterUp({
    delay: 10,
    time: 500,
  });

  /*==========   Projects Filtering and Sorting  ==========*/
  $("#filtered-items-wrap").mixItUp();
  $(".projects-filter li a").on("click", function (e) {
    e.preventDefault();
  });

  // Project cards are informational only; their placeholder links have no destination.
  $(".projects-grid .project__title a, .projects-grid .project__cat a").on(
    "click",
    function (e) {
      e.preventDefault();
    },
  );
});

document.querySelector(".read-more-btn").addEventListener("click", function () {
  document.querySelector(".hidden-text").classList.add("show");
  this.style.display = "none";
});

// preloader

document.addEventListener("DOMContentLoaded", function () {
  const video = document.querySelector("#preloader-container video");

  video.muted = true;
  video.playsInline = true;

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      document.addEventListener("touchstart", () => video.play(), {
        once: true,
      });
    });
  }
});
