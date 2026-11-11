# Change Log

- **2026-11-11**: Trip API documentation corrected to match the API: shared trips are no longer offered and `includeShared` has no effect; the [/customize](#trip-customize) endpoint adds the selected stops to the stops already included in the option; a search with no available trip returns an empty `options` list; rules for removing values with [/update](#trip-update); `expiresAt` of options; the 429 status code. Example requests and responses of the Trip API and the Hourly Ride search were replaced with ones that return data on the sandbox. Added the [Trip API integration guide for AI coding agents](#ai-coding-agents).
- **2026-10-06**: Added vehicle type `PremiumVan` to the Trip API and Hourly Ride API [Vehicle](#vehicle) object. The [Day Trips API](#daytripvehicle) returns the same vehicle as `premiumVan`.
- **2026-09-11**: Trip API: added `over18` to [PassengerDetail](#passengerdetail) as the way to confirm the lead passenger is an adult; `birthday` is deprecated and only required when `over18` is not sent. Responses now include `over18: true` for the lead passenger, matching the Hourly Ride API.
- **2025-12-02**: Added Hourly Ride API endpoints documentation.
- **2025-08-01**: Added Day Trips API endpoints documentation.
- **2025-07-16**: Updated base endpoint addresses with the new domain name.
- **2025-06-03**: Added support for meeting positions in private trips.
- **2025-05-20**: Introduced multi-vehicle trip options.
- **2025-04-02**: Extended /search and /book endpoints to accept departure time in local time.
- **2025-03-28**: Added modelDescription field to Vehicle object.
- **2025-01-20**: Added the ability to search by airport code.
- **2024-12-10**: Added timezone information to pickup and dropoff positions in the search response.
- **2024-09-09**: Added the ability to search and book shared trips.
- **2024-05-24**: Introduced endpoints to retrieve drivers assigned to trips and track drivers' positions.
- **2023-11-06**: Added support for airport transfers.
- **2023-01-23**: Initial version.
