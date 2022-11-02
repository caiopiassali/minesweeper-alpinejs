import './style.scss'

import Alpine from 'alpinejs'

import game from './game'

window.Alpine = Alpine

Alpine.data('game', game)
Alpine.start()
