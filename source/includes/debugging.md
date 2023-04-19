# Debugging

Every response from the Daytrip API contains a `x-correlation-id` header with a unique identifier of the HTTP call. If you send us this identifier, we can give you more detailed info about what went wrong with your call.

If you are using correlation ids on your side as well, you can send us `x-correlation-id` header with your requests and we will use your own correlation id value.

[About correlation ids](https://microsoft.github.io/code-with-engineering-playbook/observability/correlation-id/)
