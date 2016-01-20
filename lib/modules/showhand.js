
import getFontSize from '../fontSize'

var fontSize

export default {
  deck: function (deck) {
    deck.showHand = deck.queued(showHand)

    function showHand (next) {
      var cards = deck.hand
      var len = cards.length

      fontSize = getFontSize()

      cards.forEach(function (card, i) {
        card.showHand(i, len, function (i) {
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

    card.showHand = function (i, len, cb) {
      var z = i / 4
      var delay = i * 10
      var rot = i / (len - 1) * 14 - 7

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

        x: Math.cos(deg2rad(rot - 90)) * 55 * fontSize / 16 + (i - len / 2 + 0.5) * 75,
        y: Math.sin(deg2rad(rot - 90)) * 55 * fontSize / 16 + 250 + Math.abs(i - len / 2) * 4,
        rot: rot,

        onStart: function () {
          $el.style.zIndex = i
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
