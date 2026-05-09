const categoryEl = document.getElementById("category");
const winnerEl = document.getElementById("winner");
const playerList = document.getElementById("playerList");

document.getElementById("startRound").onclick = () => {
    db.ref("game/buzzer").set({ locked: false, winner: null });
};

document.getElementById("reset").onclick = () => {
    db.ref("game").set({
        players: {},
        category: null,
        wheelRotation: 0,
        buzzer: { locked: true, winner: null }
    });
};

db.ref("game/category").on("value", snap => {
    categoryEl.textContent = snap.val() || "—";
});

db.ref("game/buzzer/winner").on("value", snap => {
    winnerEl.textContent = snap.val() || "—";
});

db.ref("game/players").on("value", snap => {
    playerList.innerHTML = "";
    snap.forEach(child => {
        const li = document.createElement("li");
        li.textContent = child.val().name;
        playerList.appendChild(li);
    });
});
