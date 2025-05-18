import React from 'react';
import { format, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineHeaderProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onAddLesson: () => void;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  currentDate,
  setCurrentDate,
  onAddLesson,
}) => {
  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <motion.h1 
          className="text-2xl font-bold flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Calendar className="w-6 h-6 text-primary-500" />
          <span>Timeline</span>
        </motion.h1>
        
        <div className="flex items-center gap-2 bg-card rounded-lg border border-gray-200 dark:border-gray-800 p-1">
          <button
            onClick={handlePreviousWeek}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            Today
          </button>
          
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 self-stretch sm:self-auto">
        <div className="text-sm text-text-light">
          Week of {format(currentDate, 'MMM d, yyyy')}
        </div>

        <motion.button
          onClick={onAddLesson}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={16} />
          <span>Add Lesson</span>
        </motion.button>
      </div>
    </div>
  );
};

export default TimelineHeader;