const pokeAPIBaseURL = "https://pokeapi.co/api/v2/pokemon/";
const game = document.getElementById("game");

let firstPick;
let isPaused = false;
let matches;

const colors = {
  fire: "#EA7A3C",
  grass: "#71C558",
  electric: "#E5C531",
  water: "#539AE2",
  ground: "#CC9F4F",
  rock: "#B2A061",
  fairy: "#E397D1",
  poison: "#B468B7",
  bug: "#94BC4A",
  dragon: "#6A7BAF",
  psychic: "#E5709B",
  flying: "#7DA6DE",
  fighting: "#CB5F48",
  normal: "#AAB09F",
  ice: "#70CBD4",
  dark: "#736C75",
  ghost: "#846AB6",
  steel: "#89A1B0",
};

const loadPokemon = async () => {
  const randomIds = new Set();
  while (randomIds.size < 8) {
    const randomNumber = Math.ceil(Math.random() * 1025);
    randomIds.add(randomNumber);
  }
  const pokePromises = [...randomIds].map((id) => fetch(pokeAPIBaseURL + id));
  const responses = await Promise.all(pokePromises);
  return await Promise.all(responses.map((res) => res.json()));
};

const displayPokemon = (pokemon) => {
  pokemon.sort((_) => Math.random() - 0.5);
  const pokemonHTML = pokemon
    .map((pokemon) => {
      const type = pokemon.types[0]?.type?.name || "normal";
      const color = colors[type];
      return `
    <div class="card" style="background-color:${color}" onclick="clickCard(event)" data-pokename=${pokemon.name}>
      <div class="front">
      
      </div>
      <div class="back rotated" style="background-color:${color}">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">

      </div>
    </div>
    `;
    })
    .join("");
  game.innerHTML = pokemonHTML;
};

const clickCard = (event) => {
  const pokemonCard = event.currentTarget;
  const [front, back] = getFrontAndBackFromCard(pokemonCard);

  if (front.classList.contains("rotated") || isPaused) return;

  isPaused = true;

  rotateElements([front, back]);

  if (!firstPick) {
    firstPick = pokemonCard;
    isPaused = false;
  } else {
    const secondPokemonName = pokemonCard.dataset.pokename;
    const firstPokemonName = firstPick.dataset.pokename;
    if (firstPokemonName != secondPokemonName) {
      const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);
      setTimeout(() => {
        rotateElements([front, back, firstFront, firstBack]);
        firstPick = null;
        isPaused = false;
      }, 500);
    } else {
      matches++;
      if (matches == 8) {
        console.log("winner");
      }
      firstPick = null;
      isPaused = false;
    }
  }
};

const rotateElements = (elements) => {
  if (typeof elements != "object" || !elements.length) return;
  elements.forEach((element) => element.classList.toggle("rotated"));
};

const getFrontAndBackFromCard = (card) => {
  const front = card.querySelector(".front");
  const back = card.querySelector(".back");
  return [front, back];
};

const resetGame = () => {
  game.innerHTML = "";
  isPaused = true;
  firstPick = null;
  matches = 0;
  setTimeout(async () => {
    const pokemon = await loadPokemon();
    displayPokemon([...pokemon, ...pokemon]);
    isPaused = false;
  }, 200);
};

resetGame();

// const pokeAPIBaseURL = "https://pokeapi.co/api/v2/pokemon/";

// const loadPokemon = async () => {
//   const randomIds = new Set();
//   let randomNumber = 1;
//   while (randomIds.size < 1025) {
//     randomIds.add(randomNumber);
//     randomNumber += 1;
//   }
//   console.log(...randomIds);
//   const randomIdsArr = [...randomIds];
//   for (let i = 0; i < randomIdsArr.length; i++) {
//     const res = await fetch(pokeAPIBaseURL + randomIdsArr[i]);
//     const pokemon = await res.json();
//     console.log(pokemon.name);
//   }
//   // document.getElementById("output").innerHTML = pokemon.name;
// };

// loadPokemon();
