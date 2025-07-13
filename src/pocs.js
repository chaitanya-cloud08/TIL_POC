import NewsPointApp from './pocs/NewsPointApp';
import CrackItGame from './pocs/CrackItGame';
import MindMaze from './pocs/MindMaze'; 
export const pocs = [
  {
    id: 'newspoint-app',
    title: 'Newspoint Read Mode',
    description: 'NewsPoint Read Mode offers three focused reading experiences: Original, GenZ Summary, and 3-Bullet Takeaways — tailored for every kind of reader.',
    type: 'react',
    source: NewsPointApp,
  },
  {
    id: 'crack-it',
    title: 'CrackIt',
    description: ' A number-based Wordle.Break the secret 3-digit code in 5 shots.Use emoji clues 🟢🟡🔴 to guide your logic.',
    type: 'react',
    source: CrackItGame,
  },
  {
    id: 'mind-maze',
    title: 'MindMaze',
    description: 'MindMaze is a fast-paced puzzle game where the maze shifts every few seconds.You must plan your moves carefully and reach the goal before the maze changes too many times.',
    type: 'react',
    source: MindMaze,
  },
];