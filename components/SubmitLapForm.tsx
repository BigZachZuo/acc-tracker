import React, { useState } from 'react';
import { Track, User, LapTime } from '../types';
import { CARS } from '../constants';
import { submitLapTime } from '../services/storageService';
import Button from './Button';
import Input from './Input';

interface SubmitLapFormProps {
  track: Track;
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const SubmitLapForm: React.FC<SubmitLapFormProps> = ({ track, user, onSuccess, onCancel }) => {
  const [carId, setCarId] = useState(CARS[0].id);
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [millis, setMillis] = useState('');
  const [conditions, setConditions] = useState<'Dry' | 'Wet'>('Dry');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const m = parseInt(minutes);
    const s = parseInt(seconds);
    const ms = parseInt(millis);

    if (isNaN(m) || isNaN(s) || isNaN(ms)) {
      setError('请输入有效的数字。');
      setIsSubmitting(false);
      return;
    }
    if (s >= 60) {
      setError('秒数必须小于60。');
      setIsSubmitting(false);
      return;
    }
    if (ms >= 1000) {
      setError('毫秒数必须小于1000。');
      setIsSubmitting(false);
      return;
    }

    const totalMilliseconds = (m * 60 * 1000) + (s * 1000) + ms;

    const generateId = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    const newLap: LapTime = {
      id: generateId(),
      username: user.username,
      userEmail: user.email, // Include email for DB
      trackId: track.id,
      carId,
      minutes: m,
      seconds: s,
      milliseconds: ms,
      totalMilliseconds,
      timestamp: new Date().toISOString(),
      conditions
    };

    const result = await submitLapTime(newLap);
    
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl max-w-lg mx-auto w-full animate-fade-in-up">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="text-red-500">录入圈速:</span> {track.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-slate-400 text-sm font-bold mb-2">选择车辆</label>
          <select 
            value={carId} 
            onChange={(e) => setCarId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            {CARS.map(car => (
              <option key={car.id} value={car.id}>
                [{car.class}] {car.brand} {car.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-sm font-bold mb-2">圈速成绩</label>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input 
                placeholder="0" 
                type="number" 
                min="0"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                required
              />
              <span className="text-xs text-slate-500 text-center block mt-1">分</span>
            </div>
            <span className="text-2xl text-slate-500 pb-8">:</span>
            <div className="flex-1">
              <Input 
                placeholder="00" 
                type="number" 
                min="0" max="59"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                required
              />
              <span className="text-xs text-slate-500 text-center block mt-1">秒</span>
            </div>
            <span className="text-2xl text-slate-500 pb-8">.</span>
            <div className="flex-1">
              <Input 
                placeholder="000" 
                type="number" 
                min="0" max="999"
                value={millis}
                onChange={(e) => setMillis(e.target.value)}
                required
              />
              <span className="text-xs text-slate-500 text-center block mt-1">毫秒</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-sm font-bold mb-2">赛道状况</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setConditions('Dry')}
              className={`flex-1 py-3 rounded-lg font-bold border ${
                conditions === 'Dry' 
                  ? 'bg-orange-500/20 border-orange-500 text-orange-500' 
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
              }`}
            >
              ☀️ 干地
            </button>
            <button
              type="button"
              onClick={() => setConditions('Wet')}
              className={`flex-1 py-3 rounded-lg font-bold border ${
                conditions === 'Wet' 
                  ? 'bg-blue-500/20 border-blue-500 text-blue-500' 
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
              }`}
            >
              🌧️ 湿地
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-900/50 border border-yellow-500/50 text-yellow-200 px-4 py-3 rounded text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {successMessage && (
           <div className="bg-green-900/50 border border-green-500/50 text-green-200 px-4 py-3 rounded text-sm font-semibold flex items-center gap-2">
             ✅ {successMessage}
           </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel} className="flex-1" disabled={isSubmitting}>
            返回
          </Button>
          <Button type="submit" className="flex-1" disabled={!!successMessage || isSubmitting} isLoading={isSubmitting}>
            提交成绩
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitLapForm;