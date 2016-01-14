
import createElement from './createElement'

import animationFrames from './animationFrames'
import ease from './ease'
import bysuit from './modules/bysuit'
import fan from './modules/fan'
import intro from './modules/intro'
import poker from './modules/poker'
import shuffle from './modules/shuffle'
import sort from './modules/sort'
import flip from './modules/flip'

import observable from './observable'
import queue from './queue'
import prefix from './prefix'
import translate from './translate'

import Card from './card'

export default function Deck (sixplayer) {
  // init cards array
  var cards = new Array(sixplayer ? 63 : 43)

  var $el = createElement('div')
  var self = observable({mount, unmount, cards, $el})
  var $root

  var modules = Deck.modules
  var module

  // make queueable
  queue(self)

  // load modules
  for (module in modules) {
    addModule(modules[module])
  }

  // add class
  $el.classList.add('deck')

  var card
  var counter = 0

  var exclude = [13, 45]

  if (!sixplayer) {
    exclude.push(
      2, 3, 4, 11, 12,    //spades
      18, 19, 27, 28, 29, //hearts
      34, 35, 36, 43, 44, //clubs
      50, 51, 59, 60, 61  //diamonds
    )
  }

  // create cards
  for (var i = 1; counter < cards.length; i++) {
    if (exclude.indexOf(i) === -1) {
        card = cards[counter] = Card(i - 1)
        card.mount($el)
        counter++
    }
  }

  return self

  function mount (root) {
    // mount deck to root
    $root = root
    $root.appendChild($el)
  }

  function unmount () {
    // unmount deck from root
    $root.removeChild($el)
  }

  function addModule (module) {
    module.deck && module.deck(self)
  }
}
Deck.animationFrames = animationFrames
Deck.ease = ease
Deck.modules = {bysuit, fan, intro, poker, shuffle, sort, flip}
Deck.Card = Card
Deck.prefix = prefix
Deck.translate = translate
