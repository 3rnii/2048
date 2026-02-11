import { GameProvider } from './contexts/game/context';
import Board from './components/Board/Board';
import Suggestion from './components/Suggestion/Suggestion';
import GameOverModal from './components/GameOverModal/GameOverModal';
import './App.css'

function App() {
  return (
    <>
      <GameProvider>
        <GameOverModal />
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
          <h1>2048</h1>
          <Board />
          <Suggestion />
        </div>
      </GameProvider>
    </>
  )
}

export default App
