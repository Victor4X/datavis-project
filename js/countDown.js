import { Animation } from "./animation.js";

const animationPlayed = localStorage.getItem("played");

const postDiv = document.querySelector("#post-countdown");
const preDiv = document.querySelector("#pre-countdown");
if (!animationPlayed) {
    let count = 3;
    
    const h1 = document.querySelector("#countdown");
    h1.textContent = `T-${count--}`;
    
    const animation = new Animation(() => 1500, () => {
        h1.textContent = count >= 0 ? count : "LIFT OF!";
        count--;
        if (count === -3) {
            animation.stop();
            postDiv.hidden = false;
            preDiv.hidden = true;
            window.dispatchEvent(new Event('resize'));
        }
    });
    animation.start();
    //localStorage.setItem("played","true");
}

else {
    postDiv.hidden = false;
    preDiv.hidden = true;
    window.dispatchEvent(new Event('resize'));
}

