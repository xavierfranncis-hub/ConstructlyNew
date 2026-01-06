export const CONSTRUCTION_PHASES = [
    {
        id: 'phase1',
        title: 'Phase 1: Planning & Pre-Construction',
        shortTitle: 'Planning',
        description: 'Design, structural safety, and budget management.',
        image: require('../assets/phases/planning.png'),
        categories: [
            { id: 'architect', title: 'Architect', description: 'Designs the building layout, floor plans, and 3D elevations.' },
            { id: 'structural_engineer', title: 'Structural Engineer', description: 'Ensures the building is safe by designing the structure.' },
            { id: 'quantity_surveyor', title: 'Quantity Surveyor', description: 'Manages project budget and tracks material expenses.' },
            { id: 'civil_engineer', title: 'Civil Engineer', description: 'Manages general infrastructure like drainage and leveling.' },
            { id: 'land_surveyor', title: 'Land Surveyor', description: 'Measures plot boundaries and prepares terrain.' },
            { id: 'plan_approver', title: 'Plan Consultant', description: 'Helps navigate local municipality laws and permits.' }
        ]
    },
    {
        id: 'phase2',
        title: 'Phase 2: Core Construction (Civil Work)',
        shortTitle: 'Civil Work',
        description: 'Skeleton, walls, plumbing, and electrical basics.',
        image: require('../assets/phases/civil.png'),
        categories: [
            { id: 'contractor', title: 'General Contractor', description: 'Manages entire team, material orders, and schedules.' },
            { id: 'mason', title: 'Mason', description: 'Lays bricks/blocks and handles stone/cement work.' },
            { id: 'formwork', title: 'Centring Worker', description: 'Sets up temporary molds for concrete slabs.' },
            { id: 'steel_fabricator', title: 'Steel Fabricator', description: 'Bends and places steel rods to reinforce structure.' },
            { id: 'plumber_rough', title: 'Plumber (Rough-in)', description: 'Installs internal piping before walls are closed.' },
            { id: 'electrician_rough', title: 'Electrician (Rough-in)', description: 'Places electrical conduits inside walls.' }
        ]
    },
    {
        id: 'phase3',
        title: 'Phase 3: Finishing & Utility Installation',
        shortTitle: 'Finishing',
        description: 'Roofing, flooring, painting, and systems.',
        image: require('../assets/phases/finishing.png'),
        categories: [
            { id: 'roofer', title: 'Roofing Specialist', description: 'Installs roof tiles, waterproofing, or shingles.' },
            { id: 'hvac', title: 'HVAC Technician', description: 'Installs heating, ventilation, and AC systems.' },
            { id: 'flooring', title: 'Flooring Contractor', description: 'Lays tiles, marble, granite, or hardwood floors.' },
            { id: 'glazier', title: 'Window Installer', description: 'Sets glass in window frames and doors.' },
            { id: 'painter', title: 'Painter', description: 'Applies putty, primer, and final paint coats.' },
            { id: 'carpenter_finish', title: 'Carpenter (Finish)', description: 'Installs wardrobes, cabinets, and doors.' }
        ]
    },
    {
        id: 'phase4',
        title: 'Phase 4: Interior & Landscaping',
        shortTitle: 'Interior',
        description: 'Aesthetics, security, and outdoor spaces.',
        image: require('../assets/phases/interior.png'),
        categories: [
            { id: 'interior_designer', title: 'Interior Designer', description: 'Curates furniture, lighting, and color schemes.' },
            { id: 'grill_fabricator', title: 'Grill Fabricator', description: 'Installs safety grills and railings.' },
            { id: 'landscaper', title: 'Landscaper', description: 'Designs and plants gardens, lawns, and decor.' },
            { id: 'security_specialist', title: 'Security Specialist', description: 'Sets up CCTV, smart locks, and automation.' }
        ]
    },
    {
        id: 'phase5',
        title: 'Phase 5: Final Handover & Housewarming',
        shortTitle: 'Handover',
        description: 'Inspection, cleaning, and ceremonies.',
        image: require('../assets/phases/handover.png'),
        categories: [
            { id: 'home_inspector', title: 'Home Inspector', description: 'Final check of plumbing, electrical, and systems.' },
            { id: 'cleaning_service', title: 'Deep Cleaning', description: 'Removes construction debris and dust.' },
            { id: 'priest', title: 'Pandit/Priest', description: 'Traditional rituals or Vastu ceremonies.' },
            { id: 'catering', title: 'Event/Catering', description: 'Manages guest arrangements for housewarming.' }
        ]
    }
];

export const MATERIAL_CATEGORIES = [
    {
        id: 'building_materials',
        title: 'Construction (Building Material)',
        description: 'Core structural components.',
        image: require('../assets/materials/core.png'),
        items: ['Cement', 'Steel (TMT)', 'Aggregates', 'Bricks', 'Binding Wire', 'Wood/Timber']
    },
    {
        id: 'plumbing_materials',
        title: 'Plumbing',
        description: 'Water supply, drainage, and waste.',
        image: require('../assets/materials/plumbing.jpg'),
        items: ['Pipes (PVC/CPVC/PEX)', 'Fittings & Valves', 'Fixtures (Wash Basin/WC)', 'Adhesives']
    },
    {
        id: 'electrical_materials',
        title: 'Electricals',
        description: 'Power distribution and safety.',
        image: require('../assets/materials/electrical.jpg'),
        items: ['Wires & Cables', 'Conduit Pipes', 'Switches & Sockets', 'Switchgears (MCB)']
    },
    {
        id: 'painting_materials',
        title: 'Painting',
        description: 'Surface preparation and finishing.',
        image: require('../assets/materials/painting.jpg'),
        items: ['Paints (Emulsion/Enamel)', 'Primer & Putty', 'Tools & Accessories']
    },
    {
        id: 'interior_materials',
        title: 'Interior',
        description: 'Aesthetics and functionality.',
        image: require('../assets/materials/interior.jpg'),
        items: ['Flooring', 'Gypsum Boards', 'Cabinets', 'Countertops', 'Hardware']
    },
    {
        id: 'fabrication_materials',
        title: 'Fabrication',
        description: 'Metal items for safety.',
        image: require('../assets/materials/fabrication.jpg'),
        items: ['Steel/Iron Grills', 'Metal Sheets']
    },
    {
        id: 'glass_materials',
        title: 'Glass',
        description: 'Windows, doors, and facades.',
        image: require('../assets/materials/glass.jpg'),
        items: ['Tempered', 'Laminated', 'IGUs', 'Decorative']
    },
    {
        id: 'cctv_materials',
        title: 'CCTV',
        description: 'Security and surveillance.',
        image: require('../assets/materials/security.jpg'),
        items: ['Cameras', 'DVR/NVR', 'Cables', 'Hard Drive', 'Monitors']
    }
];
