const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = 5000;
const USERS_PATH = './items.json';
const TASKS_PATH = './tasks.json';
const STORE_PATH = './store.json';

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

let users = [];
let tasks = [];
let stores = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const loadUsers = () => {
  if (fs.existsSync(USERS_PATH)) {
    let data = fs.readFileSync(USERS_PATH, 'utf8');
    users = JSON.parse(data);
  }
};

const loadTasks = () => {
  if (fs.existsSync(TASKS_PATH)) {
    let data = fs.readFileSync(TASKS_PATH, 'utf8');
    tasks = JSON.parse(data);
  }
};

const loadStores = () => {
  if (fs.existsSync(STORE_PATH)) {
    let data = fs.readFileSync(STORE_PATH, 'utf8');
    stores = JSON.parse(data);
  }
};

const saveUsers = () => {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
};

const saveTasks = () => {
  fs.writeFileSync(TASKS_PATH, JSON.stringify(tasks, null, 2));
};

loadUsers();
loadTasks();
loadStores();

app.get('/menu/tasks', (req, res) => {
  tasks.sort((a, b) => b.importa - a.importa); // Sort tasks by importa in descending order
  res.json(tasks);
});

app.get('/menu/store', (req, res) => {
  res.json(stores);
});

app.post('/signUp', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const newUser = {
    id: Date.now(),
    username,
    password
  };

  users.push(newUser);
  saveUsers();
  res.status(201).json({ message: 'User created successfully' });
});

app.post('/menu/tasks', (req, res) => {
  const { importa, text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }

  const taskExists = tasks.some(task => task.text === text);
  if (taskExists) {
    return res.status(400).json({ message: 'Task already exists' });
  }

  const newTask = {
    importa: importa || 0, // Default to 0 if importa is not provided
    id: Date.now(),
    text
  };

  tasks.push(newTask);
  saveTasks();
  res.status(201).json({ message: 'Task created successfully' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.delete('/menu/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== parseInt(id, 10));

  saveTasks();
  res.sendStatus(204);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
