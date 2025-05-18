import React from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckCircle, Circle, GripVertical } from 'lucide-react';
import { Lesson } from '../context/LessonContext';
import { useLessons } from '../context/LessonContext';

interface LessonCardProps {
  lesson: Lesson;
  isFirst?: boolean;
  isLast?: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isFirst, isLast }) => {
  const { getCategory, toggleLessonCompleted } = useLessons();
  const category = getCategory(lesson.categoryId);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`
        group relative bg-white dark:bg-gray-800 rounded-lg p-3
        border border-gray-200 dark:border-gray-700
        hover:border-primary-500 dark:hover:border-primary-500
        transition-all duration-300
        ${isDragging ? 'timeline-item dragging' : ''}
        ${isFirst ? 'mt-0' : ''}
        ${isLast ? 'mb-0' : ''}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.div
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <GripVertical size={16} className="text-gray-400" />
        </motion.div>
      </div>

      <div className="flex items-start gap-3">
        <motion.button
          onClick={() => toggleLessonCompleted(lesson.id)}
          className="flex-shrink-0 mt-0.5 focus:outline-none focus-ring rounded-full hover-scale"
          whileTap={{ scale: 0.8 }}
        >
          <motion.div
            initial={false}
            animate={lesson.completed ? { scale: [1.2, 1] } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {lesson.completed ? (
              <CheckCircle className="w-5 h-5 text-primary-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
          </motion.div>
        </motion.button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-medium truncate ${lesson.completed ? 'text-gray-400 line-through' : ''}`}>
              {lesson.title}
            </h4>
            {category && (
              <motion.span 
                className="badge badge-secondary text-xs hover-scale"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                style={{
                  backgroundColor: `${category.color}15`,
                  color: category.color,
                }}
              >
                {category.name}
              </motion.span>
            )}
          </div>

          {lesson.description && (
            <p className={`mt-1 text-sm text-text-light line-clamp-2 ${lesson.completed ? 'line-through' : ''}`}>
              {lesson.description}
            </p>
          )}

          {lesson.duration && (
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1 flex-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(lesson.progress || 0) * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <motion.span 
                className="text-xs text-text-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {Math.round((lesson.progress || 0) * 100)}%
              </motion.span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LessonCard;