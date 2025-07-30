# Trip API

A trip is a representation of passenger transportation from point A to point B. Each search will usually return multiple trip options that can be booked. Options can differ by vehicle type or by being private or shared with other travelers. Shared trips have predefined pickup and dropoff points and departure times. For private trips pickup and dropoff points as well as departure time are matching the search request. Private trips can also be customized by adding stops if available.

## Flows

Trip API can be used to search for trip options, customizing an option with stops and then booking the option.

### Simple trip

A typical simple flow without stop customization would look like this:

1. call [/search](#search-endpoint) endpoint to get possible options
2. call [/book](#book-endpoint) endpoint to book the chosen option
3. `optional` - call [/details](#details-endpoint) endpoint to get trip and booking details
4. `optional` - call [/drivers](#drivers-endpoint) endpoint to get information about driver(s) and vehicle(s) assigned to the trip
5. `optional` - call [/tracking](#tracking-endpoint) endpoint to track the position of the driver(s) assigned to the trip

### Trip with a stop

A flow with adding stops would look like this:

1. call [/search](#search-endpoint) endpoint to get possible options
2. call [/customize](#customize-endpoint) endpoint to add stops to the chosen option
3. call [/book](#book-endpoint) endpoint to book the customized option
4. `optional` - call [/details](#details-endpoint) endpoint to get trip and booking details

### Cancelling a trip

A flow to book a trip, get details about it and then cancel it would look like this:

1. call [/search](#search-endpoint) endpoint to get possible options
2. call [/book](#book-endpoint) endpoint to book the chosen option
3. `optional` - call [/details](#details-endpoint) endpoint to get trip and booking details
4. call [/cancel](#cancel-endpoint) endpoint to cancel the booking
5. `optional` - call [/details](#details-endpoint) endpoint to get trip and booking details (status should be "Cancelled")

### Updating a trip

If you want to change departure time or add/remove stops you need to cancel the booking and create it again as it can affect the price. For small adjustments like changing passenger phone number, email, child seat type, pickup and dropoff address notes (within the scope of original search coordinates), customer note or flight number you can use the [/update](#update-endpoint) endpoint:

1. call [/search](#search-endpoint) endpoint to get possible options
2. call [/book](#book-endpoint) endpoint to book the chosen option
3. `optional` - call [/details](#details-endpoint) endpoint to get trip and booking details
4. call [/update](#update-endpoint) endpoint to update the booking details

Disclaimer: in the last 24 hours before the departure the [/update](#update-endpoint) endpoint will no longer accept updates. For updates in the last 24 hours please contact our customer support at <daytrip@mydaytrip.com> or call [+44 20 3318 1119](tel:+442033181119).

## Search endpoint

This endpoint returns all available trip options based on the specified origin, destination, departure time, and passenger count. The origin and destination can be provided either as geographic coordinates or as IATA airport codes. Geographic coordinates should be specified as latitude and longitude in decimal degrees format, for example: `39.753657`, `-117.610215`. The departure time must be supplied as a UNIX epoch timestamp in seconds (e.g., 1679463169).

> To search for a private or shared trip from Prague to Vienna for 3 passengers, use this call:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v3/trip/search?originLatitude=50.10&originLongitude=14.2559&destinationLatitude=48.2082&destinationLongitude=16.3738&departureTime=1766227088&passengersCount=3&childrenCount=1&includeShared=true" \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> To search for a private or shared trip from Prague Airport to Vienna for 3 passengers, use this call:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v3/trip/search?originType=iata&origin=PRG&destinationType=coordinates&destinationLatitude=48.2082&destinationLongitude=16.3738&departureTime=1766227088&passengersCount=3&childrenCount=1&includeShared=true" \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
  "searchId": "f0e34a1b-2b3d-4747-b426-292633b615b4",
  "expiresAt": "2022-12-04T18:00:00Z",
  "passengersCount": 3,
  "currency": "EUR",
  "options": [
    {
      "id": "1d32109f-c2e2-44fe-b2cf-461ef3730541",
      "type": "Private",
      "englishSpeakingDriver": true,
      "distanceKm": 334,
      "travelTimeMinutes": 208,
      "pickUp": {
        "lat": 50.1,
        "lon": 14.25,
        "time": "2022-12-05T18:00:00Z",
        "timezone": "Europe/Prague",
        "meetAndGreet": true,
        "state": "original",
        "immutable": false
      },
      "dropOff": {
        "lat": 48.2,
        "lon": 16.37,
        "state": "original",
        "immutable": false
      },
      "pricing": {
        "totalPrice": 260
      },
      "vehicle": {
        "type": "Sedan",
        "maxPassengers": 3,
        "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
        "modelDescription": "VW Passat or similar",
        "image": "https://daytrip.imgix.net/site/sedan.png"
      },
      "luggage": {
        "maxTotalCarryons": 3,
        "maxTotalSuitcases": 3
      },
      "availableChildSeatTypes": [
        {
          "childSeatType": "RearFacing",
          "description": "Rear-facing infant seat",
          "ageFrom": 0,
          "ageTo": 1,
          "weightInPoundsFrom": 0,
          "weightInPoundsTo": 26,
          "weightInKilosFrom": 0,
          "weightInKilosTo": 10
        },
        {
          "childSeatType": "ForwardFacing",
          "description": "Forward-facing w/harness",
          "ageFrom": 1,
          "ageTo": 4,
          "weightInPoundsFrom": 18,
          "weightInPoundsTo": 36,
          "weightInKilosFrom": 8,
          "weightInKilosTo": 16
        },
        {
          "childSeatType": "BoosterSeat",
          "description": "Booster seat with high back",
          "ageFrom": 4,
          "ageTo": 6,
          "weightInPoundsFrom": 30,
          "weightInPoundsTo": 50,
          "weightInKilosFrom": 14,
          "weightInKilosTo": 23
        },
        {
          "childSeatType": "Booster",
          "description": "Backless booster",
          "ageFrom": 6,
          "ageTo": 12,
          "weightInPoundsFrom": 44,
          "weightInPoundsTo": 72,
          "weightInKilosFrom": 20,
          "weightInKilosTo": 33
        }
      ],
      "possibleStops": [
        {
          "id": "d280ce2a-6224-4d95-af17-a250f81b97dd",
          "price": 31,
          "name": "Lednice Chateau and Park",
          "image": "https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
          "title": "Vacation like a King",
          "perex": "This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
          "description": "The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
          "durationInMinutes": 60,
          "order": 1,
          "timezone": "Europe/Prague",
          "country": {
            "englishName": "Czech Republic"
          }
        },
        {
          "id": "4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
          "price": 28,
          "name": "Mikulov",
          "image": "https://daytrip.imgix.net/510.jpg",
          "title": "The Heart of Czech Wine Country",
          "perex": "A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
          "description": "Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
          "durationInMinutes": 60,
          "order": 2,
          "timezone": "Europe/Prague",
          "country": {
            "englishName": "Czech Republic"
          }
        }
      ]
    },
    {
      "id": "054ee064-d4dd-492f-9d0a-5251a7f791c2",
      "type": "Private",
      "englishSpeakingDriver": false,
      "distanceKm": 334,
      "travelTimeMinutes": 208,
      "pickUp": {
        "lat": 50.1,
        "lon": 14.25,
        "time": "2022-12-05T18:00:00Z",
        "timezone": "Europe/Prague",
        "meetAndGreet": true,
        "state": "original",
        "immutable": false
      },
      "dropOff": {
        "lat": 48.2,
        "lon": 16.37,
        "state": "original",
        "immutable": false
      },
      "pricing": {
        "totalPrice": 240
      },
      "vehicle": {
        "type": "Sedan",
        "maxPassengers": 3,
        "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
        "modelDescription": "VW Passat or similar",
        "image": "https://daytrip.imgix.net/site/sedan.png"
      },
      "luggage": {
        "maxTotalCarryons": 3,
        "maxTotalSuitcases": 3
      },
      "availableChildSeatTypes": [
        {
          "childSeatType": "RearFacing",
          "description": "Rear-facing infant seat",
          "ageFrom": 0,
          "ageTo": 1,
          "weightInPoundsFrom": 0,
          "weightInPoundsTo": 26,
          "weightInKilosFrom": 0,
          "weightInKilosTo": 10
        },
        {
          "childSeatType": "ForwardFacing",
          "description": "Forward-facing w/harness",
          "ageFrom": 1,
          "ageTo": 4,
          "weightInPoundsFrom": 18,
          "weightInPoundsTo": 36,
          "weightInKilosFrom": 8,
          "weightInKilosTo": 16
        },
        {
          "childSeatType": "BoosterSeat",
          "description": "Booster seat with high back",
          "ageFrom": 4,
          "ageTo": 6,
          "weightInPoundsFrom": 30,
          "weightInPoundsTo": 50,
          "weightInKilosFrom": 14,
          "weightInKilosTo": 23
        },
        {
          "childSeatType": "Booster",
          "description": "Backless booster",
          "ageFrom": 6,
          "ageTo": 12,
          "weightInPoundsFrom": 44,
          "weightInPoundsTo": 72,
          "weightInKilosFrom": 20,
          "weightInKilosTo": 33
        }
      ],
      "possibleStops": [
        {
          "id": "d280ce2a-6224-4d95-af17-a250f81b97dd",
          "price": 31,
          "name": "Lednice Chateau and Park",
          "image": "https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
          "title": "Vacation like a King",
          "perex": "This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
          "description": "The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
          "durationInMinutes": 60,
          "order": 1,
          "timezone": "Europe/Prague",
          "country": {
            "englishName": "Czech Republic"
          }
        },
        {
          "id": "4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
          "price": 28,
          "name": "Mikulov",
          "image": "https://daytrip.imgix.net/510.jpg",
          "title": "The Heart of Czech Wine Country",
          "perex": "A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
          "description": "Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
          "durationInMinutes": 60,
          "order": 2,
          "timezone": "Europe/Prague",
          "country": {
            "englishName": "Czech Republic"
          }
        }
      ]
    },
    {
      "id": "b071e9f8-54d9-44be-bb5f-feae5aafd771",
      "type": "Private",
      "englishSpeakingDriver": true,
      "distanceKm": 334,
      "travelTimeMinutes": 208,
      "pickUp": {
        "lat": 50.1,
        "lon": 14.25,
        "time": "2022-12-05T18:00:00Z",
        "timezone": "Europe/Prague",
        "meetAndGreet": true,
        "state": "original",
        "immutable": false
      },
      "dropOff": {
        "lat": 48.2,
        "lon": 16.37,
        "state": "original",
        "immutable": false
      },
      "pricing": {
        "totalPrice": 320
      },
      "vehicle": {
        "type": "MPV",
        "maxPassengers": 4,
        "description": "Compact MPV comparable to a Volkswagen Touran, up to 4 passengers with luggage.",
        "modelDescription": "VW Touran or similar",
        "image": "https://daytrip.imgix.net/site/mpv.png"
      },
      "luggage": {
        "maxTotalCarryons": 4,
        "maxTotalSuitcases": 4
      },
      "availableChildSeatTypes": [
        {
          "childSeatType": "RearFacing",
          "description": "Rear-facing infant seat",
          "ageFrom": 0,
          "ageTo": 1,
          "weightInPoundsFrom": 0,
          "weightInPoundsTo": 26,
          "weightInKilosFrom": 0,
          "weightInKilosTo": 10
        },
        {
          "childSeatType": "ForwardFacing",
          "description": "Forward-facing w/harness",
          "ageFrom": 1,
          "ageTo": 4,
          "weightInPoundsFrom": 18,
          "weightInPoundsTo": 36,
          "weightInKilosFrom": 8,
          "weightInKilosTo": 16
        },
        {
          "childSeatType": "BoosterSeat",
          "description": "Booster seat with high back",
          "ageFrom": 4,
          "ageTo": 6,
          "weightInPoundsFrom": 30,
          "weightInPoundsTo": 50,
          "weightInKilosFrom": 14,
          "weightInKilosTo": 23
        },
        {
          "childSeatType": "Booster",
          "description": "Backless booster",
          "ageFrom": 6,
          "ageTo": 12,
          "weightInPoundsFrom": 44,
          "weightInPoundsTo": 72,
          "weightInKilosFrom": 20,
          "weightInKilosTo": 33
        }
      ],
      "possibleStops": [
        {
          "id": "d280ce2a-6224-4d95-af17-a250f81b97dd",
          "price": 31,
          "name": "Lednice Chateau and Park",
          "image": "https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
          "title": "Vacation like a King",
          "perex": "This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
          "description": "The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
          "durationInMinutes": 60,
          "order": 1,
          "timezone": "Europe/Prague",
          "country": {
            "englishName": "Czech Republic"
          }
        },
        {
          "id": "4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
          "price": 28,
          "name": "Mikulov",
          "image": "https://daytrip.imgix.net/510.jpg",
          "title": "The Heart of Czech Wine Country",
          "perex": "A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
          "description": "Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
          "durationInMinutes": 60,
          "order": 2,
          "timezone": "Europe/Prague",
          "country": {
            "englishName": "Czech Republic"
          }
        }
      ]
    },
    {
      "id": "282a8a94-2a18-42f6-9af6-c53b13d007cb",
      "type": "Shared",
      "englishSpeakingDriver": true,
      "distanceKm": 350,
      "travelTimeMinutes": 235,
      "pickUp": {
        "lat": 50.12,
        "lon": 14.27,
        "time": "2022-12-05T19:00:00Z",
        "interval": {
          "earliest": "2022-12-05T19:00:00Z",
          "latest": "2022-12-05T19:10:00Z"
        },
        "timezone": "Europe/Prague",
        "description": "In front of the hotel Europa",
        "address": "Evropska 1540/41, Prague, Czechia",
        "meetAndGreet": false,
        "state": "adjusted",
        "immutable": true
      },
      "dropOff": {
        "lat": 48.21,
        "lon": 16.36,
        "time": "2022-12-05T22:55:00Z",
        "interval": {
          "earliest": "2022-12-05T22:40:00Z",
          "latest": "2022-12-05T22:55:00Z"
        },
        "timezone": "Europe/Vienna",
        "description": "Next to the railway station",
        "address": "Bahnhofplatz, 1010 Wien, Austria",
        "state": "adjusted",
        "immutable": true
      },
      "pricing": {
        "pricePerPassenger": 180,
        "totalPrice": 360
      },
      "vehicle": {
        "type": "Shuttle",
        "maxPassengers": 10,
        "description": "Shuttle comparable to a Mercedes-Benz Vito, up to 10 passengers with luggage.",
        "modelDescription": "Mercedes-Benz Vito or similar",
        "image": "https://daytrip.imgix.net/site/shuttle.png"
      },
      "luggage": {
        "maxCarryonsPerPerson": 1,
        "maxSuitcasesPerPerson": 1,
        "maxTotalCarryons": 2,
        "maxTotalSuitcases": 2
      },
      "seatsAvailable": 8,
      "availableChildSeatTypes": [
        {
          "childSeatType": "RearFacing",
          "description": "Rear-facing infant seat",
          "ageFrom": 0,
          "ageTo": 1,
          "weightInPoundsFrom": 0,
          "weightInPoundsTo": 26,
          "weightInKilosFrom": 0,
          "weightInKilosTo": 10
        },
        {
          "childSeatType": "ForwardFacing",
          "description": "Forward-facing w/harness",
          "ageFrom": 1,
          "ageTo": 4,
          "weightInPoundsFrom": 18,
          "weightInPoundsTo": 36,
          "weightInKilosFrom": 8,
          "weightInKilosTo": 16
        },
        {
          "childSeatType": "BoosterSeat",
          "description": "Booster seat with high back",
          "ageFrom": 4,
          "ageTo": 6,
          "weightInPoundsFrom": 30,
          "weightInPoundsTo": 50,
          "weightInKilosFrom": 14,
          "weightInKilosTo": 23
        },
        {
          "childSeatType": "Booster",
          "description": "Backless booster",
          "ageFrom": 6,
          "ageTo": 12,
          "weightInPoundsFrom": 44,
          "weightInPoundsTo": 72,
          "weightInKilosFrom": 20,
          "weightInKilosTo": 33
        }
      ],
      "possibleStops": [],
      "cancellationPolicy": "Flexible",
      "expiresAt": "2022-12-04T15:00:00Z"
    },
    {
      "id": "4b137906-008a-49cf-b248-e3827b3a3175",
      "type": "Shared",
      "englishSpeakingDriver": false,
      "distanceKm": 350,
      "travelTimeMinutes": 235,
      "pickUp": {
        "lat": 50.12,
        "lon": 14.27,
        "time": "2022-12-05T20:00:00Z",
        "interval": {
          "earliest": "2022-12-05T20:00:00Z",
          "latest": "2022-12-05T20:10:00Z"
        },
        "timezone": "Europe/Prague",
        "description": "In front of the hotel Europa",
        "address": "Evropska 1540/41, Prague, Czechia",
        "meetAndGreet": false,
        "state": "adjusted",
        "immutable": true
      },
      "dropOff": {
        "lat": 48.21,
        "lon": 16.36,
        "time": "2022-12-05T23:55:00Z",
        "interval": {
          "earliest": "2022-12-05T23:40:00Z",
          "latest": "2022-12-05T23:55:00Z"
        },
        "timezone": "Europe/Vienna",
        "description": "Next to the railway station",
        "address": "Bahnhofplatz, 1010 Wien, Austria",
        "state": "adjusted",
        "immutable": true
      },
      "pricing": {
        "pricePerPassenger": 190,
        "totalPrice": 380
      },
      "vehicle": {
        "type": "Shuttle",
        "maxPassengers": 10,
        "description": "Shuttle comparable to a Mercedes-Benz Vito, up to 10 passengers with luggage.",
        "modelDescription": "Mercedes-Benz Vito or similar",
        "image": "https://daytrip.imgix.net/site/shuttle.png"
      },
      "luggage": {
        "maxCarryonsPerPerson": 1,
        "maxSuitcasesPerPerson": 1,
        "maxTotalCarryons": 2,
        "maxTotalSuitcases": 2
      },
      "seatsAvailable": 5,
      "availableChildSeatTypes": [
        {
          "childSeatType": "RearFacing",
          "description": "Rear-facing infant seat",
          "ageFrom": 0,
          "ageTo": 1,
          "weightInPoundsFrom": 0,
          "weightInPoundsTo": 26,
          "weightInKilosFrom": 0,
          "weightInKilosTo": 10
        },
        {
          "childSeatType": "ForwardFacing",
          "description": "Forward-facing w/harness",
          "ageFrom": 1,
          "ageTo": 4,
          "weightInPoundsFrom": 18,
          "weightInPoundsTo": 36,
          "weightInKilosFrom": 8,
          "weightInKilosTo": 16
        },
        {
          "childSeatType": "BoosterSeat",
          "description": "Booster seat with high back",
          "ageFrom": 4,
          "ageTo": 6,
          "weightInPoundsFrom": 30,
          "weightInPoundsTo": 50,
          "weightInKilosFrom": 14,
          "weightInKilosTo": 23
        },
        {
          "childSeatType": "Booster",
          "description": "Backless booster",
          "ageFrom": 6,
          "ageTo": 12,
          "weightInPoundsFrom": 44,
          "weightInPoundsTo": 72,
          "weightInKilosFrom": 20,
          "weightInKilosTo": 33
        }
      ],
      "possibleStops": [],
      "includedStops": [],
      "cancellationPolicy": "Flexible",
      "expiresAt": "2022-12-04T15:00:00Z"
    }
  ]
}
```

> To search for a private trip from Dubrovnik to Venice for 10 passengers, with multiple vehicle options and meeting positions:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v3/trip/search?originLatitude=42.639515&originLongitude=18.108064&destinationLatitude=45.434143&destinationLongitude=12.333497&departureTime=1766227088&includeShared=false&includeStops=false&passengersCount=10&includeMultipleVehicles=true&includeMeetingPositions=true" \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
  "searchId": "f41dc34f-5218-46b1-8e46-1de8ccc5f5c3",
  "expiresAt": "2025-05-27T05:53:46Z",
  "passengersCount": 10,
  "currency": "EUR",
  "options": [
    {
      "id": "68646974-023a-4f9c-8358-869c7ab8db3d",
      "type": "Private",
      "englishSpeakingDriver": true,
      "distanceKm": 833,
      "travelTimeMinutes": 536,
      "pickUp": {
        "lat": 42.6420418,
        "lon": 18.11293,
        "time": "2025-12-20T10:38:08Z",
        "timezone": "Europe/Zagreb",
        "description": "Ploce Gate, Ul. Frana Supila 2",
        "address": "Vrata od Ploča, Ul. Vrata od Ploča, 20000, Dubrovnik, Croatia",
        "image": "https://daytrip.imgix.net/meeting-point-3.png",
        "meetAndGreet": false,
        "state": "adjusted",
        "adjustmentReason": "restricted_area",
        "immutable": true
      },
      "dropOff": {
        "lat": 45.43731978047655,
        "lon": 12.3191409718277,
        "description": "Piazzale Roma",
        "address": "Piazzale Roma, Venice, Metropolitan City of Venice, Italy",
        "image": "https://daytrip.imgix.net/meeting-point-4.png",
        "state": "adjusted",
        "adjustmentReason": "restricted_area",
        "immutable": true
      },
      "pricing": {
        "totalPrice": 2131
      },
      "vehicles": [
        {
          "type": "Van",
          "maxPassengers": 7,
          "description": "Van comparable to a VW Transporter, up to 7 passengers with luggage.",
          "modelDescription": "VW Transporter or similar",
          "image": "https://daytrip.imgix.net/site/van-vw.png"
        },
        {
          "type": "Sedan",
          "maxPassengers": 3,
          "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
          "modelDescription": "VW Passat or similar",
          "image": "https://daytrip.imgix.net/site/sedan.png"
        }
      ],
      "luggage": {
        "maxTotalCarryons": 10,
        "maxTotalSuitcases": 10
      },
      "possibleStops": [],
      "includedStops": [],
      "availableChildSeatTypes": [
        {
          "childSeatType": "RearFacing",
          "description": "Rear-facing infant seat",
          "ageFrom": 0,
          "ageTo": 1,
          "weightInPoundsFrom": 0,
          "weightInPoundsTo": 26,
          "weightInKilosFrom": 0,
          "weightInKilosTo": 10
        },
        {
          "childSeatType": "ForwardFacing",
          "description": "Forward-facing w/harness",
          "ageFrom": 1,
          "ageTo": 4,
          "weightInPoundsFrom": 18,
          "weightInPoundsTo": 36,
          "weightInKilosFrom": 8,
          "weightInKilosTo": 16
        },
        {
          "childSeatType": "BoosterSeat",
          "description": "Booster seat with high back",
          "ageFrom": 4,
          "ageTo": 6,
          "weightInPoundsFrom": 30,
          "weightInPoundsTo": 50,
          "weightInKilosFrom": 14,
          "weightInKilosTo": 23
        },
        {
          "childSeatType": "Booster",
          "description": "Backless booster",
          "ageFrom": 6,
          "ageTo": 12,
          "weightInPoundsFrom": 44,
          "weightInPoundsTo": 72,
          "weightInKilosFrom": 20,
          "weightInKilosTo": 33
        }
      ]
    }
  ]
}
```

### URL path

`/partners/v3/trip/search`

### Query Parameters

| Parameter                 | Type    | Description |
| ------------------------- | ------- | ----------- |
| originType                | string  | Specifies whether the origin is provided as geo-coordinates or as an airport code. Possible values: `coordinates`, `iata`. If omitted, the default value is `coordinates`. |
| originLatitude            | number  | Origin latitude in degrees. Required if `originType` is set to `coordinates` or omitted. |
| originLongitude           | number  | Origin longitude in degrees. Required if `originType` is set to `coordinates` or omitted. |
| origin                    | string  | IATA airport code of the origin airport. Required if `originType` is set to `iata`. |
| destinationType           | string  | Specifies whether the destination is provided as geo-coordinates or as an airport code. Possible values: `coordinates`, `iata`. If omitted, the default value is `coordinates`. |
| destinationLatitude       | number  | Destination latitude in degrees. Required if `destinationType` is set to `coordinates` or omitted. |
| destinationLongitude      | number  | Destination longitude in degrees. Required if `destinationType` is set to `coordinates` or omitted. |
| destination               | string  | IATA airport code of the destination airport. Required if `destinationType` is set to `iata`. |
| departureTime             | integer | Departure time as a UNIX epoch timestamp in seconds. This timestamp should be calculated from the local departure time and converted to UTC. It can be omitted, if `departureTimeLocal` is provided. |
| departureTimeLocal        | integer | Departure time as a UNIX epoch timestamp in seconds. This parameter can be used, when the origin timezone is unknown and conversion to UTC cannot be done. In this case the departure time can be sent as a local time converted to the Unix epoch. This parameter is not required, when `departureTime` is provided. |
| passengersCount           | integer | Total number of passengers to transport (adults and children). Must be between 1 and 7 if `includeMultipleVehicles` is set to `false` or not provided. In case that `includeMultipleVehicles` is set to `true` this parameter must be between 1 and 99. |
| childrenCount             | integer | Optional. Specifies the number of children in the group. Required for shared trip options. |
| includeStops              | boolean | Optional. Defaults to `true`. When set to `false`, no stops will be included in the trip options. |
| includeShared             | boolean | Optional. Defaults to `false`. When set to `true`, shared trip options will be included. |
| includeNonEnglishSpeaking | boolean | Optional. Defaults to `true`. When set to `false`, no trip options with non-English-speaking drivers will be included. |
| includeMeetingPositions   | boolean | Optional. Defaults to `false`. When set to `true`, trip options may include predefined meeting positions for pickup or dropoff when the requested address is in an area that vehicles cannot access directly. In these cases, the API will return the nearest accessible meeting point along with relevant details. |
| includeMultipleVehicles   | boolean | Optional. Defaults to `false`. When set to `true`, if single vehicle options cannot be found we will try to provide trip options with multiple vehicles. |

### Response body

| Property        | Type                              | Description |
| --------------- | --------------------------------- | ----------- |
| searchId        | string                            | Unique id of your search query. |
| expiresAt       | string                            | UTC timestamp of when the offers in this response expire. After this time it is no longer possible to book them, you need to make a new search. |
| passengersCount | integer                           | The count of passengers this search query was for. |
| currency        | string                            | Currency used for all prices in this response. |
| options         | list of [TripOption](#tripoption) | List of options for this trip. |

### Error status codes

| Status code | Description |
| ----------- | ----------- |
| 400         | Invalid request - missing mandatory query parameter, parameter has wrong type or wrong passenger count. |
| 401         | API key missing or invalid. |
| 404         | No trip options found for given request. |

## Customize endpoint

This endpoint is used to customize a trip option returned by the Search endpoint. The result is a new trip option with a new id that can be booked or customized again. The format of the response body is the same as for the Search endpoint. Currently the only supported customization operation is selection of stops for private trips. Selected stops will appear in `includedStops` of the returned option. In case of repeated calls, previously selected stops will be replaced, so if you selected one stop and want to change it to two stops, you need to send both stops in `selectedStops`. `totalPrice` and `travelTimeMinutes` will be automatically updated to reflect the selected stops.

> To add the Mikulov stop to the sedan vehicle type private trip option from the Search endpoint example above, use the following call:

```bash
curl -d '{
  "optionId": "1d32109f-c2e2-44fe-b2cf-461ef3730541",
  "selectedStops": ["4ee58c0c-4e56-46ef-bd22-406a1bc60e1c"]
}' \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -X POST https://papi.staging.mydaytrip.net/partners/v3/trip/search/customize
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
  "searchId": "f0e34a1b-2b3d-4747-b426-292633b615b4",
  "expiresAt": "2022-12-04T18:00:00Z",
  "passengersCount": 3,
  "currency": "EUR",
  "options": [
    {
      "id": "519314e3-cd92-41e0-85b6-c652c345e9d0",
      "type": "Private",
      "englishSpeakingDriver": true,
      "distanceKm": 334,
      "travelTimeMinutes": 268,
      "pickUp": {
        "lat": 50.1,
        "lon": 14.25,
        "time": "2022-12-05T18:00:00Z",
        "timezone": "Europe/Prague",
        "meetAndGreet": true,
        "state": "original",
        "immutable": false
      },
      "dropOff": {
        "lat": 48.2,
        "lon": 16.37,
        "state": "original",
        "immutable": false
      },
      "pricing": {
        "totalPrice": 288
      },
      "vehicle": {
        "type": "Sedan",
        "maxPassengers": 3,
        "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
        "modelDescription": "VW Passat or similar",
        "image": "https://daytrip.imgix.net/site/sedan.png"
      },
      "luggage": {
        "maxTotalCarryons": 3,
        "maxTotalSuitcases": 3
      },
      "availableChildSeatTypes": [
        {
          "childSeatType": "RearFacing",
          "description": "Rear-facing infant seat",
          "ageFrom": 0,
          "ageTo": 1,
          "weightInPoundsFrom": 0,
          "weightInPoundsTo": 26,
          "weightInKilosFrom": 0,
          "weightInKilosTo": 10
        },
        {
          "childSeatType": "ForwardFacing",
          "description": "Forward-facing w/harness",
          "ageFrom": 1,
          "ageTo": 4,
          "weightInPoundsFrom": 18,
          "weightInPoundsTo": 36,
          "weightInKilosFrom": 8,
          "weightInKilosTo": 16
        },
        {
          "childSeatType": "BoosterSeat",
          "description": "Booster seat with high back",
          "ageFrom": 4,
          "ageTo": 6,
          "weightInPoundsFrom": 30,
          "weightInPoundsTo": 50,
          "weightInKilosFrom": 14,
          "weightInKilosTo": 23
        },
        {
          "childSeatType": "Booster",
          "description": "Backless booster",
          "ageFrom": 6,
          "ageTo": 12,
          "weightInPoundsFrom": 44,
          "weightInPoundsTo": 72,
          "weightInKilosFrom": 20,
          "weightInKilosTo": 33
        }
      ],
      "includedStops": [
        {
          "id": "4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
          "price": 28,
          "name": "Mikulov",
          "image": "https://daytrip.imgix.net/510.jpg",
          "title": "The Heart of Czech Wine Country",
          "perex": "A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
          "description": "Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
          "durationInMinutes": 60,
          "order": 2,
          "timezone": "Europe/Prague",
          "country": {
            "englishName": "Czech Republic"
          }
        }
      ],
      "possibleStops": [
        {
          "id": "d280ce2a-6224-4d95-af17-a250f81b97dd",
          "price": 31,
          "name": "Lednice Chateau and Park",
          "image": "https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
          "title": "Vacation like a King",
          "perex": "This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
          "description": "The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
          "durationInMinutes": 60,
          "order": 1,
          "timezone": "Europe/Prague",
          "country": {
            "englishName": "Czech Republic"
          }
        }
      ]
    }
  ]
}
```

### URL path

`/partners/v3/trip/search/customize`

### Request body

| Property      | Type           | Description                                                                                                                            |
| ------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| optionId      | string         | Id of the option you want to customize. Taken from [/search](#search-endpoint) or [/customize](#customize-endpoint) endpoint response. |
| selectedStops | list of string | List of ids of stops to include in the trip. Will replace currently included stops.                                                    |

### Response body

Same format as for the [Search endpoint](#search)

### Error status codes

| Status code | Description                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------- |
| 400         | Invalid request - missing mandatory property, property has a wrong type or not a valid json. |
| 401         | API key missing or invalid.                                                                  |
| 403         | Forbidden request - trying to customize a trip option owned by someone else.                 |
| 404         | Trip option not found or expired. Stop not found.                                            |
| 409         | Trip option has already been booked.                                                         |

## Book endpoint

This endpoint is used to book a trip option. Any trip option from Search or Customize endpoint response can be booked if the search results have not expired yet (see `expiresAt` property). You need to send id of the chosen option and passenger details to this endpoint. The result is a booking id that can be used to cancel the booking if not too close to departure.

> To book the customized trip option with stops from the example above or to book a trip option from the original Search endpoint response for two adults and one child with a booster seat, use the following call:

```bash
curl -d '{
  "optionId": "f0e34a1b-2b3d-4747-b426-292633b615b4",
  "pickUpAddressNote": "Havel airport",
  "dropOffAddressNote": "Vienna central square",
  "customerNote": "We will stand next to the entrance",
  "flightNumber": "FR008",
  "passengerDetails": [
    {
      "type": "Lead",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+41555555555",
      "email": "client-email@example.com",
      "birthday": 629424000
    },
    { "type": "Adult" },
    {
      "type": "Child",
      "childSeatType": "Booster"
    }
  ]
}' \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -X POST https://papi.staging.mydaytrip.net/partners/v3/trip/book
```

```javascript

```

```python

```

> Example response without meeting and dropoff positions:

```json
{
  "bookingId": "cb102778-a3d7-426e-8d18-6bd6b296f283",
  "bookingReference": "CB1027",
  "departureTimeUtc": "2022-12-05T18:00:00Z",
  "originTimezone": "Europe/Prague",
  "meetAndGreet": true,
  "trip": {
    "id": "f0e34a1b-2b3d-4747-b426-292633b615b4",
    "type": "Private",
    "englishSpeakingDriver": true,
    "distanceKm": 334,
    "travelTimeMinutes": 268,
    "pickUp": {
      "lat": 50.1,
      "lon": 14.25,
      "time": "2022-12-05T18:00:00Z",
      "timezone": "Europe/Prague",
      "meetAndGreet": true,
      "state": "original",
      "immutable": false
    },
    "dropOff": {
      "lat": 48.2,
      "lon": 16.37,
      "state": "original",
      "immutable": false
    },
    "pricing": {
      "totalPrice": 288
    },
    "vehicle": {
      "type": "Sedan",
      "maxPassengers": 3,
      "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
      "modelDescription": "VW Passat or similar",
      "image": "https://daytrip.imgix.net/site/sedan.png"
    },
    "luggage": {
      "maxTotalCarryons": 3,
      "maxTotalSuitcases": 3
    },
    "availableChildSeatTypes": [
      {
        "childSeatType": "RearFacing",
        "description": "Rear-facing infant seat",
        "ageFrom": 0,
        "ageTo": 1,
        "weightInPoundsFrom": 0,
        "weightInPoundsTo": 26,
        "weightInKilosFrom": 0,
        "weightInKilosTo": 10
      },
      {
        "childSeatType": "ForwardFacing",
        "description": "Forward-facing w/harness",
        "ageFrom": 1,
        "ageTo": 4,
        "weightInPoundsFrom": 18,
        "weightInPoundsTo": 36,
        "weightInKilosFrom": 8,
        "weightInKilosTo": 16
      },
      {
        "childSeatType": "BoosterSeat",
        "description": "Booster seat with high back",
        "ageFrom": 4,
        "ageTo": 6,
        "weightInPoundsFrom": 30,
        "weightInPoundsTo": 50,
        "weightInKilosFrom": 14,
        "weightInKilosTo": 23
      },
      {
        "childSeatType": "Booster",
        "description": "Backless booster",
        "ageFrom": 6,
        "ageTo": 12,
        "weightInPoundsFrom": 44,
        "weightInPoundsTo": 72,
        "weightInKilosFrom": 20,
        "weightInKilosTo": 33
      }
    ],
    "includedStops": [],
    "possibleStops": []
  }
}
```

> Example response with meeting and dropoff positions:

```json
{
  "bookingId": "72r537a9-b846-4b46-b638-de8121337229",
  "bookingReference": "72R537",
  "departureTimeUtc": "2022-12-05T18:00:00Z",
  "originTimezone": "Europe/Zurich",
  "meetAndGreet": false,
  "meetingPosition": {
    "lat": 46.067648,
    "lon": 7.775185,
    "description": "The train station in Tasch",
    "address": "3929 Täsch, Switzerland",
    "instructions": "As vehicle entry into Zermatt is heavily restricted, your driver will meet you nearby at the train station in Tasch, which can be reached by transit from Zermatt within about 10 minutes. Your driver will be waiting at the taxi stand just outside the entrance to the train station.",
    "image": "https://daytrip.imgix.net/meeting-point-5.png"
  },
  "dropOffPosition": {
    "lat": 45.4374041,
    "lon": 12.3190675,
    "description": "Piazzale Roma",
    "address": "Piazzale Roma, Venice, Metropolitan City of Venice, Italy",
    "instructions": "Venice’s historic center (the islands) is not accessible by car. Our partner driver will drop you off at Piazzale Roma.",
    "image": "https://daytrip.imgix.net/meeting-point-4.png"
  },
  "trip": {
    "id": "519314e3-cd92-41e0-85b6-c652c345e9d0",
    "type": "Private",
    "englishSpeakingDriver": false,
    "distanceKm": 334,
    "travelTimeMinutes": 268,
    "pickUp": {
      "lat": 46.067648,
      "lon": 7.775185,
      "time": "2022-12-05T18:00:00Z",
      "timezone": "Europe/Zurich",
      "description": "The train station in Tasch",
      "address": "3929 Täsch, Switzerland",
      "image": "https://daytrip.imgix.net/meeting-point-5.png",
      "meetAndGreet": false,
      "state": "adjusted",
      "adjustmentReason": "restricted_area",
      "immutable": true
    },
    "dropOff": {
      "lat": 45.4374041,
      "lon": 12.3190675,
      "description": "Piazzale Roma",
      "address": "Piazzale Roma, Venice, Metropolitan City of Venice, Italy",
      "image": "https://daytrip.imgix.net/meeting-point-4.png",
      "state": "adjusted",
      "adjustmentReason": "restricted_area",
      "immutable": true
    },
    "pricing": {
      "totalPrice": 288
    },
    "vehicle": {
      "type": "Sedan",
      "maxPassengers": 3,
      "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
      "image": "https://daytrip.imgix.net/site/sedan.png"
    },
    "luggage": {
      "maxTotalCarryons": 3,
      "maxTotalSuitcases": 3
    },
    "availableChildSeatTypes": [
      {
        "childSeatType": "RearFacing",
        "description": "Rear-facing infant seat",
        "ageFrom": 0,
        "ageTo": 1,
        "weightInPoundsFrom": 0,
        "weightInPoundsTo": 26,
        "weightInKilosFrom": 0,
        "weightInKilosTo": 10
      },
      {
        "childSeatType": "ForwardFacing",
        "description": "Forward-facing w/harness",
        "ageFrom": 1,
        "ageTo": 4,
        "weightInPoundsFrom": 18,
        "weightInPoundsTo": 36,
        "weightInKilosFrom": 8,
        "weightInKilosTo": 16
      },
      {
        "childSeatType": "BoosterSeat",
        "description": "Booster seat with high back",
        "ageFrom": 4,
        "ageTo": 6,
        "weightInPoundsFrom": 30,
        "weightInPoundsTo": 50,
        "weightInKilosFrom": 14,
        "weightInKilosTo": 23
      },
      {
        "childSeatType": "Booster",
        "description": "Backless booster",
        "ageFrom": 6,
        "ageTo": 12,
        "weightInPoundsFrom": 44,
        "weightInPoundsTo": 72,
        "weightInKilosFrom": 20,
        "weightInKilosTo": 33
      }
    ],
    "includedStops": [],
    "possibleStops": []
  }
}
```

### URL path

`/partners/v3/trip/book`

### Request body

| Property           | Type                                        | Description |
| ------------------ | ------------------------------------------- | ----------- |
| optionId           | string                                      | Id of the option you want to book. Taken from [/search](#search-endpoint) or [/customize](#customize-endpoint) endpoint response. |
| departureTime      | integer                                     | Optional. Departure time as a UNIX epoch timestamp in seconds to use instead of the `departureTime` provided to the [/search](#search-endpoint). You can only move departure time less than 24 hours into the past or into the future compared to the original `departureTime`, otherwise the booking will be rejected (403 HTTP status code). Also if the new price after changing the departure time would be different, booking will also get rejected. Such price change should be extremely rare but your integration should be ready for it if you are sending different `departureTime`. Note that UNIX timestamps are UTC so you need to convert from local time to UTC when calculating it. Change of the departure time is applicable only for the private trip. |
| departureTimeLocal | integer                                     | Optional. The same as `departureTime` but the local departure time is not converted to UTC. If `departureTime` is specified, this parameter cannot be sent, and vice versa. |
| pickUpAddressNote  | string                                      | Pickup address or a note describing the pickup point. Optional, but should be provided if available at the booking time; otherwise, it should be provided via the [/update](#update-endpoint) endpoint. Applicable only for the private trip. It will be ignored if the selected trip option already has a predefined meeting position that cannot be changed (immutable), i.e. the meeting position outside of a restricted area. |
| dropOffAddressNote | string                                      | Dropoff address or a note describing the dropoff point. Optional, but should be provided if available at the booking time; otherwise, it should be provided via the [/update](#update-endpoint) endpoint. Applicable only for the private trip. It will be ignored if the selected trip option already has a predefined meeting position that cannot be changed (immutable), i.e. the meeting position outside of a restricted area. |
| customerNote       | string                                      | Optional note for the driver not related to pickup or dropoff. Applicable only for the private trip. |
| flightNumber       | string                                      | Optional flight number in case this is an airport pickup. Applicable only for the private trip. |
| passengerDetails   | list of [PassengerDetail](#passengerdetail) | List of passengers that will go on this trip. For trips with "Private" type the number of passengers must be below or equal to `maxPassengers` of the `vehicle` in the trip option. For trips with "Shared" type the number of passengers must match the `passengersCount` query parameter from the Search endpoint. There must always be exactly one passenger of type "Lead" with contact details filled. For passenger of type "Child" you must specify a child seat of proper type offered in the trip option's [availableChildSeatTypes](#tripoption). For older children that do not need any child seat use `Adult` passenger type. |
| externalId         | string                                      | Optional. You can send us the id of the booking in your system to help with communication when our support team needs to identify a booking and you are not able to provide our own `bookingReference`. |

### Response body

| Property         | Type                                         | Description                                                                                                                          |
| ---------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| bookingId        | string                                       | Id of the created booking. Can be used to retrieve details about the booking or to cancel it.                                        |
| bookingReference | string                                       | Short booking reference that can be shared with the customer in order for him to be able to contact Daytrip customer support easily. |
| departureTimeUtc | string                                       | Date and time of departure in UTC.                                                                                                   |
| originTimezone   | string                                       | IANA timezone for the origin location. Can be used to convert `departureTimeUtc` to local time.                                      |
| meetAndGreet     | boolean                                      | Specifies if meet and greet is provided for the pickup of this booking.                                                              |
| meetingPosition  | object - [MeetingPosition](#meetingposition) | Information about the meeting position, important for unreachable places or when meet and greet is not provided. Optional.           |
| dropOffPosition  | object - [DropOffPosition](#dropoffposition) | Information about the dropoff position, important for unreachable places. Optional.                                                  |
| trip             | object - [TripOption](#tripoption)           | Trip option used to make the booking.                                                                                                |

### Error status codes

| Status code | Description                                                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400         | Invalid request - missing mandatory property, property has wrong type, mismatch in passenger count, missing lead passenger, multiple lead passengers or not a valid json. |
| 401         | API key missing or invalid.                                                                                                                                               |
| 403         | Forbidden request - trying to book a trip option owned by someone else. Departure too soon. Departure time change not allowed.                                            |
| 404         | Trip option not found or expired.                                                                                                                                         |
| 409         | Trip option has already been booked. Price changed, please make a new search.                                                                                             |

## Cancel endpoint

This endpoint is used to cancel a booked trip. For private trips only trips that have departure more than 24 hours in the future can be cancelled - this threshold is a subject to change. The shared trips can be cancelled at any time before departure, and compensated according to the selected [cancellation policy](#cancellationpolicytype).

> To cancel a booked trip, use the following call:

```bash
curl -d '{ "bookingId": "cb102778-a3d7-426e-8d18-6bd6b296f283" }' \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -X POST https://papi.staging.mydaytrip.net/partners/v3/trip/cancel
```

```javascript

```

```python

```

> Example response with the penalty amount for the cancellation:

```json
{
  "penalty": 0,
  "currency": "EUR"
}
```

### URL path

`/partners/v3/trip/cancel`

### Request body

| Property  | Type   | Description                                                                        |
| --------- | ------ | ---------------------------------------------------------------------------------- |
| bookingId | string | Id of the booking to cancel. Taken from [/book](#book-endpoint) endpoint response. |

### Response body

| Property | Type   | Description                                                                                                     |
| -------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| penalty  | number | Amount of money that will be deducted from the refund. If the penalty is 0, the cancellation is free of charge. |
| currency | string | Currency of the penalty amount.                                                                                 |

### Error status codes

| Status code | Description                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------- |
| 400         | Invalid request - bookingId missing or not a valid json.                                           |
| 401         | API key missing or invalid.                                                                        |
| 403         | Forbidden request - trying to cancel a booking owned by someone else or the departure is too soon. |
| 404         | Booking not found.                                                                                 |
| 409         | Booking has already been cancelled.                                                                |

## Details endpoint

This endpoint returns details of a booked trip. It provides the status of the booking, information about the trip option and the data that were provided when booking the trip.

There are two versions of the endpoint: `/partners/v3/trip/details/boookingId` and `/partners/v3/trip/external/details/externalId`. The second version can be used to retrieve trip details by the `externalId` you provided when creating the booking. The response of both versions of the endpoint is exactly the same.

> To get details of a booked trip by `bookingId`, use the following call:

```bash
curl https://papi.staging.mydaytrip.net/partners/v3/trip/details/bookingId \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> Make sure to replace `bookingId` with the real booking id.

> To get details of a booked trip by `externalId`, use the following call:

```bash
curl https://papi.staging.mydaytrip.net/partners/v3/trip/external/details/externalId \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> Make sure to replace `externalId` with the real external id.

> Example response without meeting and dropoff positions:

```json
{
  "bookingId": "cb102786-f663-47d7-9635-7ef61a51bf29",
  "bookingReference": "CB1027",
  "status": "Confirmed",
  "createdAt": "2022-12-05T18:00:00Z",
  "passengersCount": 3,
  "currency": "EUR",
  "departureTimeUtc": "2022-12-05T18:00:00Z",
  "originTimezone": "Europe/Prague",
  "meetAndGreet": true,
  "pickUpAddressNote": "Havel airport",
  "dropOffAddressNote": "Vienna central square",
  "customerNote": "We will stand next to the entrance",
  "flightNumber": "FR008",
  "passengerDetails": [
    {
      "type": "Lead",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+41555555555",
      "email": "client-email@example.com",
      "birthday": 629424000
    },
    {
      "type": "Adult"
    },
    {
      "type": "Child",
      "childSeatType": "Booster"
    }
  ],
  "trip": {
    "type": "Private",
    "englishSpeakingDriver": true,
    "distanceKm": 334,
    "travelTimeMinutes": 268,
    "pickUp": {
      "lat": 50.1,
      "lon": 14.25,
      "time": "2022-12-05T18:00:00Z",
      "timezone": "Europe/Prague",
      "meetAndGreet": true,
      "state": "original",
      "immutable": false
    },
    "dropOff": {
      "lat": 48.2,
      "lon": 16.37,
      "state": "original",
      "immutable": false
    },
    "pricing": {
      "totalPrice": 288
    },
    "vehicle": {
      "type": "Sedan",
      "maxPassengers": 3,
      "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
      "modelDescription": "VW Passat or similar",
      "image": "https://daytrip.imgix.net/site/sedan.png"
    },
    "luggage": {
      "maxTotalCarryons": 3,
      "maxTotalSuitcases": 3
    },
    "includedStops": [
      {
        "id": "4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
        "price": 28,
        "name": "Mikulov",
        "image": "https://daytrip.imgix.net/510.jpg",
        "title": "The Heart of Czech Wine Country",
        "perex": "A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
        "description": "Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
        "durationInMinutes": 60,
        "order": 2,
        "timezone": "Europe/Prague",
        "country": {
          "englishName": "Czech Republic"
        }
      }
    ]
  }
}
```

> Example response with meeting and dropoff positions:

```json
{
  "bookingId": "72r53786-f663-47d7-9635-7ef61a51bf29",
  "bookingReference": "72R537",
  "status": "Confirmed",
  "createdAt": "2022-12-05T18:00:00Z",
  "passengersCount": 3,
  "currency": "EUR",
  "departureTimeUtc": "2022-12-05T18:00:00Z",
  "originTimezone": "Europe/Zurich",
  "meetAndGreet": false,
  "meetingPosition": {
    "lat": 46.067648,
    "lon": 7.775185,
    "description": "The train station in Tasch",
    "address": "3929 Täsch, Switzerland",
    "instructions": "As vehicle entry into Zermatt is heavily restricted, your driver will meet you nearby at the train station in Tasch, which can be reached by transit from Zermatt within about 10 minutes. Your driver will be waiting at the taxi stand just outside the entrance to the train station.",
    "image": "https://daytrip.imgix.net/meeting-point-5.png"
  },
  "dropOffPosition": {
    "lat": 45.4374041,
    "lon": 12.3190675,
    "description": "Piazzale Roma",
    "address": "Piazzale Roma, Venice, Metropolitan City of Venice, Italy",
    "instructions": "Venice’s historic center (the islands) is not accessible by car. Our partner driver will drop you off at Piazzale Roma.",
    "image": "https://daytrip.imgix.net/management/venice.png?w=480&q=50"
  },
  "pickUpAddressNote": "Zermatt",
  "dropOffAddressNote": "Venice",
  "passengerDetails": [
    {
      "type": "Lead",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+41555555555",
      "email": "client-email@example.com",
      "birthday": 629424000
    },
    {
      "type": "Adult"
    },
    {
      "type": "Child",
      "childSeatType": "Booster"
    }
  ],
  "trip": {
    "type": "Private",
    "englishSpeakingDriver": true,
    "distanceKm": 334,
    "travelTimeMinutes": 268,
    "pickUp": {
      "lat": 46.067648,
      "lon": 7.775185,
      "time": "2022-12-05T18:00:00Z",
      "timezone": "Europe/Zurich",
      "description": "The train station in Tasch",
      "address": "3929 Täsch, Switzerland",
      "image": "https://daytrip.imgix.net/meeting-point-5.png",
      "meetAndGreet": false,
      "state": "adjusted",
      "adjustmentReason": "restricted_area",
      "immutable": true
    },
    "dropOff": {
      "lat": 45.4374041,
      "lon": 12.3190675,
      "description": "Piazzale Roma",
      "address": "Piazzale Roma, Venice, Metropolitan City of Venice, Italy",
      "image": "https://daytrip.imgix.net/meeting-point-4.png",
      "state": "adjusted",
      "adjustmentReason": "restricted_area",
      "immutable": true
    },
    "pricing": {
      "totalPrice": 1311
    },
    "vehicle": {
      "type": "Sedan",
      "maxPassengers": 3,
      "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
      "modelDescription": "VW Passat or similar",
      "image": "https://daytrip.imgix.net/site/sedan.png"
    },
    "luggage": {
      "maxTotalCarryons": 3,
      "maxTotalSuitcases": 3
    },
    "includedStops": []
  }
}
```

### URL path

`/partners/v3/trip/details/bookingId`

OR

`/partners/v3/trip/external/details/externalId`

Replace `bookingId`/`externalId` with the id of the booking you want to retrieve details for.

### Response body

| Property           | Type                                         | Description                                                                                                                                                           |
| ------------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bookingId          | string                                       | Unique id of the booking.                                                                                                                                             |
| bookingReference   | string                                       | Short booking reference that can be shared with the customer in order for him to be able to contact Daytrip customer support easily.                                  |
| externalId         | string                                       | Optional. If you sent the `externalId` parameter to the [/book](#book-endpoint) endpoint it will be returned here.                                                    |
| status             | string                                       | Booking status. "Confirmed" or "Cancelled".                                                                                                                           |
| createdAt          | string                                       | UTC timestamp of when this booking was created.                                                                                                                       |
| cancelledAt        | string                                       | UTC timestamp of when this booking was cancelled. Optional.                                                                                                           |
| passengersCount    | integer                                      | The count of passengers this booking is for.                                                                                                                          |
| currency           | string                                       | Currency used for all prices in this response.                                                                                                                        |
| departureTimeUtc   | string                                       | Date and time of departure in UTC. This reflects possible changes made by customer support.                                                                           |
| originTimezone     | string                                       | IANA timezone for the origin location. Can be used to convert `departureTimeUtc` to local time.                                                                       |
| meetAndGreet       | boolean                                      | Specifies if meet and greet is provided for the pickup of this booking.                                                                                               |
| meetingPosition    | object - [MeetingPosition](#meetingposition) | Information about the meeting position, important for unreachable places or when meet and greet is not provided. Optional.                                            |
| dropOffPosition    | object - [DropOffPosition](#dropoffposition) | Information about the dropoff position, important for unreachable places. Optional.                                                                                   |
| pickUpAddressNote  | string                                       | Pickup address or a note describing the pickup point. Optional, but should be provided it it was unknown at the booking time. Applicable only for the private trip.   |
| dropOffAddressNote | string                                       | Dropoff address or a note describing the dropoff point. Optional, but should be provided it it was unknown at the booking time. Applicable only for the private trip. |
| customerNote       | string                                       | Optional note for the driver not related to pickup or dropoff.                                                                                                        |
| flightNumber       | string                                       | Optional flight number in case this is an airport pickup.                                                                                                             |
| passengerDetails   | list of [PassengerDetail](#passengerdetail)  | List of passengers that will go on this trip.                                                                                                                         |
| trip               | object - [TripOption](#tripoption)           | Information about the trip. This does not reflect changes made after the booking was created.                                                                         |

### Error status codes

| Status code | Description                                                                   |
| ----------- | ----------------------------------------------------------------------------- |
| 401         | API key missing or invalid.                                                   |
| 403         | Forbidden request - trying to get details of a booking owned by someone else. |
| 404         | Booking not found.                                                            |

## Update endpoint

This endpoint is used to update minor details of an existing booking. If you want to change departure time or add/remove stops you need to cancel the booking and create it again as it can affect the price. The response of the endpoint are the details of the updated booking, in the same format as the [/details](#details-endpoint) endpoint.

> To update passenger details and customer note of a booked trip, use the following call:

```bash
curl -d '{
  "bookingId": "cb102778-a3d7-426e-8d18-6bd6b296f283",
  "customerNote": "We will wait inside the Airport building",
  "passengerDetails": [
    {
      "type": "Lead",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+4166666666",
      "email": "client-email@example.com",
      "birthday": 629424000
    },
    { "type": "Adult" },
    {
      "type": "Child",
      "childSeatType": "BoosterSeat"
    }
  ]
}' \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -X POST https://papi.staging.mydaytrip.net/partners/v3/trip/update
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
  "bookingId": "cb102786-f663-47d7-9635-7ef61a51bf29",
  "bookingReference": "CB1027",
  "status": "Confirmed",
  "createdAt": "2022-12-05T18:00:00Z",
  "passengersCount": 3,
  "currency": "EUR",
  "departureTimeUtc": "2022-12-05T18:00:00Z",
  "originTimezone": "Europe/Prague",
  "meetAndGreet": true,
  "pickUpAddressNote": "Havel airport",
  "dropOffAddressNote": "Vienna central square",
  "customerNote": "We will wait inside the Airport building",
  "flightNumber": "FR008",
  "passengerDetails": [
    {
      "type": "Lead",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+4166666666",
      "email": "client-email@example.com",
      "birthday": 629424000
    },
    {
      "type": "Adult"
    },
    {
      "type": "Child",
      "childSeatType": "BoosterSeat"
    }
  ],
  "trip": {
    "type": "Private",
    "englishSpeakingDriver": true,
    "distanceKm": 334,
    "travelTimeMinutes": 268,
    "pickUp": {
      "lat": 50.1,
      "lon": 14.25,
      "time": "2022-12-05T18:00:00Z",
      "timezone": "Europe/Prague",
      "meetAndGreet": true,
      "state": "original",
      "immutable": false
    },
    "dropOff": {
      "lat": 48.2,
      "lon": 16.37,
      "state": "original",
      "immutable": false
    },
    "pricing": {
      "totalPrice": 288
    },
    "vehicle": {
      "type": "Sedan",
      "maxPassengers": 3,
      "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
      "modelDescription": "VW Passat or similar",
      "image": "https://daytrip.imgix.net/site/sedan.png"
    },
    "luggage": {
      "maxTotalCarryons": 3,
      "maxTotalSuitcases": 3
    },
    "includedStops": [
      {
        "id": "4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
        "price": 28,
        "name": "Mikulov",
        "image": "https://daytrip.imgix.net/510.jpg",
        "title": "The Heart of Czech Wine Country",
        "perex": "A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
        "description": "Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
        "durationInMinutes": 60,
        "order": 2,
        "timezone": "Europe/Prague",
        "country": {
          "englishName": "Czech Republic"
        }
      }
    ]
  }
}
```

### URL path

`/partners/v3/trip/update`

### Request body

All properties except `bookingId` are optional. When a property is not included in the request it won't be updated and it will keep it's previous value. If you want to remove a property value like `customerNote` then send an empty string `""` as the value. If you want to make changes to any passenger you need to provide full `passengerDetails` array - it's not possible to send only details of the passenger you want to update.

Disclaimer: in the last 24 hours before the departure the [/update](#update-endpoint) endpoint will no longer accept updates. For updates in the last 24 hours please contact our customer support at <daytrip@mydaytrip.com> or call [+44 20 3318 1119](tel:+442033181119).

| Property           | Type                                        | Description |
| ------------------ | ------------------------------------------- | ----------- |
| bookingId          | string                                      | Id of the booking to cancel. Taken from [/book](#book-endpoint) endpoint response. |
| pickUpAddressNote  | string                                      | Pickup address or a note describing the pickup point. Optional, but should be provided if it was not provided at the booking time. Applicable only for the private trip. It will be ignored if the selected trip option already has a predefined meeting position that cannot be changed (immutable), i.e. the meeting position outside of a restricted area. |
| dropOffAddressNote | string                                      | Dropoff address or a note describing the dropoff point. Optional, but should be provided if it was not provided at the booking time. Applicable only for the private trip. It will be ignored if the selected trip option already has a predefined meeting position that cannot be changed (immutable), i.e. the meeting position outside of a restricted area. |
| customerNote       | string                                      | Optional note for the driver not related to pickup or dropoff. |
| flightNumber        | string                                      | Optional flight number in case this is an airport pickup. |
| passengerDetails   | list of [PassengerDetail](#passengerdetail) | Optional. List of passengers that will go on this trip. For trips with "Private" type the number of passengers must be below or equal to `maxPassengers` of the `vehicle` in the trip option. For trips with "Shared" type the number of passengers must match the `passengersCount` query parameter from the Search endpoint. There must always be exactly one passenger of type "Lead" with contact details filled. For passenger of type "Child" you must specify a child seat of proper type offered in the trip option's [availableChildSeatTypes](#tripoption). For older children that do not need any child seat use `Adult` passenger type. |

### Response body

| Property           | Type                                         | Description                                                                                                                          |
| ------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| bookingId          | string                                       | Unique id of the booking.                                                                                                            |
| bookingReference   | string                                       | Short booking reference that can be shared with the customer in order for him to be able to contact Daytrip customer support easily. |
| externalId         | string                                       | Optional. If you sent the `externalId` parameter to the [/book](#book-endpoint) endpoint it will be returned here.                   |
| status             | string                                       | Booking status. "Confirmed" or "Cancelled".                                                                                          |
| createdAt          | string                                       | UTC timestamp of when this booking was created.                                                                                      |
| cancelledAt        | string                                       | UTC timestamp of when this booking was cancelled. Optional.                                                                          |
| passengersCount    | integer                                      | The count of passengers this booking is for.                                                                                         |
| currency           | string                                       | Currency used for all prices in this response.                                                                                       |
| departureTimeUtc   | string                                       | Date and time of departure in UTC. This reflects possible changes made by customer support.                                          |
| originTimezone     | string                                       | IANA timezone for the origin location. Can be used to convert `departureTimeUtc` to local time.                                      |
| meetAndGreet       | boolean                                      | Specifies if meet and greet is provided for the pickup of this booking.                                                              |
| meetingPosition    | object - [MeetingPosition](#meetingposition) | Information about the meeting position, important for unreachable places or when meet and greet is not provided. Optional.           |
| dropOffPosition    | object - [DropOffPosition](#dropoffposition) | Information about the dropoff position, important for unreachable places. Optional.                                                  |
| pickUpAddressNote  | string                                       | Pickup address or a note describing the pickup point. Optional.                                                                      |
| dropOffAddressNote | string                                       | Dropoff address or a note describing the dropoff point. Optional.                                                                    |
| customerNote       | string                                       | Optional note for the driver not related to pickup or dropoff.                                                                       |
| flightNumber       | string                                       | Optional flight number in case this is an airport pickup.                                                                            |
| passengerDetails   | list of [PassengerDetail](#passengerdetail)  | List of passengers that will go on this trip.                                                                                        |
| trip               | object - [TripOption](#tripoption)           | Information about the trip. This does not reflect changes made after the booking was created.                                        |

### Error status codes

| Status code | Description                                                                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400         | Invalid request - missing mandatory property, property has wrong type, mismatch in passenger count, missing lead passenger, multiple lead passengers or not a valid json. |
| 401         | API key missing or invalid.                                                                                                                                               |
| 403         | Forbidden request - trying to update details of a booking owned by someone else or trying to update a trip in the last 24 hours before departure.                         |
| 404         | Booking not found.                                                                                                                                                        |
| 409         | Trying to update a cancelled booking.                                                                                                                                     |

## Tracking endpoint

This endpoint allows you to retrieve the latest position of driver(s) assigned to the trip. Not every trip is guaranteed to have driver tracking. Use the [/drivers](#drivers-endpoint) endpoint to retrieve the details about the drivers and the vehicles. That information can be cached and does not need to be retrieved with every tracking request.

> To get driver position(s) of a trip currently in progress, use the following call:

```bash
curl https://papi.staging.mydaytrip.net/partners/v3/trip/tracking/bookingId \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> Make sure to replace `bookingId` with the real booking id.

> Example response for a trip served by one driver:

```json
{
  "driverPositions": [
    {
      "timestamp": "2023-12-04T18:00:00Z",
      "driverId": "4381b73d-be1d-4d7d-bf7c-cdde5292c1b9",
      "position": {
        "lat": 50.09298565485293,
        "lon": 14.453347220812443
      }
    }
  ]
}
```

> Example response for a trip where tracking did not start yet:

```json
{
  "driverPositions": []
}
```

> Example response for a trip served by two drivers:

```json
{
  "driverPositions": [
    {
      "timestamp": "2023-12-04T18:00:00Z",
      "driverId": "4381b73d-be1d-4d7d-bf7c-cdde5292c1b9",
      "position": {
        "lat": 50.09298565485293,
        "lon": 14.453347220812443
      }
    },
    {
      "timestamp": "2023-12-04T18:01:00Z",
      "driverId": "52443e97-dd86-477a-927a-8fc9fa786797",
      "position": {
        "lat": 50.08213692331847,
        "lon": 14.433944045117011
      }
    }
  ]
}
```

### URL path

`/partners/v3/trip/tracking/bookingId`

Replace `bookingId` with the id of the booking you want to track.

### Response body

| Property        | Type                                      | Description                                    |
| --------------- | ----------------------------------------- | ---------------------------------------------- |
| driverPositions | list of [DriverPosition](#driverposition) | List of latest driver positions for this trip. |

### Error status codes

| Status code | Description                                                          |
| ----------- | -------------------------------------------------------------------- |
| 401         | API key missing or invalid.                                          |
| 403         | Forbidden request - trying to track a booking owned by someone else. |
| 404         | Booking not found.                                                   |

## Drivers endpoint

This endpoint allows you to retrieve the information about driver(s) and vehicle(s) currently assigned to the trip. The assigned driver might change so it is recommended to pass this information to the customer only few days before the trip and give him an update if the response of this endpoint changes. The `driverId` returned by this endpoint is the same as the `driverId` returned by the [/tracking](#tracking-endpoint) endpoint and can be used to identify which driver is at which position in case of trips with multiple drivers.

Proposed frequency of calling this endpoint depending on the time before the departure time:

- the first check is ideal to do 48 hours before the departure;
- in the period 48-24 hours before the departure, it is recommended to check the assigned drivers every 4 hours;
- in the last 24 hours before the departure, it is recommended to check the assigned drivers every hour.

> To get drivers currently assigned to a trip

```bash
curl https://papi.staging.mydaytrip.net/partners/v3/trip/drivers/bookingId \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> Make sure to replace `bookingId` with the real booking id.

> Example response for a trip served by one driver:

```json
{
  "assignedDrivers": [
    {
      "driverId": "4381b73d-be1d-4d7d-bf7c-cdde5292c1b9",
      "name": "John Doe",
      "phoneNumber": "+1 628 201 9501",
      "profilePhoto": "link to image of driver's profile photo",
      "vehicle": {
        "title": "Mercedes-Benz E-class",
        "color": "Black",
        "licensePlate": "XXXXXX"
      }
    }
  ]
}
```

> Example response for a trip that doesn't have any assigned driver yet:

```json
{
  "assignedDrivers": []
}
```

> Example response for a trip served by two drivers:

```json
{
  "assignedDrivers": [
    {
      "driverId": "4381b73d-be1d-4d7d-bf7c-cdde5292c1b9",
      "name": "John Doe",
      "phoneNumber": "+1 628 201 9501",
      "profilePhoto": "link to driver's profile photo image",
      "vehicle": {
        "title": "Mercedes-Benz E-class",
        "color": "Black",
        "licensePlate": "XXXXXX"
      }
    },
    {
      "driverId": "52443e97-dd86-477a-927a-8fc9fa786797",
      "name": "Jack Smith",
      "phoneNumber": "+1 628 201 9501",
      "vehicle": {
        "title": "BMW 5 Series"
      }
    }
  ]
}
```

### URL path

`/partners/v3/trip/drivers/bookingId`

Replace `bookingId` with the id of the booking you want to retrieve drivers and vehicles for.

### Response body

| Property        | Type                      | Description                                      |
| --------------- | ------------------------- | ------------------------------------------------ |
| assignedDrivers | list of [Driver](#driver) | List of drivers currently assigned to this trip. |

### Error status codes

| Status code | Description                                                                         |
| ----------- | ----------------------------------------------------------------------------------- |
| 401         | API key missing or invalid.                                                         |
| 403         | Forbidden request - trying to retrieve drivers for a booking owned by someone else. |
| 404         | Booking not found.                                                                  |

# Trip API Entities

Below is a documentation of all object entities returned by the Daytrip API endpoints.

## TripOption

| Property                | Type                                                     | Description                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id                      | string                                                   | Unique id of the trip option. Used to customize or book this option.                                                                                                     |
| type                    | string                                                   | Type of this option. "Private" or "Shared" (predefined shuttle trips).                                                                                                   |
| englishSpeakingDriver   | boolean                                                  | Specifies if this option includes an English speaking driver.                                                                                                            |
| distanceKm              | number                                                   | Length of the trip.                                                                                                                                                      |
| travelTimeMinutes       | number                                                   | Expected duration of the trip in minutes.                                                                                                                                |
| pickUp                  | object - [Location](#location)                           | Details about the pickup point.                                                                                                                                          |
| dropOff                 | object - [Location](#location)                           | Details about the dropoff point.                                                                                                                                         |
| pricing                 | object - [Pricing](#pricing)                             | Details about the pricing.                                                                                                                                               |
| vehicle                 | object - [Vehicle](#vehicle)                             | Details about the vehicle. Defined only if `includeMultipleVehicles` set to `false` or not defined.                                                                      |
| vehicles                | list of [Vehicle](#vehicle)                              | Details about vehicles. Defined only if `includeMultipleVehicles` set to `true`.                                                                                         |
| luggage                 | object - [Luggage](#luggage)                             | Details about the luggage.                                                                                                                                               |
| seatsAvailable          | integer                                                  | Number of available seats in the shared shuttle. Optional.                                                                                                               |
| availableChildSeatTypes | list of [ChildSeatType](#childseattype)                  | List of available child seat types for this trip.                                                                                                                        |
| possibleStops           | list of [Stop](#stop)                                    | Stops that can be added to this trip option.                                                                                                                             |
| includedStops           | list of [Stop](#stop)                                    | Stops that are already included in this option.                                                                                                                          |
| cancellationPolicy      | one of [CancellationPolicyType](#cancellationpolicytype) | Cancellation policy for this trip option. Optional. Populated only for shared trips.                                                                                     |
| expiresAt               | string                                                   | UTC timestamp of when this offer expires. After this time it is no longer possible to book it, you need to make a new search. Optional. Populated only for shared trips. |

## Location

| Property         | Type                                   | Description |
| ---------------- | -------------------------------------- | ----------- |
| lat              | number                                 | Latitude in degrees. |
| lon              | number                                 | Longitude in degrees. |
| time             | string                                 | UTC timestamp of the departure or arrival time. Optional. For pickup only in case of the private trip. Always present for shared trips. |
| interval         | object - [TimeInterval](#timeinterval) | Estimated departure or arrival interval. Optional, for shared trips only. |
| timezone         | string                                 | IANA timezone matching the location. Presents if `time` or `interval` are present. Can be used to convert UTC timestamps from `time`/`interval` to local time. |
| description      | string                                 | Description of the pickup or dropoff. Optional. |
| address          | string                                 | Address of the pickup or dropoff. Optional. |
| image            | string                                 | Link to an image of the position. Optional. |
| meetAndGreet     | boolean                                | Specifies if meet and greet is provided for this pickup. Optional, for pickup only. |
| state            | string                                 | Represents a state of the location: `original` - customer provided; or `adjusted` - differs from the pickup or dropoff requested by the customer. |
| adjustmentReason | string                                 | Reason for the adjustment of the pickup or dropoff. Optional. Possible values: `restricted_area`, `airport_pickup`. |
| immutable        | boolean                                | Specifies if the pickup or dropoff position can be changed. If `true` then the position is predefined and cannot be changed. |

## TimeInterval

| Property | Type   | Description                                 |
| -------- | ------ | ------------------------------------------- |
| earliest | string | UTC timestamp of the start of the interval. |
| latest   | string | UTC timestamp of the end of the interval.   |

## Pricing

| Property          | Type   | Description                                                    |
| ----------------- | ------ | -------------------------------------------------------------- |
| totalPrice        | number | Total price of this option based on requested passenger count. |
| pricePerPassenger | number | Price per passenger. Optional, for shared options only.        |

## Vehicle

| Property         | Type    | Description                                                                                                           |
| ---------------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| type             | string  | Type of vehicle. "Sedan", "MPV", "Van", "Luxury" or "Shuttle"                                                         |
| maxPassengers    | integer | Maximum number of passengers that can take a trip in this vehicle.                                                    |
| description      | string  | Complete description of the vehicle type.                                                                             |
| modelDescription | string  | Models that the vehicle is similar to.                                                                                |
| image            | string  | Link to an illustrative image of the vehicle type. Not an image of the exact vehicle that will be used for this trip. |

## Luggage

| Property              | Type    | Description                                                                                                    |
| --------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| maxTotalCarryons      | integer | Maximum amount of carry-on luggage that passengers can bring on this trip.                                     |
| maxTotalSuitcases     | integer | Maximum amount of suitcases that passengers can bring on this trip.                                            |
| maxCarryonsPerPerson  | integer | Maximum amount of carry-on luggage that one passenger can bring on this trip. Optional, for shared trips only. |
| maxSuitcasesPerPerson | integer | Maximum amount of suitcases that one passenger can bring on this trip. Optional, for shared trips only.        |

## ChildSeatType

| Property           | Type    | Description                                                                       |
| ------------------ | ------- | --------------------------------------------------------------------------------- |
| childSeatType      | string  | Type of the child seat. "RearFacing", "ForwardFacing", "BoosterSeat" or "Booster" |
| description        | string  | Description of the child seat type.                                               |
| ageFrom            | integer | Minimum age in years of a child that this seat type is suitable for.              |
| ageTo              | integer | Maximum age in years of a child that this seat type is suitable for.              |
| weightInPoundsFrom | integer | Minimum weight in pounds of a child that this seat type is suitable for.          |
| weightInPoundsTo   | integer | Maximum weight in pounds of a child that this seat type is suitable for.          |
| weightInKilosFrom  | integer | Minimum weight in kilograms of a child that this seat type is suitable for.       |
| weightInKilosTo    | integer | Maximum weight in kilograms of a child that this seat type is suitable for.       |

## Stop

| Property          | Type                         | Description                                                                                                                                            |
| ----------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id                | string                       | Id of the stop. Used for adding stops to a trip option.                                                                                                |
| price             | number                       | Price of the stop. If the stop is in `includedStops` then this price is already part of `totalPrice` under `pricing` of the [TripOption](#tripoption). |
| name              | string                       | Name of the stop.                                                                                                                                      |
| image             | string                       | Link to the image of the stop.                                                                                                                         |
| title             | string                       | Title of the stop description.                                                                                                                         |
| perex             | string                       | Perex of the stop description.                                                                                                                         |
| description       | string                       | The stop description.                                                                                                                                  |
| durationInMinutes | integer                      | Expected duration of the stop.                                                                                                                         |
| order             | integer                      | Order of this stop on this trip.                                                                                                                       |
| timezone          | string                       | IANA timezone matching the location of the stop.                                                                                                       |
| country           | object - [Country](#country) | Details about the country where the stop is located.                                                                                                   |

## Country

| Property    | Type   | Description                     |
| ----------- | ------ | ------------------------------- |
| englishName | string | Name of the country in English. |

## PassengerDetail

| Property      | Type    | Description                                                                                                                                                                           |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type          | string  | Type of the passenger. "Lead", "Adult" or "Child"                                                                                                                                     |
| firstName     | string  | First name of the passenger - required the for lead passenger.                                                                                                                        |
| lastName      | string  | Last name of the passenger - required for the lead passenger.                                                                                                                         |
| phone         | string  | Phone number of the passenger - required for the lead passenger. Include country prefix.                                                                                              |
| email         | string  | Email of the passenger - required for the lead passenger.                                                                                                                             |
| birthday      | integer | Birthday of the passenger - required for the lead passenger. UNIX epoch timestamp in seconds.                                                                                         |
| childSeatType | string  | Requested child seat type for a passenger of type "Child". Must match one of offered child seat types from [availableChildSeatTypes](#tripoption) of the trip option you are booking. |

## MeetingPosition

| Property     | Type   | Description                                 |
| ------------ | ------ | ------------------------------------------- |
| lat          | number | Latitude in degrees.                        |
| lon          | number | Longitude in degrees.                       |
| description  | string | Description of the position.                |
| instructions | string | Meeting instructions for the customer.      |
| address      | string | Address of the position. Optional.          |
| image        | string | Link to an image of the position. Optional. |

## DropOffPosition

| Property    | Type   | Description                                 |
| ----------- | ------ | ------------------------------------------- |
| lat         | number | Latitude in degrees.                        |
| lon         | number | Longitude in degrees.                       |
| description | string | Description of the position.                |
| address     | string | Address of the position. Optional.          |
| image       | string | Link to an image of the position. Optional. |

## DriverPosition

| Property  | Type                           | Description                                                                                                                                                                                                           |
| --------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| timestamp | string                         | UTC timestamp of when this position was reported by the driver.                                                                                                                                                       |
| driverId  | string                         | Unique id of the driver. To distinguish the drivers for trips with multiple drivers. Use the [/drivers](#drivers-endpoint) endpoint to retrieve the details about the drivers and vehicles and match them by this id. |
| position  | object - [Position](#position) | Last reported position of the driver.                                                                                                                                                                                 |

## Position

| Property | Type   | Description           |
| -------- | ------ | --------------------- |
| lat      | number | Latitude in degrees.  |
| lon      | number | Longitude in degrees. |

## Driver

| Property     | Type                                       | Description                                                                 |
| ------------ | ------------------------------------------ | --------------------------------------------------------------------------- |
| driverId     | string                                     | Unique id of the driver. Used to match driver position with driver details. |
| name         | string                                     | Name of the driver.                                                         |
| phoneNumber  | string                                     | Phone number of the driver including country code.                          |
| profilePhoto | string                                     | Optional. Link to driver's profile photo if available.                      |
| vehicle      | object - [DriversVehicle](#driversvehicle) | Information about driver's vehicle.                                         |

## DriversVehicle

| Property     | Type   | Description                                      |
| ------------ | ------ | ------------------------------------------------ |
| title        | string | Make and model of the vehicle.                   |
| color        | string | Optional. Color of the vehicle if known.         |
| licensePlate | string | Optional. Licence plate of the vehicle if known. |

## CancellationPolicyType

| Property      | Type   | Description                                        |
| ------------- | ------ | -------------------------------------------------- |
| NonRefundable | string | No refunds for cancellations.                      |
| Flexible      | string | 100% refundable up to 24 hours before departure.   |
| SuperFlexible | string | 100% refundable up to 15 minutes before departure. |
