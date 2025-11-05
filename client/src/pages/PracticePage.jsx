import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import beeImage from '../assets/bee.png';
import './PracticePage.css';

export default function PracticePage() {
  const navigate = useNavigate();
  
  // Practice sections data - 3 sections with 5-6 nodes each
  const [sections, setSections] = useState([
    {
      id: 1,
      section: 'SECTION 2, UNIT 10',
      title: 'Say where people are from',
      color: '#c084fc', // purple
      nodes: [
        { id: 1, type: 'star', unlocked: true, completed: true, position: { top: '15%', left: '28%' } },
        { id: 2, type: 'practice', unlocked: true, completed: false, position: { top: '30%', left: '38%' } },
        { id: 3, type: 'lesson', unlocked: true, completed: false, position: { top: '48%', left: '48%' } },
        { id: 4, type: 'star', unlocked: true, completed: false, position: { top: '65%', left: '58%' } },
        { id: 5, type: 'book', unlocked: false, completed: false, position: { top: '82%', left: '48%' } },
      ]
    },
    {
      id: 2,
      section: 'SECTION 2, UNIT 11',
      title: 'Order food and drinks',
      color: '#fbbf24', // yellow
      nodes: [
        { id: 6, type: 'star', unlocked: false, completed: false, position: { top: '15%', left: '48%' } },
        { id: 7, type: 'practice', unlocked: false, completed: false, position: { top: '28%', left: '38%' } },
        { id: 8, type: 'lesson', unlocked: false, completed: false, position: { top: '42%', left: '48%' } },
        { id: 9, type: 'star', unlocked: false, completed: false, position: { top: '56%', left: '58%' } },
        { id: 10, type: 'book', unlocked: false, completed: false, position: { top: '68%', left: '68%' } },
        { id: 11, type: 'microphone', unlocked: false, completed: false, position: { top: '82%', left: '48%' } },
      ]
    },
    {
      id: 3,
      section: 'SECTION 2, UNIT 12',
      title: 'Talk about your family',
      color: '#10b981', // green
      nodes: [
        { id: 12, type: 'star', unlocked: false, completed: false, position: { top: '15%', left: '48%' } },
        { id: 13, type: 'practice', unlocked: false, completed: false, position: { top: '30%', left: '38%' } },
        { id: 14, type: 'lesson', unlocked: false, completed: false, position: { top: '45%', left: '48%' } },
        { id: 15, type: 'trophy', unlocked: false, completed: false, position: { top: '60%', left: '58%' } },
        { id: 16, type: 'chest', unlocked: false, completed: false, position: { top: '75%', left: '48%' } },
      ]
    }
  ]);

  // Check if section is completed
  function isSectionCompleted(sectionNodes) {
    return sectionNodes.every(node => node.completed || !node.unlocked);
  }

  // Update sections based on completion
  useEffect(() => {
    setSections(prevSections => {
      const updatedSections = [...prevSections];
      
      // Check each section and lock subsequent sections if not completed
      for (let i = 0; i < updatedSections.length - 1; i++) {
        const currentSectionCompleted = isSectionCompleted(updatedSections[i].nodes);
        
        // If current section is not completed, lock all nodes in next sections
        if (!currentSectionCompleted) {
          for (let j = i + 1; j < updatedSections.length; j++) {
            updatedSections[j].nodes = updatedSections[j].nodes.map(node => ({
              ...node,
              unlocked: false
            }));
          }
          break;
        }
      }
      
      return updatedSections;
    });
  }, []);

  function handleNodeClick(node, section, sectionIndex) {
    // Check if previous section is completed
    if (sectionIndex > 0) {
      const previousSection = sections[sectionIndex - 1];
      const previousSectionCompleted = isSectionCompleted(previousSection.nodes);
      
      if (!previousSectionCompleted) {
        alert('🔒 Complete the previous section first!');
        return;
      }
    }

    if (node.unlocked) {
      // Simulate completing the node
      setSections(prevSections => {
        const updatedSections = [...prevSections];
        const sectionToUpdate = updatedSections[sectionIndex];
        const nodeIndex = sectionToUpdate.nodes.findIndex(n => n.id === node.id);
        
        if (nodeIndex !== -1) {
          // Mark current node as completed
          sectionToUpdate.nodes[nodeIndex].completed = true;
          
          // Unlock next node in the same section
          if (nodeIndex < sectionToUpdate.nodes.length - 1) {
            sectionToUpdate.nodes[nodeIndex + 1].unlocked = true;
          }
          
          // Check if current section is now completed
          const currentSectionCompleted = isSectionCompleted(sectionToUpdate.nodes);
          
          // If current section is completed and there's a next section, unlock first node of next section
          if (currentSectionCompleted && sectionIndex < updatedSections.length - 1) {
            updatedSections[sectionIndex + 1].nodes[0].unlocked = true;
          }
        }
        
        return updatedSections;
      });

      alert(`Starting: ${section.title}\nNode Type: ${node.type}\nNode ID: ${node.id}\n\n✅ Node completed!`);
      // Navigate to practice exercise page
      // navigate(`/practice/${section.id}/${node.id}`);
    } else {
      alert('🔒 This lesson is locked! Complete previous lessons first.');
    }
  }

  function getNodeIcon(type, unlocked, completed) {
    if (!unlocked) {
      return '🔒';
    }
    
    switch(type) {
      case 'star':
        return '⭐';
      case 'practice':
        return '🎯';
      case 'lesson':
        return '🎧';
      case 'book':
        return '📖';
      case 'trophy':
        return '🏆';
      case 'chest':
        return '🎁';
      case 'microphone':
        return '🎤';
      default:
        return '⚪';
    }
  }

  // Get section status for visual indication
  function getSectionStatus(sectionIndex) {
    if (sectionIndex === 0) return 'active';
    
    const previousSection = sections[sectionIndex - 1];
    const previousSectionCompleted = isSectionCompleted(previousSection.nodes);
    
    return previousSectionCompleted ? 'active' : 'locked';
  }

  return (
    <div className="practice-root">
      <LeftSidebar activePage="practice" />

      {/* Main Content */}
      <main className="practice-content">
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
          <span className="breadcrumb-current">Practice</span>
        </div>

        {/* Practice Sections */}
        <div className="practice-sections">
          {sections.map((section, sectionIndex) => {
            const sectionStatus = getSectionStatus(sectionIndex);
            
            return (
              <div key={section.id} className={`practice-section ${sectionStatus === 'locked' ? 'section-locked' : ''}`}>
                {/* Section Header */}
                <div className="section-header" style={{ backgroundColor: section.color }}>
                  <div className="section-info">
                    <span className="section-label">{section.section}</span>
                    <h2 className="section-title">
                      {section.title}
                      {sectionStatus === 'locked' && ' 🔒'}
                    </h2>
                  </div>
                  <button className="section-menu-btn">☰</button>
                </div>

                {/* Practice Path */}
                <div className={`practice-path ${sectionStatus === 'locked' ? 'path-locked' : ''}`}>
                  {/* Bee Character - Show on first section only */}
                  {sectionIndex === 0 && (
                    <div className="bee-character" style={{ bottom: '12%', left: '8%' }}>
                      <img src={beeImage} alt="Bee Character" className="bee-image" />
                    </div>
                  )}

                  {/* Second section bee */}
                  {sectionIndex === 1 && (
                    <div className="bee-character" style={{ bottom: '8%', left: '8%' }}>
                      <img src={beeImage} alt="Bee Character" className="bee-image" />
                    </div>
                  )}

                  {/* Third section bee */}
                  {sectionIndex === 2 && (
                    <div className="bee-character" style={{ bottom: '10%', right: '8%' }}>
                      <img src={beeImage} alt="Bee Character" className="bee-image" />
                    </div>
                  )}

                  {/* Path SVG Lines - Curved paths */}
                  <svg className="path-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {section.nodes.map((node, index) => {
                      if (index < section.nodes.length - 1) {
                        const current = section.nodes[index];
                        const next = section.nodes[index + 1];
                        
                        const x1 = parseFloat(current.position.left);
                        const y1 = parseFloat(current.position.top);
                        const x2 = parseFloat(next.position.left);
                        const y2 = parseFloat(next.position.top);
                        
                        const controlX = (x1 + x2) / 2;
                        const controlY = (y1 + y2) / 2;
                        
                        return (
                          <path
                            key={`line-${node.id}`}
                            d={`M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`}
                            fill="none"
                            stroke={current.unlocked ? '#cbd5e1' : '#e5e7eb'}
                            strokeWidth="0.5"
                            strokeDasharray={current.unlocked ? '0' : '2,2'}
                          />
                        );
                      }
                      return null;
                    })}
                  </svg>

                  {/* Practice Nodes */}
                  {section.nodes.map((node) => (
                    <button
                      key={node.id}
                      className={`practice-node ${node.type} ${node.unlocked ? 'unlocked' : 'locked'} ${node.completed ? 'completed' : ''}`}
                      style={{
                        top: node.position.top,
                        left: node.position.left
                      }}
                      onClick={() => handleNodeClick(node, section, sectionIndex)}
                    >
                      <span className="node-icon">{getNodeIcon(node.type, node.unlocked, node.completed)}</span>
                    </button>
                  ))}

                  {/* Overlay for locked section */}
                  {sectionStatus === 'locked' && (
                    <div className="section-lock-overlay">
                      <div className="lock-message">
                        <span className="lock-icon">🔒</span>
                        <p>Complete the previous section to unlock</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}