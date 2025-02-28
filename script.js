document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll(".slider");

    sliders.forEach((slider, index) => {
        slider.addEventListener("input", function () {
            sliders.forEach((s, i) => {
                if (i > 0 && parseInt(sliders[i].value) > parseInt(sliders[i - 1].value)) {
                    s.style.accentColor = "red"; // Turn red if exceeding previous
                } else {
                    s.style.accentColor = ""; // Reset if within limit
                }
            });
        });
    });
});
