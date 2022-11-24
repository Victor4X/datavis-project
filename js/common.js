const settingsDiv = document.querySelector("#settings");
console.log("Loading settings");

const settings = {};
const callbacks = [];

const addSetting = (key, setting) => {

    const div = document.createElement("div");
    div.classList.add("setting");
    setting.htmlElement = div;
    const label = document.createElement("label");
    label.innerText = setting.label;
    div.appendChild(label);

    const input = document.createElement("input");
    input.type = setting.type;
    input.value = setting.value;
    for (const attr in setting.attrs) {
        input.setAttribute(attr, setting.attrs[attr]);
    }

    input.addEventListener("change", () => {
        // Convert to number if type is number
        if (setting.type === "number") {
            setting.value = Number(input.value);
        } else {
            setting.value = input.value;
        }
        callbacks.forEach((callback) => callback());
    });

    div.appendChild(input);
    settingsDiv.appendChild(div);

    // Add to settings object
    settings[key] = setting;
}

addSetting("test", {
        label: "Test setting",
        value: 0,
        type: "number",
        attrs: { min: 0, max: 10 }
    }
);

export { settings, addSetting, callbacks };