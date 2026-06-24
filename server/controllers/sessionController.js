const fs = require('fs');
const path = require('path');

const JSON_SESSIONS_PATH = path.join(__dirname, '..', 'data', 'sessions.json');
const JSON_USERS_PATH = path.join(__dirname, '..', 'data', 'users.json');

// Helper to ensure JSON file database exists and return sessions
const getJsonSessions = () => {
  const dir = path.dirname(JSON_SESSIONS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(JSON_SESSIONS_PATH)) {
    fs.writeFileSync(JSON_SESSIONS_PATH, JSON.stringify([]));
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(JSON_SESSIONS_PATH, 'utf-8') || '[]');
  } catch (err) {
    return [];
  }
};

// Helper to save sessions to JSON database
const saveJsonSessions = (sessions) => {
  fs.writeFileSync(JSON_SESSIONS_PATH, JSON.stringify(sessions, null, 2));
};

// @desc    Log a completed Pomodoro session
// @route   POST /api/sessions
// @access  Private
exports.logSession = async (req, res) => {
  try {
    const { duration, subject } = req.body; // duration in minutes

    if (!duration) {
      return res.status(400).json({ success: false, message: 'Please specify session duration' });
    }

    const hoursAdded = Number((duration / 60).toFixed(1));

    const allSessions = getJsonSessions();
    const newSession = {
      _id: 'sess_' + Date.now(),
      duration: Number(duration),
      subject: subject || 'General',
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    allSessions.push(newSession);
    saveJsonSessions(allSessions);

    // Update study statistics (total hours and streaks) inside users.json file database
    if (fs.existsSync(JSON_USERS_PATH)) {
      try {
        const users = JSON.parse(fs.readFileSync(JSON_USERS_PATH, 'utf-8') || '[]');
        const userIdx = users.findIndex(u => u._id === req.user.id);
        
        if (userIdx !== -1) {
          users[userIdx].totalStudyHours = Number((users[userIdx].totalStudyHours + hoursAdded).toFixed(1));
          users[userIdx].streak = users[userIdx].streak === 0 ? 1 : users[userIdx].streak + 1;
          users[userIdx].updatedAt = new Date();
          
          fs.writeFileSync(JSON_USERS_PATH, JSON.stringify(users, null, 2));
        }
      } catch (err) {
        console.error('Error updating local user statistics:', err);
      }
    }

    res.status(201).json({ success: true, data: newSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get weekly analytics (study hours per subject)
// @route   GET /api/sessions/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
  try {
    const allSessions = getJsonSessions();
    const sessions = allSessions.filter(s => s.userId === req.user.id);

    // Aggregate focus hours per CA subject
    const subjectHours = {
      FR: 0,
      Audit: 0,
      DT: 0,
      IDT: 0,
      AFM: 0,
      SCMPE: 0,
      General: 0
    };

    sessions.forEach(s => {
      const hours = s.duration / 60;
      if (subjectHours[s.subject] !== undefined) {
        subjectHours[s.subject] += hours;
      } else {
        subjectHours.General += hours;
      }
    });

    // Format for Recharts consumption
    const formattedData = Object.keys(subjectHours).map(sub => ({
      name: sub,
      hours: Number(subjectHours[sub].toFixed(1))
    }));

    res.json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
