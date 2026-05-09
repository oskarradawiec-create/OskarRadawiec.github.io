const categories = [
    "Historia",
    "Geografia",
    "Nauka",
    "Filmy",
    "Muzyka",
    "Sport",
    "Technologia",
    "Literatura",
    "Sztuka",
    "Losowe"
];

const wheelCanvas = document.getElementById("wheel");
const spinBtn = document.getElementById("spin");
const wheelCtx = wheelCanvas ? wheelCanvas.getContext("2d") : null;

function drawWheel(rotation = 0) {
    if (!wheelCtx) return;

    const cx = wheelCanvas.width / 2;
    const cy = wheelCanvas.height / 2;
    const radius = Math.min(cx, cy) - 10;
    const arc = (2 * Math.PI) / categories.length;

    wheelCtx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    for (let i = 0; i < categories.length; i++) {
        const startAngle = i * arc + rotation;
        const endAngle = startAngle + arc;

        wheelCtx.beginPath();
        wheelCtx.moveTo(cx, cy);
        wheelCtx.arc(cx, cy, radius, startAngle, endAngle);
        wheelCtx.closePath();
        wheelCtx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ff9800";
        wheelCtx.fill();

        wheelCtx.save();
        wheelCtx.translate(cx, cy);
        wheelCtx.rotate(startAngle + arc / 2);
        wheelCtx.fillStyle = "#000";
        wheelCtx.font = "14px sans-serif";
        wheelCtx.textAlign = "right";
        wheelCtx.fillText(categories[i], radius - 10, 5);
        wheelCtx.restore();
    }

    wheelCtx.beginPath();
    wheelCtx.moveTo(cx, cy - radius - 5);
    wheelCtx.lineTo(cx - 10, cy - radius - 25);
    wheelCtx.lineTo(cx + 10, cy - radius - 25);
    wheelCtx.closePath();
    wheelCtx.fillStyle = "#f44336";
    wheelCtx.fill();
}

if (wheelCanvas) drawWheel();

function spinWheel() {
    const spins = 5 + Math.random() * 3;
    const totalRotation = spins * 2 * Math.PI;
    const duration = 2000;
    const start = performance.now();

    function animate(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const rotation = totalRotation * easeOut;

        drawWheel(rotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            const arc = (2 * Math.PI) / categories.length;
            const index = Math.floor(((2 * Math.PI - (rotation % (2 * Math.PI))) / arc)) % categories.length;
            const category = categories[index];

            db.ref("game/category").set(category);
            db.ref("game/wheelRotation").set(rotation);
        }
    }

    requestAnimationFrame(animate);
}

if (spinBtn) {
    spinBtn.addEventListener("click", spinWheel);
}

db.ref("game/wheelRotation").on("value", snap => {
    const rotation = snap.val();
    if (rotation !== null) drawWheel(rotation);
});
