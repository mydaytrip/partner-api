# Trip API

A trip is a representation of passenger transportation from point A to point B. Each search will usually return multiple trip options that can be booked. Options can differ by vehicle type or by being private or shared with other travelers. Shared trips have predefined pick up and drop off points and departure times. For private trips pick up and drop off points as well as departure time are matching the search request. Private trips can also be customized by adding stops if available.

## Flows

Trip API can be used to search for trip options, customizing an option with stops and then booking the option. 

### Simple trip

A typical simple flow without stop customization would look like this:

1. call [/search](#search-endpoint) endpoint to get possible options
2. call [/book](#book-endpoint) endpoint to book the chosen option
3. `optional` - call [/details](#details-endpoint) endpoint to get trip and booking details

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

If you want to change departure time or add/remove stops you need to cancel the booking and create it again as it can affect the price. For small adjustments like changing passenger phone number, email, child seat type, pick up and drop off address notes (within the scope of original search coordinates), customer note or flight number you can use the [/update](#update-endpoint) endpoint:

1. call [/search](#search-endpoint) endpoint to get possible options
2. call [/book](#book-endpoint) endpoint to book the chosen option
3. `optional` - call [/details](#details-endpoint) endpoint to get trip and booking details
4. call [/update](#update-endpoint) endpoint to update the booking details

Disclaimer: in the last 24 hours before the departure the [/update](#update-endpoint) endpoint will no longer accept updates. For updates in the last 24 hours please contact our customer support at <daytrip@mydaytrip.com> or call [+44 20 3318 1119](tel:+442033181119).

## Search endpoint

This endpoint returns all trip options for given origin, destination, departure time and passenger count (must be between 1 and 10). Origin and destination are passed as latitude and longitude coordinates. The unit used is degree with decimal places, for example `39.753657, -117.610215`. Departure time is passed as a UNIX epoch timestamp in seconds, like `1679463169`. Note that UNIX timestamps are UTC so you need to convert from local time to UTC when calculating it.

> To search for a trip from Prague to Vienna for two passengers, use this call:

```bash
curl "https://api.staging.mydaytrip.net/partners/v3/trip/search?originLongitude=14.2559&originLatitude=50.10&destinationLongitude=16.3738&destinationLatitude=48.2082&departureTime=1766227088&passengersCount=3"
  -H "x-api-key: your-api-key"
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
   "searchId":"f0e34a1b-2b3d-4747-b426-292633b615b4",
   "expiresAt": "2022-12-04T18:00:00Z",
   "passengersCount":3,
   "currency":"EUR",
   "options":[
      {
         "id":"1d32109f-c2e2-44fe-b2cf-461ef3730541",
         "type":"Private",
         "englishSpeakingDriver": true,
         "distanceKm":334,
         "travelTimeMinutes":208,
         "pickUp":{
            "lat":50.10,
            "lon":14.25,
            "time":"2022-12-05T18:00:00Z"
         },
         "dropOff":{
            "lat":48.20,
            "lon":16.37
         },
         "pricing":{
            "totalPrice":260
         },
         "vehicle":{
            "type":"Sedan",
            "maxPassengers":3,
            "description":"Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
            "image":"https://daytrip.imgix.net/site/sedan.png"
         },
         "luggage":{
            "maxTotalCarryons":3,
            "maxTotalSuitcases":3
         },
         "availableChildSeatTypes":[
            {
               "childSeatType":"RearFacing",
               "description":"Rear-facing infant seat",
               "ageFrom":0,
               "ageTo":1,
               "weightInPoundsFrom":0,
               "weightInPoundsTo":26,
               "weightInKilosFrom":0,
               "weightInKilosTo":10
            },
            {
               "childSeatType":"ForwardFacing",
               "description":"Forward-facing w/harness",
               "ageFrom":1,
               "ageTo":4,
               "weightInPoundsFrom":18,
               "weightInPoundsTo":36,
               "weightInKilosFrom":8,
               "weightInKilosTo":16
            },
            {
               "childSeatType":"BoosterSeat",
               "description":"Booster seat with high back",
               "ageFrom":4,
               "ageTo":6,
               "weightInPoundsFrom":30,
               "weightInPoundsTo":50,
               "weightInKilosFrom":14,
               "weightInKilosTo":23
            },
            {
               "childSeatType":"Booster",
               "description":"Backless booster",
               "ageFrom":6,
               "ageTo":12,
               "weightInPoundsFrom":44,
               "weightInPoundsTo":72,
               "weightInKilosFrom":20,
               "weightInKilosTo":33
            }
         ],
         "possibleStops":[
            {
               "id":"d280ce2a-6224-4d95-af17-a250f81b97dd",
               "price":31,
               "name":"Lednice Chateau and Park",
               "image":"https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
               "title":"Vacation like a King",
               "perex":"This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
               "description":"The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
               "durationInMinutes":60,
               "order":1,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
               }
            },
            {
               "id":"4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
               "price":28,
               "name":"Mikulov",
               "image":"https://daytrip.imgix.net/510.jpg",
               "title":"The Heart of Czech Wine Country",
               "perex":"A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
               "description":"Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
               "durationInMinutes":60,
               "order":2,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
               }
            }
         ]
      },
      {
         "id":"054ee064-d4dd-492f-9d0a-5251a7f791c2",
         "type":"Private",
         "englishSpeakingDriver": false,
         "distanceKm":334,
         "travelTimeMinutes":208,
         "pickUp":{
            "lat":50.10,
            "lon":14.25,
            "time":"2022-12-05T18:00:00Z"
         },
         "dropOff":{
            "lat":48.20,
            "lon":16.37
         },
         "pricing":{
            "totalPrice":240
         },
         "vehicle":{
            "type":"Sedan",
            "maxPassengers":3,
            "description":"Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
            "image":"https://daytrip.imgix.net/site/sedan.png"
         },
         "luggage":{
            "maxTotalCarryons":3,
            "maxTotalSuitcases":3
         },
         "availableChildSeatTypes":[
            {
               "childSeatType":"RearFacing",
               "description":"Rear-facing infant seat",
               "ageFrom":0,
               "ageTo":1,
               "weightInPoundsFrom":0,
               "weightInPoundsTo":26,
               "weightInKilosFrom":0,
               "weightInKilosTo":10
            },
            {
               "childSeatType":"ForwardFacing",
               "description":"Forward-facing w/harness",
               "ageFrom":1,
               "ageTo":4,
               "weightInPoundsFrom":18,
               "weightInPoundsTo":36,
               "weightInKilosFrom":8,
               "weightInKilosTo":16
            },
            {
               "childSeatType":"BoosterSeat",
               "description":"Booster seat with high back",
               "ageFrom":4,
               "ageTo":6,
               "weightInPoundsFrom":30,
               "weightInPoundsTo":50,
               "weightInKilosFrom":14,
               "weightInKilosTo":23
            },
            {
               "childSeatType":"Booster",
               "description":"Backless booster",
               "ageFrom":6,
               "ageTo":12,
               "weightInPoundsFrom":44,
               "weightInPoundsTo":72,
               "weightInKilosFrom":20,
               "weightInKilosTo":33
            }
         ],
         "possibleStops":[
            {
               "id":"d280ce2a-6224-4d95-af17-a250f81b97dd",
               "price":31,
               "name":"Lednice Chateau and Park",
               "image":"https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
               "title":"Vacation like a King",
               "perex":"This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
               "description":"The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
               "durationInMinutes":60,
               "order":1,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
               }
            },
            {
               "id":"4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
               "price":28,
               "name":"Mikulov",
               "image":"https://daytrip.imgix.net/510.jpg",
               "title":"The Heart of Czech Wine Country",
               "perex":"A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
               "description":"Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
               "durationInMinutes":60,
               "order":2,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
               }
            }
         ]
      },
      {
         "id":"b071e9f8-54d9-44be-bb5f-feae5aafd771",
         "type":"Private",
         "englishSpeakingDriver": true,
         "distanceKm":334,
         "travelTimeMinutes":208,
         "pickUp":{
            "lat":50.10,
            "lon":14.25,
            "time":"2022-12-05T18:00:00Z"
         },
         "dropOff":{
            "lat":48.20,
            "lon":16.37
         },
         "pricing":{
            "totalPrice":320
         },
         "vehicle":{
            "type":"MPV",
            "maxPassengers":4,
            "description":"Compact MPV comparable to a Volkswagen Touran, up to 4 passengers with luggage.",
            "image":"https://daytrip.imgix.net/site/mpv.png"
         },
         "luggage":{
            "maxTotalCarryons":4,
            "maxTotalSuitcases":4
         },
         "availableChildSeatTypes":[
            {
               "childSeatType":"RearFacing",
               "description":"Rear-facing infant seat",
               "ageFrom":0,
               "ageTo":1,
               "weightInPoundsFrom":0,
               "weightInPoundsTo":26,
               "weightInKilosFrom":0,
               "weightInKilosTo":10
            },
            {
               "childSeatType":"ForwardFacing",
               "description":"Forward-facing w/harness",
               "ageFrom":1,
               "ageTo":4,
               "weightInPoundsFrom":18,
               "weightInPoundsTo":36,
               "weightInKilosFrom":8,
               "weightInKilosTo":16
            },
            {
               "childSeatType":"BoosterSeat",
               "description":"Booster seat with high back",
               "ageFrom":4,
               "ageTo":6,
               "weightInPoundsFrom":30,
               "weightInPoundsTo":50,
               "weightInKilosFrom":14,
               "weightInKilosTo":23
            },
            {
               "childSeatType":"Booster",
               "description":"Backless booster",
               "ageFrom":6,
               "ageTo":12,
               "weightInPoundsFrom":44,
               "weightInPoundsTo":72,
               "weightInKilosFrom":20,
               "weightInKilosTo":33
            }
         ],
         "possibleStops":[
            {
               "id":"d280ce2a-6224-4d95-af17-a250f81b97dd",
               "price":31,
               "name":"Lednice Chateau and Park",
               "image":"https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
               "title":"Vacation like a King",
               "perex":"This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
               "description":"The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
               "durationInMinutes":60,
               "order":1,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
               }
            },
            {
               "id":"4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
               "price":28,
               "name":"Mikulov",
               "image":"https://daytrip.imgix.net/510.jpg",
               "title":"The Heart of Czech Wine Country",
               "perex":"A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
               "description":"Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
               "durationInMinutes":60,
               "order":2,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
               }
            }
         ]
      },
      {
         "id":"282a8a94-2a18-42f6-9af6-c53b13d007cb",
         "type":"Shared",
         "englishSpeakingDriver": true,
         "distanceKm":350,
         "travelTimeMinutes":235,
         "pickUp":{
            "lat":50.12,
            "lon":14.27,
            "time":"2022-12-05T19:00:00Z",
            "description":"In front of the hotel Europa"
         },
         "dropOff":{
            "lat":48.21,
            "lon":16.36,
            "description":"Next to the railway station"
         },
         "pricing":{
            "pricePerPassenger":180,
            "totalPrice":360
         },
         "vehicle":{
            "type":"Shuttle",
            "maxPassengers":10,
            "description":"Shuttle comparable to a Mercedes-Benz Vito, up to 10 passengers with luggage.",
            "image":"https://daytrip.imgix.net/site/shuttle.png"
         },
         "luggage":{
            "maxCarryonsPerPerson":1,
            "maxSuitcasesPerPerson":1,
            "maxTotalCarryons":2,
            "maxTotalSuitcases":2
         },
         "seatsAvailable":8,
         "availableChildSeatTypes":[
            
         ],
         "possibleStops":[
            
         ]
      },
      {
         "id":"4b137906-008a-49cf-b248-e3827b3a3175",
         "type":"Shared",
         "englishSpeakingDriver": false,
         "distanceKm":350,
         "travelTimeMinutes":235,
         "pickUp":{
            "lat":50.12,
            "lon":14.27,
            "time":"2022-12-05T21:00:00Z",
            "description":"In front of the hotel Europa"
         },
         "dropOff":{
            "lat":48.21,
            "lon":16.36,
            "description":"Next to the railway station"
         },
         "pricing":{
            "pricePerPassenger":190,
            "totalPrice":380
         },
         "vehicle":{
            "type":"Shuttle",
            "maxPassengers":10,
            "description":"Shuttle comparable to a Mercedes-Benz Vito, up to 10 passengers with luggage.",
            "image":"https://daytrip.imgix.net/site/shuttle.png"
         },
         "luggage":{
            "maxCarryonsPerPerson":1,
            "maxSuitcasesPerPerson":1,
            "maxTotalCarryons":2,
            "maxTotalSuitcases":2
         },
         "seatsAvailable":5,
         "availableChildSeatTypes":[
            
         ],
         "possibleStops":[
            
         ],
         "includedStops":[
            {
               "id":"d280ce2a-6224-4d95-af17-a250f81b97dd",
               "price":31,
               "name":"Lednice Chateau and Park",
               "image":"https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
               "title":"Vacation like a King",
               "perex":"This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
               "description":"The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
               "durationInMinutes":60,
               "order":1,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
               }
            }
         ]
      }
   ]
}
```

### URL path

`/partners/v3/trip/search`

### Query Parameters

Parameter                 | Type    | Description
------------------------- | ------- | -----------
originLatitude            | number  | Origin latitude in degrees.
originLongitude           | number  | Origin longitude in degrees.
destinationLatitude       | number  | Destination latitude in degrees.
destinationLongitude      | number  | Destination longitude in degrees.
departureTime             | integer | Departure time as a UNIX epoch timestamp in seconds. Note that UNIX timestamps are UTC so you need to convert from local time to UTC when calculating it.
passengersCount           | integer | Count of passengers to transport. Must be between 1 and 10.
includeStops              | boolean | Optional. Default value true. When set to false no stops will be returned in trip options. This applies to predefined stops, not custom stops.
includeShared             | boolean | Optional. Default value true. When set to false no shared trip options will be returned.
includeNonEnglishSpeaking | boolean | Optional. Default value true. When set to false no trip options without an English speaking driver will be returned.

### Response body

Property        | Type                              | Description
--------------- | --------------------------------- | -----------
searchId        | string                            | Unique id of your search query.
expiresAt       | string                            | UTC timestamp of when the offers in this response expire. After this time it is no longer possible to book them, you need to make a new search.
passengersCount | integer                           | The count of passengers this search query was for.
currency        | string                            | Currency used for all prices in this response.
options         | list of [TripOption](#tripoption) | List of options for this trip.

### Error status codes

Status code | Description
----------- | -----------
400         | Invalid request - missing mandatory query parameter, parameter has wrong type or wrong passenger count.
401         | API key missing or invalid.
404         | No trip options found for given request.

## Search with custom stops endpoint

This endpoint adds the possibility to specify custom stops along the way compared to the simple Search endpoint. It returns all trip options for given origin, destination, departure time, passenger count (must be between 1 and 10) and custom stops along the way. Origin, destination and custom stops are passed as latitude and longitude coordinates. The unit used is degree with decimal places, for example `39.753657, -117.610215`. Departure time is passed as a UNIX epoch timestamp in seconds, like `1679463169`. Note that UNIX timestamps are UTC so you need to convert from local time to UTC when calculating it.

> To search for a trip from Prague to Vienna with a stop in Brno, use this call:

```bash
curl -d '{ "originLongitude": 14.2559, "originLatitude": 50.10, "destinationLongitude": 16.3738, "destinationLongitude": 48.2082, "departureTime": 1766227088, "passengersCount": 3, "customStops": [ { "name": "Linz, Austria", "latitude": 48.3069, "longitude": 14.2858, "durationInMinutes": 120 } ] }' 
  -H "Content-Type: application/json" 
  -H "x-api-key: your-api-key" 
  -X POST https://api.staging.mydaytrip.net/partners/v3/trip/searchWithCustomStops
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
   "searchId":"f0e34a1b-2b3d-4747-b426-292633b615b4",
   "expiresAt": "2022-12-04T18:00:00Z",
   "passengersCount":3,
   "currency":"EUR",
   "options":[
      {
         "id":"1d32109f-c2e2-44fe-b2cf-461ef3730541",
         "type":"Private",
         "englishSpeakingDriver": true,
         "distanceKm":427,
         "travelTimeMinutes":432,
         "pickUp":{
            "lat":50.10,
            "lon":14.25,
            "time":"2022-12-05T18:00:00Z"
         },
         "dropOff":{
            "lat":48.20,
            "lon":16.37
         },
         "pricing":{
            "totalPrice":420
         },
         "vehicle":{
            "type":"Sedan",
            "maxPassengers":3,
            "description":"Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
            "image":"https://daytrip.imgix.net/site/sedan.png"
         },
         "luggage":{
            "maxTotalCarryons":3,
            "maxTotalSuitcases":3
         },
         "availableChildSeatTypes":[
            {
               "childSeatType":"RearFacing",
               "description":"Rear-facing infant seat",
               "ageFrom":0,
               "ageTo":1,
               "weightInPoundsFrom":0,
               "weightInPoundsTo":26,
               "weightInKilosFrom":0,
               "weightInKilosTo":10
            },
            {
               "childSeatType":"ForwardFacing",
               "description":"Forward-facing w/harness",
               "ageFrom":1,
               "ageTo":4,
               "weightInPoundsFrom":18,
               "weightInPoundsTo":36,
               "weightInKilosFrom":8,
               "weightInKilosTo":16
            },
            {
               "childSeatType":"BoosterSeat",
               "description":"Booster seat with high back",
               "ageFrom":4,
               "ageTo":6,
               "weightInPoundsFrom":30,
               "weightInPoundsTo":50,
               "weightInKilosFrom":14,
               "weightInKilosTo":23
            },
            {
               "childSeatType":"Booster",
               "description":"Backless booster",
               "ageFrom":6,
               "ageTo":12,
               "weightInPoundsFrom":44,
               "weightInPoundsTo":72,
               "weightInKilosFrom":20,
               "weightInKilosTo":33
            }
         ],
         "includedCustomStops":[
            {
               "name": "Linz, Austria",
               "latitude": 48.3069,
               "longitude": 14.2858,
               "durationInMinutes": 120,
            }
         ]
      },
      {
         "id":"b071e9f8-54d9-44be-bb5f-feae5aafd771",
         "type":"Private",
         "englishSpeakingDriver": true,
         "distanceKm":427,
         "travelTimeMinutes":432,
         "pickUp":{
            "lat":50.10,
            "lon":14.25,
            "time":"2022-12-05T18:00:00Z"
         },
         "dropOff":{
            "lat":48.20,
            "lon":16.37
         },
         "pricing":{
            "totalPrice":500
         },
         "vehicle":{
            "type":"MPV",
            "maxPassengers":4,
            "description":"Compact MPV comparable to a Volkswagen Touran, up to 4 passengers with luggage.",
            "image":"https://daytrip.imgix.net/site/mpv.png"
         },
         "luggage":{
            "maxTotalCarryons":4,
            "maxTotalSuitcases":4
         },
         "availableChildSeatTypes":[
            {
               "childSeatType":"RearFacing",
               "description":"Rear-facing infant seat",
               "ageFrom":0,
               "ageTo":1,
               "weightInPoundsFrom":0,
               "weightInPoundsTo":26,
               "weightInKilosFrom":0,
               "weightInKilosTo":10
            },
            {
               "childSeatType":"ForwardFacing",
               "description":"Forward-facing w/harness",
               "ageFrom":1,
               "ageTo":4,
               "weightInPoundsFrom":18,
               "weightInPoundsTo":36,
               "weightInKilosFrom":8,
               "weightInKilosTo":16
            },
            {
               "childSeatType":"BoosterSeat",
               "description":"Booster seat with high back",
               "ageFrom":4,
               "ageTo":6,
               "weightInPoundsFrom":30,
               "weightInPoundsTo":50,
               "weightInKilosFrom":14,
               "weightInKilosTo":23
            },
            {
               "childSeatType":"Booster",
               "description":"Backless booster",
               "ageFrom":6,
               "ageTo":12,
               "weightInPoundsFrom":44,
               "weightInPoundsTo":72,
               "weightInKilosFrom":20,
               "weightInKilosTo":33
            }
         ],
         "includedCustomStops":[
            {
               "name": "Linz, Austria",
               "latitude": 48.3069,
               "longitude": 14.2858,
               "durationInMinutes": 120,
            }
         ]
      }
   ]
}
```

### URL path

`/partners/v3/trip/searchWithCustomStops`

### Request body

Parameter                 | Type    | Description
------------------------- | ------- | -----------
originLatitude            | number  | Origin latitude in degrees.
originLongitude           | number  | Origin longitude in degrees.
destinationLatitude       | number  | Destination latitude in degrees.
destinationLongitude      | number  | Destination longitude in degrees.
departureTime             | integer | Departure time as a UNIX epoch timestamp in seconds. Note that UNIX timestamps are UTC so you need to convert from local time to UTC when calculating it.
passengersCount           | integer | Count of passengers to transport. Must be between 1 and 10.
includeStops              | boolean | Optional. Default value true. When set to false no stops will be returned in trip options.
includeShared             | boolean | Optional. Default value true. When set to false no shared trip options will be returned.
includeNonEnglishSpeaking | boolean | Optional. Default value true. When set to false no trip options without an English speaking driver will be returned.
customStops               | list of [CustomStop](#customstop) | Optional. Customs stops for this trip in the desired order. When a custom stop is requested then origin can be equal to destination, making the trip a same day roundtrip.

### Response body

Property        | Type                              | Description
--------------- | --------------------------------- | -----------
searchId        | string                            | Unique id of your search query.
expiresAt       | string                            | UTC timestamp of when the offers in this response expire. After this time it is no longer possible to book them, you need to make a new search.
passengersCount | integer                           | The count of passengers this search query was for.
currency        | string                            | Currency used for all prices in this response.
options         | list of [TripOption](#tripoption) | List of options for this trip.

### Error status codes

Status code | Description
----------- | -----------
400         | Invalid request - missing mandatory query parameter, parameter has wrong type or wrong passenger count.
401         | API key missing or invalid.
404         | No trip options found for given request.

## Customize endpoint

This endpoint is used to customize a trip option returned by the Search endpoint. The result is a new trip option with a new id that can be booked or customized again. The format of the response body is the same as for the Search endpoint. Currently the only supported customization operation is selection of stops for private trips. Selected stops will appear in `includedStops` of the returned option. In case of repeated calls, previously selected stops will be replaced, so if you selected one stop and want to change it to two stops, you need to send both stops in `selectedStops`. `totalPrice` and `travelTimeMinutes` will be automatically updated to reflect the selected stops. Trip options with custom stops returned by the Search with customs stops endpoint can't be customized. To add or remove custom stops, make a new call to the Search with customs stops endpoint.

> To add the Mikulov stop to the sedan vehicle type private trip option from the Search endpoint example above, use the following call:

```bash
curl -d '{ "optionId": "1d32109f-c2e2-44fe-b2cf-461ef3730541", "selectedStops": ["4ee58c0c-4e56-46ef-bd22-406a1bc60e1c"] }' 
  -H "Content-Type: application/json" 
  -H "x-api-key: your-api-key" 
  -X POST https://api.staging.mydaytrip.net/partners/v3/trip/search/customize
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
   "searchId":"f0e34a1b-2b3d-4747-b426-292633b615b4",
   "expiresAt": "2022-12-04T18:00:00Z",
   "passengersCount":3,
   "currency":"EUR",
   "options":[
      {
         "id":"519314e3-cd92-41e0-85b6-c652c345e9d0",
         "type":"Private",
         "englishSpeakingDriver": true,
         "distanceKm":334,
         "travelTimeMinutes":268,
         "pickUp":{
            "lat":50.10,
            "lon":14.25,
            "time":"2022-12-05T18:00:00Z"
         },
         "dropOff":{
            "lat":48.20,
            "lon":16.37
         },
         "pricing":{
            "totalPrice":288
         },
         "vehicle":{
            "type":"Sedan",
            "maxPassengers":3,
            "description":"Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
            "image":"https://daytrip.imgix.net/site/sedan.png"
         },
         "luggage":{
            "maxTotalCarryons":3,
            "maxTotalSuitcases":3
         },
         "availableChildSeatTypes":[
            {
               "childSeatType":"RearFacing",
               "description":"Rear-facing infant seat",
               "ageFrom":0,
               "ageTo":1,
               "weightInPoundsFrom":0,
               "weightInPoundsTo":26,
               "weightInKilosFrom":0,
               "weightInKilosTo":10
            },
            {
               "childSeatType":"ForwardFacing",
               "description":"Forward-facing w/harness",
               "ageFrom":1,
               "ageTo":4,
               "weightInPoundsFrom":18,
               "weightInPoundsTo":36,
               "weightInKilosFrom":8,
               "weightInKilosTo":16
            },
            {
               "childSeatType":"BoosterSeat",
               "description":"Booster seat with high back",
               "ageFrom":4,
               "ageTo":6,
               "weightInPoundsFrom":30,
               "weightInPoundsTo":50,
               "weightInKilosFrom":14,
               "weightInKilosTo":23
            },
            {
               "childSeatType":"Booster",
               "description":"Backless booster",
               "ageFrom":6,
               "ageTo":12,
               "weightInPoundsFrom":44,
               "weightInPoundsTo":72,
               "weightInKilosFrom":20,
               "weightInKilosTo":33
            }
         ],
         "includedStops":[
            {
               "id":"4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
               "price":28,
               "name":"Mikulov",
               "image":"https://daytrip.imgix.net/510.jpg",
               "title":"The Heart of Czech Wine Country",
               "perex":"A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
               "description":"Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
               "durationInMinutes":60,
               "order":2,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
               }
            }
         ],
         "possibleStops":[
            {
               "id":"d280ce2a-6224-4d95-af17-a250f81b97dd",
               "price":31,
               "name":"Lednice Chateau and Park",
               "image":"https://daytrip.imgix.net/lednice-chateau-and-park4.jpg",
               "title":"Vacation like a King",
               "perex":"This UNESCO-listed chateau and sprawling park was the Lichtenstein's holiday home - exactly the kind of extravagance you'd expect from a dynasty with their own country. ",
               "description":"The Liechtensteins really came into the money with the fortunes seized from Czech noblemen after their victory at the Battle of White Mountain in 1620, and Lednice was one of the presents they bought themselves. In the mid-19th century the baroque manor was given a complete makeover in the 'Windsor Gothic' style, leaving it as we see it today: a shameless flaunting of fabulous wealth, a slap in the face to anyone foolish enough to think that the French Revolution had ended high-living in Europe. The surrounding English landscape park, the largest in the country, is an incomparable swath of green, sprinkled with Romantic follies. There's also a monumental greenhouse open all year round, overflowing with exotic growths gathered by an army of botanists across the Americas. The greenhouse's exoticism is echoed by the charming minaret, constructed at the turn of the 18th century, bringing a whiff of Morocco to Moravia.\nFor more info: www.zamek-lednice.com",
               "durationInMinutes":60,
               "order":1,
               "timezone":"Europe/Prague",
               "country":{
                  "englishName":"Czech Republic"
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

Property        | Type                         | Description
--------------- | ---------------------------- | -----------
optionId        | string                       | Id of the option you want to customize. Taken from [/search](#search-endpoint) or [/customize](#customize-endpoint) endpoint response.
selectedStops   | list of string               | List of ids of stops to include in the trip. Will replace currently included stops.

### Response body

Same format as for the [Search endpoint](#search)

### Error status codes

Status code | Description
----------- | -----------
400         | Invalid request - missing mandatory property, property has a wrong type or not a valid json.
401         | API key missing or invalid.
403         | Forbidden request - trying to customize a trip option owned by someone else.
404         | Trip option not found or expired. Stop not found.
409         | Trip option has already been booked.

## Book endpoint

This endpoint is used to book a trip option. Any trip option from Search, Search with custom stops or Customize endpoint response can be booked if the search results have not expired yet (see `expiresAt` property). You need to send id of the chosen option and passenger details to this endpoint. The result is a booking id that can be used to cancel the booking if not too close to departure.

> To book the customized trip option with stops from the example above or to book a trip option from the original Search endpoint response for two adults and one child with a booster seat, use the following call:

```bash
curl -d '{ "optionId": "f0e34a1b-2b3d-4747-b426-292633b615b4", "pickUpAddressNote": "Havel airport", "dropOffAddressNote": "Vienna central square", "customerNote": "We will stand next to the entrance", "flightNumber": "FR008", "passengerDetails": [ { "type": "Lead", "firstName": "John", "lastName": "Doe", "phone": "+41555555555", "email": "client-email@example.com", "birthday": 629424000 }, { "type": "Adult" }, { "type": "Child", "childSeatType": "Booster" } ] }' 
  -H "Content-Type: application/json" 
  -H "x-api-key: your-api-key" 
  -X POST https://api.staging.mydaytrip.net/partners/v3/trip/book
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
   "bookingId": "cb102778-a3d7-426e-8d18-6bd6b296f283",
   "bookingReference": "CB1027"
}
```

### URL path

`/partners/v3/trip/book`

### Request body

Property           | Type                                        | Description
------------------ | ------------------------------------------- | -----------
optionId           | string                                      | Id of the option you want to book. Taken from [/search](#search-endpoint) or [/customize](#customize-endpoint) endpoint response.
departureTime      | integer                                     | Optional. Departure time as a UNIX epoch timestamp in seconds to use instead of the `departureTime` provided to the [/search](#search-endpoint). You can only move departure time less than 24 hours into the past or into the future compared to the original `departureTime`, otherwise the booking will be rejected (403 HTTP status code). Also if the new price after changing the departure time would be different, booking will also get rejected. Such price change should be extremely rare but your integration should be ready for it if you are sending different `departureTime`. Note that UNIX timestamps are UTC so you need to convert from local time to UTC when calculating it. 
pickUpAddressNote  | string                                      | Optional note for the driver with details about the pick up location.
dropOffAddressNote | string                                      | Optional note for the driver with details about the drop off location.
customerNote       | string                                      | Optional note for the driver not related to pick up or drop off.
flightNumber       | string                                      | Optional flight number in case this is an airport pick up.
passengerDetails   | list of [PassengerDetail](#passengerdetail) | List of passengers that will go on this trip. For trips with "Private" type the number of passengers must be below or equal to `maxPassengers` of the `vehicle` in the trip option. For trips with "Shared" type the number of passengers must match the `passengersCount` query parameter from the Search endpoint. There must always be exactly one passenger of type "Lead" with contact details filled. For passenger of type "Child" you must specify a child seat of proper type offered in the trip option's `availableChildSeatTypes`. For older children that do not need any child seat use `Adult` passenger type.

### Response body

Property           | Type                                        | Description
------------------ | ------------------------------------------- | -----------
bookingId          | string                                      | Id of the created booking. Can be used to retrieve details about the booking or to cancel it.
bookingReference   | string                                      | Short booking reference that can be shared with the customer in order for him to be able to contact Daytrip customer support easily.

### Error status codes

Status code | Description
----------- | -----------
400         | Invalid request - missing mandatory property, property has wrong type, mismatch in passenger count, missing lead passenger, multiple lead passengers or not a valid json.
401         | API key missing or invalid.
403         | Forbidden request - trying to book a trip option owned by someone else. Departure too soon. Departure time change not allowed.
404         | Trip option not found or expired.
409         | Trip option has already been booked. Price changed, please make a new search.

## Cancel endpoint

This endpoint is used to cancel a booked trip. Only trips that have departure more than 24 hours in the future can be cancelled - this threshold is a subject to change.

> To cancel a booked trip, use the following call:

```bash
curl -d '{ "bookingId": "cb102778-a3d7-426e-8d18-6bd6b296f283" }' 
  -H "Content-Type: application/json" 
  -H "x-api-key: your-api-key" 
  -X POST https://api.staging.mydaytrip.net/partners/v3/trip/cancel
```

```javascript

```

```python

```

> The above call returns an empty object:

```json
{

}
```

### URL path

`/partners/v3/trip/cancel`

### Request body

Property         | Type                         | Description
---------------- | ---------------------------- | -----------
bookingId        | string                       | Id of the booking to cancel. Taken from [/book](#book-endpoint) endpoint response.

### Error status codes

Status code | Description
----------- | -----------
400         | Invalid request - bookingId missing or not a valid json.
401         | API key missing or invalid.
403         | Forbidden request - trying to cancel a booking owned by someone else or the departure is too soon.
404         | Booking not found.
409         | Booking has already been cancelled.

## Details endpoint

This endpoint returns details of a booked trip. It provides the status of the booking, information about the trip option and the data that were provided when booking the trip.

> To get details of a booked trip, use the following call:

```bash
curl https://api.staging.mydaytrip.net/partners/v3/trip/details/bookingId 
  -H "x-api-key: your-api-key" 
```

```javascript

```

```python

```

> Make sure to replace `bookingId` with the real booking id.

> The above call returns a JSON structured like this:

```json
{
   "bookingReference": "CB1027",
   "status": "Confirmed",
   "createdAt": "2022-12-05T18:00:00Z",
   "passengersCount": 3,
   "currency": "EUR",
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
      "distanceKm":334,
      "travelTimeMinutes":268,
      "pickUp":{
         "lat":50.10,
         "lon":14.25,
         "time":"2022-12-05T18:00:00Z"
      },
      "dropOff":{
         "lat":48.20,
         "lon":16.37
      },
      "pricing":{
         "totalPrice":288
      },
      "vehicle":{
         "type":"Sedan",
         "maxPassengers":3,
         "description":"Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
         "image":"https://daytrip.imgix.net/site/sedan.png"
      },
      "luggage":{
         "maxTotalCarryons":3,
         "maxTotalSuitcases":3
      },
      "includedStops":[
         {
            "id":"4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
            "price":28,
            "name":"Mikulov",
            "image":"https://daytrip.imgix.net/510.jpg",
            "title":"The Heart of Czech Wine Country",
            "perex":"A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
            "description":"Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
            "durationInMinutes":60,
            "order":2,
            "timezone":"Europe/Prague",
            "country":{
               "englishName":"Czech Republic"
            }
         }
      ],
   }
}
```

### URL path

`/partners/v3/trip/details/bookingId`

Replace `bookingId` with the id of the booking you want to retrieve details for.

### Response body

Property           | Type                                        | Description
------------------ | ------------------------------------------- | -----------
bookingReference   | string                                      | Short booking reference that can be shared with the customer in order for him to be able to contact Daytrip customer support easily.
status             | string                                      | Booking status. "Confirmed" or "Cancelled".
createdAt          | string                                      | UTC timestamp of when this booking was created.
cancelledAt        | string                                      | UTC timestamp of when this booking was cancelled. Optional.
passengersCount    | integer                                     | The count of passengers this booking is for.
currency           | string                                      | Currency used for all prices in this response.
pickUpAddressNote  | string                                      | Optional note for the driver with details about the pick up location.
dropOffAddressNote | string                                      | Optional note for the driver with details about the drop off location.
customerNote       | string                                      | Optional note for the driver not related to pick up or drop off.
flightNumber       | string                                      | Optional flight number in case this is an airport pick up.
passengerDetails   | list of [PassengerDetail](#passengerdetail) | List of passengers that will go on this trip.
trip               | object - [TripOption](#tripoption)          | Information about the trip.

### Error status codes

Status code | Description
----------- | -----------
401         | API key missing or invalid.
403         | Forbidden request - trying to get details of a booking owned by someone else.
404         | Booking not found.

## Update endpoint

This endpoint is used to update minor details of an existing booking. If you want to change departure time or add/remove stops you need to cancel the booking and create it again as it can affect the price. The response of the endpoint are the details of the updated booking, in the same format as the [/details](#details-endpoint) endpoint.

> To update passenger details and customer note of a booked trip, use the following call:

```bash
curl -d '{ "bookingId": "cb102778-a3d7-426e-8d18-6bd6b296f283", "customerNote": "We will wait inside the Airport building", "passengerDetails": [ { "type": "Lead", "firstName": "John", "lastName": "Doe", "phone": "+4166666666", "email": "client-email@example.com", "birthday": 629424000 }, { "type": "Adult" }, { "type": "Child", "childSeatType": "BoosterSeat" } ] }'
  -H "Content-Type: application/json" 
  -H "x-api-key: your-api-key" 
  -X POST https://api.staging.mydaytrip.net/partners/v3/trip/update
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
   "bookingReference": "CB1027",
   "status": "Confirmed",
   "createdAt": "2022-12-05T18:00:00Z",
   "passengersCount": 3,
   "currency": "EUR",
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
      "distanceKm":334,
      "travelTimeMinutes":268,
      "pickUp":{
         "lat":50.10,
         "lon":14.25,
         "time":"2022-12-05T18:00:00Z"
      },
      "dropOff":{
         "lat":48.20,
         "lon":16.37
      },
      "pricing":{
         "totalPrice":288
      },
      "vehicle":{
         "type":"Sedan",
         "maxPassengers":3,
         "description":"Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
         "image":"https://daytrip.imgix.net/site/sedan.png"
      },
      "luggage":{
         "maxTotalCarryons":3,
         "maxTotalSuitcases":3
      },
      "includedStops":[
         {
            "id":"4ee58c0c-4e56-46ef-bd22-406a1bc60e1c",
            "price":28,
            "name":"Mikulov",
            "image":"https://daytrip.imgix.net/510.jpg",
            "title":"The Heart of Czech Wine Country",
            "perex":"A town with a history as deep and flavourful as its wine, Mikulov provides a perfect combination of relaxation and exploration.",
            "description":"Often favoured by visitors with a more active approach to life, Mikulov has much to offer. Surrounded by idyllic countryside, crisscrossed by bicycle paths and marked hiking trails, and the nearby Nové Mlýny lakes, there is something for everyone to enjoy. After all that fresh air, a glass of wine will be more than welcome, and fortunately, Mikulov is the centre for Czech wine making. Due to a high concentration of limestone in the local soil, wine from this region has a unique character and distinct taste. If you like your wine with a side-serving of history, Mikulov Castle dates from the 1730s, and the Dietrichstein Tomb is the final resting place of a Bohemian noble family. Mikulov is also significant for its strong Jewish history. In the early 1800s Mikulov's Jewish Quarter was the largest in Moravia with half the town's inhabitants being of Jewish faith.",
            "durationInMinutes":60,
            "order":2,
            "timezone":"Europe/Prague",
            "country":{
               "englishName":"Czech Republic"
            }
         }
      ],
   }
}
```

### URL path

`/partners/v3/trip/update`

### Request body

All properties except `bookingId` are optional. When a property is not included in the request it won't be updated and it will keep it's previous value. If you want to remove a property value like `customerNote` then send an empty string `""` as the value. If you want to make changes to any passenger you need to provide full `passengerDetails` array - it's not possible to send only details of the passenger you want to update.

Disclaimer: in the last 24 hours before the departure the [/update](#update-endpoint) endpoint will no longer accept updates. For updates in the last 24 hours please contact our customer support at <daytrip@mydaytrip.com> or call [+44 20 3318 1119](tel:+442033181119).

Property           | Type                                          | Description
------------------ | --------------------------------------------- | -----------
bookingId          | string                                        | Id of the booking to cancel. Taken from [/book](#book-endpoint) endpoint response.
pickUpAddressNote  | string                                        | Optional note for the driver with details about the pick up location.
dropOffAddressNote | string                                        | Optional note for the driver with details about the drop off location.
customerNote       | string                                        | Optional note for the driver not related to pick up or drop off.
flightNumber       | string                                        | Optional flight number in case this is an airport pick up.
passengerDetails   | list of [PassengerDetail](#passengerdetail)   | Optional. List of passengers that will go on this trip. For trips with "Private" type the number of passengers must be below or equal to `maxPassengers` of the `vehicle` in the trip option. For trips with "Shared" type the number of passengers must match the `passengersCount` query parameter from the Search endpoint. There must always be exactly one passenger of type "Lead" with contact details filled. For passenger of type "Child" you must specify a child seat of proper type offered in the trip option's `availableChildSeatTypes`. For older children that do not need any child seat use `Adult` passenger type.

### Response body

Property           | Type                                        | Description
------------------ | ------------------------------------------- | -----------
bookingReference   | string                                      | Short booking reference that can be shared with the customer in order for him to be able to contact Daytrip customer support easily.
status             | string                                      | Booking status. "Confirmed" or "Cancelled".
createdAt          | string                                      | UTC timestamp of when this booking was created.
cancelledAt        | string                                      | UTC timestamp of when this booking was cancelled. Optional.
passengersCount    | integer                                     | The count of passengers this booking is for.
currency           | string                                      | Currency used for all prices in this response.
pickUpAddressNote  | string                                      | Optional note for the driver with details about the pick up location.
dropOffAddressNote | string                                      | Optional note for the driver with details about the drop off location.
customerNote       | string                                      | Optional note for the driver not related to pick up or drop off.
flightNumber       | string                                      | Optional flight number in case this is an airport pick up.
passengerDetails   | list of [PassengerDetail](#passengerdetail) | List of passengers that will go on this trip.
trip               | object - [TripOption](#tripoption)          | Information about the trip.

### Error status codes

Status code | Description
----------- | -----------
400         | Invalid request - missing mandatory property, property has wrong type, mismatch in passenger count, missing lead passenger, multiple lead passengers or not a valid json.
401         | API key missing or invalid.
403         | Forbidden request - trying to update details of a booking owned by someone else or trying to update a trip in the last 24 hours before departure.
404         | Booking not found.
409         | Trying to update a cancelled booking.

# Entities

Below is a documentation of all object entities returned by the Daytrip API endpoints.

## CustomStop

Property          | Type   | Description
----------------- | ------ | -----------
name              | string | Name of the stop. Preferably a valid Google Maps address.
latitude          | number | Stop location latitude in degrees.
longitude         | number | Stop location longitude in degrees.
durationInMinutes | number | Stop duration in minutes. 30 minutes minimum, 300 minutes maximum.

## TripOption

Property                | Type                                    | Description
----------------------- | --------------------------------------- | -----------
id                      | string                                  | Unique id of the trip option. Used to customize or book this option.
type                    | string                                  | Type of this option. "Private" or "Shared" (predefined shuttle trips).
englishSpeakingDriver   | boolean                                 | Specifies if this option includes an English speaking driver.
distanceKm              | number                                  | Length of the trip.
travelTimeMinutes       | number                                  | Expected duration of the trip in minutes.
pickUp                  | object - [Location](#location)          | Details about the pick up point.
dropOff                 | object - [Location](#location)          | Details about the drop off point.
pricing                 | object - [Pricing](#pricing)            | Details about the pricing.
vehicle                 | object - [Vehicle](#vehicle)            | Details about the vehicle.
luggage                 | object - [Luggage](#luggage)            | Details about the luggage.
seatsAvailable          | integer                                 | Number of available seats in the shared shuttle. Optional.
availableChildSeatTypes | list of [ChildSeatType](#childseattype) | List of available child seat types for this trip.
possibleStops           | list of [Stop](#stop)                   | Stops that can be added to this trip option.
includedStops           | list of [Stop](#stop)                   | Stops that are already included in this option.
includedCustomStops     | list of [CustomStop](#customstop)       | Custom stops included in this option. When custom stops are included then both `possibleStops` and `includedStops` will always be empty.

## Location

Property                | Type                         | Description
----------------------- | ---------------------------- | -----------
lat                     | number                       | Latitude in degrees.
lon                     | number                       | Longitude in degrees.
time                    | string                       | UTC timestamp of the departure time. Optional, for pick up only.
description             | string                       | Description of the pick up or drop off. Optional.

## Pricing

Property                | Type                         | Description
----------------------- | ---------------------------- | -----------
totalPrice              | number                       | Total price of this option based on requested passenger count.
pricePerPassenger       | number                       | Price per passenger. Optional, for shared options only.

## Vehicle

Property                | Type                         | Description
----------------------- | ---------------------------- | -----------
type                    | string                       | Type of vehicle. "Sedan", "MPV", "Van", "Luxury" or "Shuttle"
maxPassengers           | integer                      | Maximum number of passengers that can take a trip in this vehicle.
description             | string                       | Description of the vehicle type, e.g. models that it is similar to.
image                   | string                       | Link to an illustrative image of the vehicle type. Not an image of the exact vehicle that will be used for this trip.

## Luggage

Property                | Type                         | Description
----------------------- | ---------------------------- | -----------
maxTotalCarryons        | integer                      | Maximum amount of carry-on luggage that passengers can bring on this trip.
maxTotalSuitcases       | integer                      | Maximum amount of suitcases that passengers can bring on this trip.
maxCarryonsPerPerson    | integer                      | Maximum amount of carry-on luggage that one passenger can bring on this trip. Optional, for shared trips only.
maxSuitcasesPerPerson   | integer                      | Maximum amount of suitcases that one passenger can bring on this trip. Optional, for shared trips only.

## ChildSeatType

Property                | Type                         | Description
----------------------- | ---------------------------- | -----------
childSeatType           | string                       | Type of the child seat. "RearFacing", "ForwardFacing", "BoosterSeat" or "Booster"
description             | string                       | Description of the child seat type.
ageFrom                 | integer                      | Minimum age in years of a child that this seat type is suitable for.
ageTo                   | integer                      | Maximum age in years of a child that this seat type is suitable for.
weightInPoundsFrom      | integer                      | Minimum weight in pounds of a child that this seat type is suitable for.
weightInPoundsTo        | integer                      | Maximum weight in pounds of a child that this seat type is suitable for.
weightInKilosFrom       | integer                      | Minimum weight in kilograms of a child that this seat type is suitable for.
weightInKilosTo         | integer                      | Maximum weight in kilograms of a child that this seat type is suitable for.

## Stop

Property                | Type                         | Description
----------------------- | ---------------------------- | -----------
id                      | string                       | Id of the stop. Used for adding stops to a trip option.
price                   | number                       | Price of the stop. If the stop is in `includedStops` then this price is already part of `totalPrice` under `pricing` of the [TripOption](#tripoption).
name                    | string                       | Name of the stop.
image                   | string                       | Link to the image of the stop.
title                   | string                       | Title of the stop description.
perex                   | string                       | Perex of the stop description.
description             | string                       | The stop description.
durationInMinutes       | integer                      | Expected duration of the stop.
order                   | integer                      | Order of this stop on this trip.
timezone                | string                       | Name of the timezone matching the location of the stop.
country                 | object - [Country](#country) | Details about the country where the stop is located.

## Country

Property                | Type                         | Description
----------------------- | ---------------------------- | -----------
englishName             | string                       | Name of the country in English.

## PassengerDetail

Property         | Type                         | Description
---------------- | ---------------------------- | -----------
type             | string                       | Type of the passenger. "Lead", "Adult" or "Child"
firstName        | string                       | First name of the passenger - required the for lead passenger.
lastName         | string                       | Last name of the passenger - required for the lead passenger.
phone            | string                       | Phone number of the passenger - required for the lead passenger. Include country prefix.
email            | string                       | Email of the passenger - required for the lead passenger.
birthday         | integer                      | Birthday of the passenger - required for the lead passenger. UNIX epoch timestamp in seconds.
childSeatType    | string                       | Requested child seat type for a passenger of type "Child". Must match one of offered child seat types from `availableChildSeatTypes` of the trip option you are booking.
