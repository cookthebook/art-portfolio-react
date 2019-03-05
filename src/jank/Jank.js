import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';

import './Jank.scss'

const LEGAL_SETS = ['RNA', 'GRN', 'DOM', 'RIX', 'XLN', 'HOU', 'AKH', 'AER', 'KLD', 'EMN', 'SOI', 'OGW', 'BFZ', 'DTK', 'FRF', 'KTK', 'JOU', 'BNG', 'THS', 'DGM', 'GTC', 'RTR', 'M19', 'ORI', 'M15', 'M14']

const DREADED_CARDS = ['ramunap ruins', 'rogue refiner', 'felidar guardian', 'smuggler\'s copter', 'attune with aether', 'aetherworks marvel', 'reflector mage', 'emrakul, the promised end', 'treasure cruise', 'dig through time', 'deathrite shaman', 'collected company']

function cleanCardName(name) {
  let exactName = name.toLowerCase().trim();
  return exactName;
}

function getScryfallData(query) {
  return new Promise(function (resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', query);

    req.onload = function () {
      if (req.status === 200) {
        resolve(req.response);
      }
      else {
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function () {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

export class Jank extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cards: []
    };

    this.processDeck = this.processDeck.bind(this);
    this.getCardInfo = this.getCardInfo.bind(this);
    this.updateResultList = this.updateResultList.bind(this);
  }

  updateResultList(card) {
    console.log('Adding card: ');
    console.log(card);
    console.log('To:');
    console.log(this.state.cards);
    var oldCards = this.state.cards;
    this.setState({
      cards: oldCards.concat([<MTGCard name={card.name} count={card.count} />])
    });
    console.log('Current deck:');
    console.log(this.state.cards);
  }

  getCardInfo(exactName, count) {
    // Form Scryfall API query
    let query = 'https://api.scryfall.com/cards/search?order=released&unique=prints&q=';
    query += '!"' + exactName + '"';
    query += '+(';
    LEGAL_SETS.forEach(set => {
      query += 'set%3A' + set + '+OR+'
    });
    query += ')';

    console.log(query);
    let cardJSON = null;

    getScryfallData(query).then(value => {
      cardJSON = JSON.parse(value);
      if (!cardJSON.data) {
        console.log('No data found for card: ' + exactName);
        return null;
      }

      exactName = cleanCardName(exactName);
      var newCard = {
        name: exactName,
        sets: [],
        count: count,
        pointCost: -1
      };

      if (DREADED_CARDS.includes(exactName)) {
        newCard.pointCost = 4;
      }

      console.log(cardJSON.data);

      cardJSON.data.forEach(cardObject => {
        console.log(newCard);
        console.log('Processing:');
        console.log(cardObject.set.toUpperCase());

        cardObject.name = cleanCardName(cardObject.name);
        if (cardObject.name === newCard.name) {
          console.log('Found match');
          newCard.sets.push(cardObject.set.toUpperCase());
          console.log('Added set: ' + cardObject.set.toUpperCase());

          // Use newest printing rarity
          if (newCard.pointCost === -1) {
            switch (cardObject.rarity) {
              case 'mythic':
                newCard.pointCost = 3;
                break;
              case 'rare':
                newCard.pointCost = 2;
                break;
              case 'uncommon':
                newCard.pointCost = 1;
                break;
              case 'common':
                newCard.pointCost = 0;
                break;
              default:
                break;
            }
          }
        }
        console.log('Done');
      });
      console.log('Finished processing card');
      this.updateResultList(newCard);
    });
  }

  processDeck() {
    if (this.state.cards.length > 0) {
      this.setState({
        cards: []
      });
    }
    let deckText = document.getElementById('deckList').value
    console.log('Deck list:')
    console.log(deckText)
    deckText.split('\n').forEach(cardText => {
      let count = parseInt(cardText.split(' ')[0])
      let card = cardText.split(' ').slice(1).join(' ')

      if (count && card) {
        this.getCardInfo(card, count);
      }
    })
  }

  render() {
    return (
      <div className='Jank'>
        <Form className='JankCardFinder container'>
          <FormGroup>
            <Label for='deckList'>Submit Decklist</Label>
            <Input type='textarea' id='deckList' placeholder='Enter card name' />
          </FormGroup>
          <br />
          <Button onClick={this.processDeck}>Find!</Button>
          {this.state.cards}
        </Form>
      </div>
    )
  }
}

class MTGCard extends Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.count = props.count;
  }

  render() {
    return (<div>
      <p>{this.count}x {this.name}</p>
    </div>);
  }
}
