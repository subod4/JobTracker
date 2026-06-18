const Application = require('../Models/Application');

// @desc Get all applications for the logged-in user
// @route GET /api/applications
exports.getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // Always restrict query to the current user
    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    if (search) {
      // Case-insensitive search on company_name and job_title for this user's records
      query.$and = [
        { user: req.user.id },
        {
          $or: [
            { company_name: { $regex: search, $options: 'i' } },
            { job_title: { $regex: search, $options: 'i' } },
          ],
        },
      ];
    }

    const applications = await Application.find(query).sort({ applied_date: -1, createdAt: -1 });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get single application by ID (enforcing user ownership)
// @route GET /api/applications/:id
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify ownership
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this application' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Create new application associated with the logged-in user
// @route POST /api/applications
exports.createApplication = async (req, res) => {
  try {
    const { company_name, job_title, job_type, status, applied_date, notes } = req.body;
    
    const application = new Application({
      user: req.user.id, // Associate with current user
      company_name,
      job_title,
      job_type,
      status,
      applied_date,
      notes,
    });

    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: error.message });
  }
};

// @desc Update application (enforcing user ownership)
// @route PATCH /api/applications/:id
exports.updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify ownership
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    const fieldsToUpdate = ['company_name', 'job_title', 'job_type', 'status', 'applied_date', 'notes'];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        application[field] = req.body[field];
      }
    });

    const updatedApplication = await application.save();
    res.status(200).json(updatedApplication);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: error.message });
  }
};

// @desc Delete application (enforcing user ownership)
// @route DELETE /api/applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Verify ownership
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this application' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
