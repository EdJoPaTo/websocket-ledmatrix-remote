# WebSocket LED-Matrix Remote

There is [an LED-Matrix at home](https://github.com/EdJoPaTo/websocket-ledmatrix-esp) which listens to this WebSocket Server.

Feel free to send stuff to it.

But please be a friendly human being and dont be overly spammy.

## Usage

Open the [website ledmatrix.edjopato.de](https://ledmatrix.edjopato.de/) and
play around with it.

You can also connect with your tool of choice to the WebSocket directly over at
`wss://letmatrix.edjopato.de/ws`. It accepts stringified JSON like this:
`JSON.stringify({x: 2, y: 4, r: 0, g: 128, b: 255})` ==
`{"x":2,"y":4,"r":0,"g":128,"b":255}`.
