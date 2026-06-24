const fs = require('fs');
const path = require('path');

const JSON_TASKS_PATH = path.join(__dirname, '..', 'data', 'tasks.json');

// Helper to ensure JSON file database exists and return tasks
const getJsonTasks = () => {
  const dir = path.dirname(JSON_TASKS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(JSON_TASKS_PATH)) {
    fs.writeFileSync(JSON_TASKS_PATH, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(JSON_TASKS_PATH, 'utf-8') || '[]');
  } catch (err) {
    return [];
  }
};

// Helper to save tasks to JSON database
const saveJsonTasks = (tasks) => {
  fs.writeFileSync(JSON_TASKS_PATH, JSON.stringify(tasks, null, 2));
};

// @desc    Get user tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const allTasks = getJsonTasks();
    const userTasks = allTasks.filter(t => t.userId === req.user.id);
    // Sort so newly created tasks appear at the top
    userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, count: userTasks.length, data: userTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, subject } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please add a task title' });
    }

    const allTasks = getJsonTasks();
    const newTask = {
      _id: 'task_' + Date.now(),
      title,
      subject: subject || 'General',
      completed: false,
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    allTasks.push(newTask);
    saveJsonTasks(allTasks);

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle/Update task completion status
// @route   PUT /api/tasks/:id
// @access  Private
exports.toggleTask = async (req, res) => {
  try {
    const allTasks = getJsonTasks();
    const taskIndex = allTasks.findIndex(t => t._id === req.params.id && t.userId === req.user.id);

    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    allTasks[taskIndex].completed = !allTasks[taskIndex].completed;
    allTasks[taskIndex].updatedAt = new Date();
    saveJsonTasks(allTasks);

    res.json({ success: true, data: allTasks[taskIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const allTasks = getJsonTasks();
    const initialLength = allTasks.length;
    const updatedTasks = allTasks.filter(t => !(t._id === req.params.id && t.userId === req.user.id));

    if (initialLength === updatedTasks.length) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    saveJsonTasks(updatedTasks);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
