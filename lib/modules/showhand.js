
import getFontSize from '../fontSize'

var fontSize

export default {
  deck: function (deck) {
    deck.showHand = deck.queued(showHand)

    function showHand (next, random) {
      var cards = deck.hand
      var len = cards.length

      fontSize = getFontSize()

      var card_pos = []
      for (var i = 0; i < len; i++) {
        card_pos.push(i)
      }
      if (random) {
        shuffle(card_pos)
      }

      cards.forEach(function (card, i) {
        card.showHand(i, len, card_pos[i], function (i) {
          if (i === cards.length - 1) {
            next()
          }
        })
        card.setSide('front')
      })
    }
  },
  card: function (card) {
    var $el = card.$el

    card.showHand = function (i, len, pos, cb) {
      var z = pos / 4
      var delay = pos * 10
      var rot = pos / (len - 1) * 14 - 7

      card.animateTo({
        delay: delay,
        duration: 150,

        x: -z,
        y: -z + 250,
        rot: 0
      })
      card.animateTo({
        delay: 300 + delay,
        duration: 150,

        x: Math.cos(deg2rad(rot - 90)) * 55 * fontSize / 16 + (pos - len / 2 + 0.5) * 75,
        y: Math.sin(deg2rad(rot - 90)) * 55 * fontSize / 16 + 250 + Math.abs(pos - len / 2) * 4,
        rot: rot,

        onStart: function () {
          $el.style.zIndex = pos
        },

        onComplete: function () {
          cb(i)
        }
      })
    }
  }
}

function deg2rad (degrees) {
  return degrees * Math.PI / 180
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}
