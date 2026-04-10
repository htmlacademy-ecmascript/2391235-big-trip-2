const getRandomId = () => crypto.randomUUID();

const generatePicture = () => ({
  src: `https://loremflickr.com/248/152?random=${Math.random()}`,
  description: 'Destination photo'
});

const generateDestination = (name = 'Amsterdam') => ({
  id: getRandomId(),
  name,
  description: 'Lorem ipsum dolor sit amet.',
  pictures: [generatePicture()]
});

const generateOffer = (title = 'Extra option') => ({
  id: getRandomId(),
  title,
  price: Math.floor(Math.random() * 100) + 1
});

const generateOffersByType = (type, offers) => ({
  type,
  offers
});

const generatePoint = (type, destinationId, offerIds) => {
  const now = Date.now();
  const randomShift = Math.floor((Math.random() * 3) - 1) * 24 * 60 * 60 * 1000;
  const startDate = new Date(now + randomShift);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);

  return {
    id: getRandomId(),
    basePrice: Math.floor(Math.random() * 200) + 1,
    dateFrom: startDate.toISOString(),
    dateTo: endDate.toISOString(),
    destinationId,
    isFavorite: false,
    offerIds,
    type
  };
};

export {
  generateDestination,
  generateOffer,
  generateOffersByType,
  generatePoint
};
