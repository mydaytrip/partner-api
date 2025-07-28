# Day Trips API

Day trips combine comfortable door‑to‑door transportation with guided sightseeing. Each product is a pre‑planned excursion with a fixed itinerary. Customers can discover available day trips by country or by geographic coordinates, inspect the full itinerary, and then book the trip for a specific departure time. Unlike the point‑to‑point trips from the core API, Day Trip products cannot be customised with additional stops or different routes – the itinerary and sightseeing stops are predefined.

The Day Trips API allows partners to search, browse, and book curated day trip packages.

## Flows

You can either browse available day trips by country or location, or search for trips based on coordinates. Once you find a suitable trip, you can create a booking, view details, and manage your bookings.

### Typical Booking Flow

1. call [/country/:isoCountryCode](#browse-locations-by-country) endpoint to get day trip starting points
2. call [/location/:locationId](#get-day-trips-from-a-location) to browse day trips from a location
   1a. `alternative` - call [/search](#search-daytrips-by-coordinates) if user’s location is available and you want to auto-resolve nearest starting point
3. call [/book](#create-day-trip-booking) to place the booking
4. `optional` - call [/details/:bookingId](#get-booking-details) to view trip and pricing info
5. `optional` - call [/cancel](#cancel-booking) or [/update](#update-booking)

---

## Browse Locations by Country

**GET** `/partners/v1/daytrips/country/{isoCountryCode}`

Returns a list of day trip starting locations available in a specified country.

### Request Parameters

| Name           | Type   | Description                                    |
| -------------- | ------ | ---------------------------------------------- |
| isoCountryCode | string | Required. ISO 3166-1 alpha-2 (e.g. `cz`, `it`) |

### Request

```bash
curl "https://papi.mydaytrip.com/partners/v1/daytrips/country/cz" \
-H "x-api-key: 50aa3b31-ea1f-4e94-9381-b6248f22f3ff"
```

### Response

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
      "description": "The centre of Olomouc is the largest historic preservation zone outside of Prague and therefore boasts numerous historic and religious buildings. However the one held in the highest regard is the Holy Trinity Column, a UNESCO World Heritage site and biggest Baroque sculpture in the Czech Republic. Built in 1754 by local citizens and craftsmen, the column is seen as both a celebration of the Catholic Church and of Olomouc itself. The monument stands 115ft high and is topped by a gilded statue of the Holy Trinity. The most prominent church in Olomouc is Saint Wenceslas Cathedral, founded in 1107 and situated in the compound of the Olomouc Castle. The Cathedral has undergone many renovations throughout its history, resulting in many different architectural styles on display, from a Romanesque crypt to a Gothic cloister to Baroque chapels. Olomouc is also home to the Moravian Theatre, the Moravian Philharmonic and the second oldest university in the Czech Republic.",
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

---

## Get Day Trips From a Location

**GET** `/partners/v1/daytrips/location/{locationId}`

Returns day trip packages for the specified origin location.

### Request Parameters

| Name       | Type   | Description                                     |
| ---------- | ------ | ----------------------------------------------- |
| locationId | string | Required. ID of a city returned from `/country` |

### Response

Returns a list of day trip packages, including itinerary, pricing and image previews.

---

## Search Daytrips by Coordinates

**GET** `/partners/v1/daytrips/search?lat=...&lon=...`

Resolves the nearest departure location based on coordinates and returns available day trips.

### Query Parameters

| Name | Type  | Description         |
| ---- | ----- | ------------------- |
| lat  | float | Required. Latitude  |
| lon  | float | Required. Longitude |

### Response

Same payload as [/location/:locationId](#get-day-trips-from-a-location)

---

## Create Day Trip Booking

**POST** `/partners/v1/daytrips/book`

Creates a booking based on selected trip and user-provided info.

### Request Body

```json
{
  "dayTripId": "...",
  "departureTimeLocal": 1747727049,
  "passengers": {
    "adults": 3,
    "children": [{ "age": 5, "childSeatType": "Booster" }]
  },
  "leadPassenger": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+41555555555",
    "email": "client@example.com",
    "over18": true
  },
  "pickupLocation": {
    "lat": 50.1,
    "lon": 14.25,
    "address": "Airport Terminal 2",
    "note": "Taxi stand"
  }
}
```

### Response Body

```json
{
  "bookingId": "...",
  "bookingReference": "...",
  "departureTimeLocal": 1747727049,
  "pickupLocation": {
    "lat": 50.1,
    "lon": 14.25,
    "note": "Taxi stand"
  },
  "dayTrip": {
    "id": "...",
    "name": "...",
    "description": "...",
    "travelTimeMinutes": 268
  },
  "pricing": {
    "currency": "EUR",
    "totalPrice": 332
  },
  "vehicles": [
    {
      "type": "Sedan",
      "modelDescription": "VW Passat or similar"
    }
  ]
}
```

---

## Cancel Booking

**POST** `/partners/v1/daytrips/cancel`

### Request

```json
{
  "bookingId": "CB1027"
}
```

### Response

```json
{
  "bookingId": "CB1027",
  "status": "cancelled",
  "cancelledAt": "2025-05-18T10:25:00Z"
}
```

---

## Get Booking Details

**GET** `/partners/v1/daytrips/details/:bookingId`

Returns full trip and pricing info for a given booking.

---

## Update Booking

**POST** `/partners/v1/daytrips/update`

Allows changes to pickup time/location or passenger count.

### Request Body

```json
{
  "bookingId": "...",
  "departureTimeLocal": 1747727049,
  "passengers": {
    "adults": 2,
    "children": [{ "age": 6, "childSeatType": "Booster" }]
  },
  "pickupLocation": {
    "lat": 50.1,
    "lon": 14.25,
    "note": "Havel airport, Terminal 2"
  }
}
```

### Response

Same format as [Create Booking](#create-day-trip-booking)
