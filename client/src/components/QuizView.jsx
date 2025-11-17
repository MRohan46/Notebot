import React, { useState } from "react";
import { Eye, CheckCircle } from "lucide-react";

export const QuizView = ({quizData, revealedAnswers, toggleAnswer}) => (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="rounded-xl p-6 flex items-center justify-between" style={{ background: '#181836' }}>
        <div>
          <p className="text-sm mb-2" style={{ color: '#8C8CA8' }}>
            {quizData?.questionCount} Questions • {quizData?.difficulty} Difficulty
          </p>
          <h2 className="text-2xl font-bold" style={{ color: '#F5F5F5' }}>
            Practice Mode
          </h2>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {quizData?.questions.map((q, i) => (
          <div 
            key={q.id}
            className="rounded-xl p-6 transition-all duration-300"
            style={{ 
              background: '#181836',
              border: `2px solid ${revealedAnswers[q.id] ? '#A020F0' : 'rgba(160,32,240,0.2)'}`
            }}>
            {/* Question */}
            <div className="mb-4">
              <div className="flex items-start gap-4 mb-3">
                <span 
                  className="px-3 py-1 rounded-lg font-bold text-lg flex-shrink-0"
                  style={{ background: 'rgba(160,32,240,0.2)', color: '#A020F0' }}>
                  Q{i + 1}
                </span>
                <p className="font-semibold text-lg leading-relaxed pt-1" style={{ color: '#F5F5F5' }}>
                  {q.question}
                </p>
              </div>
            </div>

            {/* Answer Section */}
            {revealedAnswers[q.id] ? (
              <div 
                className="rounded-lg p-4 mt-4"
                style={{ 
                  background: 'rgba(160,32,240,0.1)',
                  borderLeft: '3px solid #A020F0'
                }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} style={{ color: '#A020F0' }} />
                  <span className="font-semibold text-sm" style={{ color: '#A020F0' }}>
                    MODEL ANSWER
                  </span>
                </div>
                <p className="leading-relaxed" style={{ color: '#F5F5F5' }}>
                  {q.answer}
                </p>
              </div>
            ) : (
              <button
                onClick={() => toggleAnswer(q.id)}
                className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2 mt-3"
                style={{
                  background: 'rgba(160,32,240,0.2)',
                  color: '#A020F0',
                  border: '2px solid #A020F0'
                }}>
                <Eye size={18} />
                Reveal Answer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
