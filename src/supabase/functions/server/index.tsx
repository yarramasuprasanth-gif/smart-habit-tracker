import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper to get authenticated user
async function getAuthenticatedUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  
  return user;
}

// Signup route
app.post('/make-server-fb39a48a/signup', async (c) => {
  try {
    const { email, name, password } = await c.req.json();
    
    if (!email || !name || !password) {
      return c.json({ error: 'Email, name, and password are required' }, 400);
    }

    console.log('Creating user with email:', email);

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });

    if (error) {
      console.log('Supabase Auth error:', error.message, error);
      return c.json({ error: `Auth error: ${error.message}` }, 400);
    }

    if (!data.user) {
      console.log('No user data returned from Supabase');
      return c.json({ error: 'Failed to create user' }, 500);
    }

    console.log('User created with ID:', data.user.id);

    // Initialize user profile in KV store
    const userProfile = {
      email,
      name,
      joinedDate: new Date().toISOString(),
    };
    
    try {
      await kv.set(`profile:${data.user.id}`, userProfile);
      console.log('Profile saved for user:', data.user.id);
    } catch (kvError) {
      console.log('KV store error saving profile:', kvError);
      return c.json({ error: 'Failed to save user profile' }, 500);
    }

    // Initialize default habits
    const defaultHabits = [
      {
        id: '1',
        name: 'Morning Meditation',
        icon: '🧘',
        streak: 0,
        completedToday: false,
        completedDates: [],
        category: 'Wellness',
        targetDays: 30,
      },
      {
        id: '2',
        name: 'Drink 8 Glasses of Water',
        icon: '💧',
        streak: 0,
        completedToday: false,
        completedDates: [],
        category: 'Health',
        targetDays: 30,
      },
      {
        id: '3',
        name: 'Read for 30 Minutes',
        icon: '📚',
        streak: 0,
        completedToday: false,
        completedDates: [],
        category: 'Learning',
        targetDays: 30,
      },
      {
        id: '4',
        name: 'Exercise',
        icon: '💪',
        streak: 0,
        completedToday: false,
        completedDates: [],
        category: 'Fitness',
        targetDays: 30,
      },
    ];
    
    try {
      await kv.set(`habits:${data.user.id}`, defaultHabits);
      console.log('Habits saved for user:', data.user.id);
    } catch (kvError) {
      console.log('KV store error saving habits:', kvError);
      return c.json({ error: 'Failed to save default habits' }, 500);
    }

    console.log('Signup successful for user:', data.user.id);

    return c.json({ 
      user: data.user,
      profile: userProfile,
    });
  } catch (error) {
    console.log('Signup error (outer catch):', error);
    return c.json({ error: `Database error creating new user: ${error.message || error}` }, 500);
  }
});

// Login route
app.post('/make-server-fb39a48a/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create a client with anon key for sign in
    const anonSupabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    );

    const { data, error } = await anonSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login error:', error);
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    return c.json({ 
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    console.log('Login error:', error);
    return c.json({ error: 'Failed to login' }, 500);
  }
});

// Get user profile
app.get('/make-server-fb39a48a/profile', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Failed to get profile' }, 500);
  }
});

// Update user profile
app.put('/make-server-fb39a48a/profile', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const existingProfile = await kv.get(`profile:${user.id}`);
    
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    const updatedProfile = { ...existingProfile, ...updates };
    await kv.set(`profile:${user.id}`, updatedProfile);

    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get user habits
app.get('/make-server-fb39a48a/habits', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habits = await kv.get(`habits:${user.id}`);
    
    return c.json({ habits: habits || [] });
  } catch (error) {
    console.log('Get habits error:', error);
    return c.json({ error: 'Failed to get habits' }, 500);
  }
});

// Update habits
app.post('/make-server-fb39a48a/habits', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { habits } = await c.req.json();
    await kv.set(`habits:${user.id}`, habits);

    return c.json({ habits });
  } catch (error) {
    console.log('Update habits error:', error);
    return c.json({ error: 'Failed to update habits' }, 500);
  }
});

// Toggle habit completion
app.put('/make-server-fb39a48a/habits/:id/toggle', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const habitId = c.req.param('id');
    const habits = await kv.get(`habits:${user.id}`) || [];
    const today = new Date().toISOString().split('T')[0];

    const updatedHabits = habits.map((habit: any) => {
      if (habit.id === habitId) {
        const isCompleting = !habit.completedToday;
        let newCompletedDates = [...habit.completedDates];
        let newStreak = habit.streak;

        if (isCompleting) {
          newCompletedDates.push(today);
          newStreak = calculateStreak([...newCompletedDates]);
        } else {
          newCompletedDates = newCompletedDates.filter((date: string) => date !== today);
          newStreak = calculateStreak(newCompletedDates);
        }

        return {
          ...habit,
          completedToday: isCompleting,
          completedDates: newCompletedDates,
          streak: newStreak,
        };
      }
      return habit;
    });

    await kv.set(`habits:${user.id}`, updatedHabits);

    return c.json({ habits: updatedHabits });
  } catch (error) {
    console.log('Toggle habit error:', error);
    return c.json({ error: 'Failed to toggle habit' }, 500);
  }
});

// Helper function to calculate streak
function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);

    const completedDate = new Date(sortedDates[i]);
    completedDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === completedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// AI Chat route - context-aware coaching
app.post('/make-server-fb39a48a/ai-chat', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { message } = await c.req.json();

    if (!message) {
      return c.json({ error: 'Message is required' }, 400);
    }

    // Get user's habits and profile for context
    const habits = await kv.get(`habits:${user.id}`) || [];
    const profile = await kv.get(`profile:${user.id}`);

    // Build context for the AI
    const habitsContext = habits.map((h: any) => ({
      name: h.name,
      icon: h.icon,
      category: h.category,
      streak: h.streak,
      completedToday: h.completedToday,
      totalCompletions: h.completedDates?.length || 0,
      targetDays: h.targetDays,
    }));

    const completedToday = habits.filter((h: any) => h.completedToday).length;
    const totalHabits = habits.length;
    const avgStreak = habits.length > 0 
      ? Math.round(habits.reduce((sum: number, h: any) => sum + h.streak, 0) / habits.length)
      : 0;

    // Call OpenAI API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.log('OpenAI API key not configured');
      return c.json({ error: 'AI service not configured' }, 500);
    }

    const systemPrompt = `You are an enthusiastic, supportive, and knowledgeable habit coach. You're helping ${profile?.name || 'a user'} build better habits.

Current User Context:
- Habits being tracked: ${habitsContext.map((h: any) => `${h.icon} ${h.name} (${h.streak} day streak, ${h.completedToday ? 'completed today' : 'not completed today'})`).join(', ')}
- Completed today: ${completedToday}/${totalHabits} habits
- Average streak: ${avgStreak} days

Be conversational, encouraging, and specific. Reference their actual habits, streaks, and progress. Give actionable advice. Keep responses concise (2-3 sentences max unless they ask for more detail). Use emojis occasionally to be friendly.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log('OpenAI API error:', response.status, errorData);
      return c.json({ error: 'Failed to get AI response' }, 500);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content;

    if (!aiMessage) {
      return c.json({ error: 'No response from AI' }, 500);
    }

    return c.json({ message: aiMessage });
  } catch (error) {
    console.log('AI chat error:', error);
    return c.json({ error: `Failed to process AI chat: ${error.message || error}` }, 500);
  }
});

// Get user settings
app.get('/make-server-fb39a48a/settings', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const settings = await kv.get(`settings:${user.id}`);
    
    // Return default settings if none exist
    const defaultSettings = {
      notifications: {
        dailyReminders: true,
        streakAlerts: true,
        weeklyReports: true,
        friendActivity: true,
      },
      preferences: {
        theme: 'light',
        reminderTime: '09:00',
        startOfWeek: 'monday',
      },
      privacy: {
        profileVisibility: 'friends',
        showStreak: true,
        showActivity: true,
      },
    };

    return c.json({ settings: settings || defaultSettings });
  } catch (error) {
    console.log('Get settings error:', error);
    return c.json({ error: 'Failed to get settings' }, 500);
  }
});

// Update user settings
app.put('/make-server-fb39a48a/settings', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const existingSettings = await kv.get(`settings:${user.id}`);
    
    const updatedSettings = existingSettings 
      ? { ...existingSettings, ...updates }
      : updates;
      
    await kv.set(`settings:${user.id}`, updatedSettings);

    return c.json({ settings: updatedSettings });
  } catch (error) {
    console.log('Update settings error:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// Change password
app.post('/make-server-fb39a48a/change-password', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { newPassword } = await c.req.json();
    
    if (!newPassword || newPassword.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword,
    });

    if (error) {
      console.log('Change password error:', error);
      return c.json({ error: 'Failed to change password' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Change password error:', error);
    return c.json({ error: 'Failed to change password' }, 500);
  }
});

// Export user data
app.get('/make-server-fb39a48a/export-data', async (c) => {
  try {
    const user = await getAuthenticatedUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const [profile, habits, settings] = await Promise.all([
      kv.get(`profile:${user.id}`),
      kv.get(`habits:${user.id}`),
      kv.get(`settings:${user.id}`),
    ]);

    const exportData = {
      profile,
      habits,
      settings,
      exportDate: new Date().toISOString(),
    };

    return c.json({ data: exportData });
  } catch (error) {
    console.log('Export data error:', error);
    return c.json({ error: 'Failed to export data' }, 500);
  }
});

Deno.serve(app.fetch);