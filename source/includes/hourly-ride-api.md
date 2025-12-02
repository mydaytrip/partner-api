# Hourly Ride API

An hourly ride is a time-based rental service where passengers rent a driver with a vehicle for a specified duration, starting and ending at the same location. Each search will return multiple hourly ride options that can differ by vehicle type. The service includes number of kilometers included in travel per hour rented.

## Flows

Hourly Ride API can be used to search for hourly ride options and then book the option.

### Simple hourly ride

A typical flow would look like this:

1. call [/search](#search-endpoint) endpoint to get possible options
2. call [/book](#book-endpoint) endpoint to book the chosen option
3. `optional` - call [/details](#details-endpoint) endpoint to get hourly ride and booking details

### Cancelling an hourly ride

A flow to book an hourly ride, get details about it and then cancel it would look like this:

1. call [/search](#search-endpoint) endpoint to get possible options
2. call [/book](#book-endpoint) endpoint to book the chosen option
3. `optional` - call [/details](#details-endpoint) endpoint to get hourly ride and booking details
4. call [/cancel](#cancel-endpoint) endpoint to cancel the booking

### Changing an hourly ride

If you want to change departure time, duration, or any other booking details, you need to cancel the existing booking and create a new one as changes can affect the price.

## Search endpoint

This endpoint returns all available hourly ride options based on the specified pickup location, departure time, duration, and passenger count. The pickup location can be provided either as geographic coordinates or as an IATA airport code. Geographic coordinates should be specified as latitude and longitude in decimal degrees format, for example: `39.753657`, `-117.610215`. The departure time must be provided as a UNIX epoch timestamp in seconds (e.g., 1679463169), calculated from the local departure time and converted to UTC. Response times will be in ISO 8601 format.

> To search for an hourly ride in Prague for 3 passengers for 6 hours, use this call:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v1/hourly-rides/search?originType=iata&origin=PRG&departureTime=1769855400&hoursRented=6&passengersCount=3&childrenCount=1" \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> To search for an hourly ride from Dubrovnik Old Town for 10 passengers for 6 hours, use this call:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v1/hourly-rides/search?originLatitude=42.639859&originLongitude=18.109776&departureTime=1769855400&hoursRented=6&passengersCount=10&childrenCount=1" \
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
    "passengersCount": 10,
    "childrenCount": 1,
    "options": [
        {
            "id": "1d32109f-c2e2-44fe-b2cf-461ef3730541",
            "type": "Private",
            "englishSpeakingDriver": true,
            "hoursRented": 6,
            "includedKilometers": 120,
            "pricing": {
                "totalPrice": 385,
                "currency": "EUR"
            },
            "pickUp": {
                "lat": 42.6420632,
                "lon": 18.1131754,
                "time": "2026-01-31T10:30:00Z",
                "timezone": "Europe/Zagreb",
                "description": "Ploce Gate, Ul. Frana Supila 2",
                "meetAndGreet": false,
                "immutable": true,
                "state": "adjusted",
                "adjustmentReason": "restricted_area",
                "address": "Vrata od Ploča, Ul. Vrata od Ploča, 20000, Dubrovnik, Croatia",
                "image": "https://daytrip.imgix.net/management/dubrovnik.png?w=480&q=50"
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
            "cancellationPolicy": "Flexible",
            "expiresAt": "2025-11-23T18:00:00Z"
        }
    ]
}
```

### Endpoint Details

`GET /partners/v1/hourly-rides/search`

### Query Parameters

| Parameter       | Type    | Description |
| --------------- | ------- | ----------- |
| originType      | string  | Specifies whether the origin is provided as geo-coordinates or as an airport code. Possible values: `coordinates`, `iata`. If omitted, the default value is `coordinates`. |
| originLatitude  | number  | Pickup location latitude in degrees. Required if `originType` is set to `coordinates` or omitted. |
| originLongitude | number  | Pickup location longitude in degrees. Required if `originType` is set to `coordinates` or omitted. |
| origin          | string  | IATA airport code of the pickup airport. Required if `originType` is set to `iata`. |
| departureTime   | integer | Departure time as a UNIX epoch timestamp in seconds. This timestamp should be calculated from the local departure time and converted to UTC. |
| hoursRented     | integer | Duration of the rental in hours. |
| passengersCount | integer | Total number of passengers to transport (adults and children). |
| childrenCount   | integer | Optional. Specifies the number of children in the group. |

**Note**: Meeting positions are automatically included in results. When the requested address is in an area that vehicles cannot access directly (e.g., restricted zones, pedestrian areas), the API will return the nearest accessible meeting point with relevant details.

### Response body

| Property        | Type                                          | Description                                        |
| --------------- | --------------------------------------------- | -------------------------------------------------- |
| searchId        | string                                        | Unique id of your search query.                    |
| passengersCount | integer                                       | The count of passengers this search query was for. |
| childrenCount   | integer                                       | The count of children this search query was for.   |
| options         | list of [HourlyRideOption](#hourlyrideoption) | List of options for this hourly ride.              |

### Error status codes

| Status code | Description                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| 400         | Invalid request - missing mandatory query parameter, parameter has wrong type or wrong passenger count. |
| 401         | API key missing or invalid.                                                                             |

## Book endpoint

This endpoint creates a booking for the selected hourly ride option. The booking must include lead passenger details and can optionally include additional adult and child passenger details with required child seats.

> To book an hourly ride option, use this call:

```bash
curl -X POST "https://papi.staging.mydaytrip.net/partners/v1/hourly-rides/book" \
  -H "x-api-key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "optionId": "1d32109f-c2e2-44fe-b2cf-461ef3730541",
    "customerNote": "Please call upon arrival",
    "passengerDetails": [
        {
            "type": "Lead",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "phone": "+420123456789",
            "over18": true
        },
        {
            "type": "Adult",
            "firstName": "Jane",
            "lastName": "Doe"
        },
        {
            "type": "Child",
            "firstName": "Tommy",
            "lastName": "Doe",
            "childSeatType": "BoosterSeat"
        }
    ],
    "externalId": "partner-booking-123"
}'
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
    "bookingId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "bookingReference": "DT-ABC123",
    "departureTimeUtc": "2022-12-05T18:00:00Z",
    "originTimezone": "Europe/Prague",
    "meetAndGreet": false,
    "hourlyRide": {
        "hoursRented": 6,
        "includedKilometers": 120,
        "pickUp": {
            "lat": 50.0755,
            "lon": 14.4378,
            "address": "Václavské náměstí, Prague, Czech Republic",
            "time": "2022-12-05T18:00:00Z",
            "timezone": "Europe/Prague",
            "meetAndGreet": false,
            "immutable": true,
            "state": "adjusted"
        },
        "pricing": {
            "totalPrice": 26000,
            "currency": "EUR"
        },
        "vehicles": [
            {
                "type": "Sedan",
                "maxPassengers": 3,
                "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
                "modelDescription": "VW Passat or similar",
                "image": "https://daytrip.imgix.net/site/sedan.png"
            }
        ]
    }
}
```

### Endpoint Details

`POST /partners/v1/hourly-rides/book`

### Request body

| Property         | Type                                        | Description                                                                                                |
| ---------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| optionId         | string                                      | Required. The ID of the hourly ride option to book from the search response.                               |
| passengerDetails | list of [PassengerDetail](#passengerdetail) | Required. List of passenger details. Must include exactly one Lead passenger. Can include Adult and Child. |
| customerNote     | string                                      | Optional. General notes for the driver.                                                                    |
| externalId       | string                                      | Optional. Your internal booking reference ID for tracking purposes.                                        |

**Note**: Pickup location and departure time are determined by the option from the search. The pickup address is automatically resolved from coordinates during booking.

### Response body

| Property         | Type                                          | Description                                                   |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------- |
| bookingId        | string                                        | Unique booking identifier.                                    |
| bookingReference | string                                        | Human-readable booking reference (e.g., "DT-ABC123").         |
| departureTimeUtc | string                                        | Departure time in UTC (ISO 8601 format).                      |
| originTimezone   | string                                        | IANA timezone of the pickup location (e.g., "Europe/Prague"). |
| meetAndGreet     | boolean                                       | Whether meet and greet service is included.                   |
| hourlyRide       | [BookedHourlyRide](#bookedhourlyrideresponse) | Details of the booked hourly ride.                            |

### Error status codes

| Status code | Description                                                       |
| ----------- | ----------------------------------------------------------------- |
| 400         | Invalid request - missing required fields or invalid data format. |
| 401         | API key missing or invalid.                                       |
| 404         | Option not found or expired.                                      |
| 409         | Option no longer available or already booked.                     |

## Details endpoint

This endpoint retrieves full details of an existing hourly ride booking, including booking status, passenger information, and pricing details.

> To get booking details, use this call:

```bash
curl "https://papi.staging.mydaytrip.net/partners/v1/hourly-rides/details/a1b2c3d4-e5f6-7890-abcd-ef1234567890" \
  -H "x-api-key: your_api_key"
```

```javascript

```

```python

```

> The above call returns a JSON structured like this:

```json
{
    "bookingId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "bookingReference": "DT-ABC123",
    "externalId": "partner-booking-123",
    "status": "Confirmed",
    "createdAt": "2025-01-01T10:00:00Z",
    "departureTimeUtc": "2025-01-15T18:00:00Z",
    "originTimezone": "Europe/Prague",
    "meetAndGreet": false,
    "customerNote": "Please call upon arrival",
    "passengerDetails": [
        {
            "type": "Lead",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "phone": "+420123456789",
            "over18": true
        },
        {
            "type": "Adult",
            "firstName": "Jane",
            "lastName": "Doe"
        },
        {
            "type": "Child",
            "firstName": "Tommy",
            "lastName": "Doe",
            "childSeatType": "BoosterSeat"
        }
    ],
    "hourlyRide": {
        "hoursRented": 6,
        "includedKilometers": 120,
        "pickUp": {
            "lat": 50.0755,
            "lon": 14.4378,
            "address": "Wenceslas Square, Prague, Czech Republic",
            "time": "2025-01-15T18:00:00Z",
            "timezone": "Europe/Prague",
            "meetAndGreet": false,
            "immutable": true,
            "state": "adjusted"
        },
        "pricing": {
            "totalPrice": 26000,
            "currency": "EUR"
        },
        "vehicles": [
            {
                "type": "Sedan",
                "maxPassengers": 3,
                "description": "Sedan comparable to a Volkswagen Passat, up to 3 passengers with luggage.",
                "modelDescription": "VW Passat or similar",
                "image": "https://daytrip.imgix.net/site/sedan.png"
            }
        ]
    }
}
```

> Example response for a cancelled booking:

```json
{
    "bookingId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "bookingReference": "DT-ABC123",
    "status": "Cancelled",
    "createdAt": "2025-01-01T10:00:00Z",
    "cancelledAt": "2025-01-02T15:30:00Z",
    "departureTimeUtc": "2025-01-15T18:00:00Z",
    "originTimezone": "Europe/Prague",
    "meetAndGreet": false,
    "passengerDetails": [...],
    "hourlyRide": {...}
}
```

### Endpoint Details

`GET /partners/v1/hourly-rides/details/:bookingId`

### Path Parameters

| Parameter | Type   | Description             |
| --------- | ------ | ----------------------- |
| bookingId | string | Required. Booking UUID. |

### Response body

| Property         | Type                                          | Description                                                             |
| ---------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| bookingId        | string                                        | Unique booking identifier.                                              |
| bookingReference | string                                        | Human-readable booking reference (e.g., "DT-ABC123").                   |
| externalId       | string                                        | Optional. Your internal booking reference ID (if provided during book). |
| status           | string                                        | Booking status: "Confirmed" or "Cancelled".                             |
| createdAt        | string                                        | When the booking was created (ISO 8601 format).                         |
| cancelledAt      | string                                        | Optional. When the booking was cancelled (ISO 8601 format).             |
| departureTimeUtc | string                                        | Departure time in UTC (ISO 8601 format).                                |
| originTimezone   | string                                        | IANA timezone of the pickup location (e.g., "Europe/Prague").           |
| meetAndGreet     | boolean                                       | Whether meet and greet service is included.                             |
| customerNote     | string                                        | Optional. General notes for the driver (if provided during book).       |
| passengerDetails | list of [PassengerDetail](#passengerdetail)   | List of passenger details from the booking.                             |
| hourlyRide       | [BookedHourlyRide](#bookedhourlyrideresponse) | Details of the booked hourly ride.                                      |

### Error status codes

| Status code | Description                 |
| ----------- | --------------------------- |
| 401         | API key missing or invalid. |
| 404         | Booking not found.          |

## Cancel endpoint

This endpoint cancels an existing hourly ride booking. The refund amount depends on the cancellation policy and how far in advance the cancellation is made.

> To cancel a hourly ride booking, use this call:

```bash
curl -d '{ "bookingId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890" }' \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -X POST "https://papi.staging.mydaytrip.net/partners/v1/hourly-rides/cancel"
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

### Endpoint Details

`POST /partners/v1/hourly-rides/cancel`

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

## Hourly Ride API Data Types

### HourlyRideOption

Represents an available hourly ride option returned from search.

| Property                | Type                            | Description |
| ----------------------- | ------------------------------- | ----------- |
| id                      | string                          | Unique option identifier. |
| type                    | string                          | Always "Private" for hourly rides. |
| englishSpeakingDriver   | boolean                         | Whether the driver speaks English. |
| hoursRented             | integer                         | Duration in hours. |
| includedKilometers      | integer                         | Total kilometers included. |
| pricing                 | [Pricing](#pricing)             | Price information. |
| pickUp                  | [TripLocation](#triplocation)   | Details about the pickup point. |
| vehicles                | list of [Vehicle](#vehicle)     | Vehicles information. |
| luggage                 | [Luggage](#luggage)             | Luggage capacity information. |
| availableChildSeatTypes | list of [ChildSeat](#childseat) | Available child seat types for this option. |
| cancellationPolicy      | string                          | Cancellation policy: "Flexible", "SuperFlexible", or "NonRefundable". |
| expiresAt               | string                          | When this option expires (ISO 8601 format). |

### BookedHourlyRideResponse

Detailed information about a booked hourly ride (used in book and details responses).

| Property           | Type                          | Description                  |
| ------------------ | ----------------------------- | ---------------------------- |
| hoursRented        | integer                       | Duration in hours.           |
| includedKilometers | integer                       | Total kilometers included.   |
| pickUp             | [TripLocation](#triplocation) | Pickup location information. |
| pricing            | [Pricing](#pricing)           | Price information.           |
| vehicles           | list of [Vehicle](#vehicle)   | Vehicles information.        |

### TripLocation

Information about a pickup/dropoff location.

| Property         | Type    | Description                                                                   |
| ---------------- | ------- | ----------------------------------------------------------------------------- |
| lat              | number  | Latitude in decimal degrees.                                                  |
| lon              | number  | Longitude in decimal degrees.                                                 |
| address          | string  | Formatted address string resolved from Google Location API.                   |
| time             | string  | Pickup time (ISO 8601 format).                                                |
| timezone         | string  | IANA timezone (e.g., "Europe/Prague").                                        |
| meetAndGreet     | boolean | Whether meet and greet service is included.                                   |
| state            | string  | Location state: "original" or "adjusted".                                     |
| immutable        | boolean | Whether the location can be changed.                                          |
| adjustmentReason | string  | Optional. Reason for location adjustment (e.g., "restricted_area").           |
| description      | string  | Optional. Description of the meeting point (included in search response).     |
| image            | string  | Optional. URL to an image of the meeting point (included in search response). |

### Pricing

Price information.

| Property   | Type    | Description                                                   |
| ---------- | ------- | ------------------------------------------------------------- |
| totalPrice | integer | Total price in the currency's minor unit (cents for EUR/USD). |
| currency   | string  | Currency used for all prices in this response.                |

### Vehicle

Vehicle information.

| Property         | Type    | Description                                            |
| ---------------- | ------- | ------------------------------------------------------ |
| type             | string  | Vehicle type: "Sedan", "MPV", "Van", or "LuxurySedan". |
| maxPassengers    | integer | Maximum number of passengers.                          |
| description      | string  | Full vehicle description.                              |
| modelDescription | string  | Example model (e.g., "VW Passat or similar").          |
| image            | string  | URL to vehicle image.                                  |

**Note on Vehicle Types**: Hourly rides support 4 vehicle types:

- **Sedan** (VehicleType.Sedan = 0): Standard sedan, up to 3 passengers
- **MPV** (VehicleType.Mpv = 1): Compact MPV, up to 4 passengers
- **Van** (VehicleType.Van = 2): Van, up to 7 passengers
- **LuxurySedan** (VehicleType.LuxurySedan = 3): Luxury sedan, up to 2 passengers (priced at 1.35× Sedan price)

Lite vehicle types (SedanLite, MpvLite, VanLite) and Shuttle are not supported for hourly rides.

### Luggage

Luggage capacity information.

| Property          | Type    | Description                      |
| ----------------- | ------- | -------------------------------- |
| maxTotalCarryons  | integer | Maximum number of carry-on bags. |
| maxTotalSuitcases | integer | Maximum number of suitcases.     |

### ChildSeat

Information about available child seat types.

| Property           | Type    | Description                                                       |
| ------------------ | ------- | ----------------------------------------------------------------- |
| childSeatType      | string  | Type: "RearFacing", "ForwardFacing", "BoosterSeat", or "Booster". |
| description        | string  | Human-readable description.                                       |
| ageFrom            | integer | Minimum age in years.                                             |
| ageTo              | integer | Maximum age in years.                                             |
| weightInPoundsFrom | integer | Minimum weight in pounds.                                         |
| weightInPoundsTo   | integer | Maximum weight in pounds.                                         |
| weightInKilosFrom  | integer | Minimum weight in kilograms.                                      |
| weightInKilosTo    | integer | Maximum weight in kilograms.                                      |

### PassengerDetail

Passenger information for booking and details responses.

| Property      | Type    | Description                                                                                     |
| ------------- | ------- | ----------------------------------------------------------------------------------------------- |
| type          | string  | Required. Passenger type: "Lead", "Adult", or "Child".                                          |
| firstName     | string  | Required for Lead passenger. Optional for Adult and Child.                                      |
| lastName      | string  | Required for Lead passenger. Optional for Adult and Child.                                      |
| email         | string  | Required for Lead passenger.                                                                    |
| phone         | string  | Required for Lead passenger. Phone number with country code.                                    |
| over18        | boolean | Required for Lead passenger. Must be true (lead passenger must be 18+).                         |
| childSeatType | string  | Required for Child passenger. Type: "RearFacing", "ForwardFacing", "BoosterSeat", or "Booster". |

### RefundInfo

Refund information after cancellation.

| Property | Type    | Description                                                     |
| -------- | ------- | --------------------------------------------------------------- |
| amount   | integer | Refund amount in the currency's minor unit (cents for EUR/USD). |
| currency | string  | Currency code (ISO 4217).                                       |

## Cancellation Policy

All hourly rides follow the same cancellation policy:

- **100% refundable** when cancelled more than 24 hours before departure
- **No refund** when cancelled within 24 hours of departure

## Business Rules

### Duration and Distance

- **Minimum duration**: 1 hour (configured via `MIN_DURATION_HOURS_BOOKING`)
- **Maximum duration**: 24 hours (configured via `MAX_DURATION_HOURS_BOOKING`)
- **Included distance**: 20 km per hour rented by default (configured via `HOURLY_DRIVER_LIMIT_KMS_PER_HOUR` environment variable)
  - Example: 6 hours = 6 × 20 = 120 km included
- **Minimum charge**: Always charged for at least 4 hours (even if booking less)
  - This is applied during pricing calculation, not validation

### Booking and Cancellation Cutoff

- Bookings must be made at least **2 hours** before the departure time
- Cancellations within **24 hours** of departure will result in no refund (100% penalty)
- Cancellations more than **24 hours** before departure receive a full refund (0% penalty)

### Address Handling

- During search, if the pickup location is in a restricted area (e.g., pedestrian zone), a meeting position with address and description is included in the response
- The resolved address is stored with the booking and included in book and details responses
- In API responses, the address appears nested within the `pickUp` object (e.g., `pickUp.address`)
- Partners cannot specify custom pickup coordinates or addresses during booking - the system uses the coordinates from the search option

### Pricing

- Prices are calculated based on:
  - Driver hourly rate and waiting rate
  - Vehicle amortization and fuel costs
  - Regional pricing multipliers
  - Minimum 4-hour charge
- **LuxurySedan** pricing: Sedan price × 1.35
- Prices are always rounded up to the nearest whole currency unit

### Supported Regions

- Service is only available in specific pricing areas
- Searches outside service areas will return a 404 error
