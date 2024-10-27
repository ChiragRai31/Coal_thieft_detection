// server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { Parser } = require("json2csv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coal_data', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
connectToMongoDB();

// Data model
const CoalDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: { type: String },
  loadWeight: { type: Number },
  temperature: { type: Number },
  humidity: { type: Number },
  moisture: { type: Number },
});
const CoalData = mongoose.model('CoalData', CoalDataSchema);

// API endpoint to get the latest data
app.get('/api/data', async (req, res) => {
  try {
    const data = await CoalData.find().sort({ timestamp: -1 }).limit(10);
    const formattedData = data.map(item => ({
      ...item.toObject(),
      timestamp: item.timestamp.toISOString()
    }));
    res.json(formattedData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data");
  }
});

// CSV Download Route
app.get("/download-report", async (req, res) => {
  try {
    const data = await CoalData.find();
    const fields = ["timestamp", "location", "loadWeight", "temperature", "humidity", "moisture"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("transport_data_report.csv");
    return res.send(csv);
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).send("Error generating CSV report");
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Simulate data every 2 seconds
  const intervalId = setInterval(async () => {
    const simulatedData = {
      location: "Location" + Math.floor(Math.random() * 100),
      loadWeight: Math.random() * 1000,
      temperature: Math.random() * 100,
      humidity: Math.random() * 100,
      moisture: Math.random() * 100,
    };

    const newCoalData = new CoalData(simulatedData);
    await newCoalData.save();
    
    // Emit new data to all connected clients
    io.emit('newData', { ...simulatedData, timestamp: new Date().toISOString() });

  }, 2000); // Emit data every 2 seconds

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(intervalId);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
