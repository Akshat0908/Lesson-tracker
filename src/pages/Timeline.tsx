import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, parseISO, isSameDay, formatISO } from 'date-fns';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useLessons, Lesson } from '../context/LessonContext';
import TimelineHeader from '../components/TimelineHeader';
import DayColumn from '../components/DayColumn';
import AddLessonModal from '../components/AddLessonModal';

const Timeline: React.FC = () => {
  const { state, addLesson, reorderLessons, rescheduleLesson } = useLessons();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );
  
  // Generate week days based on current date
  useEffect(() => {
    const startDay = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday as start of week
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDay, i));
    setWeekDays(days);
  }, [currentDate]);
  
  // Group lessons by day
  const getLessonsByDay = (day: Date) => {
    return state.lessons.filter(lesson => {
      if (!lesson.scheduledDate) return false;
      const lessonDate = parseISO(lesson.scheduledDate);
      return isSameDay(lessonDate, day);
    });
  };
  
  // Get all lessons for the current week
  const getAllWeekLessons = () => {
    return weekDays.flatMap(day => getLessonsByDay(day));
  };
  
  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const targetDateAttribute = (over.data.current as any)?.sortable?.containerId;
    
    if (targetDateAttribute) {
      const targetDate = weekDays.find(day => 
        format(day, 'yyyy-MM-dd') === targetDateAttribute
      );
      
      if (targetDate) {
        rescheduleLesson(active.id.toString(), formatISO(targetDate));
        toast.success('Lesson rescheduled successfully');
      }
    } else {
      const activeLesson = state.lessons.find(lesson => lesson.id === active.id);
      const overLesson = state.lessons.find(lesson => lesson.id === over.id);
      
      if (activeLesson && overLesson) {
        const reordered = [...state.lessons];
        const activeIndex = reordered.findIndex(lesson => lesson.id === active.id);
        const overIndex = reordered.findIndex(lesson => lesson.id === over.id);
        
        [reordered[activeIndex], reordered[overIndex]] = [reordered[overIndex], reordered[activeIndex]];
        
        reorderLessons(reordered);
        toast.success('Lessons reordered successfully');
      }
    }
  };
  
  const handleAddLesson = async (lesson: Omit<Lesson, 'id'>) => {
    try {
      await addLesson(lesson);
      toast.success('Lesson added successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error('Failed to add lesson');
    }
  };
  
  return (
    <div className="space-y-6">
      <TimelineHeader 
        currentDate={currentDate} 
        setCurrentDate={setCurrentDate}
        onAddLesson={() => setIsAddModalOpen(true)}
      />
      
      {state.loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-pulsate text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-text-light">Loading your lessons...</p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto pb-4 -mx-6 px-6">
            <div 
              className="flex gap-4 min-w-full" 
              style={{ minWidth: 'max-content' }}
            >
              <AnimatePresence mode="wait">
                {weekDays.map(day => (
                  <motion.div
                    key={format(day, 'yyyy-MM-dd')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className={`flex-1 min-w-[250px] transition-transform ${
                      isDragging ? 'scale-98' : ''
                    }`}
                  >
                    <SortableContext
                      items={getLessonsByDay(day).map(lesson => lesson.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <DayColumn 
                        date={day} 
                        lessons={getLessonsByDay(day)} 
                        isDragging={isDragging}
                      />
                    </SortableContext>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </DndContext>
      )}
      
      <AddLessonModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLesson={handleAddLesson}
        categories={state.categories}
      />
    </div>
  );
};

export default Timeline;