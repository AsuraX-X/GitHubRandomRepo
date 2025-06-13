const langSelector = document.querySelector(".select-lang");
const df = document.querySelector(".default");
const content = document.querySelector(".content");
const button = document.querySelector(".button-div");
let languages = [];

const getLanguages = async () => {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );
    languages = await res.json();

    languages.forEach(({ title, value }) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = title;
      langSelector.appendChild(option);
    });
    df.textContent = "Select a language";
  } catch (error) {
    console.error(error);
    df.textContent = "Error fetching languages";
  }
};

df.textContent = "Loading...";

getLanguages();

renderRepo = (repo) => {
  content.innerHTML = `
  <div class="repo">
        <h1 class="title">${repo.name}</h1>
        <p class="owner"><i class="fa-regular fa-circle-user icon" style="font-size:1.5rem;"></i>${repo.owner.login}</p>
        <p class="description">${repo.description}</p>
        <a class="link" href=${repo.html_url} target="_blank">Visit Repo</a>
        <div class="stats">
        <p class="stars"><i class="fa-solid fa-star icon"></i>${repo.stargazers_count}
        <p class="forks"><i class="fa-solid fa-code-fork icon"></i>${repo.forks_count}</p>
        <p class="issues"><i class="fa-solid fa-circle-exclamation icon"></i>${repo.open_issues_count}</p>
        </div>
    </div>`;

  button.innerHTML = `
    <button class="refresh-btn" onclick="{handleLangChange()}">Refresh</button>
    `;
};

const getRepo = async (language) => {
  try {
    let res;
    if (language) {
      res = await fetch(
        `https://api.github.com/search/repositories?q=language:${language}`
      );
    } else {
      res = await fetch(
        `https://api.github.com/search/repositories?q=is:public`
      );
    }
    const data = await res.json();
    const randRepo = data.items[Math.floor(Math.random() * data.items.length)];
    console.log(randRepo);
    renderRepo(randRepo);
  } catch (error) {
    console.error(error);
    content.innerHTML = `<div class="error">
        <p> Error fetching repo</p>
      </div>`;
    button.innerHTML = `
    <button class="retry-btn " onclick="{handleLangChange()}">Click to retry</button>
    `;
  }
};

let language = "";

const handleLangChange = () => {
  content.innerHTML = "<p class='text-center'>Loading...</p>";
  button.innerHTML = "";
  language = langSelector.value;
  console.log(language);
  getRepo(language);
};
