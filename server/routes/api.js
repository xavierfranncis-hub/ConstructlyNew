const express = require('express');
const router = express.Router();
const Builder = require('../models/Builder');
const Project = require('../models/Project');
const House = require('../models/House');

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

const FALLBACK_HOUSES = [
    { id: 1, title: 'Luxurious 4BHK Villa', price: 25000000, type: 'New', location: 'Gachibowli, Hyd', images: [], sellerName: 'Rajesh Kumar', sellerPhone: '9876543210', description: 'Modern villa with premium amenities.' },
    { id: 2, title: 'Cozy 2BHK Apartment', price: 6500000, type: 'Old', location: 'Kukatpally, Hyd', images: [], sellerName: 'Sneha Reddy', sellerPhone: '8765432109', description: 'Well-maintained flat in a prime location.' },
];

// Get Builders
router.get('/builders', async (req, res) => {
    try {
        const dbBuilders = await Builder.find();
        // Convert Mongoose docs to plain objects with .id
        const sanitizedDbBuilders = dbBuilders.map(b => ({
            ...b.toObject(),
            id: b._id.toString()
        }));

        const builders = [...sanitizedDbBuilders, ...sessionBuilders];
        if (builders.length > 0) {
            return res.json(builders);
        }
        res.json(FALLBACK_BUILDERS);
    } catch (err) {
        console.log('Using Fallback Builders (DB Error)');
        res.json([...FALLBACK_BUILDERS, ...sessionBuilders]);
    }
});

router.post('/builders', async (req, res) => {
    try {
        const { businessName, ownerName, location, expertise, phone, portfolio } = req.body;

        if (!businessName || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const builderData = {
            id: Date.now(),
            name: businessName,
            ownerName,
            location: location,
            expertise: typeof expertise === 'string' ? expertise.split(',').map(e => e.trim()) : expertise,
            phone: phone || '',
            portfolio: portfolio || [],
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
        // Convert Mongoose docs to plain objects with .id
        const sanitizedDbProjects = dbProjects.map(p => ({
            ...p.toObject(),
            id: p._id.toString()
        }));

        const projects = [...sanitizedDbProjects, ...sessionProjects];
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
            status: status || 'Draft/Quote',
            progress: progress || 0,
            lastUpdate: 'Just now',
            isHired: false
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

// Formalize Hire (Leads -> Active)
router.patch('/projects/:id/hire', async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, estimatedEndDate, contractAmount } = req.body;

        // 1. Try DB
        let project = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
            project = await Project.findById(id);
        } else {
            project = await Project.findOne({ id: Number(id) });
        }

        if (project) {
            project.isHired = true;
            project.status = 'Hired / Ongoing';
            project.startDate = startDate;
            project.estimatedEndDate = estimatedEndDate;
            project.contractAmount = contractAmount;
            project.lastUpdate = 'Hired professional! Project started.';
            await project.save();

            // Also update session if present
            const idx = sessionProjects.findIndex(p => p.id == id || (project.id && p.id == project.id));
            if (idx !== -1) {
                sessionProjects[idx] = { ...sessionProjects[idx], ...project.toObject(), id: project.id || sessionProjects[idx].id };
            }

            return res.json(project);
        }

        // 2. Fallback for session projects (In-memory ONLY)
        const sessionIndex = sessionProjects.findIndex(p => p.id == id);
        if (sessionIndex !== -1) {
            sessionProjects[sessionIndex] = {
                ...sessionProjects[sessionIndex],
                isHired: true,
                status: 'Hired / Ongoing',
                startDate,
                estimatedEndDate,
                contractAmount,
                lastUpdate: 'Hired professional! Project started.'
            };
            return res.json(sessionProjects[sessionIndex]);
        }

        res.status(404).json({ error: 'Project not found' });
    } catch (err) {
        console.error('Hiring Error:', err);
        res.status(500).json({ error: 'Failed to finalize hire' });
    }
});

// --- Real Estate (Buy/Sell) ---

// Get all houses
router.get('/houses', async (req, res) => {
    try {
        const dbHouses = await House.find().sort({ timestamp: -1 });
        const sanitized = dbHouses.map(h => ({ ...h.toObject(), id: h._id.toString() }));
        if (sanitized.length > 0) return res.json(sanitized);
        res.json(FALLBACK_HOUSES);
    } catch (err) {
        res.json(FALLBACK_HOUSES);
    }
});

// Post a new house
router.post('/houses', async (req, res) => {
    try {
        const houseData = req.body;
        const newHouse = new House({
            ...houseData,
            id: Date.now() // Internal numeric ID for fallbacks
        });
        await newHouse.save();
        res.status(201).json(newHouse);
    } catch (err) {
        console.error('Post House Error:', err);
        res.status(500).json({ error: 'Failed to post property' });
    }
});

module.exports = router;
