document.addEventListener('DOMContentLoaded', function () {
  createGameInitiator(document.getElementById('game'));
});

(function () {
  let revealedCards = [];
  let findedCards = [];

  // функцию, генерирующую массив парных чисел.
  function createNumbersArray(count) {
    // count = (count % 2 === 0 && 3 < count && count < 101) ? count : 4;
    let arr = [];

    for (i = 1; arr.length < count; i++) {
      arr.push(i);
      arr.push(i);
    }
    return arr
  }

  // Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел
  function shuffle(generatedArray) {
    const shuffledArray = [...generatedArray]; // Create a copy to avoid modifying the input
    for (i = 0; i < shuffledArray.length; i++) {
      // let tempNumb = shuffledArray[i];
      // let randomIndex = Math.floor(Math.random() * shuffledArray.length); //generate random index
      // let randomNumber = shuffledArray[randomIndex];
      // shuffledArray[i] = randomNumber;
      // shuffledArray[randomIndex] = tempNumb;
      const j = Math.floor(Math.random() * shuffledArray.length); //generate random index - j
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray
  }

  // Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.
  function startGame(container, count) {
    const shuffledArray = shuffle(createNumbersArray(count));
    cardWrap = document.createElement('div');
    cardWrap.classList.add('card-wrap');

    // Calculate the number of columns based on the count
    const columns = Math.sqrt(count) + 1;

    cardWrap.style.display = 'flex';
    cardWrap.style.flexWrap = 'wrap';
    cardWrap.style.justifyContent = 'space-around';



    for (i = 0; i < shuffledArray.length; i++) {
      let card = document.createElement('div');
      let cardInner = document.createElement('div');
      let cardFront = document.createElement('div');
      let cardBack = document.createElement('div');
      let cardText = document.createElement('span');

      cardText.textContent = shuffledArray[i];
      card.classList.add('card');
      cardInner.classList.add('card-inner');
      cardFront.classList.add('card-front');
      cardBack.classList.add('card-back');
      cardText.classList.add('card-text');
      card.style.width = `calc((100% / ${columns}) - 10px)`; // 10px is the margin between columns

      cardBack.appendChild(cardText);
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);
      cardWrap.appendChild(card);

      // Add a click event listener to each card
      card.addEventListener('click', function () {
        if (!card.classList.contains('show') && revealedCards.length < 2) {
          card.classList.add('show');
          revealedCards.push(card);

          // If two cards are revealed, check if they match
          if (revealedCards.length === 2) {
            if (revealedCards[0].textContent === revealedCards[1].textContent) {
              // The cards match, remove the click event listeners
              revealedCards[0].removeEventListener('click', function () { });
              revealedCards[1].removeEventListener('click', function () { });
              findedCards.push(revealedCards[0].textContent);
              findedCards.push(revealedCards[1].textContent);
              revealedCards = []; // Reset revealed cards
              console.log(findedCards);
              if (findedCards.length === count) {
                clearTimeout(endGameTimer);
                createEndGame(container, 'You won!');
              }
            } else {
              // The cards don't match, hide them after a brief delay
              setTimeout(() => {
                revealedCards[0].classList.remove('show');
                revealedCards[1].classList.remove('show');
                revealedCards = []; // Reset revealed cards
              }, 1000);
            }
          }
        }
      });
    }

    console.log(shuffledArray);

    container.appendChild(cardWrap);
    return cardWrap
  }

  function createGamePage(container) {
    let initContainer = document.createElement('div');
    let form = document.createElement('form');
    let input = document.createElement('input');
    let button = document.createElement('button');
    let appTitle = document.createElement('h2');
    let descriptionInit = document.createElement('span');
    let timeWarning = document.createElement('span');

    appTitle.innerHTML = 'Pair game';
    appTitle.classList.add('title');
    form.classList.add('input-group', 'mb-5');
    input.classList.add('form-control');
    input.placeholder = 'Enter a number here';
    button.classList.add('btn', 'btn-primary');
    button.innerHTML = 'Start game!';
    button.setAttribute('disabled', 'disabled');
    container.classList.add('vh-100', 'd-flex', 'align-items-center', 'justify-content-center', 'flex-column')
    initContainer.classList.add('initContainer', 'align-items-center', 'justify-content-center', 'flex-column')
    descriptionInit.innerHTML = 'Enter how big play field you want to be.<br>If you want a 4x4 enter number 4';
    descriptionInit.classList.add('description', 'self-align-center');
    timeWarning.classList.add('time-warning', 'show', 'hide', 'description', 'self-align-center', 'text-danger');
    timeWarning.innerHTML = 'After pressing enter or "Start game!" <br> you will have 1 minute to finish game';

    container.append(initContainer);
    initContainer.append(appTitle);
    initContainer.append(descriptionInit);
    form.append(input);
    form.append(button);
    initContainer.append(form);
    initContainer.append(timeWarning);

    return {
      form,
      input,
      button,
      initContainer,
      timeWarning
    };
  }

  function createEndGame(container, mesageToDisplay) {
    let endContainer = document.createElement('div');
    let endTitle = document.createElement('h3');
    let endButton = document.createElement('button');

    endContainer.classList.add('endContainer', 'position-absolute', 'p-2', 'bg-success', 'border', 'border-4', 'rounded-3');
    endButton.classList.add('btn', 'btn-warning');
    endButton.innerHTML = 'Restart game!';
    endTitle.innerHTML = mesageToDisplay + '<br>Do you want to run the game again?';

    endContainer.append(endTitle, endButton);
    container.append(endContainer);

    endButton.addEventListener('click', function () {
      hideElements(document.querySelector('.initContainer'));
      hideElements(document.querySelector('.time-warning'));
      hideElements(endContainer);
    })

    shuffledArray = [];
    findedCards = [];
    document.querySelector('.card-wrap').remove(); // clear all child elements
  }

  function hideElements(someElement) {
    someElement.classList.toggle('hide');
  }

  function createGameInitiator(generalContainer) {
    let gamePage = createGamePage(generalContainer);

    // toggle enable or disabled state for from button
    function toggleFormButton() {
      gamePage.button.disabled = gamePage.input.value === '';
    };
    gamePage.input.addEventListener('input', function () {
      let timeWarning = document.querySelector('.time-warning');
      hideElements(timeWarning);
      toggleFormButton();
    }
    );

    gamePage.form.addEventListener('submit', function (e) {
      e.preventDefault();
      count = (gamePage.input.value % 2 === 0 && 3 < gamePage.input.value && gamePage.input.value < 101) ? gamePage.input.value * gamePage.input.value : 4;

      gamePage.input.value = ''; //clear the value of the input after entered a number
      toggleFormButton(); // disable button after entered a number

      setTimeout(() => {
        startGame(generalContainer, count);
      }, 1100);

      setTimeout(() => {
        hideElements(document.querySelector('.initContainer'));
      }, 700);

      endGameTimer = setTimeout(function () {
        createEndGame(generalContainer, 'Timer has run out');
      }, 6 * 10000);
    })
  }

  window.createGameInitiator = createGameInitiator;
})();

