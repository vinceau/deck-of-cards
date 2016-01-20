
import getFontSize from '../fontSize'

var fontSize

export default {
  deck: function (deck) {
    deck.deal = deck.queued(deal)
    deck.times = 0

    function deal (next) {
      var cards = deck.cards
      var len = cards.length
      var sixplayer = len == 63
      var me = sixplayer ? 3 : 2

      fontSize = getFontSize()

      deck.hand = []
      deck.kitty = []

      cards.reverse().forEach(function (card, i) {
        card.pos = i

        card.deal(i, len, sixplayer, function (i) {
          if (i === cards.length - 1) {
            next()
          }
        })

        if (card.player === me) {
          deck.hand.push(card)
        } else if (card.player === -1) {
          deck.kitty.push(card)
        }

      })

      deck.times++
    }
  },
  card: function (card) {
    var $el = card.$el

    card.deal = function (i, len, sixplayer, cb) {
      var delay = i * 250

      var players = sixplayer ? 6 : 4

      var kitty = getKitty(players)

      var toPlayer = function(j) {
        // player -1 is the kitty
        if (kitty.indexOf(j) !== -1) return -1
        if (j < kitty[0]) { //round 1
          return j / 3 | 0
        } else if (j < kitty[1]) {
          return (j - kitty[0] - 1) / 4 | 0
        } else {
          return (j - kitty[1] - 1) / 3 | 0
        }
      }

      var toRound = function(j) {
        // player 6 is the kitty
        if (j <= kitty[0]) { //round 1
          return 0
        } else if (j <= kitty[1]) {
          return 1
        } else {
          return 2
        }
      }

      var toNumber = function(j) {
        // player 6 is the kitty
        if (j <= kitty[0]) { //round 1
          return j % 3
        } else if (j <= kitty[1]) {
          return ((j - kitty[0] - 1) % 4) + 3
        } else {
          return ((j - kitty[1] - 1) % 3) + 7
        }
      }

      var x, y, rot
      if (toPlayer(i) !== -1) { //kitty
        rot = toPlayer(i) * (360 / players) + toNumber(i)
        x = Math.cos(deg2rad(rot - 90)) * 155 * fontSize / 16
        y = Math.sin(deg2rad(rot - 90)) * 155 * fontSize / 16
      } else {
        rot = 300 + (toRound(i) * 3)
        x = 0 + (toRound(i) * 3)
        y = 0 + (toRound(i) * 3)
      }

      card.player = toPlayer(i)

      card.animateTo({
        delay: delay,
        duration: 150,

        x: x,
        y: y,
        rot: rot,

        onStart: function () {
          $el.style.zIndex = toNumber(i)
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

function getKitty (players) {
  var kitty = []
  kitty.push(players * 3)
  kitty.push(players * 7 + 1)
  kitty.push(players * 10 + 2)
  return kitty
}
