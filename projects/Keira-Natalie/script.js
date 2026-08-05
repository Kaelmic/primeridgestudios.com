document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");

      navToggle.classList.toggle("active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const serviceSelect = document.getElementById("serviceSelect");

  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      if (serviceSelect) {
        serviceSelect.value = link.dataset.service || "";
      }
    });
  });

  const filterButtons = document.querySelectorAll(".filter");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      galleryItems.forEach((item) => {
        const shouldHide =
          filter !== "all" && item.dataset.category !== filter;

        item.classList.toggle("hidden", shouldHide);
      });
    });
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxPhoto = document.getElementById("lightboxPhoto");
  const lightboxClose = document.getElementById("lightboxClose");

  function closeLightbox() {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (!lightbox || !lightboxPhoto) return;

      lightboxPhoto.style.backgroundImage =
        getComputedStyle(item).backgroundImage;

      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  const testimonials = document.querySelectorAll(".testimonial");
  const prevQuote = document.getElementById("prevQuote");
  const nextQuote = document.getElementById("nextQuote");

  let quoteIndex = 0;

  function showQuote(index) {
    testimonials.forEach((testimonial, itemIndex) => {
      testimonial.classList.toggle("active", itemIndex === index);
    });
  }

  prevQuote?.addEventListener("click", () => {
    quoteIndex =
      (quoteIndex - 1 + testimonials.length) % testimonials.length;

    showQuote(quoteIndex);
  });

  nextQuote?.addEventListener("click", () => {
    quoteIndex = (quoteIndex + 1) % testimonials.length;

    showQuote(quoteIndex);
  });

  const form = document.querySelector(".booking-form");
  const successMessage = document.getElementById("success-message");

  if (!form) return;

  const nameInput = form.querySelector(
    'input[name="Customer Name"]'
  );

  const phoneInput = form.querySelector(
    'input[name="Phone Number"]'
  );

  const dateInput = document.getElementById("dateInput");
  const dayDisplay = document.getElementById("day-display");
  const timeInput = document.getElementById("timeInput");

  const submitButton = form.querySelector(
    'button[type="submit"]'
  );

  function localDateString(date = new Date()) {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(
      2,
      "0"
    );

    const day = String(date.getDate()).padStart(
      2,
      "0"
    );

    return `${year}-${month}-${day}`;
  }

  function generateTimeSlots() {
    if (!timeInput || !dateInput) return;

    timeInput.innerHTML =
      '<option value="">Select a time</option>';

    if (!dateInput.value) return;

    const isToday =
      dateInput.value === localDateString();

    const earliestTime = new Date(
      Date.now() + 15 * 60 * 1000
    );

    for (let hour = 9; hour <= 18; hour += 1) {
      ["00", "15", "30", "45"].forEach((minute) => {
        if (hour === 18 && minute !== "00") return;

        const time =
          `${String(hour).padStart(2, "0")}:${minute}`;

        const slotDate = new Date(
          `${dateInput.value}T${time}`
        );

        if (isToday && slotDate <= earliestTime) {
          return;
        }

        const option =
          document.createElement("option");

        option.value = time;
        option.textContent = time;

        timeInput.appendChild(option);
      });
    }
  }

  if (dateInput) {
    dateInput.min = localDateString();
  }

  nameInput?.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(
      /[^A-Za-zÀ-ÿ\s'-]/g,
      ""
    );
  });

  phoneInput?.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(
      /[^\d+\s]/g,
      ""
    );
  });

  dateInput?.addEventListener("change", () => {
    if (!dateInput.value) {
      if (dayDisplay) {
        dayDisplay.textContent = "";
      }

      generateTimeSlots();
      return;
    }

    const selectedDate = new Date(
      `${dateInput.value}T00:00:00`
    );

    const dayName = selectedDate.toLocaleDateString(
      "en-GB",
      {
        weekday: "long",
      }
    );

    if (selectedDate.getDay() === 0) {
      if (dayDisplay) {
        dayDisplay.textContent =
          `The studio is closed on ${dayName}s.`;
      }

      dateInput.value = "";
      generateTimeSlots();

      return;
    }

    if (dayDisplay) {
      dayDisplay.textContent = dayName;
    }

    generateTimeSlots();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!timeInput?.value) {
      alert("Please select an available time.");
      return;
    }

    const formData = new FormData(form);

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending request";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Booking request failed");
      }

      form.reset();

      if (dayDisplay) {
        dayDisplay.textContent = "";
      }

      generateTimeSlots();

      if (successMessage) {
        successMessage.style.display = "block";
      }
    } catch (error) {
      alert(
        "The request could not be sent. Please try again or contact us through WhatsApp."
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
          "Send booking request";
      }
    }
  });
});