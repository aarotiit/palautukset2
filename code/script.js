(function () {
  var input = document.getElementById("task-input");
  var addBtn = document.getElementById("add-btn");
  var list = document.getElementById("list");
  var empty = document.getElementById("empty");
  var btnAll = document.getElementById("filter-all");
  var btnActive = document.getElementById("filter-active");
  var btnCompleted = document.getElementById("filter-completed");

  var tasks = [];
  var filter = "all";

  function load() {
    try {
      var saved = localStorage.getItem("tasks");
      tasks = saved ? JSON.parse(saved) : [];
    } catch (e) {
      tasks = [];
    }
  }

  function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function setFilter(next) {
    filter = next;
    btnAll.classList.toggle("active", filter === "all");
    btnActive.classList.toggle("active", filter === "active");
    btnCompleted.classList.toggle("active", filter === "completed");
    render();
  }

  function addTask() {
    var text = (input.value || "").trim();
    if (!text) return;
    var task = { id: Date.now(), text: text, done: false };
    tasks.unshift(task);
    input.value = "";
    save();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map(function (t) {
      return t.id === id ? { id: t.id, text: t.text, done: !t.done } : t;
    });
    save();
    render();
  }

  function removeTask(id) {
    tasks = tasks.filter(function (t) {
      return t.id !== id;
    });
    save();
    render();
  }

  function render() {
    var items = tasks.filter(function (t) {
      if (filter === "active") return !t.done;
      if (filter === "completed") return t.done;
      return true;
    });

    list.innerHTML = "";
    if (items.length === 0) {
      empty.style.display = "block";
    } else {
      empty.style.display = "none";
    }

    items.forEach(function (t) {
      var li = document.createElement("li");
      li.className = "item" + (t.done ? " done" : "");

      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!t.done;
      cb.addEventListener("change", function () {
        toggleTask(t.id);
      });

      var span = document.createElement("span");
      span.className = "item-text";
      span.textContent = t.text;

      var del = document.createElement("button");
      del.className = "delete-btn";
      del.textContent = "Delete";
      del.addEventListener("click", function () {
        removeTask(t.id);
      });

      li.appendChild(cb);
      li.appendChild(span);
      li.appendChild(del);
      list.appendChild(li);
    });
  }

  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
  });
  btnAll.addEventListener("click", function () {
    setFilter("all");
  });
  btnActive.addEventListener("click", function () {
    setFilter("active");
  });
  btnCompleted.addEventListener("click", function () {
    setFilter("completed");
  });

  load();
  render();
})();
