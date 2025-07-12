import NewsPointApp from './pocs/NewsPointApp';
import CrackItGame from './pocs/CrackItGame'; 
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
];