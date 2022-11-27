import rocket_info from "../data/rocket_history.json" assert { type: "json"};

const rocketDiv = (rocket) => {
    const rocketDiv = document.createElement("div");
    rocketDiv.className = "rocket";

    const rocketName = document.createElement("h3");
    rocketName.textContent = rocket.name;

    const rocketInfoDiv = document.createElement("div");
    rocketInfoDiv.className = "rocket-info-box";

    const rocketImage = document.createElement("img");
    rocketImage.src = rocket.image;
    rocketImage.alt = rocket.name;

    const rocketInfoPara = document.createElement("p");
    rocketInfoPara.textContent = rocket.info;

    rocketInfoDiv.appendChild(rocketImage);
    rocketInfoDiv.appendChild(rocketInfoPara);
    rocketDiv.appendChild(rocketName);
    rocketDiv.appendChild(rocketInfoDiv);

    return rocketDiv;
}

const countryDiv = (country) => {
    const countryDiv = document.createElement("div");
    countryDiv.className = "country";
    countryDiv.style.backgroundImage = `url(${country.image})`;

    const countryName = document.createElement("h2");
    countryName.textContent = country.name;

    const rocketsDiv = document.createElement("div");
    rocketsDiv.className = "rockets";

    country.rockets.forEach(rocket => {
        rocketsDiv.appendChild(rocketDiv(rocket));
    });

    countryDiv.appendChild(countryName);
    countryDiv.appendChild(rocketsDiv);

    return countryDiv;
}

const rocket_history_div = document.querySelector(".rocket-history");
rocket_info.forEach(country => {
    rocket_history_div.appendChild(countryDiv(country));
});
