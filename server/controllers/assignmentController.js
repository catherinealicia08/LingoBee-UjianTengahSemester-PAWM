import { supabase } from '../config/supabase.js';
import multer from 'multer';

// ========================================
// MULTER CONFIGURATION
// ========================================
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, XLSX, JPG, PNG allowed.'));
    }
  }
});

// ========================================
// UPLOAD FILE ENDPOINT
// ========================================
export const uploadFile = async (req, res) => {
  try {
    console.log('📥 Upload request received');
    console.log('👤 User ID:', req.user.id);
    console.log('👤 User NIM:', req.user.nim);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const file = req.file;
    console.log('📄 File received:', file.originalname);
    console.log('📦 File size:', (file.size / 1024).toFixed(2), 'KB');
    console.log('📋 MIME type:', file.mimetype);

    const userId = req.user.id;
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${timestamp}_${sanitizedFileName}`;

    console.log('📁 Upload path:', filePath);

    const { data, error } = await supabase.storage
      .from('assignment-files')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to upload file to storage'
      });
    }

    console.log('✅ File uploaded to storage:', data.path);

    const { data: urlData } = supabase.storage
      .from('assignment-files')
      .getPublicUrl(filePath);

    console.log('🔗 Public URL:', urlData.publicUrl);

    res.json({ 
      success: true, 
      fileUrl: urlData.publicUrl,
      fileName: file.originalname,
      filePath: filePath,
      fileSize: file.size,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Upload file error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to upload file' 
    });
  }
};

// ========================================
// GET ALL ASSIGNMENTS
// ========================================
export const getAssignments = async (req, res) => {
  try {
    console.log('📚 Fetching assignments for user:', req.user.id);

    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select('*')
      .eq('status', 'active')
      .order('due_date', { ascending: true });

    if (assignmentsError) throw assignmentsError;

    console.log(`✅ Found ${assignments.length} assignments`);

    const { data: submissions, error: submissionsError } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('user_id', req.user.id);

    if (submissionsError) throw submissionsError;

    console.log(`✅ Found ${submissions?.length || 0} submissions`);

    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = submissions?.find(s => s.assignment_id === assignment.id);
      
      // ✅ Map database status to frontend display
      let displayStatus = 'assigned';
      if (submission) {
        if (submission.status === 'turned_in') displayStatus = 'submitted';
        else if (submission.status === 'graded') displayStatus = 'graded';
        else if (submission.status === 'returned') displayStatus = 'returned';
        else displayStatus = submission.status;
      }
      
      return {
        ...assignment,
        submission_status: displayStatus,
        submission_id: submission?.id || null,
        submitted_at: submission?.submitted_at || null,
        grade: submission?.grade || null,
        submission_file_url: submission?.submission_file_url || null,
        submission_file_name: submission?.submission_file_name || null
      };
    });

    res.json({ 
      success: true, 
      assignments: assignmentsWithStatus 
    });
  } catch (error) {
    console.error('❌ Get assignments error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch assignments' 
    });
  }
};

// ========================================
// GET SINGLE ASSIGNMENT DETAILS
// ========================================
export const getAssignmentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📖 Fetching assignment details:', id);

    const { data: assignment, error: assignmentError } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', id)
      .single();

    if (assignmentError) {
      console.error('❌ Assignment not found:', assignmentError);
      return res.status(404).json({ 
        success: false, 
        error: 'Assignment not found' 
      });
    }

    console.log('✅ Assignment found:', assignment.title);

    const { data: submission, error: submissionError } = await supabase
      .from('assignment_submissions')
      .select('*')
      .eq('assignment_id', id)
      .eq('user_id', req.user.id)
      .single();

    if (submissionError && submissionError.code !== 'PGRST116') {
      console.error('⚠️ Submission error:', submissionError);
    }

    console.log('📝 Submission status:', submission ? submission.status : 'Not submitted');

    const { data: classComments, error: classCommentsError } = await supabase
      .from('assignment_class_comments')
      .select(`
        id,
        comment,
        created_at,
        users:user_id (full_name, nim)
      `)
      .eq('assignment_id', id)
      .order('created_at', { ascending: false });

    if (classCommentsError) {
      console.error('⚠️ Class comments error:', classCommentsError);
    }

    console.log(`💬 Found ${classComments?.length || 0} class comments`);

    let privateComments = [];
    if (submission) {
      const { data: comments, error: privateError } = await supabase
        .from('assignment_private_comments')
        .select(`
          id,
          comment,
          is_teacher,
          created_at,
          users:user_id (full_name)
        `)
        .eq('submission_id', submission.id)
        .order('created_at', { ascending: true });
      
      if (privateError) {
        console.error('⚠️ Private comments error:', privateError);
      } else {
        privateComments = comments || [];
        console.log(`🔒 Found ${privateComments.length} private comments`);
      }
    }

    res.json({ 
      success: true, 
      assignment,
      submission: submission || null,
      classComments: classComments || [],
      privateComments
    });
  } catch (error) {
    console.error('❌ Get assignment details error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch assignment details' 
    });
  }
};

// ========================================
// SUBMIT ASSIGNMENT
// ========================================
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, fileUrl, fileName, submissionText } = req.body;

    console.log('📤 Submitting assignment:', assignmentId);
    console.log('👤 User:', req.user.id);
    console.log('📄 File:', fileName);

    if (!assignmentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Assignment ID is required' 
      });
    }

    const { data: existingSubmission } = await supabase
      .from('assignment_submissions')
      .select('id')
      .eq('assignment_id', assignmentId)
      .eq('user_id', req.user.id)
      .single();

    let result;

    if (existingSubmission) {
      console.log('🔄 Updating existing submission:', existingSubmission.id);
      
      const { data, error } = await supabase
        .from('assignment_submissions')
        .update({
          status: 'turned_in', // ✅ CHANGED from 'submitted'
          submission_file_url: fileUrl,
          submission_file_name: fileName,
          submission_text: submissionText,
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubmission.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      console.log('✨ Creating new submission');
      
      const { data, error } = await supabase
        .from('assignment_submissions')
        .insert([{
          assignment_id: assignmentId,
          user_id: req.user.id,
          status: 'turned_in', // ✅ CHANGED from 'submitted'
          submission_file_url: fileUrl,
          submission_file_name: fileName,
          submission_text: submissionText,
          submitted_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    console.log('✅ Assignment submitted successfully');

    res.json({ 
      success: true, 
      message: 'Assignment submitted successfully! 🎉',
      submission: result
    });
  } catch (error) {
    console.error('❌ Submit assignment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to submit assignment' 
    });
  }
};

// ========================================
// MARK ASSIGNMENT AS DONE (WITHOUT FILE)
// ========================================
export const markAsDone = async (req, res) => {
  try {
    const { assignmentId } = req.body;

    console.log('✅ Marking assignment as done:', assignmentId);
    console.log('👤 User:', req.user.id);

    if (!assignmentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Assignment ID is required' 
      });
    }

    const { data: existing } = await supabase
      .from('assignment_submissions')
      .select('id')
      .eq('assignment_id', assignmentId)
      .eq('user_id', req.user.id)
      .single();

    if (existing) {
      console.log('🔄 Updating existing submission status');
      
      const { error } = await supabase
        .from('assignment_submissions')
        .update({ 
          status: 'turned_in', // ✅ CHANGED from 'submitted'
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      console.log('✨ Creating new submission entry');
      
      const { error } = await supabase
        .from('assignment_submissions')
        .insert([{
          assignment_id: assignmentId,
          user_id: req.user.id,
          status: 'turned_in', // ✅ CHANGED from 'submitted'
          submitted_at: new Date().toISOString()
        }]);

      if (error) throw error;
    }

    console.log('✅ Assignment marked as done');

    res.json({ 
      success: true, 
      message: 'Assignment marked as done! ✅' 
    });
  } catch (error) {
    console.error('❌ Mark as done error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to mark assignment as done' 
    });
  }
};

// ========================================
// ADD CLASS COMMENT
// ========================================
export const addClassComment = async (req, res) => {
  try {
    const { assignmentId, comment } = req.body;

    console.log('💬 Adding class comment to assignment:', assignmentId);
    console.log('👤 User:', req.user.id);

    if (!assignmentId || !comment) {
      return res.status(400).json({ 
        success: false, 
        error: 'Assignment ID and comment are required' 
      });
    }

    if (comment.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Comment cannot be empty' 
      });
    }

    const { data, error } = await supabase
      .from('assignment_class_comments')
      .insert([{
        assignment_id: assignmentId,
        user_id: req.user.id,
        comment: comment.trim()
      }])
      .select(`
        id,
        comment,
        created_at,
        users:user_id (full_name, nim)
      `)
      .single();

    if (error) throw error;

    console.log('✅ Class comment added successfully');

    res.status(201).json({ 
      success: true, 
      message: 'Comment added successfully! 💬',
      comment: data
    });
  } catch (error) {
    console.error('❌ Add class comment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to add comment' 
    });
  }
};

// ========================================
// ADD PRIVATE COMMENT
// ========================================
export const addPrivateComment = async (req, res) => {
  try {
    const { submissionId, comment } = req.body;

    console.log('🔒 Adding private comment to submission:', submissionId);
    console.log('👤 User:', req.user.id);

    if (!submissionId || !comment) {
      return res.status(400).json({ 
        success: false, 
        error: 'Submission ID and comment are required' 
      });
    }

    if (comment.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Comment cannot be empty' 
      });
    }

    const { data, error } = await supabase
      .from('assignment_private_comments')
      .insert([{
        submission_id: submissionId,
        user_id: req.user.id,
        comment: comment.trim(),
        is_teacher: false
      }])
      .select(`
        id,
        comment,
        is_teacher,
        created_at,
        users:user_id (full_name)
      `)
      .single();

    if (error) throw error;

    console.log('✅ Private comment added successfully');

    res.status(201).json({ 
      success: true, 
      message: 'Private comment added successfully! 🔒',
      comment: data
    });
  } catch (error) {
    console.error('❌ Add private comment error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to add private comment' 
    });
  }
};

// ========================================
// GET UPLOAD URL (OPTIONAL)
// ========================================
export const getUploadUrl = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ 
        success: false, 
        error: 'File name is required' 
      });
    }

    const userId = req.user.id;
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${timestamp}_${sanitizedFileName}`;

    console.log('📁 Generated file path:', filePath);
    console.log('👤 User ID:', userId);

    res.json({ 
      success: true, 
      filePath,
      bucketName: 'assignment-files',
      userId
    });
  } catch (error) {
    console.error('❌ Get upload URL error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to get upload URL' 
    });
  }
};