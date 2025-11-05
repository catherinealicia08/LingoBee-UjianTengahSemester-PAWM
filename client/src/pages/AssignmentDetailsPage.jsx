import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import './AssignmentDetailsPage.css';

export default function AssignmentDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // Get assignment data from route state or use default
  const assignmentData = location.state?.assignment || {
    id: id,
    title: 'Tenses Table Completion',
    bab: 'Introduction & Basic Tenses',
    dueDate: 'Oct 10, 11:59 PM',
    status: 'Assigned'
  };

  const [workStatus, setWorkStatus] = useState(assignmentData.status);

  // Assignment details content
  const assignmentContent = {
    tugas: 'Tugas 2.2',
    type: '📝 Simulasi Menjadi Asisten',
    description: '🚀 Setelah mengerjakan analisis bisnis dan inovasi sistem informasi, saatnya kalian menilai hasil pekerjaan yang telah ada secara lengkap & rasional',
    instructions: [
      '📧 Silakan buka inbox email masing-masing yang telah disediakan panduan serta dokumen yang harus dinilai.',
      '📊 Sheets penilaian yang sudah dikerjakan dikumpulkan dalam bentuk spreadsheet (.xlsx) dan di-attach pada assignment ini',
      '💬 Jika ada pertanyaan, silakan mengisi sheets QnA 🗒️'
    ],
    closing: 'Semangat & selamat menilai! 💪'
  };

  function handleMarkAsDone() {
    setWorkStatus('Submitted');
    alert('Assignment marked as done! ✅');
  }

  function handleAddWork() {
    alert('Add or Create functionality - Navigate to submission page');
  }

  return (
    <div className="assignment-details-root">
      <LeftSidebar activePage="assignment" />

      {/* Main Content */}
      <main className="assignment-details-content">
        {/* Header with Level Info */}
        <header className="top-header">
          <div className="level-info">
            <span className="streak">1 🔥</span>
            <span className="level">Lvl 10</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/homepage')} className="breadcrumb-link">Dashboard</span>
          <span className="breadcrumb-separator">›</span>
          <span onClick={() => navigate('/assignment')} className="breadcrumb-link">Assignment</span>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{assignmentData.title}</span>
        </div>

        {/* Assignment Details Card */}
        <div className="assignment-details-card">
          {/* Assignment Header */}
          <div className="assignment-header">
            <div className="assignment-icon">📋</div>
            <div className="assignment-title-section">
              <h1 className="assignment-title">{assignmentData.title}</h1>
              <p className="assignment-due">Due {assignmentData.dueDate}</p>
            </div>
          </div>

          {/* Assignment Content */}
          <div className="assignment-content-body">
            <div className="assignment-meta">
              <strong>[ {assignmentContent.tugas} : {assignmentContent.type} ]</strong>
            </div>

            <div className="assignment-description">
              <p>{assignmentContent.description}</p>
            </div>

            <div className="assignment-instructions">
              {assignmentContent.instructions.map((instruction, index) => (
                <p key={index}>{instruction}</p>
              ))}
            </div>

            <div className="assignment-sheets-info">
              <p>
                Sheets penilaian yang <strong>sudah dikerjakan dikumpulkan dalam bentuk spreadsheet (.xlsx)</strong> dan <strong>di-attach pada assignment ini</strong>
              </p>
            </div>

            <div className="assignment-qna">
              <p>💬 Jika ada pertanyaan, silakan mengisi sheets QnA 🗒️</p>
            </div>

            <div className="assignment-closing">
              <p>{assignmentContent.closing}</p>
            </div>
          </div>

          {/* Class Comments Section */}
          <div className="class-comments-section">
            <div className="comments-header">
              <span className="comments-icon">👥</span>
              <h3>Class Comments</h3>
            </div>
            <button className="add-comment-btn">Add Comments</button>
          </div>
        </div>

        {/* Your Work Card - Main Content Only */}
        <div className="your-work-card-main">
          <div className="work-header">
            <h3>Your Work</h3>
            <span className={`work-status ${workStatus.toLowerCase()}`}>{workStatus}</span>
          </div>
          
          <button className="add-work-btn" onClick={handleAddWork}>
            + Add or Create
          </button>
          
          <button className="mark-done-btn" onClick={handleMarkAsDone}>
            Mark As Done
          </button>

          <div className="private-comments-section">
            <div className="private-header">
              <span className="private-icon">🔒</span>
              <h4>Private comments</h4>
            </div>
            <button className="add-private-comment-btn">Add Private Comments</button>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Standard Components Only */}
      <RightSidebar />
    </div>
  );
}