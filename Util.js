'use strict';

// eslint-disable-next-line no-unused-vars
class Util {
    static createAndAppend(name, parent, options = {}) {
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
    static async fetchJSON(url) {
        try {
            const bigRepoData = fetch(url);
            const repoResponse = await bigRepoData;
            const data = await repoResponse.json();
            return data;
        } catch (e) {
            console.log(e);
        }
    }
}
