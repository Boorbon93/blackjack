//Card variables
const colors = ['Hearts','Spades','Diamonds','Clubs'];
const values = ['Ace','King','Queen','Jack','Ten','Nine','Eight','Seven','Six','Five','Four','Three','Two'];

//DOM references 
let statusTextArea = document.getElementById('status-text-area');
let newGameButton = document.getElementById('new-game-button');
let hitButton = document.getElementById('hit-button');
let stayButton = document.getElementById('stay-button');
let dealerTextArea = document.getElementById('dealer-text-area');
let dealerCardsArea = document.getElementById('dealer-cards-area');
let playerTextArea = document.getElementById('player-text-area');
let playerCardsArea = document.getElementById('player-cards-area');
let backgroundGreenButton = document.getElementById('bg-green-button');
let backgroundBlueButton = document.getElementById('bg-blue-button');
let backgroundRedButton = document.getElementById('bg-red-button');
let container = document.getElementById('container');
let counterArea = document.getElementById('counter-area');


//Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false, 
    playerCards = [],
    dealerCards = [],
    playerScore = 0,
    dealerScore = 0,
    playerWinCounter = 0,
    dealerWinCounter = 0,
    deck = [];

//Initialize first game
hitButton.style.display = 'none';
stayButton.style.display = 'none';
counterArea.innerText = 'Player points: ' + playerWinCounter + '\n' + 'Dealer points: ' + dealerWinCounter;
showStatus();

newGameButton.addEventListener("click", function(){
    gameStarted = true;
    gameOver = false;
    playerWon = false; 

    deck = createDeck();
    shuffleDeck(deck);
    playerCards = [drawCard(),drawCard()];
    dealerCards = [drawCard(),drawCard()];
    
    statusTextArea.innerText = 'Game started!';
    newGameButton.style.display = 'none';
    hitButton.style.display = 'inline';
    stayButton.style.display = 'inline';
    showStatus();
});

hitButton.addEventListener('click', function(){
    playerCards.push(drawCard());
    checkIfGameEnded();
    showStatus();
});

stayButton.addEventListener('click', function(){
    gameOver = true;
    checkIfGameEnded();
    showStatus();
});

//Change background color
backgroundBlueButton.addEventListener('click', function(){
    container.removeAttribute('class');
    container.classList.add('bg-blue');
});
backgroundRedButton.addEventListener('click', function(){
    container.removeAttribute('class');
    container.classList.toggle('bg-red');
});
backgroundGreenButton.addEventListener('click', function(){
    container.removeAttribute('class');
    container.classList.toggle('bg-green');
});

function createDeck() {
let deck = [];
    for  (let colorsIndex = 0; colorsIndex < colors.length; colorsIndex++){
        for (let valuesIndex = 0; valuesIndex < values.length; valuesIndex++){
            let card = {
                color: colors[colorsIndex],
                value: values[valuesIndex]
                };
            deck.push(card);
        }
    }
    return deck;
}
//Fisher-Yates shuffle
function shuffleDeck(deck){
    let counter = deck.length;
    while (counter > 0){
        let index = Math.floor(Math.random() * counter);
        counter --;
        let tempArray = deck[counter];
        deck[counter] = deck[index];
        deck[index] = tempArray;
    }
return deck;
}

function getCardName(card){
    return card.value + ' of ' + card.color; 
}
function getGraphicsName(card){
    return card.value + '_of_' + card.color + '.png';
}

function evaluateCard(card) {
    switch(card.value){
        case 'Ace':
            return 1;
        case 'Two':
            return 2;
        case 'Three':
            return 3;
        case 'Four':
            return 4;
        case 'Five':
            return 5;
        case 'Six':
            return 6;
        case 'Seven':
            return 7;
        case 'Eight':
            return 8;
        case 'Nine':
            return 9;
        default:
            return 10;  
    }
}

function calculateScores(cardArray){
    let score = 0;
    let hasAce = false;
    for (let i = 0; i < cardArray.length; i++){
        let card = cardArray[i];
        score += evaluateCard(card);
        if (card.value === 'Ace'){
            hasAce = true;
        }
    }
    if (hasAce === true && score + 10 <= 21){
        return score + 10; 
    }
    return score; 
}
function updateScores(){
    dealerScore = calculateScores(dealerCards);
    playerScore = calculateScores(playerCards);
}
function checkIfGameEnded(){
    
    updateScores();
    
    if (gameOver === true){
        //dealer can draw after player stays
        while(dealerScore < playerScore
            && dealerScore <= 21
            && playerScore <= 21){
                dealerCards.push(drawCard());
                updateScores(); 
            }
    }
    if (playerScore === 21){
        playerWon = true;
        gameOver = true; 
    }
    else if (dealerScore === 21){
        playerWon = false;
        gameOver = true; 
    }
    else if (playerScore > 21){
        playerWon = false;
        gameOver = true;
    } 
    else if (dealerScore > 21){
        playerWon = true;
        gameOver = true;
    }
}

function showStatus(){
    if(gameStarted === false){
        statusTextArea.innerText = 'Welcome to Blackjack!';
        return;
    }

    let dealerCardsString = '';
    let dealerCardsFilenames = '';
    for (let i = 0; i < dealerCards.length; i++){
        dealerCardsString += getCardName(dealerCards[i]) + ', ';
        dealerCardsFilenames += `<img src="img/${getGraphicsName(dealerCards[i])}" class="card-face">`;
    }
    dealerCardsArea.innerHTML = `${dealerCardsFilenames}`; 
    
    let playerCardsString = '';
    let playerCardsFilenames = '';
    for (let i = 0; i < playerCards.length; i++){
        playerCardsString += getCardName(playerCards[i]) + ', ';
        playerCardsFilenames += `<img src="img/${getGraphicsName(playerCards[i])}" class="card-face">`;
    }
    playerCardsArea.innerHTML = `${playerCardsFilenames}`;
    updateScores();
    
    statusTextArea.innerText = ''; 

    dealerTextArea.innerText =
    'Dealer has:\n' +
    dealerCardsString + '\n' +
    'Score: ' + dealerScore;

    playerTextArea.innerText =
    'You have:\n' +
    playerCardsString + '\n' +
    'Score: ' + playerScore; 
   
    if (gameOver === true){
        if (playerWon === true){
            statusTextArea.innerText += 'You win!';
            playerWinCounter++;
        }
        else{
            statusTextArea.innerText += 'You lose!';
            dealerWinCounter++;
        }
        counterArea.innerText = 'Player points: ' + playerWinCounter + '\n' + 'Dealer points: ' + dealerWinCounter;
        newGameButton.style.display = 'inline';
        hitButton.style.display = 'none';
        stayButton.style.display = 'none';
    }
}


function drawCard(){
return deck.shift();
}