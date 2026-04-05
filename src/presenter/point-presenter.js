import {render, replace} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class PointPresenter {
  #container = null;
  #point = null;
  #destinations = null;
  #offersByType = null;

  #pointComponent = null;
  #editPointComponent = null;

  constructor({container, point, destinations, offersByType}) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
  }

  init() {
    this.#renderPoint();
  }

  #renderPoint() {
    this.#pointComponent = new PointView({
      point: this.#point,
      onEditClick: this.#replacePointToForm
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations,
      onFormSubmit: this.#replaceFormToPoint,
      onRollupClick: this.#replaceFormToPoint
    });

    this.#editPointComponent.setTypeChangeHandler(this.#handleTypeChange);

    render(this.#pointComponent, this.#container);
  }

  #getOffersForType(type, checkedOfferIds = []) {
    const offersGroup = this.#offersByType.find((item) => item.type === type);
    const availableOffers = offersGroup ? offersGroup.offers : [];

    return availableOffers.map((offer) => ({
      ...offer,
      isChecked: checkedOfferIds.includes(offer.id)
    }));
  }

  #createPointWithType(type) {
    return {
      ...this.#point,
      type,
      offers: this.#getOffersForType(type)
    };
  }

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleTypeChange = (newType) => {
    this.#point = this.#createPointWithType(newType);

    const prevEditComponent = this.#editPointComponent;
    const prevPointComponent = this.#pointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onEditClick: this.#replacePointToForm
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations,
      onFormSubmit: this.#replaceFormToPoint,
      onRollupClick: this.#replaceFormToPoint
    });

    this.#editPointComponent.setTypeChangeHandler(this.#handleTypeChange);

    replace(this.#editPointComponent, prevEditComponent);

    if (prevPointComponent.element.isConnected) {
      replace(this.#pointComponent, prevPointComponent);
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };
}
