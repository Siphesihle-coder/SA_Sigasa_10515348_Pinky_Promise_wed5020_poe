"use strict";

document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // 1. AUTOMATIC COPYRIGHT YEAR
    // =========================================

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // =========================================
    // 2. LIVE PRODUCT SEARCH
    // =========================================

    const searchInput = document.getElementById("product-search");

    const productCards = document.querySelectorAll(
        ".searchable-product"
    );

    const noResults = document.getElementById("no-results");

    const searchCount = document.getElementById("search-count");

    if (searchInput && productCards.length > 0) {

        function filterProducts() {

            const searchTerm = searchInput.value
                .trim()
                .toLowerCase();

            let visibleProducts = 0;

            productCards.forEach(function (card) {

                const productName = card.textContent.toLowerCase();

                const searchKeywords = (
                    card.getAttribute("data-search") || ""
                ).toLowerCase();

                const matches =
                    productName.includes(searchTerm) ||
                    searchKeywords.includes(searchTerm);

                card.classList.toggle("is-hidden", !matches);

                if (matches) {
                    visibleProducts++;
                }

            });

            // Show or hide the no-results message.
            if (noResults) {
                noResults.classList.toggle(
                    "is-hidden",
                    visibleProducts !== 0
                );
            }

            // Update the search result count.
            if (searchCount) {

                if (searchTerm === "") {
                    searchCount.textContent =
                        "Showing all " + visibleProducts + " designs.";

                } else {
                    searchCount.textContent =
                        visibleProducts +
                        (visibleProducts === 1
                            ? " design found."
                            : " designs found.");
                }

            }
        }

        searchInput.addEventListener("input", filterProducts);
    }


    // =========================================
    // 3. FAQ ACCORDION
    // =========================================

    const faqButtons = document.querySelectorAll(".faq-question");

    faqButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            const answerId = button.getAttribute("aria-controls");

            const answer = document.getElementById(answerId);

            // Update the button's accessibility state.
            button.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            // Display or hide the answer.
            if (answer) {
                answer.classList.toggle(
                    "is-hidden",
                    isExpanded
                );
            }

        });

    });


    // =========================================
    // 4. ENQUIRY FORM HINTS
    // =========================================

    const designSelect = document.getElementById("design");

    const typeHint = document.getElementById("type-hint");

    if (designSelect && typeHint) {

        function updateDesignHint() {

            const selectedDesign = designSelect.value;

            let hint = "";

            switch (selectedDesign) {

                case "French Tips":
                    hint = "Tell us whether you prefer a classic or modern French design.";
                    break;

                case "Floral Set":
                    hint = "You can describe your preferred flower colours and style.";
                    break;

                case "Maximalist Nails":
                    hint = "Tell us about the colours, patterns and details you would like.";
                    break;

                case "Dramatic Set":
                    hint = "Describe the bold look or occasion you have in mind.";
                    break;

                case "Custom design":
                    hint = "Describe your inspiration, preferred shape, length and colours.";
                    break;

                case "Pricing and availability":
                    hint = "Tell us which design you would like pricing or availability information about.";
                    break;

                case "Other":
                    hint = "Please explain what you would like to enquire about.";
                    break;

                default:
                    hint = "";
            }

            typeHint.textContent = hint;
        }

        designSelect.addEventListener("change", updateDesignHint);

        // Fill the selection if the visitor came from a product link.
        const urlParameters = new URLSearchParams(window.location.search);

        const requestedDesign = urlParameters.get("design");

        if (requestedDesign) {

            const matchingOption = Array.from(
                designSelect.options
            ).find(function (option) {
                return option.value === requestedDesign ||
                       option.textContent.trim() === requestedDesign;
            });

            if (matchingOption) {
                designSelect.value = matchingOption.value;
                updateDesignHint();
            }
        }
    }


    // =========================================
    // 5. FORM VALIDATION
    // =========================================

    const forms = document.querySelectorAll(".site-form");

    forms.forEach(function (form) {

        form.addEventListener("submit", function (event) {

            // Stop the browser from submitting the demo form.
            event.preventDefault();

            let isFormValid = true;

            let firstInvalidField = null;

            const fields = form.querySelectorAll(
                "input, select, textarea"
            );

            fields.forEach(function (field) {

                const formRow = field.closest(".form-row");

                const errorMessage = formRow
                    ? formRow.querySelector(".field-error")
                    : null;

                let message = "";

                const value = field.value.trim();

                // Required field validation.
                if (field.required && value === "") {

                    message = "This field is required.";

                } else if (
                    value !== "" &&
                    field.type === "email" &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {

                    // Email validation.
                    message = "Please enter a valid email address.";

                } else if (
                    value !== "" &&
                    field.type === "tel" &&
                    !/^[0-9+()\s-]{7,20}$/.test(value)
                ) {

                    // Phone number validation.
                    message = "Please enter a valid phone number.";

                } else if (
                    value !== "" &&
                    field.minLength > 0 &&
                    value.length < field.minLength
                ) {

                    // Minimum character length.
                    message =
                        "Please enter at least " +
                        field.minLength +
                        " characters.";

                } else if (
                    value !== "" &&
                    field.maxLength > 0 &&
                    value.length > field.maxLength
                ) {

                    // Maximum character length.
                    message =
                        "Please enter no more than " +
                        field.maxLength +
                        " characters.";

                } else if (
                    value !== "" &&
                    field.pattern &&
                    !new RegExp(field.pattern).test(value)
                ) {

                    message = "Please check the format of this field.";
                }

                // Display the error message.
                if (errorMessage) {
                    errorMessage.textContent = message;
                }

                // Update accessibility information.
                field.setAttribute(
                    "aria-invalid",
                    message ? "true" : "false"
                );

                if (message) {

                    isFormValid = false;

                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                }

            });


            // Find the success message.
            const successMessage = form.querySelector(".form-success");

            if (successMessage) {

                successMessage.classList.toggle(
                    "is-hidden",
                    !isFormValid
                );
            }


            // Focus the first invalid field.
            if (!isFormValid && firstInvalidField) {

                firstInvalidField.focus();

            } else if (isFormValid && successMessage) {

                successMessage.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }

        });


        // Clear errors as the visitor corrects the form.
        form.querySelectorAll(
            "input, select, textarea"
        ).forEach(function (field) {

            function clearFieldError() {

                const formRow = field.closest(".form-row");

                const errorMessage = formRow
                    ? formRow.querySelector(".field-error")
                    : null;

                if (errorMessage) {
                    errorMessage.textContent = "";
                }

                field.removeAttribute("aria-invalid");

                const successMessage =
                    form.querySelector(".form-success");

                if (successMessage) {
                    successMessage.classList.add("is-hidden");
                }
            }

            field.addEventListener("input", clearFieldError);

            field.addEventListener("change", clearFieldError);

        });

    });


    // =========================================
    // 6. SCROLL REVEAL ANIMATIONS
    // =========================================

    const revealElements = document.querySelectorAll(
        ".product-card, .value-card, .split, .section-heading"
    );

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        "IntersectionObserver" in window &&
        !reducedMotion
    ) {

        revealElements.forEach(function (element) {
            element.classList.add("reveal");
        });

        const observer = new IntersectionObserver(
            function (entries, currentObserver) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        currentObserver.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element) {
            observer.observe(element);
        });
    }


    // =========================================
    // 7. IMAGE LIGHTBOX
    // =========================================

    const imagesToEnlarge = document.querySelectorAll(
        ".product-card > img, .rounded-image, .hero-image"
    );

    imagesToEnlarge.forEach(function (image) {

        image.tabIndex = 0;

        image.setAttribute("role", "button");

        image.setAttribute(
            "aria-label",
            "View larger image: " + image.alt
        );

        image.style.cursor = "zoom-in";


        function openLightbox() {

            // Prevent multiple lightboxes from opening.
            if (document.querySelector(".lightbox")) {
                return;
            }

            const overlay = document.createElement("div");

            overlay.className = "lightbox";

            overlay.setAttribute("role", "dialog");

            overlay.setAttribute("aria-modal", "true");

            overlay.setAttribute(
                "aria-label",
                image.alt || "Enlarged nail design"
            );


            const enlargedImage = document.createElement("img");

            enlargedImage.src = image.src;

            enlargedImage.alt = image.alt;


            const closeButton = document.createElement("button");

            closeButton.type = "button";

            closeButton.textContent = "×";

            closeButton.setAttribute(
                "aria-label",
                "Close enlarged image"
            );


            overlay.appendChild(enlargedImage);

            overlay.appendChild(closeButton);

            document.body.appendChild(overlay);

            closeButton.focus();


            function closeLightbox(event) {

                if (
                    event.type === "keydown" &&
                    event.key !== "Escape"
                ) {
                    return;
                }

                if (
                    event.type === "click" &&
                    event.target !== overlay &&
                    event.target !== closeButton
                ) {
                    return;
                }

                overlay.remove();

                document.removeEventListener(
                    "keydown",
                    closeLightbox
                );

                image.focus();
            }


            closeButton.addEventListener(
                "click",
                closeLightbox
            );

            overlay.addEventListener(
                "click",
                closeLightbox
            );

            document.addEventListener(
                "keydown",
                closeLightbox
            );
        }


        // Open the enlarged image when clicked.
        image.addEventListener("click", openLightbox);


        // Also allow keyboard users to open the image.
        image.addEventListener("keydown", function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openLightbox();
            }

        });

    });

});