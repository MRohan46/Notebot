import React, { useEffect, useState } from 'react';
import { Download, Sparkles, LucideCloudUpload } from 'lucide-react';
import axios from 'axios'
import { analyzeAPI, analyzeSaveAPI, deleteSessionAPI, getSessionsAPI } from "../utils/APIroutes.js"
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar.jsx';
import { Library } from '../components/Library.jsx';
import { Header } from '../components/Header.jsx';
import useGetUserData from '../hooks/useGetUserData.js';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import mammoth from 'mammoth';
import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons'; 


// Set workerSrc to the local build
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  `/pdf.worker.min.mjs`;

const AppHome = () => {
  const [page, setPage] = useState('dashboard');
  const [sessionTitle, setSessionTitle] = useState('Untitled Session');
  const [inputText, setInputText] = useState('');
  const [aiMode, setAiMode] = useState('summary');
  const [activeTab, setActiveTab] = useState('summary');
  const [output, setOutput] = useState({
    summary: null,
    quiz: null,
  });
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedSessions, setSavedSessions] = useState([]);
  const { userData, loading, error } = useGetUserData();

  useEffect(() => {
    if (!loading && !userData) {
      navigate("/auth");
    }
  }, [loading, userData, navigate]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(getSessionsAPI, { withCredentials: true });
        setSavedSessions(response.data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      }
    };

    fetchSessions();
  }, [page]); // empty dependency array = run once on mount

  const handleDelete = async (sessionId) => {
    setIsProcessing(true); 
    try {
      const response = await axios.delete(
        deleteSessionAPI,
        { 
          data: {sessionId},
          withCredentials: true
         } // <-- request body
      );

      const data = response.data;
      setSavedSessions(prev => prev.filter(session => session.id !== sessionId));

    } catch (err) {
      console.error("Delete API error:", err);
    } finally {
      setIsProcessing(false);
    }
  }
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);

    try {
      const response = await axios.post(
        analyzeAPI,
        { text: inputText, mode: aiMode }, // <-- request body
        { withCredentials: true }          // <-- send cookies if needed
      );

      const data = response.data;

      // Update your state based on returned type
      if (data.type === "summary") {
        setOutput(prev => ({
          ...prev,
          summary: data.content
        }));
      } else if (data.type === "quiz") {
        setOutput(prev => ({
          ...prev,
          quiz: data.content
        }));
      }

      setActiveTab(aiMode);
    } catch (err) {
      console.error("Analyze API error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!output) return;

    const newSession = {
      id: Date.now(),
      title: sessionTitle,
      snippet:
        output.summary
          ? output.summary.summary?.[0]?.substring(0, 80) + "..."
          : "Practice questions generated",
      date: new Date().toISOString().split("T")[0],
      type: output.summary ? "Summary" : "Quiz"
    };

    // 🔥 Save full AI output (summary + quiz)
    try {
      await axios.post(analyzeSaveAPI,
        {
          title: newSession.title,
          snippet: newSession.snippet,
          type: newSession.type,
          date: newSession.date,
          output: output   // <-- FULL data here (both summary & quiz)
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Saving session failed:", err);
    }

    const btn = document.getElementById("save-btn");
    btn.classList.add("animate-pulse");
    setTimeout(() => btn.classList.remove("animate-pulse"), 500);
  };

  const handleFileChange = async (file) => {
    const fileType = file.type;
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const fileContent = fileReader.result; // ArrayBuffer

      try {
        let extractedText = '';

        if (fileType === 'application/pdf') {
          extractedText = await extractTextFromPDF(fileContent);
        } else if (fileType === 'text/plain') {
          extractedText = new TextDecoder().decode(fileContent);
        }

        setInputText(extractedText);
      } catch (error) {
        console.error('Error extracting text from file:', error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };



  const extractTextFromPDF = async (pdfBuffer) => {
    const pdfDoc = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
    let extractedText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      textContent.items.forEach(item => {
        extractedText += item.str + ' ';
      });
    }

    return extractedText;
  };

  const Dashboard = () => (
    <div className="flex flex-col md:flex-row gap-6 h-full p-6">
      <div className="w-full md:w-[40%] flex flex-col gap-6">
        <div className="rounded p-6 flex flex-col gap-4" style={{ background: '#181836' }}>
          <h2 className="text-lg font-semibold tracking-wide" style={{ color: '#8C8CA8' }}>
            Lecture Source
          </h2>
          
          <div className="flex flex-col gap-4">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your lecture notes, transcript, or study material here..."
              className="w-full h-48 p-4 rounded outline-none resize-none font-mono text-sm transition-all"
              style={{ 
                background: '#0A0A1F',
                color: '#F5F5F5',
                border: '2px solid transparent'
              }}
              onFocus={(e) => e.target.style.borderColor = '#A020F0'}
              onBlur={(e) => e.target.style.borderColor = 'transparent'}
            />
            
            <Upload
              customRequest={({ file, onSuccess }) => {
                handleFileChange(file); // process the file
                onSuccess("ok");        // fake success
              }}
              showUploadList={false}
              accept=".pdf,.txt,.pptx"
              multiple={false}
              // enable drag-and-drop
              style={{ width: '100%' }}
            >
              <div
                className="border-2 border-dashed rounded p-8 text-center cursor-pointer transition-all hover:border-opacity-100"
                style={{ borderColor: 'rgba(0,255,255,0.3)' }}
              >
                <UploadOutlined size={32} style={{ color: '#00FFFF' }} className="mx-auto mb-2" />
                <p style={{ color: '#8C8CA8' }}>
                  Drop PDF, TXT, or PPTX files here
                </p>
              </div>
            </Upload>

          </div>
        </div>
        
        <div className="rounded p-6 flex flex-col gap-4" style={{ background: '#181836' }}>
          <h2 className="text-lg font-semibold tracking-wide" style={{ color: '#8C8CA8' }}>
            AI Generation Modules
          </h2>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setAiMode('summary')}
              className="flex-1 py-3 rounded font-semibold transition-all duration-300"
              style={{
                background: aiMode === 'summary' ? 'rgba(0,255,255,0.1)' : 'transparent',
                color: '#F5F5F5',
                border: `2px solid ${aiMode === 'summary' ? '#00FFFF' : '#8C8CA8'}`,
                boxShadow: aiMode === 'summary' ? '0 0 12px rgba(0,255,255,0.4)' : 'none'
              }}>
              Summary
            </button>
            
            <button 
              onClick={() => setAiMode('quiz')}
              className="flex-1 py-3 rounded font-semibold transition-all duration-300"
              style={{
                background: aiMode === 'quiz' ? 'rgba(0,255,255,0.1)' : 'transparent',
                color: '#F5F5F5',
                border: `2px solid ${aiMode === 'quiz' ? '#00FFFF' : '#8C8CA8'}`,
                boxShadow: aiMode === 'quiz' ? '0 0 12px rgba(0,255,255,0.4)' : 'none'
              }}>
              Quiz Generator
            </button>
          </div>
        </div>
        
        <button 
          onClick={handleAnalyze}
          disabled={!(typeof inputText === 'string' && inputText.trim()) || isProcessing}
          className="w-full py-4 rounded font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isProcessing ? 'linear-gradient(90deg, #00FFFF, #A020F0)' : '#00FFFF',
            color: '#0A0A1F',
            boxShadow: '0 0 20px rgba(0,255,255,0.5)'
          }}>
          {isProcessing ? 'Processing...' : 'Analyze Content'}
        </button>
      </div>
      
      <div className="w-full md:flex-1 rounded p-6 flex flex-col" style={{ background: '#181836' }}>
        {!output.summary && !output.quiz ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Sparkles size={64} style={{ color: '#8C8CA8' }} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: '#8C8CA8' }}>
                Upload content and select a generation mode to begin
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-6 mb-6 border-b pb-2" style={{ borderColor: '#8C8CA8' }}>
              <button 
                onClick={() => setActiveTab('summary')}
                className="pb-2 font-semibold transition-all relative"
                style={{ color: activeTab === 'summary' ? '#00FFFF' : '#8C8CA8' }}>
                Summary
                {activeTab === 'summary' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                       style={{ background: '#00FFFF', boxShadow: '0 0 8px rgba(0,255,255,0.8)' }} />
                )}
              </button>
              
              <button 
                onClick={() => setActiveTab('quiz')}
                className="pb-2 font-semibold transition-all relative"
                style={{ color: activeTab === 'quiz' ? '#00FFFF' : '#8C8CA8' }}>
                Quiz
                {activeTab === 'quiz' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                       style={{ background: '#00FFFF', boxShadow: '0 0 8px rgba(0,255,255,0.8)' }} />
                )}
              </button>
            </div>
            
            <div className="flex-1 overflow-auto">
              {activeTab === 'summary' && output.summary ? (
                <div>

                  <h3 className="text-xl font-bold mb-6" style={{ color: '#F5F5F5' }}>
                    Lessons
                  </h3>
                  <ul className="space-y-4">
                    {output.summary.links.map((item, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed" style={{ color: '#F5F5F5' }}>
                        <span style={{ color: '#00FFFF' }}>•</span>
                        <a href={item}>
                          <span>{item}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                  

                  <h3 className="text-xl font-bold mb-6" style={{ color: '#F5F5F5' }}>
                    AI-Generated Summary
                  </h3>
                  
                  <ul className="space-y-4">
                    {output.summary.summary.map((item, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed" style={{ color: '#F5F5F5' }}>
                        <span style={{ color: '#00FFFF' }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8">
                    <h4 className="text-sm font-semibold mb-3" style={{ color: '#8C8CA8' }}>
                      KEY TERMS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {output.summary.keywords.map((kw, i) => (
                        <span 
                          key={i}
                          className="px-3 py-1 rounded-full text-sm font-mono cursor-pointer transition-all hover:drop-shadow-[0_0_8px_rgba(160,32,240,0.6)]"
                          style={{ 
                            background: 'rgba(160,32,240,0.2)',
                            color: '#A020F0',
                            border: '1px solid #A020F0'
                          }}
                          title="Click for definition (coming soon)">
                          {kw}
                        </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <QuizView questions={output.quiz || []} />
                )}
            </div>
            
            <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: '#8C8CA8' }}>
              <button 
                id="save-btn"
                onClick={handleSave}
                className="flex-1 py-3 rounded font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: '#00FFFF',
                  color: '#0A0A1F',
                  boxShadow: '0 0 12px rgba(0,255,255,0.4)'
                }}>
                Save to Library
              </button>
              
              <button 
                className="px-4 py-3 rounded transition-all duration-300 hover:bg-opacity-20"
                style={{ background: 'rgba(140,140,168,0.1)', color: '#8C8CA8' }}
                title="Export">
                <Download size={20} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const QuizView = ({ questions }) => {
    const [revealed, setRevealed] = useState({});
    
    return (
      <div>
        <h3 className="text-xl font-bold mb-6" style={{ color: '#F5F5F5' }}>
          Practice Questions
        </h3>
        
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="rounded p-4" style={{ background: '#0A0A1F' }}>
              <p className="font-mono mb-3" style={{ color: '#F5F5F5' }}>
                {i + 1}. {q.question}
              </p>
              
              {revealed[i] ? (
                <div className="p-3 rounded mt-2" style={{ background: 'rgba(160,32,240,0.1)', borderLeft: '3px solid #A020F0' }}>
                  <p className="text-sm leading-relaxed" style={{ color: '#F5F5F5' }}>
                    {q.answer}
                  </p>
                </div>
              ) : (
                <button 
                  onClick={() => setRevealed({...revealed, [i]: true})}
                  className="px-4 py-2 rounded text-sm font-semibold transition-all mt-2"
                  style={{
                    background: 'rgba(160,32,240,0.2)',
                    color: '#A020F0',
                    border: '1px solid #A020F0',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}>
                  Reveal Answer
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  const Settings = () => (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 tracking-wide" style={{ color: '#F5F5F5' }}>
        Settings
      </h1>
      
      <div className="space-y-6">
        <div className="rounded p-6" style={{ background: '#181836' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#F5F5F5' }}>
            Appearance
          </h3>
          <div className="flex items-center justify-between">
            <span style={{ color: '#8C8CA8' }}>Theme Mode</span>
            <div className="px-4 py-2 rounded font-mono" style={{ background: '#0A0A1F', color: '#00FFFF' }}>
              Dark Mode (Active)
            </div>
          </div>
        </div>
        
        <div className="rounded p-6" style={{ background: '#181836' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#F5F5F5' }}>
            Account
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: '#8C8CA8' }}>Email</span>
              <span style={{ color: '#F5F5F5' }}>{userData?.email}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#8C8CA8' }}>Plan</span>
              <span style={{ color: '#00FFFF' }}>Free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  console.log(userData)

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0A0A1F', color: '#F5F5F5' }}>
      <Header page={page} sessionTitle={sessionTitle} setSessionTitle={setSessionTitle} name={userData?.fullName}/>
      <Sidebar setPage={setPage} setInputText={setInputText} setOutput={setOutput} setSessionTitle={setSessionTitle} page={page}/>
      
      <div className="ml-16 mt-16 h-[calc(auto-4rem)]">
        {page === 'dashboard' && <Dashboard />}
        {page === 'library' && <Library savedSessions={savedSessions} navigate={navigate} handleDelete={handleDelete}/>}
        {page === 'settings' && <Settings />}
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
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
        body{
        height: auto
        }
      `}</style>
    </div>
  );
};

export default AppHome;