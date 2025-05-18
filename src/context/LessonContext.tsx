import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { formatISO, parseISO, addDays } from 'date-fns';
import { mockLessons, mockCategories } from '../data/mockData';

// Define types
export interface Lesson {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  duration: number; // in minutes
  scheduledDate: string;
  completed: boolean;
  progress: number; // 0-100
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resources: Array<{ title: string; url: string }>;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface LessonState {
  lessons: Lesson[];
  categories: Category[];
  loading: boolean;
  error: string | null;
}

type LessonAction =
  | { type: 'SET_LESSONS'; payload: Lesson[] }
  | { type: 'ADD_LESSON'; payload: Lesson }
  | { type: 'UPDATE_LESSON'; payload: Lesson }
  | { type: 'DELETE_LESSON'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'REORDER_LESSONS'; payload: Lesson[] };

const initialState: LessonState = {
  lessons: [],
  categories: [],
  loading: false,
  error: null,
};

const lessonReducer = (state: LessonState, action: LessonAction): LessonState => {
  switch (action.type) {
    case 'SET_LESSONS':
      return { ...state, lessons: action.payload, loading: false };
    case 'ADD_LESSON':
      return { ...state, lessons: [...state.lessons, action.payload] };
    case 'UPDATE_LESSON':
      return {
        ...state,
        lessons: state.lessons.map(lesson => 
          lesson.id === action.payload.id ? action.payload : lesson
        ),
      };
    case 'DELETE_LESSON':
      return {
        ...state,
        lessons: state.lessons.filter(lesson => lesson.id !== action.payload),
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'REORDER_LESSONS':
      return { ...state, lessons: action.payload };
    default:
      return state;
  }
};

interface LessonContextProps {
  state: LessonState;
  addLesson: (lesson: Omit<Lesson, 'id'>) => void;
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (id: string) => void;
  reorderLessons: (reorderedLessons: Lesson[]) => void;
  toggleLessonCompleted: (id: string) => void;
  updateLessonProgress: (id: string, progress: number) => void;
  rescheduleLesson: (id: string, newDate: string) => void;
  getCategory: (id: string) => Category | undefined;
}

const LessonContext = createContext<LessonContextProps | undefined>(undefined);

export const LessonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(lessonReducer, initialState);

  // Initialize with mock data
  useEffect(() => {
    const loadData = () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Simulate network request to get data
        setTimeout(() => {
          dispatch({ type: 'SET_CATEGORIES', payload: mockCategories });
          dispatch({ type: 'SET_LESSONS', payload: mockLessons });
        }, 800); // Simulate loading delay
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    };

    loadData();
  }, []);

  // Helper function to generate a unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const addLesson = (lessonData: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = {
      id: generateId(),
      ...lessonData,
    };
    dispatch({ type: 'ADD_LESSON', payload: newLesson });
  };

  const updateLesson = (lesson: Lesson) => {
    dispatch({ type: 'UPDATE_LESSON', payload: lesson });
  };

  const deleteLesson = (id: string) => {
    dispatch({ type: 'DELETE_LESSON', payload: id });
  };

  const reorderLessons = (reorderedLessons: Lesson[]) => {
    dispatch({ type: 'REORDER_LESSONS', payload: reorderedLessons });
  };

  const toggleLessonCompleted = (id: string) => {
    const lesson = state.lessons.find(l => l.id === id);
    if (lesson) {
      const updatedLesson = { 
        ...lesson, 
        completed: !lesson.completed,
        progress: !lesson.completed ? 100 : lesson.progress
      };
      dispatch({ type: 'UPDATE_LESSON', payload: updatedLesson });
    }
  };

  const updateLessonProgress = (id: string, progress: number) => {
    const lesson = state.lessons.find(l => l.id === id);
    if (lesson) {
      const updatedLesson = { 
        ...lesson, 
        progress: Math.max(0, Math.min(100, progress)),
        completed: progress >= 100
      };
      dispatch({ type: 'UPDATE_LESSON', payload: updatedLesson });
    }
  };

  const rescheduleLesson = (id: string, newDate: string) => {
    const lesson = state.lessons.find(l => l.id === id);
    if (lesson) {
      const updatedLesson = { ...lesson, scheduledDate: newDate };
      dispatch({ type: 'UPDATE_LESSON', payload: updatedLesson });
    }
  };

  const getCategory = (id: string) => {
    return state.categories.find(category => category.id === id);
  };

  return (
    <LessonContext.Provider
      value={{
        state,
        addLesson,
        updateLesson,
        deleteLesson,
        reorderLessons,
        toggleLessonCompleted,
        updateLessonProgress,
        rescheduleLesson,
        getCategory,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};

export const useLessons = () => {
  const context = useContext(LessonContext);
  if (context === undefined) {
    throw new Error('useLessons must be used within a LessonProvider');
  }
  return context;
};