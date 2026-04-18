document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initButtons();
});

let map;
let draggedPiece = null;
let moves = 0;


function initMap() {
  map = L.map("map").setView([52.0, 19.0], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    crossOrigin: true,
  }).addTo(map);
}


function initButtons() {
  document.getElementById("btn-location").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;

      document.getElementById("coords").textContent =
        `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`;

      L.marker([latitude, longitude]).addTo(map);
      map.setView([latitude, longitude], 14);
    });
  });

  document.getElementById("btn-generate").addEventListener("click", () => {
    setTimeout(makeSnapshot, 700);
  });
}


function makeSnapshot() {
  leafletImage(map, (err, canvas) => {
    if (err) {
      console.error("Error in leaflet-image:", err);
      return;
    }

    const img = new Image();
    img.src = canvas.toDataURL();

    img.onload = () => {

      const square = document.createElement("canvas");
      square.width = 400;
      square.height = 400;

      const ctx = square.getContext("2d");

      const scale = Math.max(
        square.width / img.width,
        square.height / img.height
      );

      const newW = img.width * scale;
      const newH = img.height * scale;

      const offsetX = (square.width - newW) / 2;
      const offsetY = (square.height - newH) / 2;

      ctx.drawImage(img, offsetX, offsetY, newW, newH);

      createPuzzle(square);
    };

    img.onerror = () => {
      console.error("Error Loading Puzzle Image");
    };
  });
}


function createPuzzle(img) {
  draggedPiece = null;
  moves = 0;
  updateMoves();

  const left = document.getElementById("puzzle-pieces");
  const right = document.getElementById("puzzle-board");

  left.innerHTML = "";
  right.innerHTML = "";

  const boardSize = right.clientWidth;
  const size = boardSize / 4;

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const slot = document.createElement("div");
      slot.classList.add("slot");
      slot.dataset.x = x;
      slot.dataset.y = y;

      slot.addEventListener("dragover", e => e.preventDefault());
      slot.addEventListener("drop", onSlotDrop);

      right.appendChild(slot);
    }
  }

  const pieces = [];

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;

      const ctx = c.getContext("2d");
      ctx.drawImage(
        img,
        x * (img.width / 4),
        y * (img.height / 4),
        img.width / 4,
        img.height / 4,
        0,
        0,
        size,
        size
      );

      c.classList.add("piece");
      c.draggable = true;
      c.dataset.correctX = x;
      c.dataset.correctY = y;

      c.addEventListener("dragstart", e => {
        draggedPiece = e.target;
      });

      pieces.push(c);
    }
  }

  shuffleArray(pieces);
  pieces.forEach(p => left.appendChild(p));

  left.addEventListener("dragover", e => e.preventDefault());
  left.addEventListener("drop", e => {
    e.preventDefault();
    if (draggedPiece) {
      left.appendChild(draggedPiece);
      draggedPiece = null;
    }
  });
}


function onSlotDrop(e) {
  e.preventDefault();
  if (!draggedPiece) return;

  const slot = e.currentTarget;

  const existing = slot.firstChild;
  if (existing) {
    document.getElementById("puzzle-pieces").appendChild(existing);
  }

  slot.appendChild(draggedPiece);
  draggedPiece = null;

  moves++;
  updateMoves();

  checkCompletion();
}


function updateMoves() {
  document.getElementById("moves").textContent = `Ruchy: ${moves}`;
}


function checkCompletion() {
  const slots = document.querySelectorAll("#puzzle-board .slot");

  for (const slot of slots) {
    const piece = slot.firstChild;
    if (!piece) return;

    if (
      piece.dataset.correctX !== slot.dataset.x ||
      piece.dataset.correctY !== slot.dataset.y
    ) {
      return;
    }
  }

  document.querySelectorAll(".piece").forEach(p => p.draggable = false);

  alert(`ulozyles puzzle w ${moves} ruchach!`);
}


function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

