import { Game } from './components/Game'

import('@k-okina/minimax_ttt/minimax_ttt').then(js => console.log(js.get_next_best_board([0, 0, 0, 0, 0, 0, 0, 0, 0])))

export default Game
