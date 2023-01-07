const express = require("express")
const path = require('path')
const bodyParser = require('body-parser')
let todolists = [
    {
        id: '123-123', title: 'My todolist'
    },
    {
        id: '321-321', title: 'My second todolist'
    }
]
let tasks = {
    ['123-123']: [
        {id: '321', title: 'do thing', isDone: false},
        {id: '431', title: 'do thing', isDone: true},
        {id: '531', title: 'do thing', isDone: false}
    ]
}

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname, 'build')))
const port = 8080

app.get('/todolists', (req, res) => {
    res.send(path.join(__dirname, 'build', 'index.html'))
})

app.get('/api/todolists', (req, res) => {
    res.json({todolists})
})

app.get('/api/todolists/:id/tasks', (req, res) => {
    const {id} = req.params
    const taskOfTodolist = tasks[id]
    if (taskOfTodolist) {
        res.json({tasks: taskOfTodolist})
    } else {
        res.join({errorMessage: 'not found'})
    }
    res.json({params: req.params})
})


app.post('/api/todolists', (req, res) => {
    const title = req.body.title
    const id = Date.now().toString()
    const newToDo = {id, title}
    todolists.push(newToDo)
    tasks[id] = []
    res.json({newToDo})
})
app.put('/api/todolists/:id', (req, res) => {
    const {id} = req.params
    const title = req.body.title
    let isFinded = false
    todolists.map((tdl) => {
        if (tdl.id === id) {
            tdl.title = title
            isFinded = true
        }
    })
    if (isFinded) {
        res.json({message: 'ok'})
    } else {
        res.json({errorMessage: 'not found'})
    }

})

app.delete('/api/todolists/:id', (req, res) => {
    const {id} = req.params
    delete tasks[id]
    todolists = todolists.filter(tdl => tdl.id !== id)
    res.json({message: 'ok'})
})


app.post('/api/tasks', (req, res) => {
    const {todolist_id} = req.body
    const {title} = req.body
    const newTask = {id: Date.now().toString(), title, isDone: false}
    tasks[todolist_id].push(newTask)
    res.json({message: 'ok'})
})

app.put('/api/tasks/:todoid', (req, res) => {
    const {todoid} = req.params
    const {id} = req.body
    const {title} = req.body
    let isFinded = false
    tasks[todoid].map((t) => {
        if (t.id === id) {
            t.title = title
            isFinded = true
        }
    })
    if (isFinded) {
        res.json({message: 'ok'})
    } else {
        res.json({errorMessage: 'not found'})
    }
})
app.delete('/api/tasks/:id',(req, res)=>{
    const {todolist_id} = req.body
    const {id} = req.params
    tasks[todolist_id]=tasks[todolist_id].filter(t=>t.id!==id)
    res.json({message: 'ok'})

})


app.listen(port, () => {
    console.log('Server is running on port' + port)
})
// const server = http.createServer((req, res) => {
//     const parsedUrl = url.parse(req.url)
//     switch (parsedUrl.pathname) {
//         case '/': {
//             fs.readFile('./pages/index.html',(err, data)=>{
//                 if (err){
//                     res.end('some error')
//                     res.writeHead(500)
//
//                 }
//                 res.writeHead(200)
//                 res.end(data)
//             })
//             break
//         }
//         case '/about': {
//             fs.readFile('./pages/about.html',(err, data)=>{
//                 if (err){
//                     res.end('some error')
//                     res.writeHead(500)
//
//                 }
//                 res.writeHead(200)
//                 res.end(data)
//             })
//             break
//         }
//         case '/todolists': {
//                 res.writeHead(200)
//                 res.end(buildHtml(`
//                 ${
//                     todolists.map((t)=>{
//                         return `<h1>${t.title}</h1>`
//                     })
//                 }
//
//                 `))
//             break
//         }
//         default: {
//             res.writeHead(404)
//             res.end('not found!')
//             break
//         }
//     }
//
// })
//
// server.listen(8080, 'localhost', () => {
//     console.log('server is running')
// })