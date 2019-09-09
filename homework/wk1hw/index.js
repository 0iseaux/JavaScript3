'use strict';

// fetchJSON	Uses XMLHttpRequest to fetch JSON data from an API end point. This function uses an asynchronous callback.
// It is not likely that you will need to modify fetchJSON().
const root = document.getElementById('root');
const select = document.querySelector('select');
const selected = document.getElementById('selected');
const contributors = document.getElementById('contributors');
let repoNamesArr = [];

function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status <= 299) {
            cb(null, xhr.response);
        } else {
            cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
        }

        // ref console.log(xhr.response);
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
}

// createAndAppend	A utility function for easily creating and appending HTML elements.
// It is not likely that you will need to modify createAndAppend().

function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);

    Object.keys(options).forEach(key => {
        const value = options[key];

        /* testing lines start 
            console.log(options) // {text: "AngularJS"}
            console.log(key) // text
            console.log(value) // AngularJS
            testing lines end */

        if (key === 'text') {
            elem.innerHTML = value; //changed 'textContent' to innerHTML
        } else {
            elem.setAttribute(key, value);
        }
    });
    return elem;
}

// main contains the start-up code for the application.
// Add new functions and modify function main() as you see fit.

function main(url) {
    fetchJSON(url, (err, repositories) => {
            if (err) {
                createAndAppend('div', root, {
                    text: err.message,
                    class: 'alert-error',
                });
                return;
            }
            // ref: console.log(repositories);

            //SORT repo names in alphabetical order (case-insensitive) & generate obj with REDUCE

            /* REF https://stackoverflow.com/questions/43773092/how-to-sort-objects-by-value
                let obj = {a: {'name':'Boy'}, b:{'name': 'apple'}, c:{'name':'Dog'}, d:{'name':'cat'}};
                Object.keys(obj).sort((a, b) => {
                    a = obj[a].name.toLowerCase();
                    b = obj[b].name.toLowerCase();
                    if (a == b) return 0;
                    return a < b ? -1 : 1;
                })
                //return ["b", "a", "d", "c"]
                */
            let sorted = Object.keys(repositories)
                .sort((a, b) => {
                    a = repositories[a].name.toLowerCase();
                    b = repositories[b].name.toLowerCase();
                    if (a === b) return 0;
                    return a < b ? -1 : 1;
                })
                .reduce((acc, curr, i) => {
                    acc[i] = repositories[curr];
                    return acc;
                }, {});

            // ref: console.log(sorted);

            // generate ARRAY of repo names
            for (const repo in sorted) {
                repoNamesArr.push(sorted[repo].name);
            }

            // ref:   console.log(repoNamesArr);

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

                    // FETCH contributors
                    // ref: console.log(sorted[repo.target.value].contributors_url)

                    fetchJSON(sorted[repo.target.value].contributors_url, (err2, contributorsData) => {
                            if (err2) {
                                createAndAppend('div', root, {
                                    text: err2.message,
                                    class: 'alert-error',
                                });
                                return;
                            }

                            // ref: console.log(contributorsData);

                            contributors.innerHTML = '';

                            for (const i in contributorsData) {
                                if (contributorsData.hasOwnProperty(i)) {


                                    // ref: console.log(i);
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
                            });
                    });
            });
    }

    const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
    window.onload = () => {
        main(HYF_REPOS_URL);
    };