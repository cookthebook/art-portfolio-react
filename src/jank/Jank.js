import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import './Jank.scss'

const LEGAL_SETS = ['RNA', 'GRN', 'DOM', 'RIX', 'XLN', 'HOU', 'AKH', 'AER', 'KLD', 'EMN', 'SOI', 'OGW', 'BFZ', 'DTK', 'FRF', 'KTK', 'JOU', 'BNG', 'THS', 'DGM', 'GTC', 'RTR', 'M19', 'ORI', 'M15', 'M14']

const DREADED_CARDS = ['ramunap ruins', 'rogue refiner', 'felidar guardian', 'smuggler\'s copter', 'attune with aether', 'aetherworks marvel', 'reflector mage', 'emrakul, the promised end', 'treasure cruise', 'dig through time', 'deathrite shaman', 'collected company']

function cleanCardName(name) {
  let exactName = name.toLowerCase()
  return exactName;
}

function getScryfallData(query) {
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', query);

    req.onload = function() {
      if (req.status === 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

function getCardInfo(exactName) {
  exactName = cleanCardName(exactName)
  let newCard = {
    name: exactName,
    sets: [],
    count: 1,
    pointCost: 0
  }

  if(DREADED_CARDS.includes(exactName)) {
    newCard.pointCost = 4;
  }

  // Form Scryfall API query
  let query = 'https://api.scryfall.com/cards/search?order=released&unique=prints&q='
  query += '!"' + exactName + '"'
  query += '+('
  LEGAL_SETS.forEach(set => {
    query += 'set%3A' + set + '+OR+'
  })
  query += ')'

  console.log(query)
  let cardJSON = null;
  
  getScryfallData(query).then(value => {
    cardJSON = value;
    if (!cardJSON.data) {
      return null;
    }
  
    console.log(cardJSON.data)
  
    cardJSON.data.forEach(cardObject => {
      if (cardObject.name.toLowerCase() === exactName) {
        newCard.sets.append(cardObject.set.toUpperCase())
      }
      // Use newest printing rarity
      if (newCard.pointCost === -1) {
        switch(cardObject.rarity) {
          case 'mythic':
            newCard.pointCost = 3
            break;
          case 'rare':
            newCard.pointCost = 2
            break;
          case 'uncommon':
            newCard.pointCost = 1
            break;
          case 'common':
            newCard.pointCost = 0
            break;
          default:
            break;
        }
      }
    })
    return newCard
  }, error => {
    console.log('Query error');
    return null;    
  });
}

export class Jank extends Component {
  constructor(props) {
    super(props)

    this.processDeck = this.processDeck.bind(this)
  }

  processDeck() {
    let deckText = document.getElementById('deckList').value
    console.log('Deck list:')
    console.log(deckText)
    let cards = []
    deckText.split('\n').forEach(cardText => {
      let count = parseInt(cardText.split(' ')[0])
      let card = cardText.split(' ').slice(1).join(' ')

      if (count && card) {
        let cardObject = getCardInfo(card)
        if (cardObject) {
          cardObject.count = count
          cards.push(cardObject)
        }
      }
    })
    console.log('Found cards:');
    console.log(cards);
  }

  render() {
    return (
      <div className='Jank'>
        <Form className='JankCardFinder container'>
          <FormGroup>
            <Label for='deckList'>Submit Decklist</Label>
            <Input type='text' id='deckList' placeholder='Enter card name' />
          </FormGroup>
          <Button onClick={this.processDeck}>Find!</Button>
        </Form>
      </div>
    )
  }
}
