export const SummaryView = ({summaryData}) => (
    <div className="space-y-8">
      {/* Lesson Links */}
      <div className="rounded-xl p-8" style={{ background: '#181836' }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#F5F5F5' }}>
          <div 
            className="w-1 h-8 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #00FFFF, #A020F0)' }} />
          Lessons
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {summaryData?.content?.links?.map((item, i) => (
            <div 
              key={i}
              className="rounded-lg p-4 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ 
                background: '#0A0A1F',
                border: '1px solid rgba(160,32,240,0.3)'
              }}> 
                <a href={item.term}>
                  <h3 
                    className="font-bold mb-2 text-lg"
                    style={{ color: '#A020F0' }}>
                    {item.term}
                  </h3>
                </a>
            </div>
          ))}
        </div>
      </div>
      {/* Main Summary Points */}
      <div className="rounded-xl p-8" style={{ background: '#181836' }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#F5F5F5' }}>
          <div 
            className="w-1 h-8 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #00FFFF, #A020F0)' }} />
          Summary Overview
        </h2>
        
        <div className="space-y-4">
          {summaryData?.content?.mainSummary?.map((point, i) => (
            <div key={i} className="flex gap-4 leading-relaxed">
              <div 
                className="mt-2 w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: '#00FFFF', boxShadow: '0 0 8px rgba(0,255,255,0.6)' }} />
              <p style={{ color: '#F5F5F5', fontSize: '1.05rem' }}>{point}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Terms */}
      <div className="rounded-xl p-8" style={{ background: '#181836' }}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#F5F5F5' }}>
          <div 
            className="w-1 h-8 rounded-full"
            style={{ background: 'linear-gradient(to bottom, #00FFFF, #A020F0)' }} />
          Key Terms & Definitions
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {summaryData?.content?.keyTerms?.map((item, i) => (
            <div 
              key={i}
              className="rounded-lg p-4 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ 
                background: '#0A0A1F',
                border: '1px solid rgba(160,32,240,0.3)'
              }}>
              <h3 
                className="font-bold mb-2 text-lg"
                style={{ color: '#A020F0' }}>
                {item.term}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );