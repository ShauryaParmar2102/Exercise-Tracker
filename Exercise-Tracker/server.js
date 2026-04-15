const express = require("express");
const fs = require("fs");

const app = express();
const port = 3030;

//Middleware
app.use(express.json());
//Any file in the Public folder can be accessed in browser
app.use(express.static("public"));

//File Storing exercises
const data_file = "exercises.json";


//Read data from file
const getExercises = () => {
    if (!fs.existsSync(data_file)) return []; // If file doesn't exist, return empty array
    const data = fs.readFileSync(data_file);
    return JSON.parse(data);
};

const writeExercises = (exercises) => {
    fs.writeFileSync(data_file, JSON.stringify(exercises, null, 2));
};

app.post("/exercises", (req, res) => { //Add Exercise (saves new exercise to file)
    const { name, type, duration } = req.body;

    if (!name || !type) {
        return res.status(400).json({ error: "Name and Type are required" });
        }

    const exercises = getExercises();

           const newExercise = {
        id: Date.now().toString(),
        name: name.trim(),                  // Exercise name
        type: type.trim(),                  // Cardio / Strength / etc.
        duration: duration,           // Duration in minutes
        completed: false,                   // Whether exercise is done
        date: new Date().toLocaleString()   // Timestamp when added
        };

    exercises.push(newExercise);
    writeExercises(exercises);
    res.status(201).json(newExercise);
});

app.get("/exercises", (req,res) => { //Gives list of exercises
    let exercises = getExercises();
    const { type, status, search } = req.query;

    //Searches exercise
    if (search) {
        const s = search.toLowerCase();
        exercises = exercises.filter(e => 
            e.name.toLowerCase().includes(s) ||
            e.type.toLowerCase().includes(s)
        );
    }

    if (status) {
        exercises = exercises.filter(e =>
            e.completed === (status === "true")
        );
    }

    if (type) {
        const t = type.toLowerCase();

        exercises = exercises.filter(e =>
            e.type.toLowerCase() === t
        );
    }

    res.json(exercises);
});

//GET EXERCISE BY ID
app.get("/exercises/:id", (req, res) => {
    const exercises = getExercises();
    const exercise = exercises.find(e => e.id === req.params.id);

    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

        res.json(exercise);
});

//Delete Exercise by ID 
app.delete("/exercises/:id", (req,res) => { //Removes exercise from file
    let exercises = getExercises();
    const filtered = exercises.filter(e => e.id !== req.params.id);

    if (filtered.length === exercises.length) {
        return res.status(404).json({error: "exercise not found"});
    }

    writeExercises(filtered);
    res.json({message: "Exercise Deleted"})
});

//Toggle Status of Exercise - Finish/Unfinished
app.put("/exercises/:id/status", (req, res) => {
    let exercises = getExercises();

    const exercise = exercises.find(e => e.id === req.params.id);

    if(!exercise) {
        return res.status(404).json({error: "exercise not found"});
    }

     exercise.completed = !exercise.completed;

    writeExercises(exercises);
    res.json(exercise);
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});