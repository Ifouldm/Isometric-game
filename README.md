# Untitled Isometric Game

This is an isometric game designed to be run in the browser, it uses a [node](https://nodejs.org/en/) / [express](https://expressjs.com/) server and socket.io to support multiplayer and [P5](https://p5js.org/) as a graphics library.

## Main goals:

- [x] Render isometric tiles
- [x] Draw map
- [x] Store map on server
- [x] Send map to clients
- [x] Mouse selection
- [x] Send update request
- [x] Save / Load maps
- [x] Zoom camera
- [ ] Wait until fully loaded
- [ ] Toolbar / UI overlay
- [ ] Game logic
    - [x] Tile metadata in json
    - [ ] Player characters
    - [ ] Non-player characters
    - [ ] AI ?

## Stretch goals:
- [ ] Chat
- [ ] Server console / commands

## Run in Development

```sh
npm run serve
```

## Run in Production

```sh
npm start
```