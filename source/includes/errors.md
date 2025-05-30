# Errors

Daytrip uses conventional HTTP response status codes to indicate the success or failure of an API request. In general: codes in the 2xx range indicate success. Codes in the 4xx range indicate an error that failed given the information provided (e.g., a required parameter was omitted, no trip was found for given parameters, etc.). Codes in the 5xx range indicate an error with Daytrip's service (these are rare).

## HTTP status code meanings

| HTTP Code | Meaning                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------- |
| 400       | Bad Request - Missing mandatory parameters, wrong types of parameters or not a valid json.     |
| 401       | Unauthorized - API key is missing or invalid.                                                  |
| 403       | Forbidden - The requested operation is forbidden.                                              |
| 404       | Not Found - No trips found, trip option not found, booking not found, endpoint does not exist. |
| 409       | Conflict - Trip option already booked, trip option already cancelled.                          |
| 500       | Internal Server Error - We had a problem with our service. Please retry your request.          |
| 502       | Bad Gateway - We had a problem with an external service. Please retry your request.            |
| 503       | Service Unavailable - We had a problem with our service. Please retry your request.            |

## Error response body

> Error response body example:

```json
{
  "statusCode": 404,
  "message": "Booking not found"
}
```

Each error response has an unified JSON body:

| Property   | Type    | Description                                                                                                                                                      |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| statusCode | integer | The HTTP status of the call duplicated in the body to allow easier logging and error handling. You can base your error handling logic on this property entirely. |
| message    | string  | Informative message about the reason of this error. Error handling logic should not use this property, it should be used for debugging purposes only.            |
