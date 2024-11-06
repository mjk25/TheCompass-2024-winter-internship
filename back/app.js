const express = require('express');
const app = express();
app.use(express.json());

// 기본 루트 응답
app.get('/', (req, res) => {
    res.send('Start A simple Project Management Dashboard');
});

const projectRoutes = require('./routes/projects');
app.use('/projects', projectRoutes);

const taskRoutes = require('./routes/tasks');
app.use('/projects/:projectId/tasks', taskRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
