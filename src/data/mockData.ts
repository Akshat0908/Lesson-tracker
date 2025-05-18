import { Lesson, Category } from '../context/LessonContext';
import { addDays, formatISO, subDays } from 'date-fns';

// Generate a date ISO string for n days from now
const dateFromNow = (days: number): string => {
  return formatISO(addDays(new Date(), days));
};

// Generate a date ISO string for n days before now
const dateBeforeNow = (days: number): string => {
  return formatISO(subDays(new Date(), days));
};

export const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Programming',
    color: '#4F46E5', // indigo
  },
  {
    id: 'cat2',
    name: 'Design',
    color: '#0EA5E9', // sky blue
  },
  {
    id: 'cat3',
    name: 'Business',
    color: '#10B981', // emerald
  },
  {
    id: 'cat4',
    name: 'Language',
    color: '#F59E0B', // amber
  },
  {
    id: 'cat5',
    name: 'Mathematics',
    color: '#EF4444', // red
  },
  {
    id: 'cat6',
    name: 'Science',
    color: '#8B5CF6', // violet
  },
];

export const mockLessons: Lesson[] = [
  {
    id: 'lesson1',
    title: 'Introduction to JavaScript',
    description: 'Learn the basics of JavaScript programming language.',
    categoryId: 'cat1',
    duration: 60,
    scheduledDate: dateFromNow(1),
    completed: false,
    progress: 0,
    difficulty: 'beginner',
    resources: [
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      { title: 'JavaScript.info', url: 'https://javascript.info/' },
    ],
  },
  {
    id: 'lesson2',
    title: 'UI Design Fundamentals',
    description: 'Learn the core principles of effective user interface design.',
    categoryId: 'cat2',
    duration: 90,
    scheduledDate: dateFromNow(2),
    completed: false,
    progress: 0,
    difficulty: 'beginner',
    resources: [
      { title: 'Figma Tutorial', url: 'https://www.figma.com/resources/learn-design/' },
      { title: 'UI Design Patterns', url: 'https://ui-patterns.com/' },
    ],
  },
  {
    id: 'lesson3',
    title: 'Modern Business Strategy',
    description: 'Understand business strategies for the modern digital landscape.',
    categoryId: 'cat3',
    duration: 120,
    scheduledDate: dateFromNow(3),
    completed: false,
    progress: 0,
    difficulty: 'intermediate',
    resources: [
      { title: 'Harvard Business Review', url: 'https://hbr.org/' },
      { title: 'Business Model Canvas', url: 'https://www.strategyzer.com/' },
    ],
  },
  {
    id: 'lesson4',
    title: 'Spanish Conversation Practice',
    description: 'Practice Spanish through guided conversation exercises.',
    categoryId: 'cat4',
    duration: 45,
    scheduledDate: dateFromNow(1),
    completed: false,
    progress: 0,
    difficulty: 'intermediate',
    resources: [
      { title: 'Duolingo', url: 'https://www.duolingo.com/' },
      { title: 'SpanishDict', url: 'https://www.spanishdict.com/' },
    ],
  },
  {
    id: 'lesson5',
    title: 'CSS Flexbox Layout',
    description: 'Master flexbox for responsive web layouts.',
    categoryId: 'cat1',
    duration: 60,
    scheduledDate: dateBeforeNow(1),
    completed: true,
    progress: 100,
    difficulty: 'intermediate',
    resources: [
      { title: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/' },
      { title: 'CSS-Tricks Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
    ],
  },
  {
    id: 'lesson6',
    title: 'React State Management',
    description: 'Learn various state management techniques in React.',
    categoryId: 'cat1',
    duration: 90,
    scheduledDate: dateBeforeNow(2),
    completed: true,
    progress: 100,
    difficulty: 'advanced',
    resources: [
      { title: 'React Documentation', url: 'https://reactjs.org/docs/hooks-state.html' },
      { title: 'Redux Documentation', url: 'https://redux.js.org/' },
    ],
  },
  {
    id: 'lesson7',
    title: 'Calculus I: Derivatives',
    description: 'Introduction to derivatives and their applications.',
    categoryId: 'cat5',
    duration: 120,
    scheduledDate: dateFromNow(5),
    completed: false,
    progress: 0,
    difficulty: 'advanced',
    resources: [
      { title: 'Khan Academy', url: 'https://www.khanacademy.org/math/calculus-1' },
      { title: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu/courses/mathematics/18-01sc-single-variable-calculus-fall-2010/' },
    ],
  },
  {
    id: 'lesson8',
    title: 'Introduction to Physics',
    description: 'Basic concepts and principles of physics.',
    categoryId: 'cat6',
    duration: 75,
    scheduledDate: dateFromNow(7),
    completed: false,
    progress: 0,
    difficulty: 'beginner',
    resources: [
      { title: 'Khan Academy', url: 'https://www.khanacademy.org/science/physics' },
      { title: 'Physics Classroom', url: 'https://www.physicsclassroom.com/' },
    ],
  },
  {
    id: 'lesson9',
    title: 'User Research Methods',
    description: 'Learn effective methods for conducting user research.',
    categoryId: 'cat2',
    duration: 60,
    scheduledDate: dateBeforeNow(3),
    completed: true,
    progress: 100,
    difficulty: 'intermediate',
    resources: [
      { title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/' },
      { title: 'UX Research Field Guide', url: 'https://www.userinterviews.com/ux-research-field-guide' },
    ],
  },
  {
    id: 'lesson10',
    title: 'Financial Planning Basics',
    description: 'Introduction to personal and business financial planning.',
    categoryId: 'cat3',
    duration: 90,
    scheduledDate: dateFromNow(10),
    completed: false,
    progress: 0,
    difficulty: 'beginner',
    resources: [
      { title: 'Investopedia', url: 'https://www.investopedia.com/' },
      { title: 'Personal Finance Reddit', url: 'https://www.reddit.com/r/personalfinance/' },
    ],
  },
];