import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { useLessons } from '../context/LessonContext';
import AddLessonModal from '../components/AddLessonModal';

const CoursesLibrary: React.FC = () => {
  const { state, addLesson } = useLessons();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Filter lessons based on search query and filters
  const filteredLessons = state.lessons.filter(lesson => {
    // Search by title or description
    const matchesSearch = 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === '' || lesson.categoryId === selectedCategory;
    
    // Filter by difficulty
    const matchesDifficulty = selectedDifficulty === '' || lesson.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Count lessons by category
  const lessonCountByCategory = state.categories.reduce((acc, category) => {
    acc[category.id] = state.lessons.filter(lesson => lesson.categoryId === category.id).length;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Courses Library</h1>
          <p className="text-text-light">Browse and manage all your lessons</p>
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary md:self-start"
        >
          <Plus size={16} className="mr-1" />
          Add Lesson
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Search */}
        <div className="md:col-span-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input pl-9 w-full"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="input flex-1"
          >
            <option value="">All Categories</option>
            {state.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="input flex-1"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Categories Sidebar */}
        <div className="order-2 md:order-1">
          <div className="card p-4">
            <h3 className="font-medium mb-4">Categories</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`flex items-center justify-between w-full p-2 rounded-lg text-sm ${
                  selectedCategory === '' 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>All Categories</span>
                <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                  {state.lessons.length}
                </span>
              </button>
              
              {state.categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center justify-between w-full p-2 rounded-lg text-sm ${
                    selectedCategory === category.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span 
                      className="inline-block w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></span>
                    {category.name}
                  </span>
                  <span className="bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                    {lessonCountByCategory[category.id] || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Lessons Grid */}
        <div className="order-1 md:order-2 md:col-span-2">
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map(lesson => {
                const category = state.categories.find(c => c.id === lesson.categoryId);
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card overflow-hidden"
                  >
                    <div 
                      className="h-2" 
                      style={{ backgroundColor: category?.color || '#4F46E5' }}
                    ></div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-text-light">{category?.name || 'Uncategorized'}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            lesson.completed
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {lesson.completed ? 'Completed' : 'Not Started'}
                        </span>
                      </div>
                      
                      <p className="text-sm mt-2 line-clamp-2">{lesson.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <div className="text-xs text-text-light">
                          {lesson.duration} min
                        </div>
                        <div className="text-xs text-text-light capitalize">
                          {lesson.difficulty}
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full" 
                            style={{ 
                              width: `${lesson.progress}%`, 
                              backgroundColor: category?.color || '#4F46E5'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <Search size={32} className="mx-auto mb-2 text-text-light opacity-50" />
              <h3 className="font-medium mb-1">No lessons found</h3>
              <p className="text-text-light text-sm">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <AddLessonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLesson={addLesson}
        categories={state.categories}
      />
    </div>
  );
};

export default CoursesLibrary;