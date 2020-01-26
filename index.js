const express = require('express');
const server = express();
server.use(express.json());

const projects = [];
let numReq = 0;

function addNumReq(req, res, next) {
  numReq++;
  console.log('Número de requests: ' + numReq);
  return next();
}
server.use(addNumReq);

server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach(proj => {
    if (proj.id === id) {
      proj.title = title;
      return res.json(proj);
    }
  });
  return null;
});

server.delete('/projects/:id', checkProjectExists, addNumReq, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  projects.splice(projectIndex, 1);
  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const projectIndex = projects.findIndex(p => p.id === id);
  projects[projectIndex].tasks.push(title);
  return res.json(projects);
});

// middlewares

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  if (projectIndex < 0) {
    return res.status(400).json({ error: 'Project not found' });
  }
  return next();
}

server.listen(3000);
