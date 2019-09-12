'use strict';

// 2 alumnis ?
// select disappears after change event?
// App.js:153 TypeError: Cannot read property 'fetchContributors' of undefined

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.mainContainer = null;
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    // 1. Create the fixed HTML elements of your page
    const root = document.getElementById('root');
    Util.createAndAppend('img', root, {
      class: 'header',
      src: './hyf.png',
    });
    Util.createAndAppend('header', root, {
      class: 'header',
      text: 'Hack Your Future Repositories',
    });
    this.mainContainer = Util.createAndAppend('div', root, {
      id: 'mainContainer',
    });
    const repoList = Util.createAndAppend('div', this.mainContainer, {
      id: 'repoList',
    });
    const select = Util.createAndAppend('select', this.mainContainer, {
      id: 'repoList',
    });
    const option = Util.createAndAppend('option', select, {
      id: 'repoList',
      value: '',
      text: '<--Choose a Repository-->',
    });
    const selected = Util.createAndAppend('div', this.mainContainer, {
      id: 'selected',
    });
    const contributorsDiv = Util.createAndAppend('div', this.mainContainer, {
      id: 'contributors',
    });

    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos.map(repo => new Repository(repo));

      // TODO: add your own code here
      //SORT repo names in alphabetical order (case-insensitive) & generate obj with REDUCE

      let sorted = Object.keys(this.repos)
        .sort((a, b) => {
          a = this.repos[a].repository.name.toLowerCase();
          b = this.repos[b].repository.name.toLowerCase();
          if (a === b) return 0;
          return a < b ? -1 : 1;
        })
        .reduce((acc, curr, i) => {
          acc[i] = this.repos[curr];
          return acc;
        }, {});


      // generate ARRAY of repo names
      let repoNamesArr = [];
      for (const i in sorted) {
        repoNamesArr.push(sorted[i].name());
      }


      // generate sorted repo names from arr to <select>
      for (const repoName of repoNamesArr) {
        Util.createAndAppend('option', select, {
          class: 'repoList',
          text: repoName,
          value: repoNamesArr.indexOf(repoName),
        });
      }
      /*
            console.log(sorted)
            console.log(sorted[0])
            */

      // WHEN SELECTING A REPO ...
      select.addEventListener('change', repoSelected => {

        this.selectRepository(sorted[repoSelected.target.value]);
        // this.selectRepository(sorted[repoSelected.target.value]);
      });
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  clearContainer() {
    document.getElementById('selected').innerHTML = '';
    document.getElementById('contributors').innerHTML = '';
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {object} repo The selected repository object
   */

  async selectRepository(repo) {
    try {
      this.clearContainer();
      const contributors = await repo.fetchContributors();

      const repoContainer = Util.createAndAppend('div', this.mainContainer);
      const contributorContainer = Util.createAndAppend('div', this.mainContainer);

      const contributorList = Util.createAndAppend('ul', contributorContainer);

      repo.render(repoContainer);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList, contributorContainer));
    } catch (error) {
      this.renderError(error);
    }
  }

  /**
   * Render an error to the page.
   * @param {Error} error An Error object describing the error.
   */
  renderError(error) {
    console.error(error); // TODO: replace with your own code
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(HYF_REPOS_URL);