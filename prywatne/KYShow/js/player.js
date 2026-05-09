const nameInput = document.getElementById("name");
const buzzerBtn = document.getElementById("buzzer");

let playerId = null;

nameInput.addEventListener("change", () => {
    const name = nameInput.value.trim();
    if (!name) return;

    playerId = db.ref("game/players").push().key;

    db.ref("game/players/" + playerId).set({
        name: name,
        joinedAt: Date.now()
    });
});

db.ref("game/category").on("value", snap => {
    document.getElementById("category").textContent = snap.val() || "—";
});

db.ref("game/buzzer").on("value", snap => {
    const data = snap.val();
    buzzerBtn.disabled = data.locked;
    document.getElementById("winner").textContent = data.winner || "—";
});

buzzerBtn.onclick = () => {
    const name = nameInput.value || "Anonim";

    db.ref("game/buzzer").transaction(b => {
        if (!b.locked) {
            b.locked = true;
            b.winner = name;
        }
        return b;
    });
};
