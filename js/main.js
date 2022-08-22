// #region helpers
// Служебные переменные

const debounce = function (fn, time) {
  let timeout;

  return function () {
    let self = this;
    const functionCall = function () {
      return fn.apply(self, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

// eslint-disable-next-line no-unused-vars
const d = document;
const body = document.querySelector("body");

// Служебные функции

function find(selector) {
  return document.querySelector(selector);
}

// eslint-disable-next-line no-unused-vars
function findAll(selectors) {
  return document.querySelectorAll(selectors);
}

// Удаляет у всех элементов items класс itemClass
// eslint-disable-next-line no-unused-vars
function removeAll(items, itemClass) {
  if (typeof items == "string") {
    items = document.querySelectorAll(items);
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.classList.remove(itemClass);
  }
}

//#region PlatformDetect
// Get os class for body. It used to fix macos scrollbar issue
let os = "Unknown";
if (navigator.appVersion.indexOf("Win") != -1) os = "windows";
if (navigator.appVersion.indexOf("Mac") != -1) os = "macos";
if (navigator.appVersion.indexOf("X11") != -1) os = "unix";
if (navigator.appVersion.indexOf("Linux") != -1) os = "linux";
document.body.classList.add("os-" + os);

//#endregion PlatformDetect
function bodyLock(con) {
  let scrollFix = window.innerWidth - document.body.clientWidth;
  if (con === true) {
    document.body.classList.add("_lock");
    if (scrollFix > 17) {
      scrollFix = 17;
    }
    document.body.style.paddingRight = scrollFix + "px";
  } else if (con === false) {
    document.body.classList.remove("_lock");
    document.body.style.paddingRight = 0;
  } else if (con === undefined) {
    if (!body.classList.contains("_lock")) {
      document.body.classList.add("_lock");
      document.body.style.paddingRight = scrollFix;
    } else {
      document.body.classList.remove("_lock");
      document.body.style.paddingRight = 0;
    }
  } else {
    console.error("Неопределенный аргумент у функции bodyLock()");
  }
}

// Валидация формы
function validationForm() {
  const name = find("#user_name");
  const phone = find("#user_phone");
  const email = find("#user_email");

  let con = true;

  for (let i = 0; i < [name, phone, email].length; i++) {
    const elem = [name, phone, email][i];
    const elemValue = elem.value.trim();

    if (elemValue === "") {
      elem.classList.add("_error");
      con = false;
    } else {
      elem.classList.remove("_error");
      con = true;
    }
  }

  return con;
}

// Отправка формы
// eslint-disable-next-line no-unused-vars
function sumbitForm() {
  const form = find(".modal__form");

  form.addEventListener("submit", async (e) => {
    const modal = find(".modal._show");
    const btnSend = form.querySelector("[type=submit]");
    btnSend.classList.add("send-preloader");

    e.preventDefault();

    let con = validationForm();

    if (con === true) {
      const formData = new FormData();
      const action = form.getAttribute("action");

      let response = await fetch(action, {
        method: "POST",
        body: formData,
      });

      // settimeout здесь для того, чтобы показать работу отправки формы. В дальнейшем это нужно убрать
      setTimeout(() => {
        if (response.ok) {
          console.log("Successful");
          form.reset();

          modal.classList.remove("_show");
          find("#send-done").classList.add("_show");
          btnSend.classList.remove("send-preloader");
        } else {
          console.log("Error");
          form.reset();

          modal.classList.remove("_show");
          find("#send-error").classList.add("_show");
          btnSend.classList.remove("send-preloader");
        }
      }, 2000);
    }
  });
}

// Мобильное меню
// menu()
// eslint-disable-next-line no-unused-vars
function menu() {
  const burger = find(".burger");
  const menu = find(".menu");

  // Высота меню
  window.addEventListener("resize", () => {
    const headerHeight = find(".header").clientHeight;

    if (window.innerWidth <= 768) {
      menu.style.paddingTop = headerHeight + "px";
    } else {
      menu.style.paddingTop = 0;
    }
  });

  burger.addEventListener("click", (e) => {
    e;
    burger.classList.toggle("burger_close");
    menu.classList.toggle("_show");
    bodyLock();
  });
}

// const swiper = new Swiper(".swiper-container", {
//   slidesPerView: 1, // Кол-во показываемых слайдов
//   spaceBetween: 0, // Расстояние между слайдами
//   loop: true, // Бесконечный слайдер
//   freeMode: true, // Слайдеры не зафиксированны
//   centeredSlides: false, // Размещать слайдеры по центру

//   autoplay: {
//     // автопрокрутка
//     delay: 5000, // задержка
//   },

//   breakpoints: {
//     1200: {},
//     700: {},
//     400: {},
//   },

//   pagination: {
//     el: ".swiper-pagination",
//   },

//   navigation: {
//     nextEl: ".swiper__arrow-next",
//     prevEl: ".swiper__arrow-prev",
//   },

//   scrollbar: {
//     el: ".swiper-scrollbar",
//   },
// });

// Функции для модальных окон
modal();
function modal() {
  // Открытие модальных окон при клике по кнопке
  openModalWhenClickingOnBtn();
  function openModalWhenClickingOnBtn() {
    const btnsOpenModal = document.querySelectorAll("[data-modal-open]");

    for (let i = 0; i < btnsOpenModal.length; i++) {
      const btn = btnsOpenModal[i];

      btn.addEventListener("click", (e) => {
        e;
        const dataBtn = btn.dataset.modalOpen;
        const modal = document.querySelector(`#${dataBtn}`);

        openModal(modal);
        window.location.hash = dataBtn;
      });
    }
  }

  // Открытие модального окна, если в url указан его id
  openModalHash();
  function openModalHash() {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const modal = document.querySelector(`.modal#${hash}`);

      if (modal) openModal(modal);
    }
  }

  // Показываем/убираем модальное окно при изменения хеша в адресной строке
  checkHash();
  function checkHash() {
    window.addEventListener("hashchange", (e) => {
      e;
      const hash = window.location.hash;
      const modal = document.querySelector(`.modal${hash}`);

      if (find(".modal._show")) find(".modal._show").classList.remove("_show");
      if (modal && hash != "") openModal(modal);
    });
  }

  // Закрытие модального окна при клике по заднему фону
  closeModalWhenClickingOnBg();
  function closeModalWhenClickingOnBg() {
    document.addEventListener("click", (e) => {
      const target = e.target;
      const modal = document.querySelector(".modal._show");

      if (modal && target.classList.contains("modal__body")) closeModal(modal);
    });
  }

  // Закрытие модальных окон при клике по крестику
  closeModalWhenClickingOnCross();
  function closeModalWhenClickingOnCross() {
    const modalElems = document.querySelectorAll(".modal");
    for (let i = 0; i < modalElems.length; i++) {
      const modal = modalElems[i];
      const closeThisModal = modal.querySelector(".modal__close");

      closeThisModal.addEventListener("click", () => {
        closeModal(modal);
      });
    }
  }

  // Закрытие модальных окон при нажатии по клавише ESC
  closeModalWhenClickingOnESC();
  function closeModalWhenClickingOnESC() {
    const modalElems = document.querySelectorAll(".modal");
    for (let i = 0; i < modalElems.length; i++) {
      const modal = modalElems[i];

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal(modal);
      });
    }
  }

  // Сброс id модального окна в url
  function resetHash() {
    const windowTop = window.pageYOffset;
    window.location.hash = "";
    window.scrollTo(0, windowTop);
  }

  // Открытие модального окна
  function openModal(modal) {
    modal.classList.add("_show");
    bodyLock(true);
  }

  // Закрытие модального окна
  function closeModal(modal) {
    modal.classList.remove("_show");
    bodyLock(false);
    resetHash();
  }
}
// Сброс id модального окна в url
function resetHash() {
  const windowTop = window.pageYOffset;
  window.location.hash = "";
  window.scrollTo(0, windowTop);
}

function openModal(modal) {
  modal.classList.add("_show");
  bodyLock(true);
}

// Закрытие модального окна
function closeModal(modal) {
  modal.classList.remove("_show");
  bodyLock(false);
  resetHash();
}

const modalClosers = document.querySelectorAll("[data-modal-close]");
modalClosers.forEach((button) => {
  button.addEventListener("click", () => {
    const modalId = button.dataset.modalClose;
    const modal = document.querySelector(`#${modalId}`);
    closeModal(modal);
  });
});

// #endregion helpers

// #region featured-slider

let isStarterSlide = true;
function indicateAutoplaySlider(slider) {
  let autoplayInterval = "";

  let timingModifier = 400;

  const currentBullet = slider.el.querySelector(
    `.swiper-pagination-bullet-active`
  );
  const paginationPercentage = document.createElement("span");
  paginationPercentage.classList.add("featured-slider-bullet__percentage");
  currentBullet.append(paginationPercentage);
  let currentInterval = 0;
  if (isStarterSlide) {
    timingModifier = 1200;
    isStarterSlide = false;
  } else {
    timingModifier = 210;
  }
  autoplayInterval = setInterval(() => {
    // if (!slider.autoplay.paused) {
    currentInterval += 200;
    const percentage =
      (currentInterval / (slider.params.autoplay.delay - timingModifier)) * 100;
    paginationPercentage.style.width = `${percentage}%`;
    if (currentInterval >= slider.params.autoplay.delay) {
      clearInterval(autoplayInterval);
      setTimeout(() => {
        paginationPercentage.remove();
      }, 100);
    }
    // }
  }, 200);
}
window.addEventListener("DOMContentLoaded", () => {
  const featuredSlider = document.querySelector(".featured-slider");
  if (featuredSlider) {
    // eslint-disable-next-line no-unused-vars, no-undef
    let featuredSlider = new Swiper(".featured-slider", {
      speed: 350,
      spaceBetween: 20,
      slidesPerView: 1,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      },
      // grabCursor: true,
      pagination: {
        el: ".featured-slider__pagination",
        clickable: true,
      },
    });
    featuredSlider.autoplay.stop();
    setTimeout(() => {
      featuredSlider.autoplay.start();
      indicateAutoplaySlider(featuredSlider);
    }, 200);
    featuredSlider.on("slideChange", () => {
      indicateAutoplaySlider(featuredSlider);
    });
  }
});
// #endregion featured-slider

// #region tabs
/**
 * @tabs
 *
 * Табы инициируются все
 * У какой кнопки таба есть класс из js переменной TAB_ACTIVE_CLASS, тот таб и будет активным сразу
 */
const tabsBars = document.querySelectorAll(".tabs");
const tabsPagesWraps = document.querySelectorAll(".tabs-content");
const TAB_ACTIVE_CLASS = "tab--active";
const TAB_ANIMATED_CLASS = "tab--animated";

// Добавляем активное состояние для табов, чтоб инициализировать Swiper
tabsBars.forEach((tabsBar) => {
  if (tabsBar.dataset.tabs) {
    tabsPagesWraps.forEach((tabsPagesWrap) => {
      const tabPages = tabsPagesWrap.querySelectorAll(".tabs-page");
      tabPages.forEach((tabPage) => {
        tabPage.classList.add(TAB_ACTIVE_CLASS);
        // tabPage.classList.add(TAB_ANIMATED_CLASS);
      });
    });
  }
});

// Задержка нужна, чтобы Swiper слайдеры не разъезжались
setTimeout(() => {
  tabsBars.forEach((tabsBar) => {
    const tabBarButtons = tabsBar.querySelectorAll(".tab");
    let clickedCount = 0;
    tabBarButtons.forEach((tabButton, buttonIndex) => {
      tabButton.addEventListener("click", () => {
        if (clickedCount != 0) {
          //
        } else {
          clickedCount++;
        }
        tabBarButtons.forEach((tab) => {
          tab.classList.remove(TAB_ACTIVE_CLASS);
        });
        tabButton.classList.add(TAB_ACTIVE_CLASS);
        if (tabsBar.dataset.tabs) {
          const tabPages = document
            .querySelector(`.tabs-content[data-tabs="${tabsBar.dataset.tabs}"]`)
            .querySelectorAll(".tabs-page");

          if (tabPages[buttonIndex]) {
            tabPages.forEach((tabPage, tabIndex) => {
              if (tabIndex !== buttonIndex) {
                tabPage.classList.remove(TAB_ANIMATED_CLASS);
                // setTimeout(() => {
                tabPage.classList.remove(TAB_ACTIVE_CLASS);
                // }, 10);
              }
            });
            tabPages[buttonIndex].classList.add(TAB_ACTIVE_CLASS);
            setTimeout(() => {
              tabPages[buttonIndex].classList.add(TAB_ANIMATED_CLASS);
            }, 60);
          }
        } else {
          // console.warn(
          //   `there is no tab pages [data-tab="${tabsBar.dataset.tabs}"]`
          // );
        }
      });
    });

    if (tabsBar.dataset.tabs) {
      tabBarButtons.forEach((tabButton) => {
        if (tabButton.classList.contains(TAB_ACTIVE_CLASS)) {
          tabButton.click();
        }
      });
    }
  });
}, 150);

const filtersButtons = document.querySelectorAll(".js_tabs-filters .tab");
const closableArea = 28;
filtersButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (
      button.classList.contains("tab--active") &&
      !button.classList.contains("chips--date")
    ) {
      setTimeout(() => {
        if (button.getBoundingClientRect().width - e.offsetX < closableArea) {
          button.classList.remove("tab--active");
          button.classList.remove("calendar--active");
        }
      }, 10);
    }
  });
});
// #endregion tabs

// #region sliders
/**
 * @sliders
 */

const newsSliderSettings = {
  slidesPerView: "auto",
  slidesPerGroup: 1,
  spaceBetween: 24,
  grabCursor: true,
  pagination: {
    el: ".news-slider__pagination",
    clickable: true,
  },
  breakpoints: {
    1100: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
    576: {
      slidesPerGroup: 2,
    },
  },
};

function initSlider(slider) {
  // eslint-disable-next-line no-undef, no-unused-vars
  console.log(slider.selector);
  return new Swiper(slider.selector, slider.options);
}
// eslint-disable-next-line no-undef, no-unused-vars
function removeSlider(slider) {
  // eslint-disable-next-line no-undef, no-unused-vars
  slider.swiper.destroy();
}

let newsSliders = document.querySelectorAll(".news-slider");
if (newsSliders) {
  let newsSliderClass = ".news-slider";
  let newsSlider = {
    selector: newsSliderClass,
    options: newsSliderSettings,
    sliders: document.querySelectorAll(newsSliderClass),
  };

  if (window.innerWidth > 575) {
    newsSlider.sliders.forEach((slider) => {
      if (
        !slider.querySelector("div").classList.value.includes("swiper-wrapper")
      ) {
        slider.querySelector("div").classList.add("swiper-wrapper");
      }
    });
    initSlider(newsSlider);
  } else {
    newsSlider.sliders.forEach((slider) => {
      const wrapper = slider.querySelector(".swiper-wrapper");
      wrapper.classList.remove("swiper-wrapper");
      wrapper.classList.add("swiper-wrapper-removed");
    });
  }

  window.addEventListener("resize", () => {
    debounce(() => {
      console.log("resize");
      removeSlider(newsSlider);
      initSlider(newsSlider);
    }, 1000);
  });
}
// #endregion sliders

// #region theme-picker
/**
 *
 * @theme-picker
 *
 */

const lightStyles = document.querySelectorAll(
  "link[rel=stylesheet][media*=prefers-color-scheme][media*=light]"
);
const darkStyles = document.querySelectorAll(
  "link[rel=stylesheet][media*=prefers-color-scheme][media*=dark]"
);
const darkSchemeMedia = matchMedia("(prefers-color-scheme: dark)");
const themeSwitchers = document.querySelectorAll(".tab--theme");

function setupSwithcer() {
  const savedScheme = getSavedScheme();

  [...themeSwitchers].forEach((switcher) => {
    switcher.addEventListener("click", () => {
      setScheme(switcher.dataset.theme);
    });
  });

  if (savedScheme !== null) {
    const currentButton = document.querySelector(
      `.tab--theme[data-theme="${savedScheme}"]`
    );
    if (currentButton) {
      setScheme(savedScheme);
      currentButton.parentElement
        .querySelectorAll(".tab")
        .forEach((tab) => tab.classList.remove("tab--active"));
      currentButton.classList.add("tab--active");
    }
    return;
  }

  const systemScheme = getSystemScheme();
  const systemSchemeButton = document.querySelector(
    `.tab--theme[data-theme="${systemScheme}"]`
  );
  systemSchemeButton.parentElement.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("tab--active");
  });
  systemSchemeButton.classList.add("tab--active");
  setScheme(systemScheme);
}

function showDocument() {
  document.documentElement.classList.add("page--loaded");
  document.documentElement.style.display = "";
}

function setScheme(scheme) {
  switchMedia(scheme);

  if (scheme === "auto") {
    clearScheme();
  } else {
    saveScheme(scheme);
  }
}

function switchMedia(scheme) {
  let lightMedia;
  let darkMedia;

  if (scheme === "auto") {
    lightMedia = "(prefers-color-scheme: light)";
    darkMedia = "(prefers-color-scheme: dark)";
  } else {
    lightMedia = scheme === "light" ? "all" : "not-all";
    darkMedia = scheme === "dark" ? "all" : "not-all";
  }

  [...lightStyles].forEach((link) => {
    link.media = lightMedia;
  });
  [...darkStyles].forEach((link) => {
    link.media = darkMedia;
  });

  document.body.classList.remove("theme--auto", "theme--dark", "theme--light");
  document.body.classList.add(`theme--${scheme}`);
}

function setupScheme() {
  const savedScheme = getSavedScheme();
  const systemScheme = getSystemScheme();

  if (savedScheme === null) return;

  if (savedScheme !== systemScheme) {
    setScheme(savedScheme);
  }
}

function getSystemScheme() {
  const darkScheme = darkSchemeMedia.matches;
  return darkScheme ? "dark" : "light";
}

function getSavedScheme() {
  return localStorage.getItem("color-scheme");
}
function saveScheme(scheme) {
  localStorage.setItem("color-scheme", scheme);
}
function clearScheme() {
  localStorage.removeItem("color-scheme");
}
setupSwithcer();
setupScheme();

// #endregion theme-picker

// #region burger
const burgerButton = document.querySelector(".burger");
const headerMenu = document.querySelector(".menu");

const searchButton = document.querySelector(".header__button-search");

function isMenuOpened() {
  return headerMenu.classList.contains("menu--opened");
}
function openMenu() {
  headerMenu.classList.add("menu--opened");
  bodyLock(true);
}
function closeMenu() {
  headerMenu.classList.remove("menu--opened");
  bodyLock(false);
}

function isBurgerOpened() {
  return headerMenu.classList.contains("menu--burger");
}
function openBurger() {
  headerMenu.classList.add("menu--burger");
  burgerButton.classList.add("burger--opened");
}
function closeBurger() {
  headerMenu.classList.remove("menu--burger");
  burgerButton.classList.remove("burger--opened");
}

function isSearchOpened() {
  return headerMenu.classList.contains("menu--search");
}
function closeSearch() {
  searchButton.classList.remove("active");
  headerMenu.classList.remove("menu--search");
}
function openSearch() {
  searchButton.classList.add("active");
  headerMenu.classList.add("menu--search");
}

if (burgerButton && headerMenu) {
  burgerButton.addEventListener("click", () => {
    if (isBurgerOpened()) {
      closeMenu();
      closeBurger();
    } else {
      openMenu();
      openBurger();
      isSearchOpened() ? closeSearch() : false;
    }
  });
  window.addEventListener("click", (e) => {
    if (isMenuOpened()) {
      if (e.target == headerMenu.querySelector(".menu__sticky")) {
        closeMenu();
        closeBurger();
      }
    }
  });

  searchButton.addEventListener("click", () => {
    if (isSearchOpened()) {
      closeMenu();
      closeSearch();
    } else {
      openMenu();
      openSearch();
      isBurgerOpened() ? closeBurger() : false;
    }
  });
}
// #endregion burger

// #region detailed-slider
const detailedSliders = document.querySelectorAll(".detailed-slider");

window.addEventListener("DOMContentLoaded", () => {
  detailedSliders.forEach((slider, index) => {
    slider.classList.add(`detailed-slider-${index}`);

    // eslint-disable-next-line no-undef
    let detailedSlides = new Swiper(
      `.detailed-slider-${index} .detailed-slider__slides`,
      {
        spaceBetween: 20,
      }
    );
    // eslint-disable-next-line no-unused-vars, no-undef
    let detailedThumbs = new Swiper(
      `.detailed-slider-${index} .detailed-slider__thumbs`,
      {
        // grabCursor: true,
        spaceBetween: 8,
        slidesPerView: "auto",
        slidesPerGroup: 1,
        allowTouchMove: false,
      }
    );

    const thumbs = document.querySelectorAll(
      `.detailed-slider-${index} .detailed-slider__thumbs .swiper-slide`
    );
    thumbs[0].classList.add("detailed-slider__slide--active");
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => {
        detailedSlides.slideTo(index);
        thumbs.forEach((thumb) => {
          thumb.classList.remove("detailed-slider__slide--active");
        });
        thumb.classList.add("detailed-slider__slide--active");
      });
    });
    detailedSlides.on("slideChange", () => {
      detailedThumbs.slideTo(detailedSlides.activeIndex);
      thumbs.forEach((thumb) => {
        thumb.classList.remove("detailed-slider__slide--active");
      });
      thumbs[detailedSlides.activeIndex].classList.add(
        "detailed-slider__slide--active"
      );
    });
  });
});
// #endregion detailed-slider

/**
 *
 * Form
 *
 */

// #region validate
function validateInput(input) {
  const field = input.querySelector("input");
  if (field.type == "tel") {
    return validatePhone(input);
  } else if (field.type == "email") {
    return validateEmail(input);
  } else if (input.classList.contains("input--dropdown ")) {
    validateDropdown(input);
  } else {
    return validateInputLength(input);
  }
}
function validateInputLength(input) {
  const field = input.querySelector("input");
  console.log(field.value);
  if (field.value.length == 0) {
    input.classList.add("input--invalid");
    return false;
  } else {
    input.classList.remove("input--invalid");
    return true;
  }
}
function validatePhone(input) {
  const field = input.querySelector(".input__field");
  let regex = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
  if (!regex.test(field.value)) {
    input.classList.add("input--invalid");
    console.log("phone invalid");
    return false;
  } else {
    input.classList.remove("input--invalid");
    console.log("phone valid");
    return true;
  }
}
function validateEmail(input) {
  const field = input.querySelector(".input__field");
  let regex =
    // eslint-disable-next-line no-control-regex
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  if (!regex.test(field.value)) {
    input.classList.add("input--invalid");
    console.log("email invalid");
    return false;
  } else {
    input.classList.remove("input--invalid");
    console.log("email valid");
    return true;
  }
}

function validateDropdown(input) {
  const field = input.querySelector("input");
  const label = input.querySelector("label");

  if (field.value == label.innerText) {
    input.classList.add("input--invalid");
    return false;
  } else {
    input.classList.remove("input--invalid");
    return true;
  }
}
// #endregion validate

const eventsThanks = document.querySelector("#events-thanks");
const formError = document.querySelector("#form-error");
const formsList = document.querySelectorAll("form");
formsList.forEach((form) => {
  // console.log("form");
  form.addEventListener("submit", async (event) => {
    console.log(form);
    event.preventDefault();

    form.querySelectorAll(".input").forEach((input) => {
      validateInput(input);
    });

    if ([...document.querySelectorAll(".input--invalid")].length === 0) {
      if (eventsThanks) {
        openModal(eventsThanks);
      }
    } else {
      if (formError) {
        openModal(formError);
      }
    }

    // let response = await fetch(
    //   window.location.origin + "/wp-content/themes/c21/send.php",
    //   {
    //     method: "POST",
    //     body: new URLSearchParams(new FormData(form)),
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   }
    // );
    // let result = await response.json();
    // console.log(result);
  });
});

// #region input-labels
const inputs = document.querySelectorAll(".input");

const inputClasses = {
  invalid: "input--invalid",
  init: "input--init",
  active: "input--active",
  dropdown: "input--dropdown",
  activeDropdown: "input--active-dropdown",
  selectedDropdown: "input--selected-dropdown",
};

function activateInput(input) {
  input.classList.add(inputClasses.active);

  if (input.classList.contains(inputClasses.dropdown)) {
    input.classList.add(inputClasses.activeDropdown);
    setTimeout(() => {
      window.addEventListener("click", closeDropdowns);
    }, 400);
    // Скроллит чтоб всегда было видно первые варианты ответов
    // var element = input.querySelector(".input-dropdown");
    // var listEndOffset = 145;
    // var elementPosition = element.getBoundingClientRect().top;
    // var offsetPosition =
    //   elementPosition +
    //   window.pageYOffset -
    //   listEndOffset -
    //   element.getBoundingClientRect().height * 2;
    // window.scrollTo({
    //   top: offsetPosition,
    //   behavior: "smooth",
    // });
    //===
    const dropdownList = input.querySelector(".input-dropdown");
    const bound = dropdownList.getBoundingClientRect();
    const bottom = dropdownList.getBoundingClientRect().bottom;
    const height = dropdownList.getBoundingClientRect().height;
    const offset = window.innerHeight - bottom;
    console.log(bound);
    if (offset < height + 20) {
      dropdownList.style.top = "unset";
      dropdownList.style.bottom = "calc(100% + 20px) ";
    }
  }
}
function deactivateInput(input) {
  const field = input.querySelector(".input__field");
  setTimeout(() => {
    if (field.value == "") {
      input.classList.remove(inputClasses.active);
    }
    if (input.classList.contains(inputClasses.dropdown)) {
      input.classList.remove(inputClasses.activeDropdown);
    }
  }, 100);
  const dropdownList = input.querySelector(".input-dropdown");
  setTimeout(() => {
    dropdownList.style.top = "";
    dropdownList.style.bottom = "";
  }, 400);
}

function initInputs(inputs) {
  inputs.forEach((input) => {
    if (input.classList.contains(inputClasses.init)) return;
    input.classList.add(inputClasses.init);

    const field = input.querySelector(".input__field");
    // eslint-disable-next-line no-unused-vars
    const label = input.querySelector(".input__label");

    input.addEventListener("click", (e) => {
      if (!e.target.classList.contains("input__field")) return;
      if (input.classList.contains(inputClasses.activeDropdown)) {
        deactivateInput(input);
      } else {
        activateInput(input);
      }
    });

    field.addEventListener("focus", () => {
      activateInput(input);
    });
    field.addEventListener("blur", () => {
      deactivateInput(input);
    });
    field.addEventListener("input", () => {
      if (field.type != "email" || field.type != "tel") {
        validateInput(input);
      }
    });

    if (field.value !== "") {
      input.classList.add(inputClasses.active);
    }
    activateDropdown(input);
  });
}

function closeDropdowns() {
  const dropdowns = document.querySelectorAll(".input--dropdown");
  dropdowns.forEach((item) => {
    deactivateInput(item);
  });
  window.removeEventListener("click", closeDropdowns);
}
function activateDropdown(input) {
  const dropdown = input.querySelector(".input-dropdown");
  if (!dropdown) return;
  const dropdownItems = dropdown.querySelectorAll(".input-dropdown__item");
  const field = input.querySelector(".input__field");
  const realInput = input.querySelector("input[hidden]");

  dropdownItems.forEach((dropdown) => {
    dropdown.addEventListener("click", () => {
      field.innerText = dropdown.innerText;
      realInput.value = dropdown.innerText;
      setTimeout(() => {
        input.classList.remove(inputClasses.activeDropdown);
        // console.log(input.classList);
        input.classList.remove(inputClasses.invalid);
        // console.log(input.classList);
      }, 150);
      input.classList.add(inputClasses.selectedDropdown);
    });
  });

  setTimeout(() => {
    if (realInput.value != "") {
      // console.log(realInput.value);
      field.innerText = realInput.value;
      input.classList.add(inputClasses.selectedDropdown);
    }
  }, 200);
}
initInputs(inputs);

// #endregion input-labels

// #region datepicker

const calendarInputs = document.querySelectorAll(
  '.input--calendar[name="start"]'
);
const calendarInputsEnd = document.querySelectorAll(
  '.input--calendar[name="end"]'
);
if ([...calendarInputs].length > 0) {
  // eslint-disable-next-line no-undef
  Datepicker.locales.ru = {
    days: [
      "Воскресенье",
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
    ],
    daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб"],
    daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    months: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    monthsShort: [
      "Янв",
      "Фев",
      "Мар",
      "Апр",
      "Май",
      "Июн",
      "Июл",
      "Авг",
      "Сен",
      "Окт",
      "Ноя",
      "Дек",
    ],
    today: "Сегодня",
    clear: "Очистить",
    format: "dd.mm.yyyy",
    weekStart: 1,
    monthsTitle: "Месяцы",
  };
  // eslint-disable-next-line no-undef
  Object.assign(Datepicker.locales);
  calendarInputs.forEach((calendar) => {
    // eslint-disable-next-line no-unused-vars, no-undef
    const datepicker = new DateRangePicker(calendar, {
      format: "dd.mm.yyyy",
      dateDelimiter: " – ",
      language: "ru",
      allowOneSidedRange: true,
      clearBtn: true,
      inputs: [
        calendar,
        calendar.parentElement.querySelector('.input--calendar[name="end"]'),
      ],
    });
    datepicker.inputs[0].datepicker.picker.element.classList.add(
      "datepicker-picker--start"
    );
    datepicker.inputs[1].datepicker.picker.element.classList.add(
      "datepicker-picker--end"
    );
    const dateCancel = document.createElement("span");
    dateCancel.classList.add("tab--date-cancel");
    dateCancel.addEventListener("click", () => {
      dateCancel.parentElement
        .querySelectorAll("input")
        .forEach((input) => (input.value = ""));
      dateCancel.parentElement.classList.remove("tab--cancelable");
      dateCancel.parentElement.classList.remove("calendar--active");
      datepicker.inputs.forEach((input) => {
        input.datepicker.picker.element.querySelector(".clear-btn").click();
        input.datepicker.hide();
      });
      setTimeout(() => {
        // dateCancel.parentElement.querySelector(".chips__text").innerText =
        // "Дата";
        dateCancel.parentElement.classList.remove("calendar--active");
        dateCancel.parentElement.classList.remove("tab--active");
      }, 10);
    });
    calendar.parentElement.append(dateCancel);

    const chipsButtonsCalendar = document.querySelectorAll(".chips--date");
    chipsButtonsCalendar.forEach((button) => {
      button.addEventListener("click", () => {
        button.classList.add("calendar--active");
        if (button.classList.contains("tab--active")) {
          datepicker.inputs.forEach((input) => {
            input.datepicker.hide();
          });
          setTimeout(() => {
            button.classList.remove("tab--active");
            button.classList.remove("calendar--active");
          }, 200);
        }
      });
    });
  });
}
const chipsCalendarButtons = document.querySelectorAll(".chips--date");
const chipsDatepickers = [];
chipsCalendarButtons.forEach((chip) => {
  const dropdowns = [...chip.querySelectorAll(".datepicker")];
  dropdowns.forEach((dropdown) => {
    chipsDatepickers.push(dropdown);
  });
});
chipsDatepickers.forEach((datepicker) => {
  // Перемещает календари выше в доме, чтоб работало внутри горизонтально скроллящихся табов
  datepicker.parentElement.parentElement.append(datepicker);
});

function updateRangeValues(e) {
  const startInput = e.target.parentElement.querySelector('[name="start"]');
  const endInput = e.target.parentElement.querySelector('[name="end"]');

  const startValue = startInput.value;
  const endValue = endInput.value;

  let innerText = "";
  if (endValue == "") {
    innerText = startValue;
  } else {
    innerText = startValue + " – " + endValue;
    // startPicker.classList.remove("datepicker--no-transition");
    // endPicker.classList.remove("datepicker--no-transition");
  }
  e.target.parentElement.querySelector(".chips__text").innerText = innerText;
}

function handleCalendarHide(input) {
  input.addEventListener("hide", (e) => {
    const button = e.target.parentElement;
    const start = button.querySelector('input[name="start"]');
    const end = button.querySelector('input[name="end"]');
    input.dataset.closed = 1;

    if (start.value != "" || end.value != "") {
      button.classList.add("tab--cancelable");
    } else {
      button.classList.remove("tab--cancelable");
    }

    if (start.dataset.closed == 1 && end.dataset.closed == 1) {
      button.classList.remove("calendar--active");
      // button.classList.remove("tab--active");
      if (start.value == "" && end.value == "") {
        setTimeout(() => {
          button.querySelector(".chips__text").innerText = "Дата";
        }, 100);
      }
    }
  });
}

function toggleStartCalendarsTransition(e) {
  const startInput = e.target.parentElement.querySelector('[name="start"]');
  const endInput = e.target.parentElement.querySelector('[name="end"]');
  const startPicker = startInput.datepicker.element.datepicker.picker.element;
  const endPicker = endInput.datepicker.element.datepicker.picker.element;

  startPicker.classList.add("datepicker--no-transition");
  endPicker.classList.add("datepicker--no-transition");
  setTimeout(() => {
    startPicker.classList.remove("datepicker--no-transition");
  }, 700);
}
function toggleEndCalendarsTransition(e) {
  const startInput = e.target.parentElement.querySelector('[name="start"]');
  const endInput = e.target.parentElement.querySelector('[name="end"]');
  const startPicker = startInput.datepicker.element.datepicker.picker.element;
  const endPicker = endInput.datepicker.element.datepicker.picker.element;

  startPicker.classList.remove("datepicker--no-transition");
  endPicker.classList.remove("datepicker--no-transition");
}
calendarInputs.forEach((start) => {
  handleCalendarHide(start);
  start.addEventListener("changeDate", (e) => {
    e.target.datepicker.hide();
    let inputName = e.target.name;
    if (inputName == "start") {
      e.target.parentElement.querySelector('[name="end"]').datepicker.show();
    }

    toggleStartCalendarsTransition(e);

    setTimeout(() => {
      updateRangeValues(e);
    }, 100);
  });
});

calendarInputsEnd.forEach((end) => {
  end.addEventListener("changeDate", (e) => {
    updateRangeValues(e);

    toggleEndCalendarsTransition(e);
    setTimeout(() => {
      e.target.datepicker.hide();
    }, 400);
  });
  handleCalendarHide(end);
});
// #endregion datepicker

// #region cookies

let cookiesPop = true;
if (!localStorage.getItem("cookies")) {
  localStorage.setItem("cookies", "true");
} else if (localStorage.getItem("cookies") == "false") {
  cookiesPop = false;
}

checkCookies(cookiesPop);

const cookiesButton = document.querySelector("#snack-cookies .snack__button");
cookiesButton.addEventListener("click", () => {
  cookiesPop = false;
  checkCookies(cookiesPop);
  localStorage.setItem("cookies", "false");
});

function checkCookies(cookiesPop) {
  const cookiesSnack = document.querySelector("#snack-cookies");
  if (!cookiesPop) {
    cookiesSnack.classList.remove("_show");
    setTimeout(() => {
      cookiesSnack.remove();
    }, 2000);
  } else {
    cookiesSnack.classList.add("_show");
  }
}
// #endregion cookies

function normalizeMenuMobileHeight() {
  if (window.innerWidth < 1200) {
    document.querySelector(".menu").style.height = `${
      window.outerHeight + 110
    }px`;
  } else {
    document.querySelector(".menu").style.height = "calc(100 * 1vh)";
  }
}
if (headerMenu) {
  window.addEventListener("resize", () => {
    normalizeMenuMobileHeight();
  });
  normalizeMenuMobileHeight();
}

window.addEventListener("DOMContentLoaded", () => {
  showDocument();
});
