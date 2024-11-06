const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();
const projectDataPath = path.join(__dirname, '../data/projectData.json');
const taskDataPath = path.join(__dirname, '../data/taskData.json');

// 모든 프로젝트 조회
router.get('/', async (req, res) => {
    try {
        const projects = await fs.readJson(projectDataPath);
        res.json(projects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

// 새 프로젝트 생성
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body; 

        if (!title || !description) {
            return res.status(400).json({ error: 'Title, Description is not exist.' });
        }

        const projects = await fs.readJson(projectDataPath);
        const newProject = {
            id: (projects.length + 1).toString(),
            title: title,
            description: description,
            tasks: [],
        };
        projects.push(newProject);
        await fs.writeJson(projectDataPath, projects);
        res.status(201).json(newProject);
        console.log(newProject);


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// 특정 프로젝트 조회
router.get('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const projects = await fs.readJson(projectDataPath);
        const project = projects.find(p => p.id === projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve project details' });
    }
});


// 프로젝트 삭제
router.delete('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const projects = await fs.readJson(projectDataPath);
        const tasks = await fs.readJson(taskDataPath);

        const project = projects.find(p => p.id === projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const hasTasks = tasks.some(task => task.pjId === projectId);
        if (hasTasks) {
            return res.status(400).json({ error: 'Cannot delete project with tasks' });
        }

        const updatedProjects = projects.filter(p => p.id !== projectId);
        await fs.writeJson(projectDataPath, updatedProjects);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;
