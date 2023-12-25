let input = document.querySelector("input");
let someData;
let ul = document.querySelector(".seasrch-list");
let ulUsefulAnswer = document.querySelector(".useful-answer");

const debounce = (fn, debounceTime) => {
  let timerId;
  return function () {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, arguments);
    }, debounceTime);
  };
};

let showTips = (arr) => {
  let newData = arr.map((user) => user.name);
  let extNewData = arr.map((user) => [
    user.name,
    user.owner.login,
    user.stargazers_count,
  ]);
  console.log(extNewData);
  for (i in newData) {
    let ul = document.querySelector(".seasrch-list");
    let newLi = document.createElement("li");
    newLi.classList.add("answerlist-item");
    newLi.textContent = extNewData[i][0];
    newLi.setAttribute("data-name", `${extNewData[i][0]}`);
    newLi.setAttribute("data-owner", `${extNewData[i][1]}`);
    newLi.setAttribute("data-stars", `${extNewData[i][2]}`);
    ul.appendChild(newLi);
  }
};

async function getData(searchStr) {
  let response = await fetch(
    `https://api.github.com/search/repositories?q=${searchStr}`
  );
  if (response.ok) {
    let result = await response.json();
    let newRes = [...result.items.slice(0, 5)];
    someData = newRes;
    console.log(someData);
    liRemoveAll();
    showTips(someData);
  }
}
let checkSpace = (string) => {
  return string.trim() !== '';
}
let liRemoveAll = () => {
  ul.replaceChildren();
};

let debounceRequest = debounce(getData, 400);

input.addEventListener("input", (e) => {
  let { value } = e.target;
  if (checkSpace(value)) {
    debounceRequest(value.trim());
  }
});

ul.addEventListener("click", (e) => {
  let ul = document.querySelector(".useful-answer");
  ul.insertAdjacentHTML(
    "afterbegin",
    `<li class="useful-answer__item">
    <div class="data">
        <span class="data__text">Name: ${e.target.dataset.name}</span>
        <span class="data__text">Owner: ${e.target.dataset.owner}</span>
        <span class="data__text">Stars: ${e.target.dataset.stars}</span>
    </div>
    <button class="close-button">
    </button>
    </li>`
  );
  input.value = "";
  liRemoveAll();
});

ulUsefulAnswer.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-button")) {
    e.target.parentElement.remove();
  }
});
