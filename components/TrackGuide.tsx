import React, { useState, useEffect } from 'react';
import { Track, Car } from '../types';
import { getRaceEngineerTips } from '../services/geminiService';
import Button from './Button';
import ReactMarkdown from 'react-markdown'; // Assuming we'd handle markdown rendering in a real app, here we might just display text or simple MD processing

interface TrackGuideProps {
  track: Track;
  car: Car;
}

const TrackGuide: React.FC<TrackGuideProps> = ({ track, car }) => {
  const [tips, setTips] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Reset tips when track changes
  useEffect(() => {
    setTips(null);
    setExpanded(false);
  }, [track.id, car.id]);

  const handleAskEngineer = async () => {
    setLoading(true);
    setExpanded(true);
    const result = await getRaceEngineerTips(track, car);
    setTips(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
               </svg>
             </div>
             <div>
               <h3 className="font-bold text-lg text-white">Race Engineer</h3>
               <p className="text-xs text-slate-400">AI Powered Strategy for {car.name}</p>
             </div>
          </div>
          
          {!expanded && (
            <Button onClick={handleAskEngineer} variant="secondary" className="text-xs">
              Request Track Data
            </Button>
          )}
        </div>

        {expanded && (
          <div className="mt-4 bg-slate-950/50 rounded-lg p-4 border border-slate-800 min-h-[100px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <span className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                <p className="text-slate-400 text-sm animate-pulse">Contacting Pit Wall...</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none text-slate-300">
                <div className="whitespace-pre-line leading-relaxed">
                    {tips}
                </div>
              </div>
            )}
            
            {!loading && (
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={() => setExpanded(false)}
                        className="text-xs text-slate-500 hover:text-white underline"
                    >
                        Close Radio
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackGuide;