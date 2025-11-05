import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import beeImage from '../assets/bee.png';
import './PracticeDetailsPage.css';

export default function PracticeDetailsPage() {
  const navigate = useNavigate();
  const { sectionId, nodeId } = useParams();

  // Practice questions data
  const [questions] = useState([
    {
      id: 1,
      type: 'translate',
      instruction: 'Translate this sentence',
      sentence: 'Amanda y yo hablamos con la maestra.',
      audioUrl: '/audio/sentence1.mp3',
      words: ['ten', 'We', 'sorry', 'four', 'men', 'are', 'always'],
      correctAnswer: ['We', 'are', 'sorry'],
    },
    {
      id: 2,
      type: 'translate',
      instruction: 'Translate this sentence',
      sentence: 'El niño come una manzana.',
      audioUrl: '/audio/sentence2.mp3',
      words: ['The', 'boy', 'girl', 'eats', 'drinks', 'an', 'apple', 'orange'],
      correctAnswer: ['The', 'boy', 'eats', 'an', 'apple'],
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(questions[0].words);
  const [hearts, setHearts] = useState(5);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [draggedWord, setDraggedWord] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Save completed node to localStorage
  function markNodeAsCompleted() {
    const completedNodes = JSON.parse(localStorage.getItem('completedNodes') || '[]');
    const nodeKey = `${sectionId}-${nodeId}`;
    
    if (!completedNodes.includes(nodeKey)) {
      completedNodes.push(nodeKey);
      localStorage.setItem('completedNodes', JSON.stringify(completedNodes));
    }
  }

  // Drag handlers for available words
  function handleDragStart(e, word, index) {
    setDraggedWord({ word, index, from: 'available' });
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  }

  function handleDragEnd(e) {
    e.target.style.opacity = '1';
    setDraggedWord(null);
  }

  // Drag handlers for selected words
  function handleSelectedDragStart(e, word, index) {
    setDraggedWord({ word, index, from: 'selected' });
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  }

  // Drop zone handlers
  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDropOnAnswer(e) {
    e.preventDefault();
    
    if (!draggedWord) return;

    if (draggedWord.from === 'available') {
      // Move from available to selected
      setSelectedWords([...selectedWords, draggedWord.word]);
      setAvailableWords(availableWords.filter((_, i) => i !== draggedWord.index));
    }
  }

  function handleDropOnBank(e) {
    e.preventDefault();
    
    if (!draggedWord) return;

    if (draggedWord.from === 'selected') {
      // Move from selected back to available
      setAvailableWords([...availableWords, draggedWord.word]);
      setSelectedWords(selectedWords.filter((_, i) => i !== draggedWord.index));
    }
  }

  // Play audio
  function playAudio() {
    const audio = new Audio(currentQuestion.audioUrl);
    audio.play().catch(err => console.log('Audio playback failed:', err));
  }

  // Check answer
  function handleSubmit() {
    const userAnswer = selectedWords.join(' ');
    const correctAnswer = currentQuestion.correctAnswer.join(' ');
    
    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      setShowFeedback(true);
      
      // Move to next question after 2 seconds
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedWords([]);
          setAvailableWords(questions[currentQuestionIndex + 1].words);
          setShowFeedback(false);
          setIsCorrect(null);
        } else {
          // All questions completed - Mark node as completed
          markNodeAsCompleted();
          alert('🎉 Congratulations! You completed all questions!');
          navigate('/practice');
        }
      }, 2000);
    } else {
      setIsCorrect(false);
      setShowFeedback(true);
      setHearts(hearts - 1);
      
      if (hearts - 1 <= 0) {
        alert('😢 No more hearts! Practice ended.');
        navigate('/practice');
      }
      
      // Hide feedback after 2 seconds
      setTimeout(() => {
        setShowFeedback(false);
        setIsCorrect(null);
      }, 2000);
    }
  }

  // Skip question
  function handleSkip() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedWords([]);
      setAvailableWords(questions[currentQuestionIndex + 1].words);
      setShowFeedback(false);
      setIsCorrect(null);
    }
  }

  return (
    <div className="practice-details-root">
      <LeftSidebar activePage="practice" />

      {/* Main Content */}
      <main className="practice-details-content">
        {/* Top Bar */}
        <header className="practice-top-bar">
          <button className="close-btn" onClick={() => navigate('/practice')}>
            ✕
          </button>
          
          <div className="progress-container">
            <div className="progress-bar-practice">
              <div 
                className="progress-fill-practice" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="hearts-display">
            <span className="heart-icon">❤️</span>
            <span className="hearts-count">{hearts}</span>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="breadcrumb-practice">
          <span onClick={() => navigate('/homepage')} className="breadcrumb-link">Dashboard</span>
          <span className="breadcrumb-separator">›</span>
          <span onClick={() => navigate('/practice')} className="breadcrumb-link">Practice</span>
        </div>

        {/* Question Area */}
        <div className="question-container">
          {/* Question Header */}
          <div className="question-header">
            <h2 className="question-instruction">{currentQuestion.instruction}</h2>
          </div>

          {/* Question Content */}
          <div className="question-content">
            {/* Bee Character */}
            <div className="bee-speaking">
              <img src={beeImage} alt="Bee Character" className="bee-character-img" />
            </div>

            {/* Speech Bubble with Audio */}
            <div className="speech-bubble">
              <button className="audio-btn" onClick={playAudio}>
                🔊
              </button>
              <div className="sentence-text">
                <p className="sentence-main">{currentQuestion.sentence}</p>
              </div>
            </div>
          </div>

          {/* Answer Area - Drop Zone */}
          <div className="answer-area">
            <h3 className="answer-label">Drag words here to translate:</h3>
            
            {/* Selected Words Area - DROP ZONE */}
            <div 
              className="selected-words-area"
              onDragOver={handleDragOver}
              onDrop={handleDropOnAnswer}
            >
              {selectedWords.length === 0 ? (
                <div className="empty-placeholder">
                  <div className="drop-line"></div>
                  <div className="drop-line"></div>
                  <div className="drop-line"></div>
                  <p className="drop-hint">Drop words here</p>
                </div>
              ) : (
                selectedWords.map((word, index) => (
                  <div
                    key={`selected-${index}`}
                    className="word-chip selected"
                    draggable
                    onDragStart={(e) => handleSelectedDragStart(e, word, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {word}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Available Words - DRAG SOURCE */}
          <div 
            className="words-bank"
            onDragOver={handleDragOver}
            onDrop={handleDropOnBank}
          >
            {availableWords.map((word, index) => (
              <div
                key={`available-${index}`}
                className="word-chip available"
                draggable
                onDragStart={(e) => handleDragStart(e, word, index)}
                onDragEnd={handleDragEnd}
              >
                {word}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="skip-btn" onClick={handleSkip}>
              Skip
            </button>
            <button 
              className="submit-btn" 
              onClick={handleSubmit}
              disabled={selectedWords.length === 0}
            >
              Submit
            </button>
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div className={`feedback-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="feedback-content">
                {isCorrect ? (
                  <>
                    <span className="feedback-icon">✅</span>
                    <span className="feedback-text">Correct! Great job!</span>
                  </>
                ) : (
                  <>
                    <span className="feedback-icon">❌</span>
                    <span className="feedback-text">
                      Incorrect. Correct answer: {currentQuestion.correctAnswer.join(' ')}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}