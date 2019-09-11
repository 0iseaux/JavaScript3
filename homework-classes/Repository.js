/* eslint-disable prettier/prettier */
'use strict';

/* global Util */

class Repository {
  constructor(repository) {
    this.repository = repository;
  }
  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} container The container element in which to render the repository.
   */

  render(container) {
    // TODO: replace the next line with your code.
    const selected = document.getElementById('selected');

    Util.createAndAppend('div', selected, {
      text: `<b>Name of Repository:</b><br>${this.repository.description})<br><br>`,
      class: 'selected',
    });

    Util.createAndAppend('div', selected, {
      text: `<b>Description:</b><br>${this.name}<br><br>`,
      class: 'selected',
    });
    Util.createAndAppend('div', selected, {
      text: `<b>Fork(s)</b>:<br>${this.repository.forks}<br><br>`,
      class: 'selected',
    });
    Util.createAndAppend('div', selected, {
      text: `<b>Updated at</b>:<br>${this.repository.updated_at}<br><br>`,
      class: 'selected',
    });

    this.fetchContributors(this.repository.contributors_url)

  }


  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors(url) {
    return Util.fetchJSON(this.repository.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.repository.name;
  }
}