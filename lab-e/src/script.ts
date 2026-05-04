const msg: string = "Hello!";
alert(msg);

const styles: Record<string, string> = {
    "Styl 1": "/style-1.css",
    "Styl 2": "/style-2.css",
    "Styl 3": "/style-3.css"
};

let currentStyle: string | null = null;

function applyStyle(styleName: string) {
    const oldLink = document.getElementById("dynamic-style");
    if (oldLink) oldLink.remove();

    const link = document.createElement("link");
    link.id = "dynamic-style";
    link.rel = "stylesheet";
    link.href = styles[styleName];

    document.head.appendChild(link);
    currentStyle = styleName;
}

function generateButtons() {
    const container = document.getElementById("style-switcher");
    if (!container) return;

    Object.keys(styles).forEach(styleName => {
        const btn = document.createElement("button");
        btn.textContent = styleName;

        btn.addEventListener("click", () => {
            applyStyle(styleName);
        });

        container.appendChild(btn);
    });
}

generateButtons();

applyStyle(Object.keys(styles)[0]);
