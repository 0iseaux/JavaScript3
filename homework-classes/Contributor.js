'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(contributor) {
    this.contributor = contributor;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} container The container element in which to render the contributor.
   */
  render(list, container) {
    // TODO: replace the next line with your code.

    container.appendChild(list)

    Util.createAndAppend('li', list, {
      text: `<img src="${this.contributor.avatar_url}">`,
      class: 'contributors',
    });

    Util.createAndAppend('li', list, {
      text: `<b>Name of Contributor:</b><a href="${this.contributor.html_url}" target="_blank">${this.contributor.login}</a>`,
      class: 'contributors',

    });

    Util.createAndAppend('li', list, {
      text: `<b>Contributions:</b>${this.contributor.contributions}</a>`,
      class: 'contributors',
    });

  }
}