"use strict";

const modal = document.querySelector(".modal");
const modalLogin = document.querySelector(".modal-login");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelectorAll(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnsOpenModalLogin = document.querySelector(".btn--show-modal-login");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const operationsContents = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
const imgTargets = document.querySelectorAll("img[data-src]");
const navLogoLink = document.querySelector(".nav__logo-link");
const showPassword = document.querySelectorAll(".show__password");
const loginPassword = document.querySelectorAll(".login__password");
///////////////////////////////////////

// * Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modalLogin.classList.add("hidden");
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnsOpenModalLogin.addEventListener("click", function () {
  modalLogin.classList.remove("hidden");
  overlay.classList.remove("hidden");
  console.log("opened");
});

btnCloseModal.forEach((btnClose) =>
  btnClose.addEventListener("click", closeModal)
);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

showPassword.forEach((showPassword, index) =>
  showPassword.addEventListener("change", function (e) {
    if (this.checked) loginPassword[index].type = "text";
    else loginPassword[index].type = "password";
  })
);

// Page navigation
btnScrollTo.addEventListener("click", function () {
  // old method
  // window.scrollTo({
  //   left: section1.getBoundingClientRect().left + window.pageXOffset,
  //   top: section1.getBoundingClientRect().top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // new method
  section1.scrollIntoView({ behavior: "smooth" });
});

navLogoLink.addEventListener("click", function (e) {
  if (!e.target.closest(".nav__logo-link")) return;

  console.log("scrollworking");
  header.scrollIntoView({ behavior: "smooth" });
});

// * Event delegation
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  // Matching strategy
  const eleid = e.target.getAttribute("href");
  if (e.target.classList.contains("nav__link"))
    document.querySelector(eleid).scrollIntoView({ behavior: "smooth" });
});

// * Tabs content
tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Matching strategy
  if (!clicked) return;

  // Remove predefined class
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  operationsContents.forEach((operationsContent) =>
    operationsContent.classList.remove("operations__content--active")
  );

  // Add active class
  clicked.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// * Menu fade animation
// ! The mouseover event triggers when the mouse pointer enters the div element, and its child elements. The mouseenter event is only triggered when the mouse pointer enters the div element.

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach(
      (sibling) => sibling !== link && (sibling.style.opacity = this)
    );
    logo.style.opacity = this;
  }
};

// ! this keyword is nothing but a variable which we can control what value it must store using bind method
nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

// * Sticy navbar
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// * Reveal sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// * Lazy loading images

const loader = function (entries, obsever) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    this.classList.remove("lazy-img");
  });

  obsever.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loader, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((imgTarget) => imgObserver.observe(imgTarget));

// * slider

const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotsContainer = document.querySelector(".dots");

  let currentSlide = 0;
  const maxSlides = slides.length;

  const goToSlide = function (slideNo = 0) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - slideNo)}%)`;
      [...dotsContainer.childNodes]
        .at(index)
        .classList.remove("dots__dot--active");
      [...dotsContainer.childNodes]
        .at(slideNo)
        .classList.add("dots__dot--active");

      // activeDot(slideNo);
    });
  };

  const createDots = function () {
    slides.forEach((_, index) => {
      dotsContainer.insertAdjacentHTML(
        "beforeEnd",
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  const init = function (...callBacks) {
    callBacks.forEach((callBack) => callBack());
  };

  init(createDots, goToSlide);

  const nextSlide = function () {
    if (currentSlide === maxSlides - 1) currentSlide = 0;
    else currentSlide++;
    goToSlide(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlides - 1;
    else currentSlide--;
    goToSlide(currentSlide);
  };

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && prevSlide();
  });

  dotsContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("dots__dot")) return;

    const { slide } = e.target.dataset;
    goToSlide(slide);
  });
};

slider();

// login logic
$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: "login.php",
      data: $("#loginForm").serialize(),
      success: function (response) {
        if (response === '"success"') {
          // Redirect to dashboard or homepage
          window.location.href = "dashboard.php";
          console.log("redirecting");
        } else {
          // Display error message
          //console.log(response);
          $("#errorMessage").text(response);
        }
      },
      error: function () {
        // Display error message
        $("#errorMessage").text(
          "Something went wrong. Please try again later."
        );
      },
    });
  });

  $("#registrationForm").submit(function (e) {
    e.preventDefault(); // prevent the form from submitting normally

    // submit the form via AJAX
    $.ajax({
      type: "POST",
      url: "registration.php",
      data: $("#registrationForm").serialize(),
      success: function (response) {
        if (response === '"success"') {
          // Redirect to dashboard or homepage
          closeModal();
          Swal.fire({
            title: "Success",
            text: "Successfully registered with Health Connect",
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          // Display error message
          $("#errorMessage").text(response);
        }
      },
      error: function () {
        // Display error message
        $("#errorMessage").text(
          "Something went wrong. Please try again later."
        );
      },
    });
  });
});
