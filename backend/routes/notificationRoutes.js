import express from 'express';
import jwt from 'jsonwebtoken';
import Notification from '../models/Notification.js';
import Creater from '../models/Creater.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to get user from token
const getUserFromToken = async (req, res, next) => {
  try {
    const createrToken = req.headers['creatertoken'];
    
    console.log("Token received:", createrToken ? "Yes" : "No");
    
    if (!createrToken) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    
    // Decode the token to get user ID
    let decoded;
    try {
      decoded = jwt.verify(createrToken, JWT_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    
    // Find user by ID from the decoded token
    const user = await Creater.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error("Middleware error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET - Get creator's notifications (for CreatorProfile page)
router.get('/', getUserFromToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ 
      userId: req.user._id, 
      read: false 
    });
    
    // Format notifications for frontend
    const formattedNotifications = notifications.map(notif => ({
      _id: notif._id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      isRead: notif.read,
      createdAt: notif.createdAt,
      data: {
        courseCode: notif.metadata?.courseCode,
        courseTitle: notif.metadata?.courseTitle,
        programCode: notif.metadata?.programCode,
        programName: notif.metadata?.programName,
        semester: notif.metadata?.semester,
      }
    }));
    
    res.json({ 
      success: true, 
      notifications: formattedNotifications,
      unreadCount 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Get user's notifications (alternative endpoint)
router.get('/user', getUserFromToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Get unread count
router.get('/unread-count', getUserFromToken, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      userId: req.user._id, 
      read: false 
    });
    
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Mark single notification as read (for CreatorProfile)
router.put('/:id/read', getUserFromToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Mark all notifications as read (for CreatorProfile)
router.put('/read-all', getUserFromToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Mark all notifications as read (generic)
router.put('/mark-all-read', getUserFromToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Bulk assignment notification (for Save Assignments button)
router.post('/bulk-assignment', async (req, res) => {
  try {
    const { assignments, programCode, programName, programVersion } = req.body;
    
    if (!assignments || assignments.length === 0) {
      return res.json({ success: true, message: "No assignments to notify" });
    }
    
    const notifications = assignments.map(assignment => ({
      userId: assignment.assigneeId,
      type: 'course_assignment',
      title: 'New Course Assignment',
      message: `You have been assigned to teach "${assignment.courseTitle}" (${assignment.courseCode}) in ${programName} (v${programVersion}).`,
      read: false,
      metadata: { 
        programCode, 
        programName, 
        programVersion,
        courseCode: assignment.courseCode,
        courseTitle: assignment.courseTitle,
        semester: assignment.semester
      }
    }));
    
    await Notification.insertMany(notifications);
    
    res.json({ success: true, count: notifications.length });
  } catch (error) {
    console.error('Bulk assignment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - PD Approval with assignments (when admin approves PD with course assignments)
router.post('/pd-approval-with-assignments', async (req, res) => {
  try {
    const { 
      programName, 
      programCode, 
      pdVersion, 
      approvedBy, 
      assignments, 
      creatorId 
    } = req.body;
    
    const notifications = [];
    
    // Notify the PD creator
    if (creatorId) {
      notifications.push({
        userId: creatorId,
        type: 'approval',
        title: 'Program Document Approved! 🎉',
        message: `Your Program Document "${programName}" (v${pdVersion}) has been approved by ${approvedBy}. Course assignments have been sent to faculty members.`,
        read: false,
        metadata: { programCode, programName, pdVersion, type: 'creator' }
      });
    }
    
    // Notify all assigned faculty
    for (const assignment of assignments) {
      if (assignment.assigneeId) {
        notifications.push({
          userId: assignment.assigneeId,
          type: 'course_assignment',
          title: 'Course Assigned to You',
          message: `You have been assigned to teach "${assignment.courseTitle}" (${assignment.courseCode}) in ${programName} (v${pdVersion}). The program has been approved.`,
          read: false,
          metadata: { 
            programCode, 
            programName, 
            pdVersion,
            courseCode: assignment.courseCode,
            courseTitle: assignment.courseTitle,
            semester: assignment.semester
          }
        });
      }
    }
    
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
    
    res.json({ success: true, count: notifications.length });
  } catch (error) {
    console.error('PD approval notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Simple PD approval (no assignments)
router.post('/pd-approval', async (req, res) => {
  try {
    const { creatorId, programName, programCode, pdVersion, approvedBy } = req.body;
    
    const notification = new Notification({
      userId: creatorId,
      type: 'approval',
      title: 'Program Document Approved! 🎉',
      message: `Your Program Document "${programName}" (v${pdVersion}) has been approved by ${approvedBy}.`,
      read: false,
      metadata: { programCode, programName, pdVersion }
    });
    
    await notification.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('PD approval notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - PD Rejection notification (when admin sends back for revision)
router.post('/pd-rejection', async (req, res) => {
  try {
    const { creatorId, programName, programCode, pdVersion, rejectionMessage } = req.body;
    
    const notification = new Notification({
      userId: creatorId,
      type: 'rejection',
      title: 'Program Document Needs Revision',
      message: `Your Program Document "${programName}" (v${pdVersion}) needs revision. Reason: ${rejectionMessage}`,
      read: false,
      metadata: { programCode, programName, pdVersion, rejectionMessage }
    });
    
    await notification.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error('PD rejection notification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Delete old notifications (cleanup)
router.delete('/old', getUserFromToken, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await Notification.deleteMany({
      userId: req.user._id,
      createdAt: { $lt: thirtyDaysAgo },
      read: true
    });
    
    res.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});





// POST - Sync assignments (handle both new assignments and removed ones)
// POST - Sync assignments (handle both new assignments and removed ones)
router.post('/sync-assignments', async (req, res) => {
  try {
    const { currentAssignments, programCode, programName, programVersion } = req.body;
    
    // Get previous version of the PD from database
    const ProgramDocument = mongoose.model('ProgramDocument');
    const previousPD = await ProgramDocument.findOne({ 
      programCode, 
      status: 'Approved' 
    }).sort({ createdAt: -1 });
    
    if (!previousPD) {
      return res.json({ success: false, message: "Previous version not found" });
    }
    
    // Extract previous assignments
    const previousAssignments = [];
    const s3 = previousPD.section3_structure || {};
    const s4 = previousPD.section4_electives || {};
    
    (s3.semesters || []).forEach(sem => {
      (sem.courses || []).forEach(course => {
        if (course.assigneeId) {
          previousAssignments.push({
            assigneeId: course.assigneeId.toString(),
            courseCode: course.code,
            courseTitle: course.title,
            semester: sem.semNumber,
          });
        }
      });
    });
    
    (s4.professionalElectives || []).forEach(group => {
      (group.courses || []).forEach(course => {
        if (course.assigneeId) {
          previousAssignments.push({
            assigneeId: course.assigneeId.toString(),
            courseCode: course.code,
            courseTitle: course.title,
          });
        }
      });
    });
    
    (s4.openElectives || []).forEach(group => {
      (group.courses || []).forEach(course => {
        if (course.assigneeId) {
          previousAssignments.push({
            assigneeId: course.assigneeId.toString(),
            courseCode: course.code,
            courseTitle: course.title,
          });
        }
      });
    });
    
    // Find NEW assignments (in current but not in previous)
    const newAssignments = currentAssignments.filter(current => 
      !previousAssignments.some(prev => 
        prev.assigneeId === current.assigneeId && 
        prev.courseCode === current.courseCode
      )
    );
    
    // Find REMOVED assignments (in previous but not in current)
    const removedAssignments = previousAssignments.filter(prev =>
      !currentAssignments.some(current => 
        current.assigneeId === prev.assigneeId && 
        current.courseCode === prev.courseCode
      )
    );
    
    // Send notifications to new assignees
    if (newAssignments.length > 0) {
      const newNotifications = newAssignments.map(assignment => ({
        userId: assignment.assigneeId,
        type: 'course_assignment',
        title: 'New Course Assignment',
        message: `You have been assigned to teach "${assignment.courseTitle}" (${assignment.courseCode}) in ${programName} (v${programVersion}).`,
        read: false,
        metadata: { 
          programCode, 
          programName, 
          programVersion,
          courseCode: assignment.courseCode,
          courseTitle: assignment.courseTitle,
          semester: assignment.semester,
          action: 'assigned'
        }
      }));
      await Notification.insertMany(newNotifications);
    }
    
    // Delete notifications for removed assignees
    if (removedAssignments.length > 0) {
      for (const removed of removedAssignments) {
        await Notification.deleteMany({
          userId: removed.assigneeId,
          'metadata.courseCode': removed.courseCode,
          'metadata.programCode': programCode,
          type: 'course_assignment'
        });
      }
    }
    
    res.json({ 
      success: true, 
      newCount: newAssignments.length, 
      removedCount: removedAssignments.length,
      message: `${newAssignments.length} notified, ${removedAssignments.length} notifications removed`
    });
  } catch (error) {
    console.error('Sync assignments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});








// POST - Remove assignment notification (when creator is unassigned)
router.post('/remove-assignment', async (req, res) => {
  try {
    const { assigneeId, courseCode, courseTitle, programCode, programName } = req.body;
    
    // Delete the notification for the removed assignee
    const result = await Notification.deleteMany({
      userId: assigneeId,
      type: 'course_assignment',
      'metadata.courseCode': courseCode,
      'metadata.programCode': programCode
    });
    
    console.log(`Removed ${result.deletedCount} notification(s) for user ${assigneeId} - Course: ${courseCode}`);
    
    res.json({ 
      success: true, 
      deletedCount: result.deletedCount,
      message: `Notification removed for previously assigned creator`
    });
  } catch (error) {
    console.error('Remove assignment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;