/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 1 — APP SETUP & DATA
========================================== */

// ---------- STORAGE ----------

let notes = JSON.parse(localStorage.getItem("notes")) || [];

let settings = JSON.parse(
    localStorage.getItem("settings")
) || {

    darkMode:false,

    streak:0,

    lastOpened:"",

    notifications:true

};

// ---------- ELEMENTS ----------

const notesList =
    document.getElementById("notes");

const noteInput =
    document.getElementById("noteInput");

const priority =
    document.getElementById("priority");

const category =
    document.getElementById("category");

const dueDate =
    document.getElementById("dueDate");

const addBtn =
    document.getElementById("addBtn");

const searchInput =
    document.getElementById("searchInput");

const filterCategory =
    document.getElementById("filterCategory");

const sortBy =
    document.getElementById("sortBy");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const favoriteTasks =
    document.getElementById("favoriteTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const dueTodayCard =
    document.getElementById("dueToday");

const streakCard =
    document.getElementById("streak");

// ---------- SAVE ----------

function saveNotes(){

    localStorage.setItem(

        "notes",

        JSON.stringify(notes)

    );

}

// ---------- SETTINGS ----------

function saveSettings(){

    localStorage.setItem(

        "settings",

        JSON.stringify(settings)

    );

}

// ---------- UNIQUE ID ----------

function createID(){

    return Date.now().toString(36)

        +

        Math.random()

        .toString(36)

        .substring(2,8);

}

// ---------- FIND NOTE ----------

function getNote(id){

    return notes.find(

        note => note.id === id

    );

}

// ---------- GREETING ----------

function updateGreeting(){

    const greeting =
        document.getElementById("greeting");

    if(!greeting) return;

    const hour =
        new Date().getHours();

    if(hour < 12){

        greeting.textContent =
        "☀️ Good Morning";

    }

    else if(hour < 18){

        greeting.textContent =
        "🌤 Good Afternoon";

    }

    else{

        greeting.textContent =
        "🌙 Good Evening";

    }

}

updateGreeting();
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 2 — ADD NOTES
========================================== */

/* ---------- ADD NOTE ---------- */

function addNote(){

    const text = noteInput.value.trim();

    if(text===""){

        showToast(
            "Please enter a note.",
            "warning"
        );

        noteInput.focus();

        return;

    }

    const note={

        id:createID(),

        text:text,

        priority:priority.value,

        category:category.value,

        dueDate:dueDate.value,

        completed:false,

        favorite:false,

        pinned:false,

        created:new Date().toISOString()

    };

    notes.unshift(note);

    saveNotes();

    clearDraft();

    clearInputs();

    showToast(
        "✅ Note added",
        "success"
    );

    displayNotes();

}

/* ---------- CLEAR INPUTS ---------- */

function clearInputs(){

    noteInput.value="";

    priority.selectedIndex=1;

    category.selectedIndex=0;

    dueDate.value="";

}

/* ---------- DRAFT ---------- */

const savedDraft =
    localStorage.getItem("draft");

if(savedDraft){

    noteInput.value = savedDraft;

}

noteInput.addEventListener(

    "input",

    function(){

        localStorage.setItem(

            "draft",

            this.value

        );

    }

);

function clearDraft(){

    localStorage.removeItem("draft");

}

/* ---------- ENTER KEY ---------- */

noteInput.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            addNote();

        }

    }

);

/* ---------- ADD BUTTON ---------- */

addBtn.addEventListener(

    "click",

    addNote

);
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 3 — DISPLAY NOTES
========================================== */

function displayNotes(){

    notesList.innerHTML = "";

    let filtered = getFilteredNotes();

    /* SEARCH */

    const search = searchInput.value
        .toLowerCase()
        .trim();

    if(search){

        filtered = filtered.filter(note =>

            note.text
                .toLowerCase()
                .includes(search)

        );

    }

    /* FILTER */

    switch(filterCategory.value){

        case "pending":
            filtered = filtered.filter(
                note => !note.completed
            );
            break;

        case "completed":
            filtered = filtered.filter(
                note => note.completed
            );
            break;

        case "favorites":
            filtered = filtered.filter(
                note => note.favorite
            );
            break;

        case "high":
            filtered = filtered.filter(
                note => note.priority.includes("High")
            );
            break;

        case "medium":
            filtered = filtered.filter(
                note => note.priority.includes("Medium")
            );
            break;

        case "low":
            filtered = filtered.filter(
                note => note.priority.includes("Low")
            );
            break;

    }

    /* PINNED FIRST */

    filtered.sort((a,b)=>

        Number(b.pinned)-

        Number(a.pinned)

    );

    /* EMPTY */

    if(filtered.length===0){

        notesList.innerHTML =

        `<div class="empty-state">

            <div class="empty-icon">📝</div>

            <h2>No Notes Found</h2>

            <p>Create a new note to begin.</p>

        </div>`;

        updateDashboard();

        return;

    }

    /* BUILD CARDS */

    filtered.forEach(note=>{

        let priorityClass="priority-low";

        if(note.priority.includes("High"))
            priorityClass="priority-high";

        if(note.priority.includes("Medium"))
            priorityClass="priority-medium";

        const li=document.createElement("li");

        if(note.completed)
            li.classList.add("completed");

        li.innerHTML=`

<div class="note-card">

<div class="note-header">

<div class="note-left">

<input
type="checkbox"
${note.completed ? "checked":""}
class="complete">

<div class="note-content">

<div class="note-title">

${note.text}

</div>

<div class="badges">

<span class="priority-badge ${priorityClass}">

${note.priority}

</span>

<span class="category-badge">

${note.category}

</span>

${note.favorite ?

'<span class="favorite-badge">⭐ Favorite</span>'

:

''

}

${note.pinned ?

'<span class="pin-badge">📌 Pinned</span>'

:

''

}

</div>

<div class="due-date">

📅 ${note.dueDate || "No due date"}

</div>

</div>

</div>

</div>

<div class="actions">

<button class="favorite">

${note.favorite ? "⭐":"☆"}

</button>

<button class="pin">

${note.pinned ? "📌":"📍"}

</button>

<button class="edit">

✏️

</button>

<button class="delete">

🗑️

</button>

</div>

</div>

`;

        notesList.appendChild(li);

        /* EVENTS */

        li.querySelector(".complete").onclick=()=>{

            toggleComplete(note.id);

        };

        li.querySelector(".favorite").onclick=()=>{

            toggleFavorite(note.id);

        };

        li.querySelector(".pin").onclick=()=>{

            togglePin(note.id);

        };

        li.querySelector(".edit").onclick=()=>{

            editNote(note.id);

        };

        li.querySelector(".delete").onclick=()=>{

            deleteNote(note.id);

        };

    });

    updateDashboard();

}
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 4 — NOTE ACTIONS
========================================== */

/* ---------- COMPLETE ---------- */

function toggleComplete(id){

    const note = getNote(id);

    if(!note) return;

    note.completed = !note.completed;

    saveNotes();

    showToast(
        note.completed
        ? "✅ Task completed"
        : "↩️ Task marked as pending",
        "success"
    );

    displayNotes();

}

/* ---------- FAVORITE ---------- */

function toggleFavorite(id){

    const note = getNote(id);

    if(!note) return;

    note.favorite = !note.favorite;

    saveNotes();

    showToast(

        note.favorite
        ? "⭐ Added to favorites"
        : "⭐ Removed from favorites",

        "info"

    );

    displayNotes();

}

/* ---------- PIN ---------- */

function togglePin(id){

    const note = getNote(id);

    if(!note) return;

    note.pinned = !note.pinned;

    saveNotes();

    showToast(

        note.pinned
        ? "📌 Note pinned"
        : "📍 Note unpinned",

        "info"

    );

    displayNotes();

}

/* ---------- EDIT ---------- */

function editNote(id){

    const note = getNote(id);

    if(!note) return;

    const updated = prompt(

        "Edit your note:",

        note.text

    );

    if(updated === null) return;

    if(updated.trim()===""){

        showToast(

            "Note cannot be empty",

            "warning"

        );

        return;

    }

    note.text = updated.trim();

    saveNotes();

    showToast(

        "✏️ Note updated",

        "success"

    );

    displayNotes();

}

/* ---------- DELETE ---------- */

let lastDeletedNote = null;

let lastDeletedIndex = null;

function deleteNote(id){

    const index = notes.findIndex(

        note => note.id === id

    );

    if(index === -1) return;

    lastDeletedNote = {...notes[index]};

    lastDeletedIndex = index;

    notes.splice(index,1);

    saveNotes();

    showToast(

        "🗑️ Note deleted",

        "error"

    );

    displayNotes();

}

/* ---------- UNDO DELETE ---------- */

function undoDelete(){

    if(!lastDeletedNote) return;

    notes.splice(

        lastDeletedIndex,

        0,

        lastDeletedNote

    );

    lastDeletedNote = null;

    lastDeletedIndex = null;

    saveNotes();

    showToast(

        "↩️ Note restored",

        "success"

    );

    displayNotes();

}
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 5 — SEARCH, FILTER & SORT
========================================== */

/* ---------- FILTER NOTES ---------- */

function getFilteredNotes(){

    let filtered = [...notes];

    /* SEARCH */

    const search = searchInput.value
        .trim()
        .toLowerCase();

    if(search){

        filtered = filtered.filter(note=>

            note.text
                .toLowerCase()
                .includes(search)

        );

    }

    /* FILTER */

    switch(filterCategory.value){

        case "pending":

            filtered = filtered.filter(
                note => !note.completed
            );

            break;

        case "completed":

            filtered = filtered.filter(
                note => note.completed
            );

            break;

        case "favorites":

            filtered = filtered.filter(
                note => note.favorite
            );

            break;

        case "high":

            filtered = filtered.filter(
                note => note.priority.includes("High")
            );

            break;

        case "medium":

            filtered = filtered.filter(
                note => note.priority.includes("Medium")
            );

            break;

        case "low":

            filtered = filtered.filter(
                note => note.priority.includes("Low")
            );

            break;

    }

    /* SORT */

    switch(sortBy.value){

        case "priority":

            const priorityOrder={

                "🔴 High":1,

                "🟡 Medium":2,

                "🟢 Low":3

            };

            filtered.sort(

                (a,b)=>

                priorityOrder[a.priority]-

                priorityOrder[b.priority]

            );

            break;

        case "date":

            filtered.sort(

                (a,b)=>

                (a.dueDate || "9999-12-31")

                .localeCompare(

                    b.dueDate || "9999-12-31"

                )

            );

            break;

        case "favorite":

            filtered.sort(

                (a,b)=>

                Number(b.favorite)-

                Number(a.favorite)

            );

            break;

        case "completed":

            filtered.sort(

                (a,b)=>

                Number(b.completed)-

                Number(a.completed)

            );

            break;

        default:

            /* Newest */

            filtered.sort(

                (a,b)=>

                new Date(b.created)-

                new Date(a.created)

            );

    }

    /* PINNED ALWAYS FIRST */

    filtered.sort(

        (a,b)=>

        Number(b.pinned)-

        Number(a.pinned)

    );

    return filtered;

}

/* ---------- LIVE SEARCH ---------- */

searchInput.addEventListener(

    "input",

    displayNotes

);

/* ---------- FILTER ---------- */

filterCategory.addEventListener(

    "change",

    displayNotes

);

/* ---------- SORT ---------- */

sortBy.addEventListener(

    "change",

    displayNotes

);
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 6 — DASHBOARD & PROGRESS
========================================== */

/* ---------- DASHBOARD ---------- */

function updateDashboard(){

    const total = notes.length;

    const completed =
        notes.filter(note => note.completed).length;

    const favorites =
        notes.filter(note => note.favorite).length;

    const pending =
        total - completed;

    const today =
        new Date().toISOString().split("T")[0];

    const dueToday =
        notes.filter(note =>

            !note.completed &&
            note.dueDate === today

        ).length;

    /* Update Cards */

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    favoriteTasks.textContent = favorites;

    pendingTasks.textContent = pending;

    dueTodayCard.textContent = dueToday;

    /* Progress */

    updateProgress();

    /* Counter */

    const counter =
        document.getElementById("counter");

    if(counter){

        counter.textContent =
            `${total} Notes`;

    }

}

/* ---------- PROGRESS ---------- */

function updateProgress(){

    if(notes.length===0){

        progressBar.style.width = "0%";

        progressText.textContent =
            "0% Complete";

        return;

    }

    const completed =
        notes.filter(note =>

            note.completed

        ).length;

    const percent = Math.round(

        (completed / notes.length) * 100

    );

    progressBar.style.width =
        percent + "%";

    progressText.textContent =
        percent + "% Complete";

}

/* ---------- DAILY STREAK ---------- */

function updateStreak(){

    const today =
        new Date().toDateString();

    if(settings.lastOpened !== today){

        settings.lastOpened = today;

        settings.streak++;

        saveSettings();

    }

    streakCard.textContent =
        settings.streak + "🔥";

}

/* ---------- REFRESH ---------- */

updateDashboard();

updateStreak();
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 7 — TOAST NOTIFICATIONS
========================================== */

/* ---------- SHOW TOAST ---------- */

function showToast(message,type="info"){

    const oldToast =
        document.querySelector(".toast");

    if(oldToast){

        oldToast.remove();

    }

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.style.opacity="0";

        toast.style.transform=
            "translateY(20px)";

        setTimeout(()=>{

            toast.remove();

        },300);

    },2500);

}

/* ---------- CHECK REMINDERS ---------- */

function checkReminders(){

    const today =
        new Date().toISOString().split("T")[0];

    const overdue =
        notes.filter(note=>

            !note.completed &&
            note.dueDate &&
            note.dueDate < today

        );

    const dueToday =
        notes.filter(note=>

            !note.completed &&
            note.dueDate===today

        );

    if(overdue.length){

        showToast(

            `🚨 ${overdue.length} overdue task(s)`,

            "error"

        );

    }

    else if(dueToday.length){

        showToast(

            `📅 ${dueToday.length} task(s) due today`,

            "warning"

        );

    }

}

/* ---------- SUCCESS HELPERS ---------- */

function noteAddedToast(){

    showToast(

        "✅ Note added successfully",

        "success"

    );

}

function noteDeletedToast(){

    showToast(

        "🗑️ Note deleted",

        "error"

    );

}

function noteUpdatedToast(){

    showToast(

        "✏️ Note updated",

        "success"

    );

}

function favoriteToast(){

    showToast(

        "⭐ Favorites updated",

        "info"

    );

}

function completedToast(){

    showToast(

        "🎉 Task completed",

        "success"

    );

}

/* ---------- RUN REMINDERS ---------- */

checkReminders();
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 8 — DARK MODE & SETTINGS
========================================== */

/* ---------- LOAD SETTINGS ---------- */

function loadSettings(){

    if(settings.darkMode){

        document.body.classList.add("dark");

    }

}

/* ---------- TOGGLE DARK MODE ---------- */

function toggleDarkMode(){

    document.body.classList.toggle("dark");

    settings.darkMode =
        document.body.classList.contains("dark");

    saveSettings();

    showToast(

        settings.darkMode
        ? "🌙 Dark Mode Enabled"
        : "☀️ Light Mode Enabled",

        "info"

    );

}

/* ---------- RESET SETTINGS ---------- */

function resetSettings(){

    settings = {

        darkMode:false,

        streak:0,

        lastOpened:"",

        notifications:true

    };

    saveSettings();

    document.body.classList.remove("dark");

    updateStreak();

    showToast(

        "⚙️ Settings Reset",

        "warning"

    );

}

/* ---------- AUTO SAVE SETTINGS ---------- */

window.addEventListener(

    "beforeunload",

    saveSettings

);

/* ---------- SYSTEM THEME ---------- */

if(

    !localStorage.getItem("settings") &&

    window.matchMedia(

        "(prefers-color-scheme: dark)"

    ).matches

){

    settings.darkMode = true;

}

loadSettings();
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 9 — IMPORT & EXPORT
========================================== */

/* ---------- EXPORT NOTES ---------- */

function exportNotes(){

    const data = JSON.stringify(notes, null, 2);

    const blob = new Blob(
        [data],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "NovaNotes_Backup.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    showToast(
        "📤 Notes exported successfully",
        "success"
    );

}

/* ---------- IMPORT NOTES ---------- */

function importNotes(event){

    const file = event.target.files[0];

    if(!file){

        return;

    }

    const reader = new FileReader();

    reader.onload = function(e){

        try{

            const imported =
                JSON.parse(e.target.result);

            if(!Array.isArray(imported)){

                throw new Error();

            }

            notes = imported;

            saveNotes();

            displayNotes();

            showToast(
                "📥 Notes imported successfully",
                "success"
            );

        }

        catch{

            showToast(
                "❌ Invalid backup file",
                "error"
            );

        }

    };

    reader.readAsText(file);

}

/* ---------- AUTO BACKUP ---------- */

function autoBackup(){

    localStorage.setItem(

        "NovaNotesBackup",

        JSON.stringify(notes)

    );

}

/* ---------- RESTORE BACKUP ---------- */

function restoreBackup(){

    const backup = localStorage.getItem(

        "NovaNotesBackup"

    );

    if(!backup) return;

    try{

        notes = JSON.parse(backup);

        saveNotes();

        displayNotes();

    }

    catch{

        console.log("Backup could not be restored.");

    }

}

/* ---------- SAVE BACKUP ---------- */

window.addEventListener(

    "beforeunload",

    autoBackup

);
/* ==========================================
   NOVA NOTES V8.5 PRO
   PART 10 — APP STARTUP
========================================== */

/* ---------- DELETE ALL ---------- */

function deleteAllNotes(){

    if(notes.length===0){

        showToast(
            "There are no notes to delete.",
            "warning"
        );

        return;

    }

    if(confirm("Delete all notes?")){

        notes=[];

        saveNotes();

        displayNotes();

        showToast(
            "🗑️ All notes deleted",
            "error"
        );

    }

}

/* ---------- START APP ---------- */

function startApp(){

    loadSettings();

    updateGreeting();

    updateStreak();

    updateDashboard();

    displayNotes();

    checkReminders();

}

/* ---------- RUN ---------- */

document.addEventListener(

    "DOMContentLoaded",

    startApp

);
/* ==========================================
   SERVICE WORKER
========================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => {

                console.log("Nova Notes is ready for offline use.");

            })
            .catch(error => {

                console.log("Service Worker Error:", error);

            });

    });

}