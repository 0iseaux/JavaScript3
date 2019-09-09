'use strict';
// Replace XMLHttpRequest with the fetch API.
// Refactor all.then() and.catch() methods with async / await and try...catch.

const root = document.getElementById('root');
const select = document.querySelector('select');
const selected = document.getElementById('selected');
const contributors = document.getElementById('contributors');
let repoNamesArr = [];

// createAndAppend	A utility function for easily creating and appending HTML elements.
// It is not likely that you will need to modify createAndAppend().

function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);

    Object.keys(options).forEach(key => {
        const value = options[key];

        if (key === 'text') {
            elem.innerHTML = value;
        } else {
            elem.setAttribute(key, value);
        }
    });
    return elem;
}

async function getAndSortRepoData(url) {
    const bigRepoData = fetch(url);
    const repoResponse = await bigRepoData;
    const repoData = await repoResponse.json();
    return repoData;
}


async function genAndSortRepoNamesList() {
    const data = await getAndSortRepoData(HYF_REPOS_URL);

    //SORT repo names in alphabetical order (case-insensitive) & generate obj with REDUCE
    let sorted = Object.keys(data)
        .sort((a, b) => {
            a = data[a].name.toLowerCase();
            b = data[b].name.toLowerCase();
            if (a === b) return 0;
            return a < b ? -1 : 1;
        })
        .reduce((acc, curr, i) => {
            acc[i] = data[curr];
            return acc;
        }, {});
    // console.log(sorted);

    // generate ARRAY of repo names
    for (const repo in sorted) {
        repoNamesArr.push(sorted[repo].name);
    }
    // console.log(repoNamesArr);

    // create list of repo names from Arr to select from
    repoNamesArr.forEach(repoName => {
        createAndAppend('option', select, {
            text: repoName,
            value: repoNamesArr.indexOf(repoName), // where each option element has the array index of the repository as its value
        });
    });


    // WHEN SELECTING A REPO ...
    select.addEventListener('change', repo => {
        // SHOW repo info
        selected.innerHTML = '';

        /* ref 
                  console.log(repo);
                  console.log(repo.target);
                  console.log(repo.target.value);
                  console.log(sorted[repo.target.value].url);
                  */

        createAndAppend('div', selected, {
            text: `<b>Name of Repository:</b><br><a href="${
                                sorted[repo.target.value].html_url
                                }" target="_blank">${sorted[repo.target.value].name}</a><br><br>`,
            class: 'selected',
        });
        createAndAppend('div', selected, {
            text: `<b>Description:</b><br>${sorted[repo.target.value].description}<br><br>`,
            class: 'selected',
        });
        createAndAppend('div', selected, {
            text: `<b>Fork(s)</b>:<br>${sorted[repo.target.value].forks}<br><br>`,
            class: 'selected',
        });
        createAndAppend('div', selected, {
            text: `<b>Updated at</b>:<br>${sorted[repo.target.value].updated_at}<br><br>`,
            class: 'selected',
        });

        getAndShowContributorsData(sorted[repo.target.value].contributors_url);

    })
}

async function getAndShowContributorsData(url) {
    // FETCH contributors
    // ref: console.log(sorted[repo.target.value].contributors_url)
    const bigContributorsData = fetch(url);
    const contributorsResponse = await bigContributorsData;
    const contributorsData = await contributorsResponse.json();

    contributors.innerHTML = '';

    for (const i in contributorsData) {
        createAndAppend('div', contributors, {
            text: `<img src="${contributorsData[i].avatar_url}">`,
            class: 'contributors',
        });
        createAndAppend('div', contributors, {
            text: `<b>Name of Contributor:</b><a href="${
                    contributorsData[i].html_url
                  }" target="_blank">${contributorsData[i].login}</a>`,
            class: 'contributors',
        });
        createAndAppend('div', contributors, {
            text: `<b>Contributions:</b>${contributorsData[i].contributions}</a>`,
            class: 'contributors',
        });
    }
}


const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => {
    genAndSortRepoNamesList(HYF_REPOS_URL);
};