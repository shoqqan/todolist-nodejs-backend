const express = require("express");
const fs = require('fs');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const dotenv = require("dotenv");
const databasePathURL = './database/todolistsDB.json';
const defaultDATA = {
    todolists: [
        {
            id: "first",
            title: "What to do?🖊",
            filter: "all"
        },
        {
            id: "second'",
            title: "What to eat?🍕'",
            filter: "all"
        }
    ],
    tasks: {
        first: [
            {id: "lol", title: "Study", isDone: true},
            {id: "lol1", title: "Create Web-Site", isDone: false},
            {id: "lol2", title: "Hangout with friends", isDone: false}
        ],
        second: [
            {id: "lol3", title: "Eags", isDone: false},
            {id: "lol4", title: "Banana", isDone: false}
        ]
    }
};
dotenv.config();
const app = express();
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Todolist NodeJS API',
            version: '1.0.0',
            description: 'Todolist API with noSQL database',
            contact: {
                name: 'Shokan Tatayev',
                url: 'https://shokan-tatayev.vercel.app/',
                email: 'tataev.shokan@gmail.com'
            },
            servers: [`http://localhost:${process.env.PORT}`]
        }
    },
    apis: ["index.js"]
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
const disableTryItOut = {
    swaggerOptions,
    customSiteTitle: 'My API Documentation', // Заголовок вашей документации
    customCss: '.swagger-ui .topbar .download-url-wrapper { display: none }', // Скрываем UI элемент для выполнения запросов
};
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs, disableTryItOut));

const port = 8080;

// GET TODOLISTS


app.use(express.json());
/**
 * @swagger
 * /api/return_default:
 *   get:
 *     summary: Return default value of database
 *     description: Return default value of database for testing
 *     responses:
 *       200:
 *         description: Get success
 */
app.get('/api/return_default', (req, res) => {
    res.json(defaultDATA)
});

app.get('/api/todolists', (req, res) => {
    let rawdata = fs.readFileSync(databasePathURL);
    res.json(JSON.parse(rawdata));
});
/**
 * @swagger
 * /api/todolists:
 *   get:
 *     summary: Get todolist
 *     description: Get todolists
 *     responses:
 *       200:
 *         description: Get success
 */
// GET TASKS FROM TODOLIST
app.get('/api/todolists/:todolist_id/tasks', (req, res) => {
    const {todolist_id} = req.params;
    let rawdata = fs.readFileSync(databasePathURL);
    let todolistsDB = JSON.parse(rawdata);
    if (todolistsDB.tasks[todolist_id]) {
        res.json({tasks: todolistsDB.tasks[todolist_id]});
    } else {
        res.status(404).end();
    }
});

// CREATE TODOLIST
/**
 * @swagger
 * /api/todolists:
 *   post:
 *     summary: Create a new Todolist
 *     description: Create a new Todolist with a specified title.
 *     requestBody:
 *       description: The title of the Todolist to create.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: New Todolist created successfully.
 */
app.post('/api/todolists', (req, res) => {
    const {title} = req.body;
    let rawdata = fs.readFileSync(databasePathURL);
    let todolistsDB = JSON.parse(rawdata);
    const id = Date.now().toString();
    const newToDo = {id, title};
    todolistsDB.todolists.push(newToDo);
    todolistsDB.tasks[id] = [];
    fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB));
    res.json(newToDo);
});

// CHANGE TODOLIST TITLE
/**
 * @swagger
 * /api/todolists/{todolist_id}:
 *   put:
 *     summary: Update Todolist title
 *     description: Update the title of a Todolist with a specified ID.
 *     parameters:
 *       - in: path
 *         name: todolist_id
 *         required: true
 *         description: The ID of the Todolist to update.
 *     requestBody:
 *       description: The updated title for the Todolist.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todolist title updated successfully.
 *       404:
 *         description: Todolist not found.
 */
app.put('/api/todolists/:todolist_id', (req, res) => {
    const {todolist_id} = req.params;
    const {title} = req.body;
    let rawdata = fs.readFileSync('./database/todolistsDB.json');
    let todolistsDB = JSON.parse(rawdata);
    if (todolistsDB.todolists.find(tdl => tdl.id === todolist_id)) {
        todolistsDB.todolists.find(tdl => tdl.id === todolist_id).title = title;
        fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB));
        res.json(todolistsDB.todolists.find(tdl => tdl.id === todolist_id));
    } else {
        res.status(404).end();
    }
});

// DELETE TODOLIST
/**
 * @swagger
 * /api/todolists/{todolist_id}:
 *   delete:
 *     summary: Delete Todolist
 *     description: Delete a Todolist with a specified ID.
 *     parameters:
 *       - in: path
 *         name: todolist_id
 *         required: true
 *         description: The ID of the Todolist to delete.
 *     responses:
 *       200:
 *         description: Todolist deleted successfully.
 *       404:
 *         description: Todolist not found.
 */
app.delete('/api/todolists/:todolist_id', (req, res) => {
    const {todolist_id} = req.params;
    let rawdata = fs.readFileSync('./database/todolistsDB.json');
    let todolistsDB = JSON.parse(rawdata);
    if (todolistsDB.todolists.find(tdl => tdl.id === todolist_id)) {
        delete todolistsDB.tasks[todolist_id];
        todolistsDB.todolists = todolistsDB.todolists.filter(tdl => tdl.id !== todolist_id);
        fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB));
        res.json({message: 'ok'});
    } else {
        res.status(404).end();
    }
});

// CREATE TASK
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new Task
 *     description: Create a new task in a specified Todolist.
 *     requestBody:
 *       description: The task details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               todolist_id:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: New task created successfully.
 */
app.post('/api/tasks', (req, res) => {
    let rawdata = fs.readFileSync('./database/todolistsDB.json');
    let todolistsDB = JSON.parse(rawdata);
    const {todolist_id, title} = req.body;
    if (todolistsDB.tasks[todolist_id]) {
        const newTask = {id: Date.now().toString(), title, isDone: false};
        todolistsDB.tasks[todolist_id].push(newTask);
        fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB));
        res.json(todolistsDB.tasks[todolist_id]);
    } else {
        res.status(404).end();
    }
});

// CHANGE TASK TITLE
/**
 * @swagger
 * /api/tasks/{todoid}:
 *   put:
 *     summary: Update Task title
 *     description: Update the title of a task in a Todolist.
 *     parameters:
 *       - in: path
 *         name: todoid
 *         required: true
 *         description: The ID of the Todolist containing the task.
 *     requestBody:
 *       description: The updated task details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task title updated successfully.
 *       404:
 *         description: Task or Todolist not found.
 */
app.put('/api/tasks/:todoid', (req, res) => {
    let rawdata = fs.readFileSync('./database/todolistsDB.json');
    let todolistsDB = JSON.parse(rawdata);
    const {todoid} = req.params;
    const {id, title} = req.body;
    if (todolistsDB.tasks[todoid]) {
        if (todolistsDB.tasks[todoid].find((el) => el.id === id)) {
            todolistsDB.tasks[todoid].find((el) => el.id === id).title = title;
            fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB));
            res.json(todolistsDB.tasks[todoid].find((el) => el.id === id));
        } else {
            res.status(404).end();
        }
    } else {
        res.status(404).end();
    }
});

// DELETE TASK
/**
 * @swagger
 * /api/tasks/{todolist_id}:
 *   delete:
 *     summary: Delete Task
 *     description: Delete a task from a Todolist.
 *     parameters:
 *       - in: path
 *         name: todolist_id
 *         required: true
 *         description: The ID of the Todolist containing the task.
 *     requestBody:
 *       description: The ID of the task to delete.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task or Todolist not found.
 */
app.delete('/api/tasks/:todolist_id', (req, res) => {
    let rawdata = fs.readFileSync('./database/todolistsDB.json');
    let todolistsDB = JSON.parse(rawdata);
    const {todolist_id} = req.params;
    const {task_id} = req.body;
    if (todolistsDB.tasks[todolist_id]) {
        if (todolistsDB.tasks[todolist_id].find((el) => el.id === task_id)) {
            todolistsDB.tasks[todolist_id] = todolistsDB.tasks[todolist_id].filter(task => task.id !== task_id);
            fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB));
            res.json({message: "deleted"});
        } else {
            res.status(404).end();
        }
    } else {
        res.status(404).end();
    }
});

// CHANGE TASK STATUS
/**
 * @swagger
 * /api/tasks/{todolist_id}/status:
 *   put:
 *     summary: Update Task status
 *     description: Update the status of a task in a Todolist.
 *     parameters:
 *       - in: path
 *         name: todolist_id
 *         required: true
 *         description: The ID of the Todolist containing the task.
 *     requestBody:
 *       description: The ID and status of the task to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task_id:
 *                 type: string
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task status updated successfully.
 *       404:
 *         description: Task or Todolist not found.
 */
app.put('/api/tasks/:todolist_id/status', (req, res) => {
    let rawdata = fs.readFileSync('./database/todolistsDB.json');
    let todolistsDB = JSON.parse(rawdata);
    const {todolist_id} = req.params;
    const {task_id, status} = req.body;
    if (todolistsDB.tasks[todolist_id]) {
        if (todolistsDB.tasks[todolist_id].find((el) => el.id === task_id)) {
            todolistsDB.tasks[todolist_id].find((el) => el.id === task_id).isDone = status;
            fs.writeFileSync(databasePathURL, JSON.stringify(todolistsDB));
            res.json(todolistsDB.tasks[todolist_id].find((el) => el.id === task_id));
        } else {
            res.status(404).end();
        }
    } else {
        res.status(404).end();
    }
});

app.listen(port, () => {
    console.log('Server is running on port 8080');
});
