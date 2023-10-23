# Twilio

Twilio is a third-party paid service for sending and recieving SMS messages.

To configure your app for Twilio:

* Visit <https://twilio.com> and create an account.  You will need also to verify a cell phone number.
* With a free account, you will get a "sandbox phone number".  However, all outbound messages will
  appear to come from the sandbox phone number, but you can only send initially (with a free account)
  to numbers that you have verified in your account settings on Twilio. (This won't be true with a paid account.)

You will need to define environment variables (e.g. in .env) for these two values, 
each of which you can get from your account settings at  <https://twilio.com>

```
TWILIO_ACCOUNT_SID=fill-this-in
TWILIO_AUTH_TOKEN=fill-this-in
```

