const init = function () {
  const imagesList = document.querySelectorAll(".gallery__item");
  imagesList.forEach((img) => {
    img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
  }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

  runJSSlider();
};

document.addEventListener("DOMContentLoaded", init);

const runJSSlider = function () {
  const imagesSelector = ".gallery__item";
  const sliderRootSelector = ".js-slider";

  const imagesList = document.querySelectorAll(imagesSelector);
  const sliderRootElement = document.querySelector(sliderRootSelector);

  initEvents(imagesList, sliderRootElement);
  initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
  imagesList.forEach(function (item) {
    item.addEventListener("click", function (e) {
      fireCustomEvent(e.currentTarget, "js-slider-img-click");
    });
  });

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
  // na elemencie [.js-slider__nav--next]
  const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
  navNext.addEventListener("click", function (e) {
    fireCustomEvent(navNext, "js-slider-img-next");
    e.stopPropagation();
  });

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
  // na elemencie [.js-slider__nav--prev]
  const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
  navPrev.addEventListener("click", function (e) {
    fireCustomEvent(navPrev, "js-slider-img-prev");
    e.stopPropagation();
  });
  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
  // tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
  const zoom = sliderRootElement.querySelector(".js-slider__zoom");
  zoom.addEventListener("click", function (e) {
    fireCustomEvent(zoom, "js-slider-close", { bubbles: false });
  });
};

const fireCustomEvent = function (element, name) {
  console.log(element.className, "=>", name);

  const event = new CustomEvent(name, {
    bubbles: true,
  });

  element.dispatchEvent(event);
};

const initCustomEvents = function (
  imagesList,
  sliderRootElement,
  imagesSelector
) {
  imagesList.forEach(function (img) {
    img.addEventListener("js-slider-img-click", function (event) {
      onImageClick(event, sliderRootElement, imagesSelector);
    });
  });

  sliderRootElement.addEventListener("js-slider-img-next", onImageNext);
  sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
  sliderRootElement.addEventListener("js-slider-close", onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
  // todo:
  // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
  sliderRootElement.classList.add("js-slider--active");
  // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
  const path = new URL(event.target.firstElementChild.src).pathname;
  document.querySelector(".js-slider__image").src = path;
  // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
  const groupName = event.currentTarget.dataset.sliderGroupName;
  console.log(groupName);
  // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
  const figures = document.querySelectorAll(
    `[data-slider-group-name="${groupName}"]`
  );
  console.log(figures);
  // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
  const thumbsItemPrototype = document.querySelector(
    ".js-slider__thumbs-item--prototype"
  );
  const sliderThumbs = document.querySelector(".js-slider__thumbs");
  for (figure of figures) {
    const imgSrc = new URL(figure.firstElementChild.src).pathname;
    console.log(imgSrc);
    const thumb = thumbsItemPrototype.cloneNode(true);
    console.log(thumb.firstElementChild);
    thumb.firstElementChild.src = imgSrc;
    thumb.classList.remove("js-slider__thumbs-item--prototype");
    sliderThumbs.appendChild(thumb);
  }
  // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
  sliderThumbs
    .querySelector(`[src="${path}"`)
    .classList.add("js-slider__thumbs-image--current");
};

const onImageNext = function (event) {
  console.log(this, "onImageNext");
  // [this] wskazuje na element [.js-slider]

  // todo:
  // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
  const thumbImgCurrent = this.querySelector(
    ".js-slider__thumbs-image--current"
  );
  // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
  // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
  let thumbFigureCurrent = thumbImgCurrent.parentElement;
  let thumbImgNext;
  if (thumbFigureCurrent.nextElementSibling) {
    thumbImgNext = thumbFigureCurrent.nextElementSibling.firstElementChild;
  } else {
    thumbImgNext = null;
  }
  // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
  if (thumbImgNext) {
    thumbImgCurrent.classList.remove("js-slider__thumbs-image--current");
    thumbImgNext.classList.add("js-slider__thumbs-image--current");
    // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
    const imgSrc = new URL(thumbImgNext.src).pathname;
    const sliderImage = document.querySelector(".js-slider__image");
    sliderImage.src = imgSrc;
  }
};

const onImagePrev = function (event) {
  console.log(this, "onImagePrev");
  // [this] wskazuje na element [.js-slider]

  // todo:
  // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
  const thumbImgCurrent = document.querySelector(
    ".js-slider__thumbs-image--current"
  );

  // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
  const thumbFigurePrev = thumbImgCurrent.parentElement.previousElementSibling;
  console.log(thumbFigurePrev);
  // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
  if (
    thumbFigurePrev &&
    !thumbFigurePrev.classList.contains("js-slider__thumbs-item--prototype")
  ) {
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    const thumbImgPrev = thumbFigurePrev.firstElementChild;
    thumbImgCurrent.classList.remove("js-slider__thumbs-image--current");
    thumbImgPrev.classList.add("js-slider__thumbs-image--current");
    // 5. podmienić atrybut [src] dla [.js-slider__image]
    const imgSrc = new URL(thumbImgPrev.src).pathname;
    const sliderImage = this.querySelector(".js-slider__image");
    sliderImage.src = imgSrc;
  }
};

const onClose = function (event) {
  // todo:
  // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
  const slider = document
    .querySelector(".js-slider")
    .classList.remove("js-slider--active");
  // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
  const sliderThumbs = document.querySelectorAll(".js-slider__thumbs-item");
  for (thumb of sliderThumbs) {
    if (!thumb.classList.contains("js-slider__thumbs-item--prototype")) {
      thumb.remove();
    }
  }
};
