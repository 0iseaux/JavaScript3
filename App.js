'use strict';

class App {
    constructor(url) {
        this.mainContainer = null;
        this.initialize(url);
    }
    async initialize(url) {
        const root = document.getElementById('root');
        Util.createAndAppend('img', root, {
            id: 'logo',
            src: './hyf.png',
        });
        const repoList = Util.createAndAppend('div', root, {
            id: 'repoListDiv',
        });
        const select = Util.createAndAppend('select', repoList, {
            id: 'repoSelect',
        });
        const option = Util.createAndAppend('option', select, {
            id: 'repoOptions',
            value: '',
            text: '<--Choose a Repository-->',
        });
        this.mainContainer = Util.createAndAppend('div', root, {
            id: 'mainContainer',
        });

        const selected = Util.createAndAppend('div', this.mainContainer, {
            id: 'selected',
        });
        this.contributorsDiv = Util.createAndAppend('div', this.mainContainer, {
            id: 'contributorsDiv',
        });
        this.contributorList = Util.createAndAppend('ul', this.contributorsDiv, {
            id: 'contributorsList',
        });

        try {
            const repos = await Util.fetchJSON(url);
            this.repos = repos.map(repo => new Repository(repo));

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

            let repoNamesArr = [];
            for (const i in sorted) {
                repoNamesArr.push(sorted[i].name()); // name() instead of name
            }

            // generate sorted repo names from arr to <select>
            for (const repoName of repoNamesArr) {
                Util.createAndAppend('option', select, {
                    class: 'repoList',
                    text: repoName,
                    value: repoNamesArr.indexOf(repoName),
                });
            }

            select.addEventListener('change', repoSelected => {
                this.selectRepository(sorted[repoSelected.target.value]);
            });
        } catch (error) {
            this.renderError(error);
        }
    }

    clearContainer() {
        document.getElementById('selected').innerHTML = '';
        this.contributorList.innerHTML = '';
    }

    async selectRepository(repo) {
        try {
            const contributors = await repo.fetchContributors();

            const repoContainer = document.getElementById('selected');

            this.clearContainer();

            repo.render(repoContainer);

            contributors
                .map(contributor => new Contributor(contributor))
                .forEach(contributor => contributor.render(this.contributorList));
        } catch (error) {
            this.renderError(error);
        }
    }

    renderError(error) {
        console.error(error); // TODO: replace with your own code
    }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
window.onload = () => new App(HYF_REPOS_URL);
