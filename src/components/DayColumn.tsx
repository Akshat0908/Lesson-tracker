import React, { useEffect, useRef } from 'react';
import { format, isToday } from 'date-fns';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Lesson } from '../context/LessonContext';
import LessonCard from './LessonCard';
import { useLessons } from '../context/LessonContext';

interface DayColumnProps {
  date: Date;
  lessons: Lesson[];
  isDragging?: boolean;
  isLoading?: boolean;
}

const DayColumn: React.FC<DayColumnProps> = ({ date, lessons, isDragging, isLoading = false }) => {
  const columnRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: columnRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: format(date, 'yyyy-MM-dd'),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentDay = isToday(date);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    const elements = columnRef.current?.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const renderLoadingState = () => (
    <div className="space-y-4">
      <div className="loading-skeleton h-6 w-3/4"></div>
      <div className="loading-skeleton h-4 w-1/2"></div>
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="loading-skeleton h-24 w-full"></div>
        ))}
      </div>
    </div>
  );
  
  return (
    <motion.div
      ref={columnRef}
      style={{
        y,
        opacity,
        scale,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`hover-lift ${isDragging ? 'pointer-events-none' : ''}`}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`card p-4 h-[calc(100vh-12rem)] flex flex-col transition-all duration-300 ${
          isDragging ? 'shadow-lg scale-[1.02] rotate-1' : ''
        } ${isCurrentDay ? 'ring-2 ring-primary-500 ring-opacity-50 hover-glow' : ''}`}
      >
        <div className="flex items-center justify-between mb-4 scroll-reveal-left">
          <div>
            <h3 className="font-medium text-lg">
              {format(date, 'EEEE')}
            </h3>
            <p className={`text-sm ${isCurrentDay ? 'text-primary-500 font-medium animate-pulse-subtle' : 'text-text-light'}`}>
              {format(date, 'MMM d')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lessons.length > 0 && (
              <motion.span
                className="badge badge-primary hover-scale"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'}
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-reveal">
          {isLoading ? (
            renderLoadingState()
          ) : (
            <AnimatePresence mode="popLayout">
              {lessons.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full text-text-light text-sm"
                >
                  No lessons scheduled
                </motion.div>
              ) : (
                lessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                      mass: 1,
                      delay: index * 0.05,
                    }}
                    className="hover-scale focus-ring"
                  >
                    <LessonCard
                      lesson={lesson}
                      isFirst={index === 0}
                      isLast={index === lessons.length - 1}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DayColumn;