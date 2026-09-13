const btn = document.getElementById("gradient");

btn.onclick = () => changeBG(randomDirection(), randomColor(), randomColor());


const body = document.getElementById("gradient");
function changeBG(direction, color1, color2) {
    body.style.backgroundImage = `linear-gradient(${direction}, rgb(${color1}), rgb(${color2}))`;
}

function randomColor() {
    return `${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}`;
}

function randomDirection() {
    return `${random(0, 359)}deg`;
}

function random(min, max) {
    const randomNumber = min + Math.round(Math.random() * (max - min));
    return randomNumber;
}
