import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Habit, StressEntry, Todo, SleepEntry, JournalEntry, ChatMessage } from '@/lib/supabase';
import { useAuth } from './use-auth';

const WellnessContext = createContext(null);

export function WellnessProvider({ children }) {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [stressEntries, setStressEntries] = useState<StressEntry[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [chatSuggestions, setChatSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when user logs out
      setHabits([]);
      setChatMessages([]);
      setStressEntries([]);
      setTodos([]);
      setSleepEntries([]);
      setJournalEntries([]);
      setChatSuggestions([]);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load habits
      const { data: habitsData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setHabits(habitsData || []);

      // Load stress entries
      const { data: stressData } = await supabase
        .from('stress_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setStressEntries(stressData || []);

      // Load todos
      const { data: todosData } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setTodos(todosData || []);

      // Load sleep entries
      const { data: sleepData } = await supabase
        .from('sleep_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setSleepEntries(sleepData || []);

      // Load journal entries
      const { data: journalData } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setJournalEntries(journalData || []);

      // Load chat messages
      const { data: chatData } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      setChatMessages(chatData || []);

    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (name: string, category: string) => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name,
          category,
          completed: false,
          is_permanent: false,
          streak: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding habit:', error);
        return false;
      }

      setHabits(prev => [data, ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding habit:', error);
      return false;
    }
  };

  const toggleHabit = async (id: string) => {
    if (!user) return;
    
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    try {
      const { error } = await supabase
        .from('habits')
        .update({ completed: !habit.completed })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error toggling habit:', error);
        return;
      }

      setHabits(prev =>
        prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h)
      );
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting habit:', error);
        return;
      }

      setHabits(prev => prev.filter(habit => habit.id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const getDailyHabitCompletions = (days) => {
    // This is a mock implementation. A real implementation would need to store
    // habit completion history.
    return Array.from({ length: days }, (_, i) => ({
      date: `2025-08-${15 + i}`,
      habitIds: [],
      totalHabits: habits.length,
    }));
  };

  const addPinnedTask = (name) => {
    const newHabit = {
      id: Date.now().toString(),
      name,
      category: 'health',
      completed: false,
      isPermanent: true,
      streak: 0,
    };
    setHabits([...habits, newHabit]);
    return true;
  };

  const updateTaskName = (id, name) => {
    setHabits(
      habits.map((habit) => (habit.id === id ? { ...habit, name } : habit))
    );
  };

  const pinTask = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, isPermanent: true } : habit
      )
    );
  };

  const unpinTask = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, isPermanent: false } : habit
      )
    );
  };

  const addChatMessage = (message) => {
    setChatMessages(prev => [...prev, message]);
  };

  const addStressEntry = async (level: number, note: string = "") => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('stress_entries')
        .insert({
          user_id: user.id,
          stress_level: level,
          note,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding stress entry:', error);
        return null;
      }

      setStressEntries(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding stress entry:', error);
      return null;
    }
  };

  const addTodos = (newTodos) => {
    const addedTodos = [];
    newTodos.forEach((todo, index) => {
      const exists = todos.some(existing => 
        existing.title.toLowerCase().trim() === todo.title.toLowerCase().trim()
      );
      if (!exists) {
        // Generate unique ID with timestamp and index to avoid duplicates
        const uniqueId = `todo-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
        
        const newTodo = {
          id: uniqueId,
          title: todo.title.trim(),
          category: todo.category || 'health',
          completed: false,
          createdAt: new Date().toISOString(),
        };
        setTodos(prev => [...prev, newTodo]);
        addedTodos.push(newTodo);
      }
    });
    return addedTodos;
  };

  const registerChatSuggestions = (tasks) => {
    const addedTodos = [];
    
    tasks.forEach((task, index) => {
      // Normalize task title for comparison
      const normalizedTitle = task.title.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
      
      // Check if task already exists in chat suggestions
      const existsInSuggestions = chatSuggestions.some(existing => 
        existing.name && existing.name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '') === normalizedTitle
      );
      
      // Check if task already exists in habits
      const existsInHabits = habits.some(existing => 
        existing.name && existing.name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '') === normalizedTitle
      );
      
      // Check if task already exists in todos
      const existsInTodos = todos.some(existing => 
        existing.title && existing.title.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '') === normalizedTitle
      );
      
      if (!existsInSuggestions && !existsInHabits && !existsInTodos) {
        // Generate unique ID with timestamp and index to avoid duplicates
        const uniqueId = `chatbot-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
        
        const newSuggestion = {
          id: uniqueId,
          name: task.title.trim(),
          completed: false,
          streak: 0,
          category: task.category || 'health',
          source: 'chatbot', // Mark as chatbot-generated
          timestamp: new Date().toISOString()
        };
        
        setChatSuggestions(prev => [...prev, newSuggestion]);
        addedTodos.push(task.title.trim());
      }
    });
    
    return addedTodos;
  };

  const clearChatSuggestions = () => {
    setChatSuggestions([]);
  };

  const removeChatSuggestion = (id) => {
    setChatSuggestions(prev => prev.filter(suggestion => suggestion.id !== id));
  };

  const addSleepEntry = (entry) => {
    setSleepEntries((prevEntries) => [...prevEntries, entry]);
  };

  const addJournalEntry = (entry) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setJournalEntries((prevEntries) => [...prevEntries, newEntry]);
  };

  const updateJournalEntry = (id, updatedEntry) => {
    setJournalEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
  };

  const deleteJournalEntry = (id) => {
    setJournalEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== id)
    );
  };

  return (
    <WellnessContext.Provider
      value={{
        habits,
        addHabit,
        toggleHabit,
        deleteHabit,
        getDailyHabitCompletions,
        addPinnedTask,
        updateTaskName,
        pinTask,
        unpinTask,
        chatMessages,
        addChatMessage,
        stressEntries,
        stressHistory: stressEntries, // Alias for compatibility
        addStressEntry,
        todos,
        addTodos,
        chatSuggestions,
        setChatSuggestions,
        registerChatSuggestions,
        clearChatSuggestions,
        removeChatSuggestion,
        sleepEntries,
        addSleepEntry,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        loading,
        user,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellness() {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
}