import NewsPointApp from './pocs/NewsPointApp';
import CodeTodDo from './pocs/CodeTodDoGame'; 
export const pocs = [
  {
    id: 'newspoint-app',
    title: 'Newspoint Read Mode',
    description: 'NewsPoint Read Mode offers three focused reading experiences: Original, GenZ Summary, and 3-Bullet Takeaways — tailored for every kind of reader.', 
    source: NewsPointApp,
  },
  {
    id: 'code-tod-do',
    title: 'Code Tod Do',
    description: ' A logic-based game where players guess a secret 3-digit code using clues. With each attempt, emoji feedback guides them closer to breaking the code in just 5 tries.',
    type: 'react',
    source: CodeTodDo,
  },
];