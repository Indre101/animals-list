"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

let HTML = {};

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0
};

function start() {
  console.log("ready");
  HTML.filtersInputs = document.querySelectorAll(".filter");
  HTML.sortInputsValues = document.querySelectorAll("#sorting th");

  // TODO: Add event-listeners to filter and sort buttons

  loadJSON();
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  HTML.filtersInputs.forEach(filterValue => {
    const clickedFilterValue = filterValue.dataset.filter.toLowerCase();
    console.log(clickedFilterValue);
    filterValue.onclick = function() {
      const filteredAnimals = allAnimals.filter(animal =>
        filterAnimals(animal, clickedFilterValue)
      );
      displayList(filteredAnimals);
    };
  });

  let counter = 0;
  let clicked = true;

  HTML.sortInputsValues.forEach(sortValue => {
    sortValue.onclick = function() {
      if (clicked === true) {
        clicked = false;
        counter = 1;
      } else if (clicked === false) {
        clicked = true;
        counter = -1;
      }

      const clickedSortValue = sortValue.dataset.sort;
      allAnimals.sort((a, b) => {
        let c;
        let d;
        if (typeof a[clickedSortValue] === "number") {
          c = a[clickedSortValue];
          d = b[clickedSortValue];
        } else {
          c = a[clickedSortValue].toLowerCase();
          d = b[clickedSortValue].toLowerCase();
        }
        if (c < d) return 1 * counter;
        if (c > d) return -1 * counter;
        if (c === d) return 0;
      });
      displayList(allAnimals);
    };
  });

  displayList(allAnimals);
}

function filterAnimals(animal, clickedFilterValue) {
  if (clickedFilterValue === "*") return animal;
  else if (animal.type === clickedFilterValue) return animal;
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);

  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  document.querySelector("#list tbody").appendChild(clone);
}
