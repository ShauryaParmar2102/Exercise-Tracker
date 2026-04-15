const API = "/exercises";

async function loadExercises(url = API) {
    //Fetch Data
    const res = await fetch(url);
    //Convert to JSON
    const exercises = await res.json();

    const list = document.getElementById("ExerciseList");
    //Clear Screen
    list.innerHTML = "";

    //Exercise information - loop thru exercises
    exercises.forEach(exercise => {
        list.innerHTML += `
        <div class="exercise">
        <h3>${exercise.name}</h3>
        <p><b>type:</b> ${exercise.type}</p>
        <p><b>duration:</b> ${exercise.duration} </p>
        <small>${exercise.date}</small><br>
        <button onclick="deleteExercise('${exercise.id}')">Delete</button>
        </div>
        `;
    });
}

// Add Exercise - takes input from frontend and sends it to backend
async function addExercise() {
        //Get the values typed in the input fields
    const name = document.getElementById("name").value.trim();
    const type = document.getElementById("type").value.trim();
    const duration = document.getElementById("duration").value.trim();

    if(!name || !type) { //Validate
        showError("Please add Exercise Name and Type") 
            return;
    }
        //Send Exercise to server
        const res = await fetch("/exercises", { //Send POST request to server/backend
            method: "POST",
              headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name, type, duration})
        });
        //read server response
        const data = await res.json();

        if(!res.ok) {
            showError(data.error || "Something went wrong");
            return;
        }

        clearError();

    document.getElementById("name").value = "";
    document.getElementById("type").value = "";
    document.getElementById("duration").value = "";

        loadExercises(); //Gets exercises from server and displays them
    }
        //Delete Exercise
    async function deleteExercise(id) {
    await fetch(`${API}/${id}`, {method: "DELETE"}); //Removes Exercise from backend
    loadExercises(); // Reload list
    }

        //Search for an exercise
    function searchExercises() {
        const value = document.getElementById("search").value;
        loadExercises(`${API}?search=${value}`);
    }

    //Filters Exercises = Asks backend for filtered data
    function filterExercises(type) {
    loadExercises(`${API}?type=${type}`);
    }

    function showError(message) {
    document.getElementById("errorMsg").innerText = message; //Shows Error message on the screen
}

function clearError() {
    document.getElementById("errorMsg").innerText = ""; //Clears Error Message
}

loadExercises(); //Runs automatically when page opens and loads all exercises immediately

