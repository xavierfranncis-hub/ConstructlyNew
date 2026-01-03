const express = require('express');
const router = express.Router();
const Builder = require('../models/Builder');
const Project = require('../models/Project');

// In-memory Session Storage (if DB is down)
const sessionBuilders = [];
const sessionProjects = [];

// Fallback Mock Data (South Hyd)
const FALLBACK_BUILDERS = [
    { id: 1, name: 'Shamshabad Constructions', rating: 4.8, expertise: ['Full Home', 'Masonry'], location: 'Shamshabad, So. Hyd' },
    { id: 2, name: 'Rajendranagar Electricals', rating: 4.5, expertise: ['Electrical', 'Wiring'], location: 'Rajendranagar, So. Hyd' },
    { id: 3, name: 'Attapur Granites & Marbles', rating: 4.9, expertise: ['Granite', 'Tiles', 'Marbles'], location: 'Attapur, So. Hyd' },
    { id: 4, name: 'Classic Interiors', rating: 4.7, expertise: ['Interior', 'Painting'], location: 'Aramghar, So. Hyd' },
    { id: 5, name: 'SMR Building Materials', rating: 4.6, expertise: ['Cement', 'Sand', 'Steel'], location: 'Saroornagar, So. Hyd' },
    { id: 6, name: 'Falaknuma Masons', rating: 4.4, expertise: ['Masonry', 'Renovation'], location: 'Falaknuma, So. Hyd' },
];

const FALLBACK_PROJECTS = [
    { id: 1, title: 'Duplex Villa - Shamshabad', builder: 'Shamshabad Constructions', progress: 0.65, status: 'Masonry Work', lastUpdate: '2 hours ago' },
    { id: 2, title: 'Granite Flooring - Attapur', builder: 'Attapur Granites & Marbles', progress: 0.30, status: 'Material Selection', lastUpdate: '1 day ago' },
];

// Get Builders
router.get('/builders', async (req, res) => {
    try {
        const dbBuilders = await Builder.find();
        const builders = [...dbBuilders, ...sessionBuilders];
        if (builders.length > 0) {
            return res.json(builders);
        }
        res.json(FALLBACK_BUILDERS);
    } catch (err) {
        console.log('Using Fallback Builders (DB Error)');
        res.json([...FALLBACK_BUILDERS, ...sessionBuilders]);
    }
});

// Register Builder
router.post('/builders', async (req, res) => {
    try {
        const { businessName, ownerName, location, expertise } = req.body;

        if (!businessName || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const builderData = {
            id: Date.now(),
            name: businessName,
            ownerName,
            location: location,
            expertise: typeof expertise === 'string' ? expertise.split(',').map(e => e.trim()) : expertise,
            rating: 5.0,
            verified: false
        };

        try {
            const newBuilder = new Builder(builderData);
            await newBuilder.save();
        } catch (dbErr) {
            console.warn('DB Save Failed, saving to memory only');
        }

        sessionBuilders.push(builderData);
        console.log('New Builder Registered:', businessName);
        res.status(201).json(builderData);
    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Failed to register builder' });
    }
});

// Get Projects
router.get('/projects', async (req, res) => {
    try {
        const dbProjects = await Project.find().sort({ _id: -1 });
        const projects = [...dbProjects, ...sessionProjects];
        if (projects.length > 0) {
            return res.json(projects);
        }
        res.json(FALLBACK_PROJECTS);
    } catch (err) {
        console.log('Using Fallback Projects (DB Error)');
        res.json([...FALLBACK_PROJECTS, ...sessionProjects]);
    }
});

// Create Project (Request Quote)
router.post('/projects', async (req, res) => {
    try {
        const { title, builder, status, progress } = req.body;
        const projectData = {
            id: Date.now(),
            title,
            builder,
            status: status || 'Pending',
            progress: progress || 0,
            lastUpdate: 'Just now'
        };

        try {
            const newProject = new Project(projectData);
            await newProject.save();
        } catch (dbErr) {
            console.warn('DB Save Failed, saving to memory only');
        }

        sessionProjects.push(projectData);
        res.status(201).json(projectData);
    } catch (err) {
        console.error('Create Project Error:', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

module.exports = router;
