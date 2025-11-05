import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import './AssignmentPage.css';

export default function AssignmentPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [assignments] = useState([
    { id: 1, no: 1, bab: 'Introduction & Basic Tenses', title: 'Tenses Table Completion', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 2, no: 2, bab: 'Introduction & Basic Tenses', title: 'Past Tense Exercise', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Submitted' },
    { id: 3, no: 3, bab: 'Introduction & Basic Tenses', title: 'Future Tense Practice', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 4, no: 4, bab: 'Introduction & Basic Tenses', title: 'Present Perfect Quiz', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Submitted' },
    { id: 5, no: 5, bab: 'Introduction & Basic Tenses', title: 'Mixed Tenses Review', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 6, no: 6, bab: 'Introduction & Basic Tenses', title: 'Grammar Assessment', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 7, no: 7, bab: 'Introduction & Basic Tenses', title: 'Writing Exercise', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 8, no: 8, bab: 'Introduction & Basic Tenses', title: 'Reading Comprehension', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 9, no: 9, bab: 'Introduction & Basic Tenses', title: 'Listening Practice', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 10, no: 10, bab: 'Introduction & Basic Tenses', title: 'Speaking Exercise', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 11, no: 11, bab: 'Introduction & Basic Tenses', title: 'Vocabulary Quiz', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 12, no: 12, bab: 'Introduction & Basic Tenses', title: 'Final Assessment', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Submitted' },
    { id: 13, no: 13, bab: 'Introduction & Basic Tenses', title: 'Bonus Exercise', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 14, no: 14, bab: 'Introduction & Basic Tenses', title: 'Review Session', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
    { id: 15, no: 15, bab: 'Introduction & Basic Tenses', title: 'Practice Test', start: '10/10/25 00:00', end: '15/10/25 23:59', status: 'Unsubmitted' },
  ]);

  // Pagination
  const totalPages = Math.ceil(assignments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssignments = assignments.slice(startIndex, endIndex);

  function handleOpenAssignment(assignment) {
    navigate(`/assignment/${assignment.id}`, {
      state: { 
        assignment: {
          id: assignment.id,
          title: assignment.title,
          bab: assignment.bab,
          dueDate: assignment.end,
          status: assignment.status === 'Submitted' ? 'Submitted' : 'Assigned'
        }
      }
    });
  }

  return (
    <div className="assignment-root">
      <LeftSidebar activePage="assignment" />

      {/* Main Content */}
      <main className="assignment-content">
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
          <span className="breadcrumb-current">Assignment</span>
        </div>

        {/* Assignment Table */}
        <div className="assignment-table-container">
          <table className="assignment-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Bab</th>
                <th>Title</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAssignments.map((assignment) => (
                <tr key={assignment.id} className="assignment-row">
                  <td>{assignment.no}</td>
                  <td>{assignment.bab}</td>
                  <td>{assignment.title}</td>
                  <td>{assignment.start}</td>
                  <td>{assignment.end}</td>
                  <td>
                    <span className={`status-badge ${assignment.status.toLowerCase()}`}>
                      {assignment.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="open-btn"
                      onClick={() => handleOpenAssignment(assignment)}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              &lt;&lt; Back
            </button>
            
            <div className="pagination-pages">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-page ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next &gt;&gt;
            </button>
          </div>
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}