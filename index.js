const express = require("express")
const path = require('path')
const bodyParser = require('body-parser')
const fs = require('fs');
const databasePathURL = './database/todolistsDB.json'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname, 'build')))
const port = 8080

app.get('/todolists', (req, res) => {
    res.send(path.join(__dirname, 'build', 'index.html'))
})

//

// GET TODOLISTS
app.get('/api/todolists', (req, res) => {
    let rawdata = fs.readFileSync(databasePathURL)
    res.json(JSON.parse(rawdata))
})


// GET TASKS FROM TODOLIST
app.get('/api/todolists/:todolist_id/tasks', (req, res) => {
    const {todolist_id} = req.params
    let rawdata = fs.readFileSync(databasePathURL)
    let todolistsDB = JSON.parse(rawdata)
    if (todolistsDB.tasks[todolist_id]) {
        res.json({tasks: todolistsDB.tasks[todolist_id]})
    } else {
        res.status(404).end()
    }
})

// CREATE TODOLIST
app.post('/api/todolists', (req, res) => {
    const {title} = req.body
    let rawdata = fs.readFileSync(databasePathURL)
    let todolistsDB = JSON.parse(rawdata)
    const id = Date.now().toString()
    const newToDo = {id, title}
    todolistsDB.todolists.push(newToDo)
    todolistsDB.tasks[id] = []
    fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB))
    res.json(newToDo)
})


//CHANGE TODOLIST TITLE
app.put('/api/todolists/:todolist_id', (req, res) => {
    const {todolist_id} = req.params
    const {title} = req.body
    let rawdata = fs.readFileSync('./database/todolistsDB.json')
    let todolistsDB = JSON.parse(rawdata)
    if (todolistsDB.todolists.find(tdl => tdl.id === todolist_id)) {
        todolistsDB.todolists.find(tdl => tdl.id === todolist_id).title = title
        fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB))
        res.json(todolistsDB.todolists.find(tdl => tdl.id === todolist_id))
    } else {
        res.status(404).end()
    }
})

//DELETE TODOLIST
app.delete('/api/todolists/:todolist_id', (req, res) => {
    const {todolist_id} = req.params
    let rawdata = fs.readFileSync('./database/todolistsDB.json')
    let todolistsDB = JSON.parse(rawdata)
    if (todolistsDB.todolists.find(tdl => tdl.id === todolist_id)) {
        delete todolistsDB.tasks[todolist_id]
        todolistsDB.todolists = todolistsDB.todolists.filter(tdl => tdl.id !== todolist_id)
        fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB))
        res.json({message: 'ok'})
    } else {
        res.status(404).end()
    }
})


//CREATE TASK
app.post('/api/tasks', (req, res) => {
    let rawdata = fs.readFileSync('./database/todolistsDB.json')
    let todolistsDB = JSON.parse(rawdata)
    const {todolist_id} = req.body
    const {title} = req.body
    if (todolistsDB.tasks[todolist_id]) {
        const newTask = {id: Date.now().toString(), title, isDone: false}
        todolistsDB.tasks[todolist_id].push(newTask)
        fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB))
        res.json(todolistsDB.tasks[todolist_id])
    } else {
        res.status(404).end()
    }

})

//CHANGE TASK TITLE
app.put('/api/tasks/:todoid', (req, res) => {
    let rawdata = fs.readFileSync('./database/todolistsDB.json')
    let todolistsDB = JSON.parse(rawdata)
    const {todoid} = req.params
    const {id} = req.body
    const {title} = req.body
    if (todolistsDB.tasks[todoid]) {
        if (todolistsDB.tasks[todoid].find((el) => el.id === id)) {
            todolistsDB.tasks[todoid].find((el) => el.id === id).title = title
            fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB))
            res.json(todolistsDB.tasks[todoid].find((el) => el.id === id))
        } else {
            res.status(404).end()
        }
    } else {
        res.status(404).end()
    }
})

//DELETE TASK
app.delete('/api/tasks/:todolist_id', (req, res) => {
    let rawdata = fs.readFileSync('./database/todolistsDB.json')
    let todolistsDB = JSON.parse(rawdata)
    const {todolist_id} = req.params
    const {task_id} = req.body
    if (todolistsDB.tasks[todolist_id]) {
        if (todolistsDB.tasks[todolist_id].find((el) => el.id === task_id)) {
            todolistsDB.tasks[todolist_id] = todolistsDB.tasks[todolist_id].filter(task => task.id !== task_id)
            fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB))
            res.json(todolistsDB.tasks[todolist_id])
        } else {
            res.status(404).end()
        }
    } else {
        res.status(404).end()
    }
})


//CHANGE TASK STATUS
app.put('/api/tasks/:todolist_id/status', (req, res) => {
    let rawdata = fs.readFileSync('./database/todolistsDB.json')
    let todolistsDB = JSON.parse(rawdata)
    const {todolist_id} = req.params
    const {task_id} = req.body
    const {status} = req.body
    if (todolistsDB.tasks[todolist_id]) {
        if (todolistsDB.tasks[todolist_id].find((el) => el.id === task_id)) {
            todolistsDB.tasks[todolist_id].find((el) => el.id === task_id).isDone = status
            fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB))
            res.json(todolistsDB.tasks[todolist_id].find((el) => el.id === task_id))
        } else {
            res.status(404).end()
        }
    } else {
        res.status(404).end()
    }
})

app.listen(port, () => {
    console.log('Server is running on port' + port)
})
