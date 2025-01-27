const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(bodyParser.json());

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token.' });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin privileges required.' });
  }
  next();
};

// User registration
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Password encryption
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
// Check and compare the entered password 
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// To get all the events
app.get('/events', async (req, res) => {
  try {
    const { date, category, location } = req.query;
    const events = await prisma.event.findMany({
      where: {
        ...(date && { date: new Date(date) }),
        ...(category && { category }),
        ...(location && { locationId: parseInt(location, 10) }),
      },
      include: { location: true },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// To create an event
app.post('/event', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { title, description, date, category, locationId } = req.body;

    if (!title || !description || !date || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const formattedDate = new Date(date).toISOString();

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: formattedDate,
        category,
        locationId: locationId ? parseInt(locationId) : null, 
        createdById: 1, 
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating event", error: err.message });
  }
});

// To update an event
app.put('/events/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, category, locationId } = req.body;
    const event = await prisma.event.update({
      where: { id: parseInt(id, 10) },
      data: { title, description, date: new Date(date), category, locationId },
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an event 
app.delete('/events/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id: parseInt(id, 10) } });
    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/events/:id/registerevent', authenticate, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id, 10);

    // Check if the event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    console.log("Event",event);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if the user has already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        userId: req.user.id,
        eventId,
      },
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event.' });
    }

    // Register the user
    const registration = await prisma.eventRegistration.create({
      data: {
        userId: req.user.id,
        eventId,
      },
    });

    res.status(201).json({ message: 'Successfully registered for the event.', registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// To get the registered events
app.get('/events/registrations', authenticate, async (req, res) => {
  try {
    const registrations = await prisma.eventRegistration.findMany({
      where: { userId: req.user.id },
      include: { event: true }, 
    });

    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
