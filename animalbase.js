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

  //   HTML.filtersInputs.forEach(filterValue => {
  //     const clickedSort = filterValue.dataset.filter.toLowerCase();
  //     filterValue.onclick = function() {
  //       if (clickedSort === "*") {
  //         displayList(allAnimals);
  //       } else {
  //         const filteredAnimals = allAnimals.filter(
  //           animal => animal.type === clickedSort
  //         );
  //         displayList(filteredAnimals);
  //       }
  //     };
  //   });

  HTML.sortInputsValues.forEach(sortValue => {
    sortValue.onclick = function() {
      const clickedSortValue = sortValue.dataset.sort;
      console.log(parseInt(clickedSortValue, 10));
      allAnimals.sort((a, b) => {
        const c = a[clickedSortValue];
        const d = b[clickedSortValue];
        if (c < d) return -1;
        if (c > d) return 1;
        if (c === d) return 0;
      });

      displayList(allAnimals);
    };
  });

  displayList(allAnimals);
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
