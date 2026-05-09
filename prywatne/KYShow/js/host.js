const categoryEl = document.getElementById("category");
const winnerEl = document.getElementById("winner");

document.getElementById("spin").onclick = () => {
    const categories = ["Historia","Geografia","Nauka","Filmy","Muzyka","Sport","Technologia","Literatura","Sztuka","Losowe"];
    const category = categories[Math.floor(Math.random() * categories.length)];

    db.ref("game/category").set(category);
};

document.getElementById("startRound").onclick = () => {
    db.ref("game/buzzer").set({ locked: false, winner: null });
};

document.getElementById("reset").onclick = () => {
    db.ref("game/buzzer").set({ locked: true, winner: null });
};

db.ref("game/buzzer/winner").on("value", snap => {
    winnerEl.textContent = snap.val() || "—";
});
