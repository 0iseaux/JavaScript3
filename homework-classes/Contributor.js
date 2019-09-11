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

    Util.createAndAppend('li', list, {
      text: `<b>Contributor:</b><br>${this.contributor.description})<br><br>`,
      class: 'selected',
    });

    Util.createAndAppend('div', container, {
      text: `<b>Name of Repository:</b><br>${this.contributor.description})<br><br>`,
      class: 'selected',
    });

    Util.createAndAppend('div', container, {
      text: `<b>Name of Repository:</b><br>${this.contributor.description})<br><br>`,
      class: 'selected',
    });



  }
}