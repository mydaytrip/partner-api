# Daytrip Partner API v3 (Trip API): integration guide for AI coding agents

Give this file to your coding agent (Claude Code or similar) together with your task, for example: *"Implement a Daytrip Trip API v3 client in our backend following this guide."* It is self-contained: the agent does not need web access to implement a correct client.

The human-readable reference is the [Daytrip API Reference](https://mydaytrip.github.io/partner-api/). This guide covers the Trip API only (private transfers); the Hourly Ride API and the Day Trips API are described in the reference. Where this guide is more specific than the reference, follow this guide.

---

## 1. Instructions for the agent

You are implementing a server-side client for the Daytrip Trip API v3. It sells private car transfers with a driver: search for options, optionally add sightseeing stops, book, then read, update, cancel and track the booking.

Hard rules. Each one prevents a bug that real integrations have shipped:

1. **Call the API from a backend only.** The API key is a secret. Never put it in browser or mobile code, logs, or URLs.
2. **Timestamps you send are Unix epoch *seconds*.** Milliseconds are rejected with 400. Timestamps you receive are ISO 8601 UTC strings without milliseconds (`2027-06-10T07:30:00Z`).
3. **Send exactly one of `departureTime` and `departureTimeLocal`** on search. Sending both is a 400. See section 4 for how each is encoded.
4. **Query-string booleans must be the literal `true` or `false`.** `1`, `yes` and `on` are read as `false`, including for flags whose default is `true`.
5. **Identify an option by its `id`, never by vehicle type.** One search can return several options with the same `vehicle.type` and different prices (for example with and without an English-speaking driver).
6. **An empty `options` array is the "no service" answer**, with HTTP 200. It is not an error. When `options` is empty, ignore every other field of the response.
7. **Book before `option.expiresAt`.** Use the `expiresAt` of the option, not the one at the top of the search response, and never hard-code a validity period.
8. **One option can be booked once.** To book the same trip again, search again.
9. **After a timeout or a 5xx on booking, do not assume failure.** Follow the recovery procedure in section 7.
10. **Branch on the HTTP status code.** `message` is for logs and for humans. Section 7 lists the current messages so you can show a useful text, but the recovery logic there never needs them.
11. **Tolerate change.** Ignore unknown response fields. Treat `vehicle.type`, `type`, `status`, `adjustmentReason` and `cancellationPolicy` as open sets: an unknown value must not crash the client. Treat every field marked optional below as possibly absent.
12. **Prices are decimal numbers in the response `currency`**, not integers and not minor units (`260` means 260.00, and `259.5` is possible). The API takes no payment: you charge your customer, Daytrip invoices you.
13. **There are no webhooks.** Read state with the details, drivers and tracking endpoints.

Deliver, at minimum: a typed client with one method per endpoint, the error mapping of section 7, the booking recovery procedure, and tests for the cases in section 9.

---

## 2. Connection

| | Sandbox | Production |
|---|---|---|
| Base URL | `https://papi-staging.dynamic-environment.mydaytrip.net/partners/v3` | `https://papi.mydaytrip.com/partners/v3` |
| API key | sandbox key | production key (issued after the sandbox integration is tested) |

Keys are per environment. Make the base URL and the key configuration, not constants. Sandbox bookings are not real trips.

Headers:

| Header | Direction | Use |
|---|---|---|
| `x-api-key: <key>` | request, required | Authentication. Missing or wrong key gives 401. |
| `Content-Type: application/json` | request, on POST | Bodies are JSON. |
| `x-correlation-id` | request, optional | Your own request id. If you send one, Daytrip uses it. |
| `x-correlation-id` | response, always | Log it with every call. Daytrip support needs it to trace a request. |
| `Retry-After` | response, on 429 and 502 | Seconds to wait before retrying. |

Rate limit: 2,000 requests per minute per API key, counted separately for each endpoint. Over the limit you get 429 with `Retry-After`. Responses also carry `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset`.

Success is any 2xx status. Do not test for `=== 200`.

---

## 3. Endpoints

| Operation | Method and path | Changes state |
|---|---|---|
| Search | `GET /trip/search` | no |
| Customize (add stops) | `POST /trip/search/customize` | no (creates a new option) |
| Book | `POST /trip/book` | yes |
| Details | `GET /trip/details/{bookingId}` | no |
| Details by your id | `GET /trip/external/details/{externalId}` | no |
| Update | `POST /trip/update` | yes |
| Cancel | `POST /trip/cancel` | yes |
| Drivers | `GET /trip/drivers/{bookingId}` | no |
| Tracking | `GET /trip/tracking/{bookingId}` | no |

URL-encode `externalId` when you put it in the path.

Typical flow: search → (customize) → book → details / drivers / tracking → (update) → (cancel).

---

## 4. Types

TypeScript notation. `?` means the field can be absent. Translate to your language as needed.

### Search

`GET /trip/search` with query parameters:

```ts
type SearchQuery = {
    // Origin: coordinates (default) or an airport code.
    originType?: "coordinates" | "iata";      // default "coordinates"
    originLatitude?: number;                  // required when originType is "coordinates" or omitted
    originLongitude?: number;                 // decimal degrees, e.g. 50.0755
    origin?: string;                          // IATA airport code, e.g. "PRG"; required when originType is "iata"

    // Destination: same pattern.
    destinationType?: "coordinates" | "iata";
    destinationLatitude?: number;
    destinationLongitude?: number;
    destination?: string;

    // Exactly one of these two. Epoch seconds.
    departureTime?: number;                   // the real instant of pickup (UTC-based epoch)
    departureTimeLocal?: number;              // the wall-clock time at the origin, encoded as if it were UTC

    passengersCount: number;                  // adults + children. 1-7, or 1-99 with includeMultipleVehicles=true
    childrenCount?: number;                   // >= 0. Already included in passengersCount.

    includeStops?: "true" | "false";              // default true. false = lighter response without sightseeing stops
    includeNonEnglishSpeaking?: "true" | "false"; // default true. false = only options with an English-speaking driver
    includeMultipleVehicles?: "true" | "false";   // default false. true = allow options made of several vehicles
};
```

Departure time, worked example. The customer wants to be picked up in Prague on 10 June 2027 at 09:30 local time. Prague is UTC+2 on that day.

- If you know the origin time zone: `departureTime = 1812612600` (the epoch of `2027-06-10T07:30:00Z`).
- If you do not: `departureTimeLocal = 1812619800` (the epoch of `2027-06-10T09:30:00Z`, that is the wall-clock digits read as UTC). Daytrip resolves the zone from the origin.

Send one of the two. The response always gives the real instant in `pickUp.time` plus `pickUp.timezone`; display the local time from those.

```ts
type SearchResponse = {
    searchId: string;
    expiresAt: string;        // obsolete. Use option.expiresAt.
    passengersCount: number;
    currency: string;         // ISO 4217, e.g. "EUR". Applies to every price in this response.
    options: TripOption[];    // [] means no service for this request
};

type TripOption = {
    id: string;                        // pass as optionId to customize and book
    type: string;                      // "Private". Skip options with a type you have not implemented.
    englishSpeakingDriver: boolean;
    distanceKm: number;
    travelTimeMinutes: number;         // includes the duration of included stops
    pickUp: TripLocation;
    dropOff: TripLocation;
    pricing: { totalPrice: number; pricePerPassenger?: number };
    vehicle?: Vehicle;                 // present when the search was made WITHOUT includeMultipleVehicles=true
    vehicles?: Vehicle[];              // present when the search was made WITH includeMultipleVehicles=true
    luggage: {
        maxTotalCarryons: number;
        maxTotalSuitcases: number;
        maxCarryonsPerPerson?: number;
        maxSuitcasesPerPerson?: number;
    };
    availableChildSeatTypes: ChildSeatType[];
    possibleStops: Stop[];             // stops you can add with customize
    includedStops: Stop[];             // stops already in this option and in its totalPrice
    seatsAvailable?: number;
    cancellationPolicy?: string;       // "NonRefundable" | "Flexible" | "SuperFlexible"; usually absent
    expiresAt?: string;                // after this time the option cannot be booked
};

type TripLocation = {
    lat: number;
    lon: number;
    time?: string;                     // pickup only: departure, UTC
    interval?: { earliest: string; latest: string };
    timezone?: string;                 // IANA zone, present when time or interval is present
    description?: string;              // name of the predefined point, when adjusted
    address?: string;
    image?: string;                    // photo URL of the predefined point
    meetAndGreet?: boolean;            // pickup only
    state: "original" | "adjusted";    // adjusted = Daytrip moved the point (see section 5)
    adjustmentReason?: "restricted_area" | "airport_pickup";
    immutable: boolean;                // true = the point is fixed and address notes for it are ignored
};

type Vehicle = {
    type: string;                      // today: "Sedan" | "MPV" | "Van" | "PremiumVan" | "Luxury" | "Shuttle"
    maxPassengers: number;
    description: string;
    modelDescription: string;          // e.g. "VW Passat or similar"
    image: string;                     // illustrative image URL of the vehicle class
};

type ChildSeatType = {
    childSeatType: "RearFacing" | "ForwardFacing" | "BoosterSeat" | "Booster";
    description: string;
    ageFrom: number; ageTo: number;
    weightInPoundsFrom: number; weightInPoundsTo: number;
    weightInKilosFrom: number; weightInKilosTo: number;
};

type Stop = {
    id: string;
    price: number;                     // price of adding this stop. The price to charge is the customized option's totalPrice.
    name: string;
    image: string;
    title: string;
    perex: string;                     // short teaser
    description: string;
    durationInMinutes: number;
    order: number;                     // position along the route
    timezone: string;
    country: { englishName: string };
};
```

### Customize

`POST /trip/search/customize`

```ts
type CustomizeRequest = {
    optionId: string;          // an option id from search (see section 5 for which one)
    selectedStops: string[];   // ids taken from that option's possibleStops
};
// Response: SearchResponse with the same searchId and exactly ONE option: a new option with a new id.
```

### Book

`POST /trip/book`

```ts
type BookRequest = {
    optionId: string;
    passengerDetails: PassengerDetail[];   // at least 1, exactly one "Lead"
    pickUpAddressNote?: string;            // pickup address or description, e.g. hotel name and street
    dropOffAddressNote?: string;
    customerNote?: string;                 // free text for the driver. Longer than 1024 chars is cut.
    flightNumber?: string;                 // e.g. "LH1234". Send it in this field, not inside customerNote.
    externalId?: string;                   // your booking id. Make it unique. See section 7.
    departureTime?: number;                // optional override, epoch seconds. See section 5 before using.
    departureTimeLocal?: number;           // same, local encoding. Never both.
};

type PassengerDetail =
    | {
          type: "Lead";
          firstName: string;
          lastName: string;
          phone: string;                   // starts with "+", 8 to 20 characters in total, e.g. "+420777123456"
          email: string;
          over18: true;                    // must be literally true
          birthday?: number;               // deprecated (epoch seconds, integer). Do not send in new integrations.
      }
    | { type: "Adult"; firstName?: string; lastName?: string }
    | {
          type: "Child";
          firstName?: string;
          lastName?: string;
          childSeatType: "RearFacing" | "ForwardFacing" | "BoosterSeat" | "Booster";
      };

type BookResponse = {
    bookingId: string;                     // store it. Needed for every later call.
    bookingReference: string;              // short code the customer can quote to Daytrip support
    departureTimeUtc: string;
    originTimezone: string;                // IANA zone, to show departureTimeUtc in local time
    meetAndGreet: boolean;
    meetingPosition?: Position;
    dropOffPosition?: Position;
    trip: TripOption;                      // the booked option
};

// Where to meet the driver, or where the trip ends.
type Position = {
    lat?: number;                          // can be absent: sometimes there are only instructions
    lon?: number;
    description?: string;
    instructions: string;                  // text for the customer. Can be an empty string.
    address?: string;
    image?: string;
};
```

The book response has no currency. Prices in `trip` are in the `currency` of the search response the option came from. Store that currency with the booking.

### Details

`GET /trip/details/{bookingId}` or `GET /trip/external/details/{externalId}`. The update endpoint returns the same shape.

```ts
type TripDetails = {
    bookingId: string;
    bookingReference: string;
    externalId?: string;
    status: "Confirmed" | "Cancelled";
    createdAt: string;
    cancelledAt?: string;
    passengersCount: number;
    currency: string;
    departureTimeUtc: string;              // current departure. Reflects changes made by Daytrip support.
    originTimezone: string;
    meetAndGreet: boolean;
    meetingPosition?: Position;
    dropOffPosition?: Position;
    pickUpAddressNote?: string;
    dropOffAddressNote?: string;
    customerNote?: string;
    flightNumber?: string;
    passengerDetails: PassengerDetail[];   // lead comes back with over18: true and a birthday value. Ignore birthday.
    trip: TripOption;                      // the option as booked
};
```

### Update

`POST /trip/update`

```ts
type UpdateRequest = {
    bookingId: string;
    pickUpAddressNote?: string;
    dropOffAddressNote?: string;
    customerNote?: string;
    flightNumber?: string;
    passengerDetails?: PassengerDetail[];  // the complete new list, not a patch
};
// Response: TripDetails
```

### Cancel

`POST /trip/cancel`

```ts
type CancelRequest = { bookingId: string };
type CancelResponse = { penalty: number; currency: string };  // penalty 0 = free cancellation
```

### Drivers and tracking

```ts
// GET /trip/drivers/{bookingId}
type DriversResponse = {
    assignedDrivers: Array<{
        driverId: string;
        name: string;
        phoneNumber: string;               // with country code
        profilePhoto?: string;             // URL
        vehicle: { title: string; color?: string; licensePlate?: string };
    }>;
};

// GET /trip/tracking/{bookingId}
type TrackingResponse = {
    driverPositions: Array<{
        driverId: string;                  // same id as in DriversResponse
        timestamp: string;                 // when the driver reported this position, UTC
        position: { lat: number; lon: number };
    }>;
};
```

### Errors

Every error has this body:

```ts
type ApiError = { statusCode: number; message: string };
```

When several validation rules fail, `message` holds all of them joined with `"; "`.

---

## 5. Behaviour you must implement around

### Search

- **No service is `200` with `options: []`.** This covers: no coverage between the two points, an unknown IATA code, coordinates `0,0`, a date on which the route is not sold, and a departure that is too soon. Show "not available" and let the user change the request. Do not retry. Treat a 404 on search the same way.
- **Lead time.** Trips cannot be booked at short notice. The minimum notice is set per route and vehicle type and is commonly between one and two days. Do not hard-code it: a search for a departure that is too soon simply returns no options (or fewer vehicle types).
- **Passenger count.** 1 to 7 without `includeMultipleVehicles=true`, 1 to 99 with it. Outside the range is a 400. For groups above 7, search with `includeMultipleVehicles=true`.
- **`vehicle` or `vehicles` depends on how you searched**, not on the option. A search with `includeMultipleVehicles=true` returns `vehicles` (an array, also for single-vehicle options) and no `vehicle`. A search without it returns `vehicle` and no `vehicles`. The same holds for the `trip` object in book, details and update responses of that booking. Write one accessor that normalises both to an array.
- **Capacity of an option** is the sum of `maxPassengers` over its vehicles.
- **`englishSpeakingDriver: false`** options are cheaper, and usually offer no stops. Show the flag to the customer, or search with `includeNonEnglishSpeaking=false`.
- **Shared (shuttle) trips** are not returned at present: every option has `type: "Private"`, and the `includeShared` query parameter has no effect. The fields `interval`, `pricePerPassenger`, `seatsAvailable`, `cancellationPolicy` and the per-person luggage limits belong to shared trips; keep them optional. If you see an option with a `type` you do not handle, leave it out.
- **Child seats** are requested per child at booking. The four seat types in `availableChildSeatTypes` come with age and weight ranges you can show in your UI.

### Adjusted pickup and drop-off points

Some places cannot be reached by car or have a fixed meeting point (old towns, pedestrian zones, airports). Daytrip then replaces the requested point with a predefined one:

- `state: "adjusted"` and `adjustmentReason` tell you that this happened. `lat`/`lon`, `description`, `address` and `image` describe the new point.
- Show the adjusted point to the customer **before** they book. They will have to walk there.
- `immutable: true` means the point is fixed: an address note you send for that end of the trip is ignored.
- `pickUp.meetAndGreet: true` means the driver comes to the customer: at an airport the driver waits in arrivals with a name sign, elsewhere at the entrance of the pickup address. `false` means the customer goes to the meeting point.
- After booking, `meetingPosition.instructions` (and `dropOffPosition`) hold the text to give to the customer. `meetingPosition` can consist of `instructions` only, without coordinates. The meeting point can also be assigned at booking time (for example once a flight number shows it is an airport pickup), so always read `meetAndGreet`, `meetingPosition` and `dropOffPosition` from the book or details response rather than from the search.

### Customize (stops)

- Only options that list `possibleStops` can be customized. For any other option the call fails with 403 or 404. Hide the stops UI when `possibleStops` is empty.
- The result is a **new option with a new id**. Book that id. The original option stays valid and can still be booked or customized.
- **The stops you send are added to the stops already included in the option you pass.** To get a predictable result, always customize the **original option from the search** (the one with empty `includedStops`) and send the **complete list** of stops you want:
  - change the selection: customize the original option again with the new full list;
  - remove all stops: book the original option.
- Each id in `selectedStops` must be in the `possibleStops` of the option you pass, once. An unknown id, a duplicate, or a stop that is already included gives 404.
- Read the price and duration from the new option (`pricing.totalPrice`, `travelTimeMinutes`). Do not add stop prices to the original price yourself: the result can differ slightly from the sum.

### Book

- **Passengers.** `passengerDetails.length` is the number of travellers. It must not exceed the capacity of the option, and should equal the `passengersCount` you searched with. Exactly one passenger has `type: "Lead"`. A child who needs no child seat is sent as `"Adult"`.
- **Lead passenger.** All of `firstName`, `lastName`, `phone`, `email` are required, and `over18` must be `true`. Use the traveller's real phone and email: they are the contact for the trip. Validate the phone format (`+`, 8 to 20 characters) in your own form so the customer can fix it before you call the API.
- **Several vehicles.** The number of non-child passengers (Lead plus Adults) must be at least the number of vehicles.
- **Luggage** is not sent. One suitcase and one carry-on per passenger is assumed. Show `luggage.maxTotalSuitcases` and `maxTotalCarryons` to the customer when they choose a vehicle.
- **Address notes.** Send `pickUpAddressNote` and `dropOffAddressNote` whenever you have them (hotel name, street and number, terminal). If you do not have them at booking time, send them later with update.
- **Flight number.** Send it in `flightNumber` for airport pickups; it is used to follow the flight. If you send a flight number for a trip that *ends* at an airport, it is passed to the driver as a note and is **not** returned in `flightNumber` by the details endpoint. Do not treat that as a lost value.
- **Customer note.** Plain text for the driver. Daytrip may clean it: a flight number or template fragments found in the note can be moved out of it, so the note you read back can differ from the one you sent.
- **Changing the departure time at booking** (`departureTime` / `departureTimeLocal` in the book request) is allowed only for a shift of less than 24 hours from the searched time, and can fail with 403 (too soon, or shift too large) or 409 (the price is different at the new time). Preferred: when the customer changes the time, run a new search and book the new option.
- **Confirmation.** A successful booking is confirmed immediately. There is no pending state.

### Details and status

- `status` is `"Confirmed"` or `"Cancelled"`. Nothing else.
- `departureTimeUtc` is the current departure and can change if the customer arranges a change with Daytrip support. Refresh details before you show or send trip information, for example the day before departure.
- `trip` describes the option as it was booked. Do not use `trip.possibleStops` of a booking to offer changes.
- Lookup by `externalId` returns the most recent booking with that id and answers 403 if that booking is not yours. Use ids that cannot collide with anything else, for example a UUID or `<your-company>-<your-booking-id>`, and never reuse one for a second booking.

### Update

- At least one field besides `bookingId` must have a non-empty value, otherwise 400.
- An omitted field keeps its value.
- `passengerDetails` replaces the whole list and follows the booking rules (one Lead, capacity, child seats, `over18: true`).
- To clear `customerNote` or an address note, send `""` for it. A request whose only other field is an empty string counts as "nothing to update": include another field with a value, for example the unchanged `passengerDetails`.
- `flightNumber` can be changed but not cleared.
- Address notes are ignored for an end of the trip that has a fixed meeting point.
- **Not possible within 24 hours of departure** (403) or on a cancelled booking (409). Within 24 hours, changes go through Daytrip customer support.
- Departure time, stops and vehicle cannot be updated. Cancel and book again, subject to the cancellation rule below.

### Cancel

- **24 hours or more before departure:** the booking is cancelled and `penalty` is `0`.
- **Less than 24 hours before departure:** the API refuses with 403 and the booking stays confirmed. Cancellation then goes through Daytrip customer support. In your UI, disable self-service cancellation from 24 hours before `departureTimeUtc`, and still handle the 403 in case clocks differ.
- Always read `penalty` and `currency` from the response rather than assuming 0.
- Cancelling a booking that is already cancelled gives 409. Treat it as success.

### Drivers and tracking

- `assignedDrivers` is empty until a driver is assigned, which can be a few days before departure, and for cancelled bookings. An empty list is normal.
- The driver can change. Refresh before you show driver details to the customer, and again shortly before departure. The answer is cached for about 10 minutes on Daytrip's side, so polling faster than that returns the same data.
- A trip with several vehicles has several drivers. Match tracking positions to drivers by `driverId`.
- `driverPositions` holds the latest known position per driver and is empty when no position is available, which is the normal state except around the time of the trip. Not every trip is tracked. Poll only close to departure and during the trip, at an interval of 15 seconds or longer, and stay within the rate limit across all your bookings.

---

## 6. Request examples

Search by coordinates, 3 passengers including 1 child:

```bash
curl "$BASE/trip/search?originLatitude=50.0755&originLongitude=14.4378&destinationLatitude=48.2082&destinationLongitude=16.3738&departureTime=1812612600&passengersCount=3&childrenCount=1" \
  -H "x-api-key: $KEY"
```

Search from an airport, group of 10:

```bash
curl "$BASE/trip/search?originType=iata&origin=PRG&destinationLatitude=48.2082&destinationLongitude=16.3738&departureTimeLocal=1812619800&passengersCount=10&includeMultipleVehicles=true" \
  -H "x-api-key: $KEY"
```

Add two stops to an option from the search:

```bash
curl -X POST "$BASE/trip/search/customize" -H "x-api-key: $KEY" -H "Content-Type: application/json" -d '{
  "optionId": "1d32109f-c2e2-44fe-b2cf-461ef3730541",
  "selectedStops": ["d280ce2a-6224-4d95-af17-a250f81b97dd", "4ee58c0c-4e56-46ef-bd22-406a1bc60e1c"]
}'
```

Book for two adults and a child:

```bash
curl -X POST "$BASE/trip/book" -H "x-api-key: $KEY" -H "Content-Type: application/json" -d '{
  "optionId": "1d32109f-c2e2-44fe-b2cf-461ef3730541",
  "externalId": "acme-7f3c2b1e-55d0-4c57-9a43-0c6f5d2a9b11",
  "pickUpAddressNote": "Hotel Paris, U Obecniho domu 1, Prague",
  "dropOffAddressNote": "Hotel Sacher, Philharmoniker Str. 4, Vienna",
  "customerNote": "We have a stroller.",
  "passengerDetails": [
    { "type": "Lead", "firstName": "John", "lastName": "Doe", "phone": "+420777123456", "email": "john.doe@example.com", "over18": true },
    { "type": "Adult", "firstName": "Jane", "lastName": "Doe" },
    { "type": "Child", "firstName": "Sam", "lastName": "Doe", "childSeatType": "BoosterSeat" }
  ]
}'
```

Update the flight number and pickup address:

```bash
curl -X POST "$BASE/trip/update" -H "x-api-key: $KEY" -H "Content-Type: application/json" -d '{
  "bookingId": "cb102778-a3d7-426e-8d18-6bd6b296f283",
  "flightNumber": "OK123",
  "pickUpAddressNote": "Terminal 2, arrivals hall"
}'
```

Cancel:

```bash
curl -X POST "$BASE/trip/cancel" -H "x-api-key: $KEY" -H "Content-Type: application/json" \
  -d '{ "bookingId": "cb102778-a3d7-426e-8d18-6bd6b296f283" }'
```

---

## 7. Errors and recovery

### By status code (applies to every endpoint)

| Status | Meaning | Client action |
|---|---|---|
| 400 | The request is wrong: missing or mistyped field, passenger rules, both departure times, milliseconds. | Do not retry. Fix the request. Log `message`; it names the field. |
| 401 | API key missing or invalid. | Do not retry. Configuration problem: alert your team. |
| 403 | Not allowed: the option or booking belongs to another key, the departure is too close, or the key may not perform this action. | Do not retry. See the per-endpoint table. |
| 404 | Option, booking or stop not found, or the option has expired. On search: no service. | Do not retry. On book or customize: search again. |
| 409 | Conflict with the current state: already booked, already cancelled, price changed. | Do not retry blindly. See the per-endpoint table. |
| 429 | Rate limit. | Wait `Retry-After` seconds, then retry. |
| 500, 503 | Daytrip-side failure. | Retry with exponential backoff, at most 3 attempts. For book, use the recovery procedure. |
| 502 | A service Daytrip depends on failed. Carries `Retry-After`. | Wait `Retry-After` seconds, then retry. For book, use the recovery procedure. |
| timeout / network error | Outcome unknown. | Safe to retry GETs. For book, use the recovery procedure. |

Suggested client timeout: 30 seconds for search and book, which compute prices and can be slow on long routes.

### By endpoint

Current `message` values are listed so you can log and display them. They can change; do not build control flow on them.

| Endpoint | Status | Current message | What it means and what to do |
|---|---|---|---|
| search | 400 | `Invalid passengers count` | Outside 1-7 (or 1-99 with multiple vehicles). Fix the input. |
| search | 400 | `Invalid departure time` or a validation text | Both or neither departure time, or milliseconds. Fix the input. |
| customize | 403 | `Trip option cannot be customized` | The option has no stops to add. Hide the stops UI for it. |
| customize | 403 | `Forbidden` | The option was created with another API key. |
| customize, book | 404 | `Trip option not found`, `Trip search has expired` | Unknown or expired option. Search again and show the new prices. |
| customize | 404 | `Stop not found` | A stop id is not in the option's `possibleStops`, is repeated, or is already included. |
| book, update | 400 | `Missing lead passenger`, `Multiple lead passengers` | Exactly one Lead is required. |
| book, update | 400 | `Invalid passengers count`, `Invalid luggage count` | More travellers than the vehicle(s) can take. Offer a larger option. |
| book | 400 | `At least one adult passenger is required per vehicle` | Fewer non-child passengers than vehicles. |
| book | 403 | `Departure too soon` | The departure is now inside the minimum notice. Search again; the trip may no longer be available. |
| book | 403 | `Departure time change not allowed` | The time sent on book is 24 hours or more from the searched time. Search again with the new time. |
| book | 403 | `Forbidden` | The option belongs to another API key, or your key may not create bookings. |
| book | 409 | `Trip option already booked` | This option has a booking. Use the recovery procedure. |
| book | 409 | `Price changed, please make a new search` | The price moved since the search. Search again and ask the customer to confirm the new price. |
| details, drivers, tracking, update, cancel | 404 | `Booking not found` | Wrong id or wrong environment. |
| details, drivers, tracking, update, cancel | 403 | `Forbidden` | The booking belongs to another API key. |
| update | 400 | `Nothing to update` | No field with a non-empty value besides `bookingId`. |
| update, cancel | 403 | `Departure too soon` | Less than 24 hours to departure. Direct the customer to Daytrip support. |
| update, cancel | 409 | `Booking already cancelled` | For cancel, treat as success. For update, refresh details. |

### Booking recovery procedure

Booking is the one call where "I do not know whether it worked" costs money: retry wrongly and you either lose the booking or the customer travels unconfirmed. Implement this exactly.

Before calling book, generate a unique `externalId` and save it with the `optionId` in your own database. Turn off automatic retries in your HTTP library for `POST /trip/book`: the steps below depend on knowing which attempt you are on.

1. Call `POST /trip/book`.
2. **2xx:** save `bookingId` and `bookingReference`. Done.
3. **400, 401, 403, 404:** the booking was not created. Do not retry. Report the failure.
4. **409, timeout, network error, 500, 502, 503:** the booking may or may not exist. Call `GET /trip/external/details/{externalId}`.
   - **2xx and `trip.id` equals your `optionId` and `status` is `"Confirmed"`:** the booking exists. Save `bookingId` and `bookingReference` from it. Done.
   - **404, and the book call was your first attempt and answered 409:** nothing was booked under your `externalId`. The option cannot be booked any more (its price changed, or it was already booked). Search again and confirm the new price with the customer.
   - **404, and the book call timed out or answered 5xx:** retry the book call with the **same** `optionId` and `externalId` after a backoff (honour `Retry-After`), at most 3 attempts in total, running step 4 after each attempt. A repeated book of the same option cannot create a second booking: it answers 409.
   - **404, and a retry answered 409 after an earlier attempt with unknown outcome:** the earlier attempt may have created the booking. Do not book another option. Flag the order for manual review and contact Daytrip support with the `x-correlation-id` of each attempt.
   - **Anything else from the details call that is a definite answer** (2xx with a different `trip.id`, 2xx with `status: "Cancelled"`, or 403): your `externalId` is not unique or the state is not what you expect. Do not book again. Flag the order for manual review.
   - **The details call itself fails** (timeout, 429, 5xx): retry it with backoff. Do not tell the customer the booking failed until you have a definite answer; flag the order for manual review if you cannot get one.

Never run two book calls for the same option at the same time.

---

## 8. What to store per booking

`bookingId`, `bookingReference`, your `externalId`, the `optionId`, the `currency` of the search, `trip.pricing.totalPrice`, `departureTimeUtc`, `originTimezone`, and the `x-correlation-id` of the book call.

Show the customer: `bookingReference`, local departure time (from `departureTimeUtc` and `originTimezone`), the pickup point and `meetingPosition.instructions`, whether it is meet and greet, the vehicle, and later the driver's name, phone and vehicle.

---

## 9. Test checklist for the sandbox

Run these against the sandbox before requesting a production key. Use a departure at least a week ahead unless the case says otherwise.

1. Search by coordinates returns options; every option has `vehicle` and no `vehicles`.
2. Search with `includeMultipleVehicles=true` and 10 passengers returns options with `vehicles`; your accessor handles both shapes.
3. Search by IATA code works; an unknown code returns 200 with empty `options`.
4. Search with a departure in 2 hours returns empty `options` and your UI shows "not available".
5. Search with a timestamp in milliseconds returns 400.
6. `departureTime` and `departureTimeLocal` for the same wall-clock time give the same `pickUp.time`.
7. Customize the original option with two stops; the new option has a new id, both stops in `includedStops`, a higher `totalPrice` and a longer `travelTimeMinutes`. Customize the original again with one stop; the result has exactly that one stop.
8. Book with Lead + Adult + Child; store ids; details returns `status: "Confirmed"` and the same passengers.
9. Book the same option again: 409. Your recovery procedure finds the existing booking by `externalId`.
10. Book with `over18: false`, with a phone without `+`, and with two Leads: each is a 400 that your form validation would have caught first.
11. Book with more passengers than the vehicle capacity: 400.
12. Details by `externalId` returns the same booking as details by `bookingId`.
13. Update the flight number and address notes; the response shows them. Update with only `bookingId`: 400.
14. Cancel: `penalty` is 0, details then shows `status: "Cancelled"` and `cancelledAt`. Cancel again: 409, handled as success.
15. Drivers and tracking on a fresh booking return empty arrays without error.
16. Search a route whose pickup is in a pedestrian zone (the public documentation uses Dubrovnik old town, `42.639515, 18.108064`, to Venice, `45.434143, 12.333497`; ask Daytrip for a sandbox example if that returns an unadjusted pickup): `pickUp.state` is `adjusted`, your UI shows the adjusted point, and after booking `meetingPosition.instructions` is shown to the customer.
17. A request without the API key returns 401 and your client reports a configuration error rather than "no results".
18. Every call logs the response `x-correlation-id`.

---

## 10. Contacts

- API keys and onboarding: partners@daytrip.com
- Problems with a booking: daytrip@daytrip.com, +44 20 3318 1119, +1 628 201 9501. Quote the `bookingReference` and, for API errors, the `x-correlation-id`.
