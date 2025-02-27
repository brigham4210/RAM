document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll(".slider");

    sliders.forEach((slider, index) => {
        slider.addEventListener("input", function () {
            if (index > 0) {
                const prevSlider = sliders[index - 1];
                if (parseInt(this.value) > parseInt(prevSlider.value)) {
                    this.style.background = "red";
                } else {
                    this.style.background = "";
                }
            }
        });
    });
});
