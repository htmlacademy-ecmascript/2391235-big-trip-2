import {render, RenderPosition} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #tripControlsFiltersContainer = null;
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointModel = null;
  #pointPresenters = [];
  #emptyPointListComponent = new EmptyPointListView();

  constructor({tripControlsFiltersContainer, tripEventsContainer, tripEventsListContainer, pointModel}) {
    this.#tripControlsFiltersContainer = tripControlsFiltersContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#pointModel = pointModel;
  }

  #createPointForView(point) {
    const destination = this.#pointModel.destinations.find((item) => item.id === point.destinationId) || {
      name: '',
      description: '',
      pictures: []
    };

    const offersByType = this.#pointModel.offers.find((item) => item.type === point.type);
    const availableOffers = offersByType ? offersByType.offers : [];

    const offers = availableOffers.map((offer) => ({
      ...offer,
      isChecked: point.offerIds.includes(offer.id)
    }));

    return {
      id: point.id,
      type: point.type,
      destination,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      basePrice: point.basePrice,
      isFavorite: point.isFavorite,
      offers
    };
  }

  init() {
    render(new FiltersView({points: this.#pointModel.points}), this.#tripControlsFiltersContainer);

    if (this.#pointModel.points.length === 0) {
      render(this.#emptyPointListComponent, this.#tripEventsListContainer);
      return;
    }

    render(new SortView(), this.#tripEventsContainer, RenderPosition.AFTERBEGIN);

    this.#pointModel.points.forEach((point) => {
      const pointForView = this.#createPointForView(point);

      const pointPresenter = new PointPresenter({
        container: this.#tripEventsListContainer,
        point: pointForView,
        destinations: this.#pointModel.destinations,
        offersByType: this.#pointModel.offers
      });

      pointPresenter.init();
      this.#pointPresenters.push(pointPresenter);
    });
  }
}
