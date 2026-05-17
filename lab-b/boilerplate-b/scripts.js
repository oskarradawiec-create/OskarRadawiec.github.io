class Todo {
  constructor() {
    this.tasks = [];
    this.term = "";
    this.load();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  load() {
    const data = localStorage.getItem("tasks");
    if (data) {
      this.tasks = JSON.parse(data);
    }
  }

  get filteredTasks() {
    if (this.term.length < 2) return this.tasks;
    return this.tasks.filter(t =>
      t.text.toLowerCase().includes(this.term.toLowerCase())
    );
  }

  draw() {
    const list = document.getElementById("list");
    list.innerHTML = "";

    this.filteredTasks.forEach((task) => {
      const originalIndex = this.tasks.indexOf(task);
      const div = document.createElement("div");
      div.className = "task";

      let text = task.text;
      if (this.term.length >= 2) {
        const regex = new RegExp(`(${this.term})`, "gi");
        text = text.replace(regex, `<span class="highlight">$1</span>`);
      }

      let dateDetails = "";
      if (task.date) {
        dateDetails = task.date;
        if (task.time) {
          dateDetails += " " + task.time;
        }
      }

      div.innerHTML = `
        <div class="text">${text}<br><small>${dateDetails}</small></div>
        <div class="actions">
          <button class="editBtn">Edytuj</button>
          <button class="deleteBtn">Usuń</button>
        </div>
      `;

      div.querySelector(".editBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.edit(originalIndex, div);
      });

      div.querySelector(".deleteBtn").addEventListener("click", (e) => {
        e.stopPropagation();
        this.remove(originalIndex);
      });

      list.appendChild(div);
    });
  }

  add(text, date, time) {
    if (text.length < 3 || text.length > 255) {
      alert("Zadanie musi mieć 3–255 znaków");
      return;
    }

    if (date) {
      const now = new Date();
      const d = new Date(date);

      if (time) {
        const [hours, minutes] = time.split(":");
        d.setHours(hours, minutes, 0, 0);
      } else {
        d.setHours(23, 59, 59, 999);
      }

      if (d < now) {
        alert("Data i godzina muszą być w przyszłości");
        return;
      }
    }

    this.tasks.push({ text, date, time });
    this.term = "";
    document.getElementById("search").value = "";
    this.save();
    this.draw();
  }

  remove(index) {
    this.tasks.splice(index, 1);
    this.save();
    this.draw();
  }

  edit(index, divElement) {
    const currentTask = this.tasks[index];

    divElement.innerHTML = `
      <div class="editForm" style="display: flex; flex-direction: column; gap: 5px; width: 75%;">
        <input id="editInput" type="text" value="${currentTask.text}" style="padding: 5px; width: 100%;">
        <div style="display: flex; gap: 5px;">
          <input id="editDate" type="date" value="${currentTask.date || ''}" style="padding: 5px; flex: 1;">
          <input id="editTime" type="time" value="${currentTask.time || ''}" style="padding: 5px; flex: 1;">
        </div>
      </div>
      <button id="saveBtn" style="padding: 10px; height: fit-content;">Zapisz</button>
    `;

    const input = divElement.querySelector("#editInput");
    const inputDate = divElement.querySelector("#editDate");
    const inputTime = divElement.querySelector("#editTime");
    const saveBtn = divElement.querySelector("#saveBtn");
    input.focus();

    const saveChanges = () => {
      const newValue = input.value.trim();
      const newDate = inputDate.value;
      const newTime = inputTime.value;

      if (newValue.length < 3 || newValue.length > 255) {
        alert("Zmieniony tekst musi mieć od 3 do 255 znaków!");
        this.draw();
        document.removeEventListener("click", outsideClickHandler);
        return;
      }

      if (newDate) {
        const now = new Date();
        const d = new Date(newDate);
        if (newTime) {
          const [hours, minutes] = newTime.split(":");
          d.setHours(hours, minutes, 0, 0);
        } else {
          d.setHours(23, 59, 59, 999);
        }

        if (d < now) {
          alert("Data i godzina muszą być w przyszłości!");
          this.draw();
          document.removeEventListener("click", outsideClickHandler);
          return;
        }
      }

      this.tasks[index] = { text: newValue, date: newDate, time: newTime };
      this.save();
      this.draw();
      document.removeEventListener("click", outsideClickHandler);
    };

    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      saveChanges();
    });

    const stopPropagationElements = [input, inputDate, inputTime, divElement];
    stopPropagationElements.forEach(el => {
      if (el) el.addEventListener("click", (e) => e.stopPropagation());
    });

    const outsideClickHandler = () => {
      saveChanges();
    };

    setTimeout(() => {
      document.addEventListener("click", outsideClickHandler);
    }, 50);
  }
}

document.todo = new Todo();
document.todo.draw();

document.getElementById("addBtn").addEventListener("click", () => {
  const text = document.getElementById("newTask").value.trim();
  const date = document.getElementById("newDate").value;
  const time = document.getElementById("newTime").value;

  document.todo.add(text, date, time);

  document.getElementById("newTask").value = "";
  document.getElementById("newDate").value = "";
  document.getElementById("newTime").value = "";
});

document.getElementById("search").addEventListener("input", (e) => {
  document.todo.term = e.target.value;
  document.todo.draw();
});
