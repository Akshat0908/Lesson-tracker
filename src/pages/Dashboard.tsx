import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, PieChart, Calendar, Clock, BarChart3, Award, TrendingUp, Target, Brain } from 'lucide-react';
import { useLessons } from '../context/LessonContext';
import ProgressRing from '../components/ProgressRing';
import { format, parseISO, isAfter, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const Dashboard: React.FC = () => {
  const { state, getCategory } = useLessons();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate stats
  const totalLessons = state.lessons.length;
  const completedLessons = state.lessons.filter(lesson => lesson.completed).length;
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  const totalDuration = state.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const completedDuration = state.lessons
    .filter(lesson => lesson.completed)
    .reduce((sum, lesson) => sum + lesson.duration, 0);
  
  const upcomingLessons = state.lessons
    .filter(lesson => !lesson.completed && isAfter(parseISO(lesson.scheduledDate), new Date()))
    .sort((a, b) => 
      differenceInDays(parseISO(a.scheduledDate), parseISO(b.scheduledDate))
    )
    .slice(0, 5);

  // Calculate weekly progress data
  const getWeeklyProgressData = () => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayLessons = state.lessons.filter(lesson => 
        format(parseISO(lesson.scheduledDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      const completed = dayLessons.filter(lesson => lesson.completed).length;
      const total = dayLessons.length;
      const progress = total > 0 ? (completed / total) * 100 : 0;

      return {
        name: format(day, 'EEE'),
        progress,
        total,
      };
    });
  };

  // Calculate difficulty distribution
  const difficultyData = ['beginner', 'intermediate', 'advanced'].map(difficulty => {
    const count = state.lessons.filter(lesson => lesson.difficulty === difficulty).length;
    return {
      name: difficulty,
      value: count,
      color: difficulty === 'beginner' ? '#10B981' : difficulty === 'intermediate' ? '#4F46E5' : '#7C3AED',
    };
  });

  // Calculate learning streak
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    let currentDate = today;

    while (true) {
      const hasCompletedLesson = state.lessons.some(lesson => 
        lesson.completed && 
        format(parseISO(lesson.scheduledDate), 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
      );

      if (!hasCompletedLesson) break;
      streak++;
      currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
    }

    return streak;
  };

  const learningStreak = calculateStreak();
  
  // Get lessons by category for the chart
  const lessonsByCategory = state.categories.map(category => {
    const count = state.lessons.filter(lesson => lesson.categoryId === category.id).length;
    return { category, count };
  }).filter(item => item.count > 0);
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Learning Analytics</h1>
          <p className="text-text-light">Track your progress and insights</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => toast.success('Analytics report generated!')}
            className="btn-outline"
          >
            Export Report
          </button>
          <button 
            onClick={() => toast.success('Settings updated!')}
            className="btn-primary"
          >
            Customize Dashboard
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Lessons Card */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <Calendar size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-text-light text-sm">Total Lessons</p>
              <p className="text-2xl font-semibold">{totalLessons}</p>
            </div>
          </div>
        </div>
        
        {/* Learning Streak Card */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-success/10 p-3">
              <TrendingUp size={20} className="text-success" />
            </div>
            <div>
              <p className="text-text-light text-sm">Learning Streak</p>
              <p className="text-2xl font-semibold">{learningStreak} days</p>
            </div>
          </div>
        </div>
        
        {/* Focus Score Card */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-accent/10 p-3">
              <Target size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-text-light text-sm">Focus Score</p>
              <p className="text-2xl font-semibold">
                {Math.round((completedDuration / totalDuration) * 100)}%
              </p>
            </div>
          </div>
        </div>
        
        {/* Knowledge Growth Card */}
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-secondary/10 p-3">
              <Brain size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-text-light text-sm">Knowledge Growth</p>
              <p className="text-2xl font-semibold">
                {completedLessons} topics
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Progress Chart */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-medium">Weekly Learning Progress</h3>
          </div>
          
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getWeeklyProgressData()}>
                  <defs>
                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#4F46E5" 
                    fillOpacity={1} 
                    fill="url(#progressGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Difficulty Distribution */}
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-medium">Learning Distribution</h3>
          </div>
          
          <div className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              {difficultyData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm capitalize">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value} lessons</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Progress */}
      <div className="mt-6">
        <div className="card">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-medium">Category Progress</h3>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessonsByCategory.map(({ category, count }) => {
                const completed = state.lessons.filter(
                  lesson => lesson.categoryId === category.id && lesson.completed
                ).length;
                const progress = Math.round((completed / count) * 100);
                
                return (
                  <div key={category.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-text-light">{completed}/{count}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${progress}%`, 
                          backgroundColor: category.color 
                        }}
                      />
                    </div>
                    
                    <div className="mt-2 text-sm text-text-light">
                      {progress}% completed
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;