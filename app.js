const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


let todos = []; 
app.get('/', (req, res) => {
  const filter = req.query.filter || 'all';

  const filteredTodos =
    filter === 'all'
      ? todos
      : todos.filter(todo => todo.priority === filter);

  res.render('index', {
    todos: filteredTodos,
    filter,
    error: null
  });
});

app.post('/add', (req, res) => {
  const { text, priority } = req.body;

  // Prevent blank todos
  if (!text || !text.trim()) {
    return res.render('index', {
      todos,
      filter: 'all',
      error: 'Task cannot be empty!'
    });
  }

 
  todos.push({
    id: Date.now(),
    text: text.trim(),
    priority: priority || 'medium'
  });

  res.redirect('/');
});


app.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { text, priority } = req.body;

  todos = todos.map(todo => {
    if (todo.id == id) {
      return {
        ...todo,
        text: text.trim(),
        priority
      };
    }
    return todo;
  });

  res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id != id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
