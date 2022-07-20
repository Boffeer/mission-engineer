// Служебные переменные
const d = document;
d;
const body = document.querySelector("body");

// Служебные функции

function find(selector) {
  return document.querySelector(selector);
}
find;

function findAll(selectors) {
  return document.querySelectorAll(selectors);
}
findAll;

// Удаляет у всех элементов items класс itemClass
function removeAll(items, itemClass) {
  if (typeof items == "string") {
    items = document.querySelectorAll(items);
  }
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    item.classList.remove(itemClass);
  }
}
removeAll;

function bodyLock(con) {
  if (con === true) {
    body.classList.add("_lock");
  } else if (con === false) {
    body.classList.remove("_lock");
  } else if (con === undefined) {
    if (!body.classList.contains("_lock")) {
      body.classList.add("_lock");
    } else {
      body.classList.remove("_lock");
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
sumbitForm();
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
menu;

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

/**
 * @featured-slider
 */

const featuredSlider = document.querySelector(".featured-slider");
if (featuredSlider) {
  // eslint-disable-next-line no-unused-vars, no-undef
  let featuredSlider = new Swiper(".featured-slider", {
    spaceBetween: 20,
    grabCursor: true,
    // navigation: {
    //   nextEl: '.featured-slider__button-next',
    //   prevEl: '.featured-slider__button-prev',
    // },
    pagination: {
      el: ".featured-slider__pagination",
      clickable: true,
    },
  });
}

/**
 * @tabs
 *
 * Табы инициируются все
 * У какой кнопки таба есть класс из js переменной TAB_ACTIVE_CLASS, тот таб и будет активным сразу
 */
const tabsBars = document.querySelectorAll(".tabs");
const tabsPagesWraps = document.querySelectorAll(".tabs-content");
const TAB_ACTIVE_CLASS = "tab--active";

// Добавляем активное состояние для табов, чтоб инициализировать Swiper
tabsBars.forEach((tabsBar) => {
  if (tabsBar.dataset.tabs) {
    tabsPagesWraps.forEach((tabsPagesWrap) => {
      const tabPages = tabsPagesWrap.querySelectorAll(".tabs-page");
      tabPages.forEach((tabPage) => {
        tabPage.classList.add(TAB_ACTIVE_CLASS);
      });
    });
  }
});

// Задержка нужна, чтобы Swiper слайдеры не разъезжались
setTimeout(() => {
  tabsBars.forEach((tabsBar) => {
    const tabBarButtons = tabsBar.querySelectorAll(".tab");
    tabBarButtons.forEach((tabButton, buttonIndex) => {
      tabButton.addEventListener("click", () => {
        tabBarButtons.forEach((tab) => {
          tab.classList.remove(TAB_ACTIVE_CLASS);
        });
        tabButton.classList.add(TAB_ACTIVE_CLASS);
        if (tabsBar.dataset.tabs) {
          const tabPages = document
            .querySelector(`.tabs-content[data-tabs="${tabsBar.dataset.tabs}"]`)
            .querySelectorAll(".tabs-page");

          if (tabPages[buttonIndex]) {
            tabPages.forEach((tabPage) => {
              tabPage.classList.remove(TAB_ACTIVE_CLASS);
            });
            tabPages[buttonIndex].classList.add(TAB_ACTIVE_CLASS);
          }
        } else {
          console.warn(
            `there is no tab pages [data-tab="${tabsBar.dataset.tabs}"]`
          );
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

const newsSliderSettings = {
  slidesPerView: "auto",
  slidesPerGroup: 1,
  spaceBetween: 24,
  grabCursor: true,
  // navigation: {
  //   nextEl: '.news-slider__button-next',
  //   prevEl: '.news-slider__button-prev',
  // },
  pagination: {
    el: ".news-slider__pagination",
    clickable: true,
  },
  breakpoints: {
    1300: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
  },
};

/**
 * @sliders
 */
function initSlider(slider) {
  // eslint-disable-next-line no-undef, no-unused-vars
  return new Swiper(slider.selector, slider.options);
}
// eslint-disable-next-line no-undef, no-unused-vars
function removeSlider(sliders) {
  // eslint-disable-next-line no-undef, no-unused-vars
  sliders.forEach(slider, () => {});
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
}

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
  console.log("saved", savedScheme);

  [...themeSwitchers].forEach((switcher) => {
    switcher.addEventListener("click", () => {
      setScheme(switcher.dataset.theme);
    });
  });

  if (savedScheme !== null) {
    const currentButton = document.querySelector(
      `.tab--theme[data-theme="${savedScheme}"]`
    );
    setTimeout(() => {
      currentButton.click();
      currentButton.parentElement
        .querySelectorAll(".tab")
        .forEach((tab) => tab.classList.remove("tab--active"));
      currentButton.classList.add("tab--active");
    }, 100);
    return;
  }

  const systemScheme = getSystemScheme();
  const systemSchemeButton = document.querySelector(
    `.tab--theme[data-theme="${systemScheme}"]`
  );
  systemSchemeButton.click();
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

const detailedSliders = document.querySelectorAll(".detailed-slider");

detailedSliders.forEach((slider, index) => {
  slider.classList.add(`detailed-slider-${index}`);

  let detailedSlides = new Swiper(
    `.detailed-slider-${index} .detailed-slider__slides`,
    {
      spaceBetween: 10,
    }
  );
  let detailedThumbs = new Swiper(
    `.detailed-slider-${index} .detailed-slider__thumbs`,
    {
      grabCursor: true,
      spaceBetween: 8,
      slidesPerView: "auto",
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
});
