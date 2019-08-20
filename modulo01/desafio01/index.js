const express = require("express");

const server = express();

server.use(express.json());

const projects = [{ id: "1", title: "np", tasks: [] }];

let requestsCounter = 0;

server.use((req, res, next) => {
  requestsCounter++;
  console.log(`requestCounter: ${requestsCounter}`);

  next();
});

function doesThisProjectExists(req, res, next) {
  const index = projects.findIndex(p => {
    return p.id == req.params.id;
  });
  if (index == -1) {
    return res.status(400).json({ error: "Id not found!" });
  }

  req.index = index;

  next();
}

// Create
server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  // console.log(projects[0].title);

  projects.push({
    id: id,
    title: title,
    tasks: []
  });

  return res.json(projects);
});

// Read all projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Update Project's name by id
server.put("/projects/:id", doesThisProjectExists, (req, res) => {
  const { newTitle } = req.body;
  // const { id } = req.params;
  // const index = projects.findIndex(p => {
  //   return p.id == id;
  // });

  projects[req.index].title = newTitle;

  return res.json(projects[req.index]);
});

// Delete Project
server.delete("/projects/:id", doesThisProjectExists, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => {
    return p.id == id;
  });

  projects.splice(index, 1);

  return res.send();
});

// Create new task in the project by id
server.post("/projects/:id/tasks", doesThisProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const index = projects.findIndex(p => {
    return p.id == id;
  });

  projects[index].tasks.push(title);

  return res.json(projects[index]);
});

server.listen(3002);
