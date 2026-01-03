const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const mongoose = require('mongoose');

// Models
const ChatMessage = require('./models/ChatMessage');
const Builder = require('./models/Builder');
const Project = require('./models/Project');

// Seed Data Function
const seedData = async () => {
  try {
    const buildersCount = await Builder.countDocuments();
    if (buildersCount === 0) {
      const builders = [
        { name: 'Shamshabad Constructions', rating: 4.8, expertise: ['Full Home', 'Masonry'], location: 'Shamshabad, So. Hyd' },
        { name: 'Rajendranagar Electricals', rating: 4.5, expertise: ['Electrical', 'Wiring'], location: 'Rajendranagar, So. Hyd' },
        { name: 'Attapur Granites & Marbles', rating: 4.9, expertise: ['Granite', 'Tiles', 'Marbles'], location: 'Attapur, So. Hyd' },
        { name: 'Classic Interiors', rating: 4.7, expertise: ['Interior', 'Painting'], location: 'Aramghar, So. Hyd' },
        { name: 'SMR Building Materials', rating: 4.6, expertise: ['Cement', 'Sand', 'Steel'], location: 'Saroornagar, So. Hyd' },
        { name: 'Falaknuma Masons', rating: 4.4, expertise: ['Masonry', 'Renovation'], location: 'Falaknuma, So. Hyd' },
      ];
      await Builder.insertMany(builders);
      console.log('Seeded Builders ✅');
    }

    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      const projects = [
        { title: 'Duplex Villa - Shamshabad', builder: 'Shamshabad Constructions', progress: 0.65, status: 'Masonry Work', lastUpdate: '2 hours ago' },
        { title: 'Granite Flooring - Attapur', builder: 'Attapur Granites & Marbles', progress: 0.30, status: 'Material Selection', lastUpdate: '1 day ago' },
      ];
      await Project.insertMany(projects);
      console.log('Seeded Projects ✅');
    }
  } catch (err) {
    console.error('Seeding Error (Ignored):', err.message);
  }
};

// DB Connection (Non-blocking)
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/constructly';

mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 5000 // Timeout after 5s if no DB
}).then(() => {
  console.log('MongoDB Connected ✅');
  seedData();
}).catch(err => {
  console.log('MongoDB Connection Failed - Running in Manual/Fallback Mode ⚠️');
  console.error('Error details:', err.message);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Socket.io Memory Fallback
const messageHistory = {}; // { roomId: [ { text, sender, time } ] }

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    try {
      // 1. Try DB
      const dbMessages = await ChatMessage.find({ roomId }).sort({ timestamp: 1 });
      const history = dbMessages.map(m => ({
        id: m._id.toString(),
        text: m.text,
        sender: m.sender,
        roomId: m.roomId,
        time: new Date(m.timestamp).toLocaleTimeString()
      }));

      // Merge with session history
      const fullHistory = [...history, ...(messageHistory[roomId] || [])];
      socket.emit('load_history', fullHistory);
    } catch (err) {
      console.log('Using In-Memory Chat History');
      socket.emit('load_history', messageHistory[roomId] || []);
    }
  });

  socket.on('send_message', async (data) => {
    console.log('Message received:', data);

    // 1. Save to session history immediately
    if (!messageHistory[data.roomId]) messageHistory[data.roomId] = [];
    messageHistory[data.roomId].push(data);

    // 2. Try DB (Asynchronously, don't block)
    try {
      const newMsg = new ChatMessage({
        roomId: data.roomId,
        text: data.text,
        sender: data.sender
      });
      await newMsg.save();
    } catch (dbErr) {
      console.warn('Chat DB Save Failed - stored in memory');
    }

    // 3. Broadcast to room
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
