import { createClient } from '@supabase/supabase-js';
import { User, LapTime } from '../types';

// --- CONFIGURATION ---

// In a real production environment, these should be environment variables (process.env.VITE_...).
// For this preview/demo, we are using the provided credentials directly.
const SUPABASE_URL = 'https://gdjvgqjspenqjlcjcuzk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkanZncWpzcGVucWpsY2pjdXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjQ0NTAsImV4cCI6MjA3OTc0MDQ1MH0.ngZK7OdibzkTadJDj5fVfbuO4rDFVJTCPYPw5c0kva8';

const USE_DB = !!(SUPABASE_URL && SUPABASE_KEY);

const supabase = USE_DB ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// Admin Credentials
// We keep the email to identify WHO gets admin rights, but we removed the secret code.
// The admin will now log in via Email OTP just like everyone else.
const ADMIN_EMAIL = 'zuoyi186@163.com';

// Local Storage Keys (Fallback)
const LS_USERS_KEY = 'acc_tracker_users';
const LS_CURRENT_USER_KEY = 'acc_tracker_current_user';
const LS_LAP_TIMES_KEY = 'acc_tracker_lap_times';

// --- HELPERS (Mapping DB snake_case <-> App camelCase) ---

const mapLapFromDb = (dbLap: any): LapTime => {
  // Derive detailed time parts from total_milliseconds if not present in DB
  const total = dbLap.total_milliseconds;
  const minutes = Math.floor(total / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const milliseconds = total % 1000;

  return {
    id: dbLap.id,
    username: dbLap.username,
    userEmail: dbLap.user_email, // Map back from DB for admin/display
    trackId: dbLap.track_id,
    carId: dbLap.car_id,
    minutes: dbLap.minutes ?? minutes,
    seconds: dbLap.seconds ?? seconds,
    milliseconds: dbLap.milliseconds ?? milliseconds,
    totalMilliseconds: total,
    timestamp: dbLap.timestamp,
    conditions: dbLap.conditions as 'Dry' | 'Wet'
  };
};

const mapLapToDb = (lap: LapTime) => ({
  username: lap.username,
  user_email: lap.userEmail, // VITAL: Map to DB column
  track_id: lap.trackId,
  car_id: lap.carId,
  total_milliseconds: lap.totalMilliseconds,
  timestamp: lap.timestamp,
  conditions: lap.conditions
});

const mapUserFromDb = (dbUser: any): User => ({
  username: dbUser.username,
  email: dbUser.email,
  isAdmin: dbUser.is_admin,
  joinedAt: dbUser.created_at
});

// --- AUTH SERVICES ---

// 1. SEND OTP
export const sendVerificationCode = async (email: string): Promise<string> => {
  // Real Supabase Email OTP
  if (USE_DB && supabase) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Allow direct sign-up/login flow
      }
    });

    if (error) {
      console.error("Supabase OTP Error:", error);
      throw new Error(error.message);
    }
    
    return "SENT_VIA_EMAIL"; // We don't return the code, Supabase handles it securely
  }

  // Fallback for LocalStorage mode (Simulated)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  setTimeout(() => {
    alert(`[SIMULATED EMAIL]\nTo: ${email}\n\nYour ACC Tracker Verification Code is: ${code}`);
  }, 500);
  return code;
};

// 2. VERIFY OTP (New Helper)
export const verifyUserOtp = async (email: string, token: string): Promise<boolean> => {
  if (USE_DB && supabase) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error || !data.session) {
      console.error("OTP Error:", error);
      return false;
    }
    return true;
  }

  // Local Storage Mode: We assume the caller checked the returned code string
  return true; 
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  if (USE_DB && supabase) {
    // Check our public users table
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle(); 
    return !!data;
  } else {
    const users: User[] = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }
};

export const registerUser = async (email: string, username: string): Promise<{ success: boolean, message: string }> => {
  if (USE_DB && supabase) {
    // Check username uniqueness
    const { data: existingUser } = await supabase.from('users').select('*').eq('username', username).maybeSingle();
    if (existingUser) return { success: false, message: '用户名已被占用' };

    // Automatic Admin assignment based on email address
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    // Upsert into public.users table (Our app's user profile)
    // Note: The Auth user is created by Supabase Auth automatically during OTP verification
    const { error } = await supabase.from('users').insert({
      email,
      username,
      is_admin: isAdmin,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error("Register DB Error:", error);
      if (error.message.includes('row-level security')) {
        return { success: false, message: '数据库权限错误: 请在Supabase中检查RLS策略。' };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: '注册成功' };

  } else {
    // Local Storage Fallback
    const users: User[] = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: '该邮箱已注册' };
    }
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, message: '用户名已被占用' };
    }

    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newUser: User = { 
      email,
      username, 
      isAdmin,
      joinedAt: new Date().toISOString() 
    };
    
    users.push(newUser);
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
    return { success: true, message: '注册成功' };
  }
};

export const loginUser = async (email: string): Promise<{ success: boolean, user?: User, message?: string }> => {
  if (USE_DB && supabase) {
    // Fetch user profile from public table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      if (error.message.includes('row-level security')) {
         return { success: false, message: '数据库权限错误: 请在Supabase中检查RLS策略。' };
      }
      return { success: false, message: '用户不存在，请先注册。' };
    }
    
    if (!data) return { success: false, message: '用户不存在，请先注册。' };
    
    const user = mapUserFromDb(data);
    localStorage.setItem(LS_CURRENT_USER_KEY, JSON.stringify(user)); 
    return { success: true, user };

  } else {
    // Local Storage Fallback
    const users: User[] = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      localStorage.setItem(LS_CURRENT_USER_KEY, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: '用户不存在' };
  }
};

export const logoutUser = async () => {
  localStorage.removeItem(LS_CURRENT_USER_KEY);
  if (USE_DB && supabase) {
    await supabase.auth.signOut();
  }
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(LS_CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const getUserByUsername = async (username: string): Promise<User | undefined> => {
   if (USE_DB && supabase) {
      const { data } = await supabase.from('users').select('*').eq('username', username).maybeSingle();
      return data ? mapUserFromDb(data) : undefined;
   } else {
      const users: User[] = JSON.parse(localStorage.getItem(LS_USERS_KEY) || '[]');
      return users.find(u => u.username === username);
   }
}

// --- LAP TIME SERVICES ---

export const fetchLapTimes = async (trackId?: string): Promise<LapTime[]> => {
  if (USE_DB && supabase) {
    let query = supabase.from('lap_times').select('*');
    if (trackId) {
      query = query.eq('track_id', trackId);
    }
    query = query.order('total_milliseconds', { ascending: true });

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching times:", error);
      return [];
    }
    return data.map(mapLapFromDb);

  } else {
    const times: LapTime[] = JSON.parse(localStorage.getItem(LS_LAP_TIMES_KEY) || '[]');
    if (trackId) {
      return times.filter(t => t.trackId === trackId).sort((a, b) => a.totalMilliseconds - b.totalMilliseconds);
    }
    return times.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};

export const submitLapTime = async (newLap: LapTime): Promise<{ success: boolean, message: string }> => {
  if (USE_DB && supabase) {
    const { data: existingRecords } = await supabase
      .from('lap_times')
      .select('*')
      .eq('username', newLap.username)
      .eq('track_id', newLap.trackId)
      .eq('car_id', newLap.carId);
    
    const existing = existingRecords && existingRecords[0];

    if (existing) {
      if (newLap.totalMilliseconds < existing.total_milliseconds) {
        const { error } = await supabase
          .from('lap_times')
          .update(mapLapToDb(newLap))
          .eq('id', existing.id);
        
        if (error) {
           if (error.message.includes('row-level security')) {
              return { success: false, message: "数据库错误: 权限被拒绝，请启用RLS策略。" };
           }
           return { success: false, message: "数据库错误: " + error.message };
        }
        return { success: true, message: "新的个人最佳成绩！记录已更新。" };
      } else {
        return { success: false, message: "成绩慢于个人最佳，未记录。" };
      }
    } else {
      const { error } = await supabase
        .from('lap_times')
        .insert(mapLapToDb(newLap));
      
      if (error) {
         if (error.message.includes('row-level security')) {
            return { success: false, message: "数据库错误: 权限被拒绝，请启用RLS策略。" };
         }
         return { success: false, message: "数据库错误: " + error.message };
      }
      return { success: true, message: "圈速记录成功。" };
    }

  } else {
    let times: LapTime[] = JSON.parse(localStorage.getItem(LS_LAP_TIMES_KEY) || '[]');
    const existingIndex = times.findIndex(t => 
      t.username === newLap.username && 
      t.trackId === newLap.trackId && 
      t.carId === newLap.carId
    );

    if (existingIndex !== -1) {
      const existing = times[existingIndex];
      if (newLap.totalMilliseconds < existing.totalMilliseconds) {
        times[existingIndex] = newLap;
        localStorage.setItem(LS_LAP_TIMES_KEY, JSON.stringify(times));
        return { success: true, message: "新的个人最佳成绩！记录已更新。" };
      } else {
        return { success: false, message: "成绩慢于个人最佳，未记录。" };
      }
    } else {
      times.push(newLap);
      localStorage.setItem(LS_LAP_TIMES_KEY, JSON.stringify(times));
      return { success: true, message: "圈速记录成功。" };
    }
  }
};

export const deleteLapTime = async (id: string): Promise<{ success: boolean, message: string }> => {
  if (USE_DB && supabase) {
    const { error } = await supabase.from('lap_times').delete().eq('id', id);
    if (error) {
      console.error("Delete Error:", error);
      return { success: false, message: error.message };
    }
    return { success: true, message: "已删除" };
  } else {
    let times: LapTime[] = JSON.parse(localStorage.getItem(LS_LAP_TIMES_KEY) || '[]');
    times = times.filter(t => t.id !== id);
    localStorage.setItem(LS_LAP_TIMES_KEY, JSON.stringify(times));
    return { success: true, message: "已删除" };
  }
};

export const seedMockData = async () => {
  if (USE_DB) {
     return;
  }
  const storedUsers = localStorage.getItem(LS_USERS_KEY);
  if (storedUsers) return;

  const mockUsers: User[] = [
    { email: 'admin@acc.com', username: 'Admin', isAdmin: true, joinedAt: new Date().toISOString() },
    { email: 'james@sim.com', username: 'J.Baldwin', isAdmin: false, joinedAt: new Date().toISOString() },
  ];
  localStorage.setItem(LS_USERS_KEY, JSON.stringify(mockUsers));

  const generateId = () => Math.random().toString(36).substr(2, 9);
  const mockTimes: LapTime[] = [
    { id: generateId(), username: 'J.Baldwin', trackId: 'monza', carId: 'mclaren_720s_evo', minutes: 1, seconds: 46, milliseconds: 320, totalMilliseconds: 106320, timestamp: new Date().toISOString(), conditions: 'Dry' },
  ];
  localStorage.setItem(LS_LAP_TIMES_KEY, JSON.stringify(mockTimes));
};