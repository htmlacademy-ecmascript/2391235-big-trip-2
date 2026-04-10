import AbstractView from '../framework/view/abstract-view.js';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

function isFuturePoint(point) {
  const now = new Date();
  return new Date(point.dateFrom) > now;
}

function isPresentPoint(point) {
  const now = new Date();
  const dateFrom = new Date(point.dateFrom);
  const dateTo = new Date(point.dateTo);

  return dateFrom <= now && dateTo >= now;
}

function isPastPoint(point) {
  const now = new Date();
  return new Date(point.dateTo) < now;
}

function createFiltersTemplate(points) {
  const safePoints = points || [];
  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input
          id="filter-everything"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${FilterType.EVERYTHING}"
          checked
        >
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input
          id="filter-future"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${FilterType.FUTURE}"
          ${!safePoints.some(isFuturePoint) ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input
          id="filter-present"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${FilterType.PRESENT}"
          ${!safePoints.some(isPresentPoint) ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-present">Present</label>
      </div>

      <div class="trip-filters__filter">
        <input
          id="filter-past"
          class="trip-filters__filter-input  visually-hidden"
          type="radio"
          name="trip-filter"
          value="${FilterType.PAST}"
          ${!safePoints.some(isPastPoint) ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class FiltersView extends AbstractView {
  #points = null;

  constructor({points} = {}) {
    super();
    this.#points = points;
  }

  get template() {
    return createFiltersTemplate(this.#points);
  }
}
