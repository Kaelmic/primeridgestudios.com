const navbar = document.querySelector(".navbar");

function updateNavbar() {
  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateNavbar);
updateNavbar();

const modal = document.getElementById("bookingModal");
const modalTitle = document.getElementById("modalTitle");
const modalOptions = document.getElementById("modalOptions");
const modalClose = document.getElementById("modalClose");

const selectedDate = document.getElementById("selectedDate");
const selectedGuests = document.getElementById("selectedGuests");
const selectedTime = document.getElementById("selectedTime");
const reserveBtn = document.getElementById("reserveBtn");

const bookingData = {
  date: "",
  guests: "",
  time: ""
};

const options = {
  date: [
    "Friday, 18 September",
    "Saturday, 19 September",
    "Sunday, 20 September",
    "Friday, 25 September",
    "Saturday, 26 September",
    "Sunday, 27 September"
  ],
  guests: [
    "2 Guests",
    "3 Guests",
    "4 Guests",
    "5 Guests",
    "6 Guests",
    "8 Guests"
  ],
  time: [
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM"
  ]
};

document.querySelectorAll(".booking-display").forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.modal;

    modalTitle.textContent =
      type === "date" ? "Select a Date" :
      type === "guests" ? "Select Guests" :
      "Select Time";

    modalOptions.innerHTML = "";

    options[type].forEach((option) => {
      const optionButton = document.createElement("button");
      optionButton.textContent = option;

      optionButton.addEventListener("click", () => {
        bookingData[type] = option;

        if (type === "date") selectedDate.textContent = option;
        if (type === "guests") selectedGuests.textContent = option;
        if (type === "time") selectedTime.textContent = option;

        modal.classList.remove("open");
      });

      modalOptions.appendChild(optionButton);
    });

    modal.classList.add("open");
  });
});

modalClose.addEventListener("click", () => {
  modal.classList.remove("open");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("open");
  }
});

reserveBtn.addEventListener("click", () => {
  const date = encodeURIComponent(bookingData.date || "Select a Date");
  const guests = encodeURIComponent(bookingData.guests || "Select Guests");
  const time = encodeURIComponent(bookingData.time || "Select Time");

  window.location.href = `reservation.html?date=${date}&guests=${guests}&time=${time}`;
});
