const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router({ mergeParams: true });
const projectDataPath = path.join(__dirname, '../data/projectData.json');
const taskDataPath = path.join(__dirname, '../data/taskData.json');

// 특정 프로젝트의 모든 태스크 조회
router.get('/', async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await fs.readJson(taskDataPath);
        const projectTasks = tasks.filter(task => task.pjId === projectId);

        if (!projectTasks) {
            return res.status(404).json({ error : 'No task in the project'});
        }
        res.json(projectTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get tasks' });
    }
});

// 새 태스크 생성
router.post('/', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, priority, dueDate } = req.body;

        // 프로젝트 ID 확인
        if (!projectId) {
            return res.status(404).json({ error: '해당 프로젝트가 존재하지 않습니다.' });
        }

        // 유효한 priority 확인
        const validPriorities = ['high', 'medium', 'low'];
        if (validPriorities.includes(priority)) {
            return res.status(400).json({ error: 'Priority는 high, medium, low 중 하나여야 합니다.' });
        }

        // 유효한 duedate
        if (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
            return res.status(400).json({
            message: "dueDate 형식은 (YYYY-MM-DD)를 따라야합니다.",
            });
        }

        const tasks = await fs.readJson(taskDataPath);
        const newTask = {
            pjId: projectId,
            id: (tasks.length + 1).toString(),
            title: title,
            description: description,
            priority: priority,
            dueDate: dueDate,
            status: 'not-started'
        };
        tasks.push(newTask);
        await fs.writeJson(taskDataPath, tasks);

        // 프로젝트 데이터 tasks 수정
        const projects = await fs.readJson(projectDataPath);
        const project = projects.find(p => p.id === projectId);

        if (!project) {
            return res.status(404).json({ error: '해당 프로젝트를 찾을 수 없습니다.' });
        }

        project.tasks.push(newTask.id);
        await fs.writeJson(projectDataPath, projects);

        res.status(201).json(newTask);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '태스크 생성에 실패했습니다.' });
    }
});


// 태스크 수정
router.put('/:taskId', async (req, res) => {
    try {
        const { projectId, taskId } = req.params;
        const { title, priority, dueDate, status } = req.body;

        const tasks = await fs.readJson(taskDataPath);
        const task = tasks.find(t => t.pjId === projectId && t.id === taskId);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (title) task.title = title;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = dueDate;
        if (status) task.status = status;

        await fs.writeJson(taskDataPath, tasks);
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// 태스크 삭제
router.delete('/:taskId', async (req, res) => {
    try {
        const { projectId, taskId } = req.params;
        const tasks = await fs.readJson(taskDataPath);
        const taskIndex = tasks.findIndex(t => t.pjId === projectId && t.id === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }

        tasks.splice(taskIndex, 1);
        await fs.writeJson(taskDataPath, tasks);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
