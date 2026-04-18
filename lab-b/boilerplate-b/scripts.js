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

    this.filteredTasks.forEach((task, index) => {
      const div = document.createElement("div");
      div.className = "task";

      let text = task.text;
      if (this.term.length >= 2) {
        const regex = new RegExp(`(${this.term})`, "gi");
        text = text.replace(regex, `<span class="highlight">$1</span>`);
      }

      div.innerHTML = `
        <div class="text">${text}<br><small>${task.date || ""}</small></div>
        <button class="deleteBtn">Usuń</button>
      `;

      div.querySelector(".text").addEventListener("click", () => {
        this.edit(index);
      });

      div.querySelector(".deleteBtn").addEventListener("click", () => {
        this.remove(index);
      });

      list.appendChild(div);
    });
  }

  add(text, date) {
    if (text.length < 3 || text.length > 255) {
      alert("Zadanie musi miec 3–255 znakow");
      return;
    }

    if (date) {
      const now = new Date();
      const d = new Date(date);
      if (d <= now) {
        alert("Data musi byc w przyszlosci");
        return;
      }
    }

    this.tasks.push({ text, date });

    // 🔧 NAPRAWA: reset wyszukiwarki, aby nowe zadanie było widoczne
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

  edit(index) {
    const list = document.getElementById("list");
    const div = list.children[index];
    const old = this.tasks[index].text;

    div.innerHTML = `<input id="editInput" type="text" value="${old}">`;

    const input = div.querySelector("#editInput");
    input.focus();

    const handler = (e) => {
      if (e.target !== input) {
        this.tasks[index].text = input.value.trim();
        this.save();
        this.draw();
        document.removeEventListener("click", handler);
      }
    };

    document.addEventListener("click", handler);
  }
}

document.todo = new Todo();
document.todo.draw();

document.getElementById("addBtn").addEventListener("click", () => {
  const text = document.getElementById("newTask").value.trim();
  const date = document.getElementById("newDate").value;

  document.todo.add(text, date);

  document.getElementById("newTask").value = "";
  document.getElementById("newDate").value = "";
});

document.getElementById("search").addEventListener("input", (e) => {
  document.todo.term = e.target.value;
  document.todo.draw();
});
