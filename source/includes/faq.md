# Frequently asked questions

## For how many passengers can I book a trip?

A single vehicle takes 1-7 passengers, depending on the vehicle type. For larger groups, search with `includeMultipleVehicles=true`: the search then accepts up to 99 passengers and returns options made of several vehicles where available.

## After receiving trip options, how much time do I have to book one of them?

Each Trip API option has its own `expiresAt` timestamp, currently 12 hours after the search. Always read it from the option instead of assuming a fixed period. An option can also stop being bookable earlier, when its price changes due to increased demand or when the departure gets too close. In such case you will need to repeat the search.

## Can I cancel a booking created via the API?

Yes, you can cancel a booking if it's departure is more than 24 hours in the future - this threshold is a subject to change.

## Once a booking is created, can it be cancelled or changed by Daytrip?

No, once a booking is created by calling our API, it is confirmed and guaranteed by Daytrip to be fulfilled. You do not need to subscribe to any booking status changes.

## Does the Daytrip API handle payments?

No, the Daytrip API does not handle payments. You are responsible for collecting online payments from the customers. You are also responsible for any currency conversion for display purposes (the API returns prices in the currency stated in the `currency` property of each response: EUR or USD based on the country of the trip, unless another currency was agreed for your account). Your company will be invoiced by Daytrip for the trips you book with us.

## Is the amount of requests for the Daytrip API limited?

You can send up to 2000 requests per minute to each endpoint. Requests over the limit are rejected with the 429 HTTP status code and a `Retry-After` header.
