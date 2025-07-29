# Day Trip API

Day trips combine comfortable door‑to‑door transportation with guided sightseeing. Each product is a pre‑planned excursion with a fixed itinerary. Customers can discover available day trips by country or by geographic coordinates, inspect the full itinerary, and then book the trip for a specific departure time. Unlike the point‑to‑point trips from the core API, Day Trip products cannot be customised with additional stops or different routes – the itinerary and sightseeing stops are predefined.

The Day Trips API allows partners to search, browse, and book curated day trip packages.

## Authentication

Authentication for the Day Trip API is consistent with the main PAPI. All requests must include your unique API key in the `x-api-key` header.

```bash
curl "https://papi.staging.mydaytrip.net/partners/v1/daytrips/..." \
  -H "x-api-key: your_api_key"
```

---

## Flows

The API is designed to support intuitive user flows, from discovery to booking management.

### Browse and Book Flow

This flow is ideal when a user wants to explore available day trips starting from a specific country or city.

1.  Call [`/partners/v1/daytrips/country/{isoCountryCode}`](#browse-locations-by-country) to discover all available departure locations within a country.
2.  Present the locations to the user. Once a location is chosen, call [`/partners/v1/daytrips/location/{locationId}`](#get-day-trips-from-a-location) to fetch all available day trip packages from that city.
3.  After the user selects a day trip, call [`/partners/v1/daytrips/book`](#create-day-trip-booking) with the `dayTripId` and passenger details to create a booking.
4.  `optional` - Use [`/partners/v1/daytrips/details/{bookingId}`](#get-booking-details) to retrieve the complete booking information at any time.
5.  `optional` - If changes are needed, use [`/partners/v1/daytrips/update`](#update-booking) to modify booking details like passenger count or pickup time.
6.  `optional` - If the trip needs to be cancelled, call [`/partners/v1/daytrips/cancel`](#cancel-booking).

### Search and Book Flow

This flow is best for users who want to find day trips starting near their current position.

1.  Call [`/partners/v1/daytrips/search`](#search-day-trips-by-coordinates) using the user's latitude and longitude. The API automatically finds the nearest departure location and returns all associated day trips.
2.  After the user selects a day trip, call [`/partners/v1/daytrips/book`](#create-day-trip-booking) with the `dayTripId` and passenger details.
3.  `optional` - Manage the booking using the [`/details`](#get-booking-details), [`/update`](#update-booking), and [`/cancel`](#cancel-booking) endpoints as described above.

---

## Browse Locations by Country

This endpoint returns a list of all available day trip departure locations within a specified country.

> To get all day trip locations in the Czech Republic, use this call:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v1/daytrips/country/cz" \
  -H "x-api-key: your_api_key"
```

> The above call returns a JSON object structured like this:

```json
{
    "countryCode": "cz",
    "locations": [
        {
            "locationId": "4cf0e7a4-8443-40c9-bbf3-bfe253a3c631",
            "name": "Prague",
            "description": "According to legend, Prague was founded in the 8th century when the duchess Libuše stood atop a rocky cliff overlooking the Vltava and prophesied: \"I see a great city whose glory will touch the stars!\". In the 14th century, Charles IV Holy Roman Emperor and King of Bohemia personally elevated Prague into an imperial capital. Charles himself designed the layout of Nové Město, laid the first stone of the Charles Bridge, and founded Charles University. Over the following centuries, Prague experienced its fair share of ups and downs, not to mention a few defenestrations, but was spared the devastation that befell many European cities. Every visitor’s first stop should be the Old Town Square, for the beautiful Baroque buildings lining it, and the famed astronomical clock on the Old Town Hall. From here, you can easily reach the world famous Charles Bridge, and make your way up to expansive castle complex.",
            "images": [
                "https://daytrip2.imgix.net/76.jpg",
                "https://daytrip2.imgix.net/prague11.jpg",
                "https://daytrip.imgix.net/prague-full-view.jpg",
                "https://daytrip.imgix.net/prague12.jpg",
                "https://daytrip.imgix.net/prague13.jpg",
                "https://daytrip.imgix.net/prague14.jpg"
            ],
            "coordinates": {
                "lat": 50.0755381,
                "lon": 14.4378005
            }
        },
        {
            "locationId": "7df59e2b-7919-4c7a-b8a0-ef05cf0c9882",
            "name": "Brno",
            "description": "At the first sign of summer, the city transforms itself into a scene of lively street cafes, outdoor restaurants and street performers that make any visit that bit more memorable. The compact nature of the city means that restaurants, malls, museums, and galleries are all close at hand and the center can easily be viewed on foot or by taking a ride on one of the many trams that run both through and around the city center. Experience the delightful mix of cultures that make up Brno, a city that went unknown to most travelers for so long but emerged from the shadow of Prague in the 1990s. Take a tip from the locals and ‘look up’ when taking a stroll through the center in order to truly appreciate the beauty of the architecture where functionalist and gothic often combine to create the perfect blend of old and new.",
            "images": [
                "https://daytrip2.imgix.net/brno2.jpg",
                "https://daytrip.imgix.net/brno300.jpg",
                "https://daytrip.imgix.net/brno200.jpg",
                "https://daytrip.imgix.net/brno100.jpg"
            ],
            "coordinates": {
                "lat": 49.1950602,
                "lon": 16.6068371
            }
        },
        {
            "locationId": "b0559b77-1e5e-41e9-be6c-72bd2671e897",
            "name": "Olomouc",
            "description": "The centre of Olomouc is the largest historic preservation zone outside of Prague and therefore boasts numerous historic and religious buildings. However the one held in the highest regard is the Holy Trinity Column, a UNESCO World Heritage site and biggest Baroque sculpture in the Czech Republic. Built in 1754 by local citizens and craftsmen, the column is seen as both a celebration of the Catholic Church and of Olomouc itself. The monument stands 115ft high and is topped by a gilded statue of the Holy Trinity. The most prominent church in Olomouc is Saint Wenceslas Cathedral, founded in 1107 and in the compound of the Olomouc Castle. The Cathedral has undergone many renovations throughout its history, resulting in many different architectural styles on display, from a Romanesque crypt to a Gothic cloister to Baroque chapels. Olomouc is also home to the Moravian Theatre, the Moravian Philharmonic and the second oldest university in the Czech Republic.",
            "images": [
                "https://daytrip2.imgix.net/olomouc1.jpg",
                "https://daytrip2.imgix.net/olomouc2.jpg",
                "https://daytrip2.imgix.net/olomouc3.jpg"
            ],
            "coordinates": {
                "lat": 49.593778,
                "lon": 17.2508787
            }
        }
    ]
}
```

### URL Path

`GET /partners/v1/daytrips/country/{isoCountryCode}`

### Request Parameters

| Name             | Type   | Description                                                 |
| ---------------- | ------ | ----------------------------------------------------------- |
| `isoCountryCode` | string | **Required.** ISO 3166-1 alpha-2 country code (e.g., `cz`). |

### Response Body

| Property      | Type   | Description                                                                                                                  |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `countryCode` | string | The ISO 3166-1 alpha-2 country code of the requested country.                                                                |
| `locations`   | array  | A list of available day trip departure locations within the specified country. See [Location](#daytriplocation) for details. |

### Error Status Codes

| Status Code | Description                      |
| ----------- | -------------------------------- |
| 400         | Invalid or missing country code. |

---

## Get Day Trips From a Location

This endpoint returns a list of available day trip packages departing from a specified location ID.

> To get all day trips originating from Prague, use this call:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v1/daytrips/location/4cf0e7a4-8443-40c9-bbf3-bfe253a3c631" \
  -H "x-api-key: your_api_key"
```

> The above call returns a JSON object structured like this:

```json
{
    "location": {
        "locationId": "4cf0e7a4-8443-40c9-bbf3-bfe253a3c631",
        "coordinates": {
            "lat": 50.0755381,
            "lon": 14.4378005
        },
        "name": "Prague",
        "description": "According to legend, Prague was founded in the 8th century when the duchess Libuše stood atop a rocky cliff overlooking the Vltava and prophesied: \"I see a great city whose glory will touch the stars!\". In the 14th century, Charles IV Holy Roman Emperor and King of Bohemia personally elevated Prague into an imperial capital. Charles himself designed the layout of Nové Město, laid the first stone of the Charles Bridge, and founded Charles University. Over the following centuries, Prague experienced its fair share of ups and downs, not to mention a few defenestrations, but was spared the devastation that befell many European cities. Every visitor’s first stop should be the Old Town Square, for the beautiful Baroque buildings lining it, and the famed astronomical clock on the Old Town Hall. From here, you can easily reach the world famous Charles Bridge, and make your way up to expansive castle complex.",
        "images": [
            "https://daytrip2.imgix.net/76.jpg",
            "https://daytrip2.imgix.net/prague11.jpg",
            "https://daytrip.imgix.net/prague-full-view.jpg",
            "https://daytrip.imgix.net/prague12.jpg",
            "https://daytrip.imgix.net/prague13.jpg",
            "https://daytrip.imgix.net/prague14.jpg"
        ]
    },
    "dayTrips": [
        {
            "dayTripId": "0e0e3600-5503-4bf8-9b4c-e044c2334e33",
            "name": "Prague to Karlovy Vary: Private day trip",
            "description": "Forested hills unfold on the journey into the Karlovy Vary’s spa elegance. Glide past Krivoklatsko’s wooded slopes and pause for panoramic views at Hartenstejn Castle, then descend into a world of colonnades, steaming springs, and Belle Epoque architecture. A return to Prague awaits after your indulgent day.",
            "sightseeingDescription": "When you arrive in Karlovy Vary, you'll have the freedom to relax in this elegant spa town and drink from its healing springs. Meanwhile, your driver will be waiting for you nearby, ensuring a stress-free return trip to Prague.",
            "images": [
                "https://daytrip.imgix.net/Karlovy-Vary3.jpg",
                "https://daytrip.imgix.net/Karlovy-Vary4.jpg",
                "https://daytrip.imgix.net/Karlovy-Vary6.jpg",
                "https://daytrip.imgix.net/Karlovy-Vary5.jpg"
            ],
            "totalTripTimeMinutes": 412,
            "price": {
                "currency": 0,
                "perPassengerPrice": 79,
                "minPassengerCount": 3
            },
            "itineraryItems": [
                {
                    "order": 1,
                    "type": "edgeLocation",
                    "location": {
                        "locationId": "4cf0e7a4-8443-40c9-bbf3-bfe253a3c631",
                        "coordinates": {
                            "lat": 50.0755381,
                            "lon": 14.4378005
                        },
                        "name": "Prague",
                        "description": "According to legend, Prague was founded in the 8th century when the duchess Libuše stood atop a rocky cliff overlooking the Vltava and prophesied: \"I see a great city whose glory will touch the stars!\". In the 14th century, Charles IV Holy Roman Emperor and King of Bohemia personally elevated Prague into an imperial capital. Charles himself designed the layout of Nové Město, laid the first stone of the Charles Bridge, and founded Charles University. Over the following centuries, Prague experienced its fair share of ups and downs, not to mention a few defenestrations, but was spared the devastation that befell many European cities. Every visitor’s first stop should be the Old Town Square, for the beautiful Baroque buildings lining it, and the famed astronomical clock on the Old Town Hall. From here, you can easily reach the world famous Charles Bridge, and make your way up to expansive castle complex.",
                        "images": [
                            "https://daytrip2.imgix.net/76.jpg",
                            "https://daytrip2.imgix.net/prague11.jpg",
                            "https://daytrip.imgix.net/prague-full-view.jpg",
                            "https://daytrip.imgix.net/prague12.jpg",
                            "https://daytrip.imgix.net/prague13.jpg",
                            "https://daytrip.imgix.net/prague14.jpg"
                        ]
                    }
                },
                {
                    "order": 2,
                    "type": "location",
                    "location": {
                        "locationId": "82565d30-7a14-4530-96f4-24861b018042",
                        "coordinates": {
                            "lat": 50.2318521,
                            "lon": 12.8719616
                        },
                        "name": "Karlovy Vary",
                        "description": "One of the best-known spa towns in the world where some of the most famous figures in European artistic and cultural life, such as Beethoven, Mozart and Casanova have all enjoyed treatment. Today, due to its distinctive architecture, hot springs and popularity with Hollywood celebrities, it is ranked among Europe’s elite spa towns. Absorb the atmosphere and the distinct fragrance of a spa town with a walk through the historical center where you can sample water from the healing springs that stand in the shadows of the exquisite colonnades. No visitor should miss the prestigious Grand Hotel Pupp with its world famous façade and regarded as one of the world’s best hotels. If you think you’ve seen it somewhere before then you most likely have — it features in the James Bond film, Casino Royale, among others, and hosts cultural festivals and award shows broadcast across the world.",
                        "images": [
                            "https://daytrip.imgix.net/Karlovy-Vary3.jpg",
                            "https://daytrip.imgix.net/Karlovy-Vary4.jpg",
                            "https://daytrip.imgix.net/Karlovy-Vary6.jpg",
                            "https://daytrip.imgix.net/Karlovy-Vary5.jpg"
                        ]
                    }
                },
                {
                    "order": 3,
                    "type": "edgeLocation",
                    "location": {
                        "locationId": "4cf0e7a4-8443-40c9-bbf3-bfe253a3c631",
                        "coordinates": {
                            "lat": 50.0755381,
                            "lon": 14.4378005
                        },
                        "name": "Prague",
                        "description": "According to legend, Prague was founded in the 8th century when the duchess Libuše stood atop a rocky cliff overlooking the Vltava and prophesied: \"I see a great city whose glory will touch the stars!\". In the 14th century, Charles IV Holy Roman Emperor and King of Bohemia personally elevated Prague into an imperial capital. Charles himself designed the layout of Nové Město, laid the first stone of the Charles Bridge, and founded Charles University. Over the following centuries, Prague experienced its fair share of ups and downs, not to mention a few defenestrations, but was spared the devastation that befell many European cities. Every visitor’s first stop should be the Old Town Square, for the beautiful Baroque buildings lining it, and the famed astronomical clock on the Old Town Hall. From here, you can easily reach the world famous Charles Bridge, and make your way up to expansive castle complex.",
                        "images": [
                            "https://daytrip2.imgix.net/76.jpg",
                            "https://daytrip2.imgix.net/prague11.jpg",
                            "https://daytrip.imgix.net/prague-full-view.jpg",
                            "https://daytrip.imgix.net/prague12.jpg",
                            "https://daytrip.imgix.net/prague13.jpg",
                            "https://daytrip.imgix.net/prague14.jpg"
                        ]
                    }
                }
            ]
        }
    ]
}
```

### URL Path

`GET /partners/v1/daytrips/location/{locationId}`

### Request Parameters

| Parameter    | Type | Description                              |
| ------------ | ---- | ---------------------------------------- |
| `locationId` | UUID | **Required.** The ID of the origin city. |

### Response Body

| Property   | Type   | Description                                                                                             |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------- |
| `location` | object | The details of the departure location. See [Location](#daytriplocation) for details.                    |
| `dayTrips` | array  | A list of available day trip packages from the specified location. See [DayTrip](#daytrip) for details. |

### Error Status Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 400         | Malformed or missing `locationId`.   |
| 404         | No location found with the given ID. |

---

## Search Day Trips by Coordinates

This endpoint finds the nearest departure location to a user's coordinates and returns all available day trips from that location.

> To search for day trips near a specific point in Prague:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v1/daytrips/search?lat=50.0755&lon=14.4378" \
  -H "x-api-key: your_api_key"
```

> The above call returns a JSON object structured like this:

```json
{
    "location": {
        "locationId": "4cf0e7a4-8443-40c9-bbf3-bfe253a3c631",
        "coordinates": {
            "lat": 50.0755381,
            "lon": 14.4378005
        },
        "name": "Prague",
        "description": "According to legend, Prague was founded in the 8th century when the duchess Libuše stood atop a rocky cliff overlooking the Vltava and prophesied: \"I see a great city whose glory will touch the stars!\". In the 14th century, Charles IV Holy Roman Emperor and King of Bohemia personally elevated Prague into an imperial capital. Charles himself designed the layout of Nové Město, laid the first stone of the Charles Bridge, and founded Charles University. Over the following centuries, Prague experienced its fair share of ups and downs, not to mention a few defenestrations, but was spared the devastation that befell many European cities. Every visitor’s first stop should be the Old Town Square, for the beautiful Baroque buildings lining it, and the famed astronomical clock on the Old Town Hall. From here, you can easily reach the world famous Charles Bridge, and make your way up to expansive castle complex.",
        "images": [
            "https://daytrip2.imgix.net/76.jpg",
            "https://daytrip2.imgix.net/prague11.jpg",
            "https://daytrip2.imgix.net/prague-full-view.jpg",
            "https://daytrip2.imgix.net/prague12.jpg",
            "https://daytrip2.imgix.net/prague13.jpg",
            "https://daytrip2.imgix.net/prague14.jpg"
        ]
    },
    "dayTrips": [
        {
            "dayTripId": "0e0e3600-5503-4bf8-9b4c-e044c2334e33",
            "name": "Prague to Karlovy Vary: Private day trip",
            "description": "Forested hills unfold on the journey into the Karlovy Vary’s spa elegance. Glide past Krivoklatsko’s wooded slopes and pause for panoramic views at Hartenstejn Castle, then descend into a world of colonnades, steaming springs, and Belle Epoque architecture. A return to Prague awaits after your indulgent day.",
            "sightseeingDescription": "When you arrive in Karlovy Vary, you'll have the freedom to relax in this elegant spa town and drink from its healing springs. Meanwhile, your driver will be waiting for you nearby, ensuring a stress-free return trip to Prague.",
            "images": [
                "https://daytrip.imgix.net/Karlovy-Vary3.jpg",
                "https://daytrip.imgix.net/Karlovy-Vary4.jpg",
                "https://daytrip.imgix.net/Karlovy-Vary6.jpg",
                "https://daytrip.imgix.net/Karlovy-Vary5.jpg"
            ],
            "totalTripTimeMinutes": 412,
            "price": {
                "currency": 0,
                "perPassengerPrice": 79,
                "minPassengerCount": 3
            },
            "itineraryItems": [
                {
                    "order": 1,
                    "type": "edgeLocation",
                    "location": {
                        "locationId": "4cf0e7a4-8443-40c9-bbf3-bfe253a3c631",
                        "coordinates": {
                            "lat": 50.0755381,
                            "lon": 14.4378005
                        },
                        "name": "Prague",
                        "description": "According to legend, Prague was founded in the 8th century when the duchess Libuše stood atop a rocky cliff overlooking the Vltava and prophesied: \"I see a great city whose glory will touch the stars!\". In the 14th century, Charles IV Holy Roman Emperor and King of Bohemia personally elevated Prague into an imperial capital. Charles himself designed the layout of Nové Město, laid the first stone of the Charles Bridge, and founded Charles University. Over the following centuries, Prague experienced its fair share of ups and downs, not to mention a few defenestrations, but was spared the devastation that befell many European cities. Every visitor’s first stop should be the Old Town Square, for the beautiful Baroque buildings lining it, and the famed astronomical clock on the Old Town Hall. From here, you can easily reach the world famous Charles Bridge, and make your way up to expansive castle complex.",
                        "images": [
                            "https://daytrip2.imgix.net/76.jpg",
                            "https://daytrip2.imgix.net/prague11.jpg",
                            "https://daytrip2.imgix.net/prague-full-view.jpg",
                            "https://daytrip2.imgix.net/prague12.jpg",
                            "https://daytrip2.imgix.net/prague13.jpg",
                            "https://daytrip2.imgix.net/prague14.jpg"
                        ]
                    }
                },
                {
                    "order": 2,
                    "type": "location",
                    "location": {
                        "locationId": "82565d30-7a14-4530-96f4-24861b018042",
                        "coordinates": {
                            "lat": 50.2318521,
                            "lon": 12.8719616
                        },
                        "name": "Karlovy Vary",
                        "description": "One of the best-known spa towns in the world where some of the most famous figures in European artistic and cultural life, such as Beethoven, Mozart and Casanova have all enjoyed treatment. Today, due to its distinctive architecture, hot springs and popularity with Hollywood celebrities, it is ranked among Europe’s elite spa towns. Absorb the atmosphere and the distinct fragrance of a spa town with a walk through the historical center where you can sample water from the healing springs that stand in the shadows of the exquisite colonnades. No visitor should miss the prestigious Grand Hotel Pupp with its world famous façade and regarded as one of the world’s best hotels. If you think you’ve seen it somewhere before then you most likely have — it features in the James Bond film, Casino Royale, among others, and hosts cultural festivals and award shows broadcast across the world.",
                        "images": [
                            "https://daytrip.imgix.net/Karlovy-Vary3.jpg",
                            "https://daytrip.imgix.net/Karlovy-Vary4.jpg",
                            "https://daytrip.imgix.net/Karlovy-Vary6.jpg",
                            "https://daytrip.imgix.net/Karlovy-Vary5.jpg"
                        ]
                    }
                },
                {
                    "order": 3,
                    "type": "edgeLocation",
                    "location": {
                        "locationId": "4cf0e7a4-8443-40c9-bbf3-bfe253a3c631",
                        "coordinates": {
                            "lat": 50.0755381,
                            "lon": 14.4378005
                        },
                        "name": "Prague",
                        "description": "According to legend, Prague was founded in the 8th century when the duchess Libuše stood atop a rocky cliff overlooking the Vltava and prophesied: \"I see a great city whose glory will touch the stars!\". In the 14th century, Charles IV Holy Roman Emperor and King of Bohemia personally elevated Prague into an imperial capital. Charles himself designed the layout of Nové Město, laid the first stone of the Charles Bridge, and founded Charles University. Over the following centuries, Prague experienced its fair share of ups and downs, not to mention a few defenestrations, but was spared the devastation that befell many European cities. Every visitor’s first stop should be the Old Town Square, for the beautiful Baroque buildings lining it, and the famed astronomical clock on the Old Town Hall. From here, you can easily reach the world famous Charles Bridge, and make your way up to expansive castle complex.",
                        "images": [
                            "https://daytrip2.imgix.net/76.jpg",
                            "https://daytrip2.imgix.net/prague11.jpg",
                            "https://daytrip2.imgix.net/prague-full-view.jpg",
                            "https://daytrip2.imgix.net/prague12.jpg",
                            "https://daytrip2.imgix.net/prague13.jpg",
                            "https://daytrip2.imgix.net/prague14.jpg"
                        ]
                    }
                }
            ]
        }
    ]
}
```

### URL Path

`GET /partners/v1/daytrips/search`

### Query Parameters

| Name  | Type  | Description                          |
| ----- | ----- | ------------------------------------ |
| `lat` | float | **Required.** Latitude of the user.  |
| `lon` | float | **Required.** Longitude of the user. |

### Response Body

| Property   | Type   | Description                                                                                         |
| ---------- | ------ | --------------------------------------------------------------------------------------------------- |
| `location` | object | The details of the nearest departure location found. See [Location](#daytriplocation) for details.  |
| `dayTrips` | array  | A list of available day trip packages from the found location. See [DayTrip](#daytrip) for details. |

### Error Status Codes

| Status Code | Description                                                |
| ----------- | ---------------------------------------------------------- |
| 400         | Invalid or missing coordinates.                            |
| 404         | No eligible departure location found near the coordinates. |

---

## Create Day Trip Booking

This endpoint creates a new booking for a selected day trip product.

> To book a day trip for 3 adults and 1 child:

```bash
curl -X POST "https://papi.staging.mydaytrip.net/partners/v1/daytrips/book" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "dayTripId": "ffa696fe-4f83-4554-80e7-f217c7a55502",
    "departureTimeLocal": 1747727049,
    "passengers": {
      "adults": 3,
      "children": [{"age": 5, "childSeatType": "Booster"}]
    },
    "leadPassenger": {
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+41555555555",
      "email": "client-email@example.com",
      "over18": true
    },
    "pickupLocation": {
      "lat": 50.1,
      "lon": 14.25,
      "address": "Havel airport, Terminal 2",
      "note": "Taxi Parking 2"
    }
  }'
```

> The above call returns a booking confirmation:

```json
{
    "bookingId": "123e4567-e89b-12d3-a456-426614174000",
    "bookingReference": "CB1027",
    "departureTimeLocal": 1747727049,
    "originTimezone": "Europe/Prague",
    "pickupLocation": {
        "lat": 50.1,
        "lon": 14.25,
        "address": "Havel airport, Terminal 2",
        "note": "Taxi Parking 2"
    },
    "dayTrip": {
        "id": "ffa696fe-4f83-4554-80e7-f217c7a55502",
        "name": "Berlin to Dresden: Private day trip",
        "description": "Travel from Berlin to this captivating city on the Elbe...",
        "sightseeingDescription": "Explore the Old Town, Frauenkirche, and more...",
        "distanceKm": 334,
        "travelTimeMinutes": 268
    },
    "pricing": {
        "currency": "EUR",
        "perPassengerPrice": 83,
        "passengersCount": 4,
        "totalPrice": 332
    },
    "vehicles": [
        {
            "type": "Sedan",
            "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
            "modelDescription": "VW Passat or similar",
            "image": "https://daytrip.imgix.net/site/sedan.png"
        }
    ]
}
```

### URL Path

`POST /partners/v1/daytrips/book`

### Request Body Parameters

| Property             | Type    | Description                                                                             |
| -------------------- | ------- | --------------------------------------------------------------------------------------- |
| `dayTripId`          | UUID    | **Required.** The ID of the day trip to book.                                           |
| `departureTimeLocal` | integer | **Required.** UNIX timestamp of local departure.                                        |
| `passengers`         | object  | **Required.** Passenger details. See [PassengerDetails](#passengerdetails).             |
| `leadPassenger`      | object  | **Required.** Contact info for the lead passenger. See [LeadPassenger](#leadpassenger). |
| `pickupLocation`     | object  | **Required.** Details of the pickup location. See [PickupLocation](#pickuplocation).    |

### Response Body

| Property             | Type    | Description                                                                                      |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `bookingId`          | UUID    | The unique identifier for the newly created booking.                                             |
| `bookingReference`   | string  | A human-readable reference for the booking.                                                      |
| `departureTimeLocal` | integer | The departure time as a UNIX timestamp in the local timezone of the origin.                      |
| `originTimezone`     | string  | The IANA timezone name of the origin.                                                            |
| `pickupLocation`     | object  | The details of the pickup location. See [DayTripPickupLocation](#pickuplocation) for details.    |
| `dayTrip`            | object  | The details of the booked day trip. See [DayTrip](#daytrip) for details.                         |
| `pricing`            | object  | The pricing details for the booking. See [DayTripPrice](#price) for details.                     |
| `vehicles`           | array   | An array of vehicles assigned to the booking. See [DayTripVehicle](#daytripvehicle) for details. |

### Error Status Codes

| Status Code | Description                                  |
| ----------- | -------------------------------------------- |
| 400         | Missing or invalid data in the request body. |
| 404         | `dayTripId` not found or is not bookable.    |
| 500         | Unexpected failure from a downstream system. |

---

## Cancel Booking

This endpoint cancels an existing day trip booking, if permitted by cancellation rules.

> To cancel a booking with reference "CB1027":

```bash
curl -X POST "https://papi.staging.mydaytrip.net/partners/v1/daytrips/cancel" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "bookingId": "CB1027"
  }'
```

> The above call returns a confirmation of the cancellation:

```json
{
    "bookingId": "CB1027",
    "status": "cancelled",
    "cancelledAt": "2025-05-18T10:25:00Z"
}
```

### URL Path

`POST /partners/v1/daytrips/cancel`

### Request Body Parameters

| Property    | Type   | Description                             |
| ----------- | ------ | --------------------------------------- |
| `bookingId` | string | **Required.** The booking ID to cancel. |

### Response Body

| Property      | Type   | Description                                               |
| ------------- | ------ | --------------------------------------------------------- |
| `bookingId`   | string | The ID of the booking that was cancelled.                 |
| `status`      | string | The new status of the booking, which will be `cancelled`. |
| `cancelledAt` | string | The timestamp of when the booking was cancelled.          |

### Error Status Codes

| Status Code | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| 400         | Invalid booking ID format.                                  |
| 403         | Cancellation is not allowed (e.g., too close to departure). |
| 404         | Booking not found.                                          |
| 500         | Unexpected internal failure.                                |

---

## Get Booking Details

This endpoint retrieves the full, current details of a specific booking.

> To get details for a specific booking:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v1/daytrips/details/123e4567-e89b-12d3-a456-426614174000" \
  -H "x-api-key: your_api_key"
```

> The above call returns a booking confirmation:

```json
{
    "bookingId": "123e4567-e89b-12d3-a456-426614174000",
    "bookingReference": "CB1027",
    "departureTimeLocal": 1747727049,
    "originTimezone": "Europe/Prague",
    "pickupLocation": {
        "lat": 50.1,
        "lon": 14.25,
        "address": "Havel airport, Terminal 2",
        "note": "Taxi Parking 2"
    },
    "dayTrip": {
        "id": "ffa696fe-4f83-4554-80e7-f217c7a55502",
        "name": "Berlin to Dresden: Private day trip",
        "description": "Travel from Berlin to this captivating city on the Elbe...",
        "sightseeingDescription": "Explore the Old Town, Frauenkirche, and more...",
        "distanceKm": 334,
        "travelTimeMinutes": 268
    },
    "pricing": {
        "currency": "EUR",
        "perPassengerPrice": 83,
        "passengersCount": 4,
        "totalPrice": 332
    },
    "vehicles": [
        {
            "type": "Sedan",
            "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
            "modelDescription": "VW Passat or similar",
            "image": "https://daytrip.imgix.net/site/sedan.png"
        }
    ]
}
```

### URL Path

`GET /partners/v1/daytrips/details/{bookingId}`

### URL Parameters

| Parameter   | Type   | Description                               |
| ----------- | ------ | ----------------------------------------- |
| `bookingId` | string | **Required.** The booking ID to retrieve. |

### Response Body

| Property             | Type    | Description                                                                                      |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `bookingId`          | UUID    | The unique identifier for the booking.                                                           |
| `bookingReference`   | string  | A human-readable reference for the booking.                                                      |
| `departureTimeLocal` | integer | The departure time as a UNIX timestamp in the local timezone of the origin.                      |
| `originTimezone`     | string  | The IANA timezone name of the origin.                                                            |
| `pickupLocation`     | object  | The details of the pickup location. See [DayTripPickupLocation](#pickuplocation) for details.    |
| `dayTrip`            | object  | The details of the booked day trip. See [DayTrip](#daytrip) for details.                         |
| `pricing`            | object  | The pricing details for the booking. See [DayTripPrice](#price) for details.                     |
| `vehicles`           | array   | An array of vehicles assigned to the booking. See [DayTripVehicle](#daytripvehicle) for details. |

### Error Status Codes

| Status Code | Description                       |
| ----------- | --------------------------------- |
| 400         | Malformed or missing `bookingId`. |
| 404         | Booking not found.                |

---

## Update Booking

This endpoint modifies an existing booking, allowing changes to pickup time, location, and passenger count.

> To update the passenger count and pickup location for a booking:

```bash
curl -X POST "https://papi.staging.mydaytrip.net/partners/v1/daytrips/update" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "bookingId": "123e4567-e89b-12d3-a456-426614174000",
    "passengers": {
      "adults": 2,
      "children": []
    },
    "pickupLocation": {
      "lat": 50.101,
      "lon": 14.252,
      "note": "New pickup point note"
    }
  }'
```

> The above call returns a booking confirmation:

```json
{
    "bookingId": "123e4567-e89b-12d3-a456-426614174000",
    "bookingReference": "CB1027",
    "departureTimeLocal": 1747727049,
    "originTimezone": "Europe/Prague",
    "pickupLocation": {
        "lat": 50.1,
        "lon": 14.25,
        "address": "Havel airport, Terminal 2",
        "note": "Taxi Parking 2"
    },
    "dayTrip": {
        "id": "ffa696fe-4f83-4554-80e7-f217c7a55502",
        "name": "Berlin to Dresden: Private day trip",
        "description": "Travel from Berlin to this captivating city on the Elbe...",
        "sightseeingDescription": "Explore the Old Town, Frauenkirche, and more...",
        "distanceKm": 334,
        "travelTimeMinutes": 268
    },
    "pricing": {
        "currency": "EUR",
        "perPassengerPrice": 83,
        "passengersCount": 4,
        "totalPrice": 332
    },
    "vehicles": [
        {
            "type": "Sedan",
            "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
            "modelDescription": "VW Passat or similar",
            "image": "https://daytrip.imgix.net/site/sedan.png"
        }
    ]
}
```

### URL Path

`POST /partners/v1/daytrips/update`

### Request Body Parameters

All fields are optional except for `bookingId`. Only include the fields you wish to update.

| Property             | Type    | Description                                                               |
| -------------------- | ------- | ------------------------------------------------------------------------- |
| `bookingId`          | UUID    | **Required.** The ID of the booking to update.                            |
| `departureTimeLocal` | integer | A new UNIX timestamp for local departure time.                            |
| `passengers`         | object  | A new passenger configuration. See [PassengerDetails](#passengerdetails). |
| `pickupLocation`     | object  | A new pickup location object. See [PickupLocation](#pickuplocation).      |

### Response Body

| Property             | Type    | Description                                                                                      |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `bookingId`          | UUID    | The unique identifier for the updated booking.                                                   |
| `bookingReference`   | string  | A human-readable reference for the booking.                                                      |
| `departureTimeLocal` | integer | The updated departure time as a UNIX timestamp in the local timezone of the origin.              |
| `originTimezone`     | string  | The IANA timezone name of the origin.                                                            |
| `pickupLocation`     | object  | The updated details of the pickup location. See [PickupLocation](#pickuplocation) for details.   |
| `dayTrip`            | object  | The details of the booked day trip. See [DayTrip](#daytrip) for details.                         |
| `pricing`            | object  | The updated pricing details for the booking. See [DayTripPrice](#daytripprice) for details.      |
| `vehicles`           | array   | An array of vehicles assigned to the booking. See [DayTripVehicle](#daytripvehicle) for details. |

### Error Status Codes

| Status Code | Description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| 400         | Malformed or incomplete request.                                         |
| 404         | Booking ID does not exist.                                               |
| 422         | Update not allowed due to business rules (e.g., too close to departure). |
| 500         | Internal service or pricing failure.                                     |

---

# Day trip API Entities

## DayTripBooking

| Property             | Type    | Description                                                                          |
| -------------------- | ------- | ------------------------------------------------------------------------------------ |
| `bookingId`          | UUID    | The unique identifier for the booking.                                               |
| `bookingReference`   | string  | A human-readable reference for the booking.                                          |
| `departureTimeLocal` | integer | The departure time as a UNIX timestamp in the local timezone of the origin.          |
| `originTimezone`     | string  | The IANA timezone name of the origin.                                                |
| `pickupLocation`     | object  | The details of the pickup location. See [PickupLocation](#pickuplocation).           |
| `dayTrip`            | object  | The details of the day trip. See [Day trip](#daytrip).                               |
| `pricing`            | object  | The pricing details for the booking. See [Price](#price).                            |
| `vehicles`           | array   | An array of vehicles assigned to the booking. See [DayTripVehicle](#daytripvehicle). |

## DayTripLocation

| Property      | Type   | Description                                                                    |
| ------------- | ------ | ------------------------------------------------------------------------------ |
| `locationId`  | UUID   | The unique identifier for the location.                                        |
| `name`        | string | The name of the location.                                                      |
| `description` | string | A description of the location.                                                 |
| `images`      | array  | An array of URLs for images of the location.                                   |
| `coordinates` | object | The geographical coordinates of the location. See [Coordinates](#coordinates). |

## Coordinates

| Property | Type  | Description                    |
| -------- | ----- | ------------------------------ |
| `lat`    | float | The latitude of the location.  |
| `lon`    | float | The longitude of the location. |

## DayTrip

| Property                 | Type    | Description                                                                        |
| ------------------------ | ------- | ---------------------------------------------------------------------------------- |
| `dayTripId`              | UUID    | The unique identifier for the day trip.                                            |
| `name`                   | string  | The name of the day trip.                                                          |
| `description`            | string  | A description of the day trip.                                                     |
| `sightseeingDescription` | string  | A description of the sightseeing opportunities on the day trip.                    |
| `images`                 | array   | An array of URLs for images of the day trip.                                       |
| `totalTripTimeMinutes`   | integer | The total duration of the day trip in minutes.                                     |
| `price`                  | object  | The pricing details for the day trip. See [Price](#price).                         |
| `itineraryItems`         | array   | An array of itinerary items for the day trip. See [ItineraryItem](#itineraryitem). |

## ItineraryItem

| Property   | Type    | Description                                                           |
| ---------- | ------- | --------------------------------------------------------------------- |
| `order`    | integer | The order of the itinerary item.                                      |
| `type`     | string  | The type of the itinerary item. Can be `edgeLocation` or `location`.  |
| `location` | object  | The location of the itinerary item. See [Location](#daytriplocation). |

## Price

| Property            | Type    | Description                                                 |
| ------------------- | ------- | ----------------------------------------------------------- |
| `currency`          | string  | The currency of the price.                                  |
| `perPassengerPrice` | float   | The price per passenger.                                    |
| `minPassengerCount` | integer | The minimum number of passengers required for the day trip. |
| `passengersCount`   | integer | The number of passengers for the booking.                   |
| `totalPrice`        | float   | The total price for the booking.                            |

## PassengerDetails

| Property                 | Type    | Description                                              |
| ------------------------ | ------- | -------------------------------------------------------- |
| `adults`                 | integer | The number of adult passengers.                          |
| `children`               | array   | An array of child passengers.                            |
| `children.age`           | integer | The age of the child passenger.                          |
| `children.childSeatType` | string  | The type of child seat required for the child passenger. |

## LeadPassenger

| Property    | Type    | Description                                         |
| ----------- | ------- | --------------------------------------------------- |
| `firstName` | string  | The first name of the lead passenger.               |
| `lastName`  | string  | The last name of the lead passenger.                |
| `phone`     | string  | The phone number of the lead passenger.             |
| `email`     | string  | The email address of the lead passenger.            |
| `over18`    | boolean | Whether the lead passenger is over 18 years of age. |

## PickupLocation

| Property  | Type   | Description                                      |
| --------- | ------ | ------------------------------------------------ |
| `lat`     | float  | The latitude of the pickup location.             |
| `lon`     | float  | The longitude of the pickup location.            |
| `address` | string | The address of the pickup location.              |
| `note`    | string | A note for the driver about the pickup location. |

## DayTripVehicle

| Property           | Type   | Description                         |
| ------------------ | ------ | ----------------------------------- |
| `type`             | string | The type of vehicle.                |
| `description`      | string | A description of the vehicle.       |
| `modelDescription` | string | A description of the vehicle model. |
| `image`            | string | A URL for an image of the vehicle.  |
