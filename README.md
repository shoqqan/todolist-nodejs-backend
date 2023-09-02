<h1>Hello 🟥NFactorial🟥!</h1>
<h2>About the project</h2>

  <p>
    At this project i used clean NodeJS)
    This is good experience for me to write back-end!
  </p>

  <br>

🌐 Live API Documentation: <a target="_blank" href='https://todolist-nodejs-backend.onrender.com/api-docs/'>Live Documentation</a>


<p>
  👉 Here is main URL for requests:  https://todolist-nodejs-backend.onrender.com/*REQUEST*
</p>

<br>

## Table of Contents

- [API Endpoints](#api-endpoints)
- [Examples](#examples)
    <br>


<h3>Created with:</h3>

» NodeJS <br>
» Express <br>
» SwaggerUI <br>




   <h2 id="api-endpoints">API Endpoints</h2>

   <h3>1. Get List of Todo Lists</h3>
    <ul>
        <li><strong>Method:</strong> GET</li>
        <li><strong>URL:</strong> /todolists</li>
        <li><strong>Description:</strong> Retrieves a list of all created Todo lists.</li>
    </ul>

  <h3>2. Create a New Todo List</h3>
    <ul>
        <li><strong>Method:</strong> POST</li>
        <li><strong>URL:</strong> /todolists</li>
        <li><strong>Description:</strong> Creates a new Todo list with the specified title.</li>
        <li><strong>Request Body:</strong>
            <pre><code>{
  "title": "My New Todo List"
}</code></pre>
        </li>
    </ul>

   <h3>3. Get List of Tasks in a Todo List</h3>
    <ul>
        <li><strong>Method:</strong> GET</li>
        <li><strong>URL:</strong> /todolists/{todolist_id}/tasks</li>
        <li><strong>Description:</strong> Retrieves a list of tasks in the specified Todo list.</li>
    </ul>

  <h3>4. Create a New Task</h3>
    <ul>
        <li><strong>Method:</strong> POST</li>
        <li><strong>URL:</strong> /tasks</li>
        <li><strong>Description:</strong> Creates a new task in the specified Todo list.</li>
        <li><strong>Request Body:</strong>
            <pre><code>{
  "todolist_id": "your-todolist-id",
  "title": "New Task"
}</code></pre>
        </li>
    </ul>

   <h3>5. Update Todo List Title</h3>
    <ul>
        <li><strong>Method:</strong> PUT</li>
        <li><strong>URL:</strong> /todolists/{todolist_id}</li>
        <li><strong>Description:</strong> Updates the title of the specified Todo list.</li>
        <li><strong>Request Body:</strong>
            <pre><code>{
  "title": "Updated Todo List Title"
}</code></pre>
        </li>
    </ul>

  <h3>6. Delete Todo List</h3>
    <ul>
        <li><strong>Method:</strong> DELETE</li>
        <li><strong>URL:</strong> /todolists/{todolist_id}</li>
        <li><strong>Description:</strong> Deletes the specified Todo list along with all its tasks.</li>
    </ul>

  <h3>7. Update Task Title</h3>
    <ul>
        <li><strong>Method:</strong> PUT</li>
        <li><strong>URL:</strong> /tasks/{todolist_id}</li>
        <li><strong>Description:</strong> Updates the title of the specified task in the specified Todo list.</li>
        <li><strong>Request Body:</strong>
            <pre><code>{
  "id": "task-id",
  "title": "Updated Task Title"
}</code></pre>
        </li>
    </ul>

   <h3>8. Delete Task</h3>
    <ul>
        <li><strong>Method:</strong> DELETE</li>
        <li><strong>URL:</strong> /tasks/{todolist_id}</li>
        <li><strong>Description:</strong> Deletes the specified task from the specified Todo list.</li>
        <li><strong>Request Body:</strong>
            <pre><code>{
  "task_id": "task-id"
}</code></pre>
        </li>
    </ul>

   <h3>9. Update Task Status</h3>
    <ul>
        <li><strong>Method:</strong> PUT</li>
        <li><strong>URL:</strong> /tasks/{todolist_id}/status</li>
        <li><strong>Description:</strong> Updates the status of the specified task in the specified Todo list.</li>
        <li><strong>Request Body:</strong>
            <pre><code>{
  "task_id": "task-id",
  "status": true
}</code></pre>
        </li>
    </ul>

  <h2 id="examples">Examples</h2>
    <p>For example:   </p>
    <p>https://todolist-nodejs-backend.onrender.com/api/todolists</p>
