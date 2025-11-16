import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, Calendar, Clock, BookOpen, Download, Share2, Edit, Trash2, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { deleteSessionAPI, getSessionAPI } from '../utils/APIroutes';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SessionLoader from '../components/SessionLoader';
import { QuizView } from '../components/QuizView';
import { SummaryView } from '../components/SummaryView';
import { useNavigate } from 'react-router-dom';
const Session = () => {
  const [contentType, setContentType] = useState('summary'); // 'summary' or 'quiz'
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [summaryData, setSummaryData] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [serverStatus, setServerStatus] = useState(null)
  const { id: sessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
        try {
        const response = await axios.post(
            getSessionAPI,
            { sessionId },                // POST body
            { withCredentials: true }     // config
        );

        const session = response.data?.session;
        setServerStatus(response.status);
        if (!session) return console.warn("Session is null!");

        // Transform summary
        const summary = session.output?.summary;
        const transformedSummary = {
            title: session.title || "remove",
            date: session.date?.split("T")[0] || "remove",
            content: {
            mainSummary: summary?.summary || ["remove"],
            keyTerms: (summary?.keywords || []).map((kw) => ({
                term: kw,
                definition: "remove",
            })),
            },
        };

        // Transform quiz
        const quiz = session.output?.quiz || [];
        const transformedQuiz = {
            title: session.title || "remove",
            date: session.date?.split("T")[0] || "remove",
            questionCount: quiz.length || 0,
            difficulty: "remove",
            questions: quiz.map((q, i) => ({
            id: i + 1,
            question: q.question || "remove",
            answer: q.answer || "remove",
            type: "remove",
            })),
        };

        setSummaryData(transformedSummary);
        setQuizData(transformedQuiz);
        } catch (err) {
        console.error("Failed to fetch session:", err);
        }
    };

    fetchSession();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        deleteSessionAPI,
        { 
          data: {sessionId},
          withCredentials: true
         } // <-- request body
      );

      const data = response.data;
      navigate("/app/home")
    } catch (err) {
      console.error("Delete API error:", err);
    }
  }

  const toggleAnswer = (id) => {
    setRevealedAnswers({
      ...revealedAnswers,
      [id]: !revealedAnswers[id]
    });
  };


    // If server returned error
    if (serverStatus !== 200) {
    return <SessionLoader loading={false} error={true} />;
    }

    // If data is still loading
    if (!summaryData || !quizData) {
    return <SessionLoader loading={true} error={false} />;
    }

    // If we have data, render the session normally




  const data = contentType === 'summary' ? summaryData : quizData;
  return (
    <div className="min-h-screen font-sans" style={{ background: '#0A0A1F', color: '#F5F5F5' }}>
      {/* Header */}
      <div 
        className="sticky top-0 z-50 border-b"
        style={{ 
          background: 'rgba(24,24,54,0.95)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(0,255,255,0.2)'
        }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center gap-2 transition-colors hover:text-cyan-400"
              style={{ color: '#8C8CA8' }}
              onClick={() => navigate("/app/home")}
              >
              <ArrowLeft size={20} onClick={() => navigate("/app/home")} />
              <span>Back to Library</span>
            </button>

            <div className="flex items-center gap-3">
              <button 
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{ background: 'rgba(255,100,100,0.1)', color: '#ff6464' }}
                title="Delete">
                <Trash2 size={20} onClick={handleDelete} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setContentType('summary')}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-300"
              style={{
                background: contentType === 'summary' ? '#00FFFF' : 'rgba(0,255,255,0.1)',
                color: contentType === 'summary' ? '#0A0A1F' : '#00FFFF',
                border: contentType === 'summary' ? 'none' : '1px solid #00FFFF'
              }}>
              View Summary
            </button>
            <button
              onClick={() => setContentType('quiz')}
              className="px-4 py-2 rounded-lg font-semibold transition-all duration-300"
              style={{
                background: contentType === 'quiz' ? '#A020F0' : 'rgba(160,32,240,0.1)',
                color: contentType === 'quiz' ? '#0A0A1F' : '#A020F0',
                border: contentType === 'quiz' ? 'none' : '1px solid #A020F0'
              }}>
              View Quiz
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <span 
              className="px-4 py-1 rounded-full text-sm font-semibold"
              style={{ 
                background: contentType === 'summary' ? 'rgba(0,255,255,0.2)' : 'rgba(160,32,240,0.2)',
                color: contentType === 'summary' ? '#00FFFF' : '#A020F0'
              }}>
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: '#F5F5F5' }}>
            {data.title}
          </h1>

          <div className="flex items-center gap-6 text-sm" style={{ color: '#8C8CA8' }}>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{data.date}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        {contentType === 'summary' ? <SummaryView summaryData={summaryData} /> : <QuizView quizData={quizData} revealedAnswers={revealedAnswers} toggleAnswer={toggleAnswer} />}
      </div>

      <style>{`
        * {
          scrollbar-width: thin;
          scrollbar-color: #00FFFF #181836;
        }
        
        *::-webkit-scrollbar {
          width: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: #181836;
        }
        
        *::-webkit-scrollbar-thumb {
          background: #00FFFF;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Session;