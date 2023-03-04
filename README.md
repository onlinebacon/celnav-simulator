# Celestial Navigation Simulator

## Intro

This is a webgl2 based celestial navigation simulator. It simulates an observer with a nautical sextant somewhere on the ocean. The goal is to use the sextant to take readings of the celestial bodies and figure out your location.

## Current state

This web page is currently in progess. So far this is what is available: 
- A horizon with dip applied to it
- 1600+ of the brightest stars
- Mouse controls to move your view up, down, left and right
- A sextant view that splits the screen in two sights
- Mouse + keyboard control to play with the sextant angle
- The position of stars being affected by standard atmospheric refracion
- A randomization of your location and time that always end up in evening twilight
- Stars size dynamically change to keep them always looking close to a point
- Colored celestial bodies
- An interface for the user to check his coordinates
- Stars positions up-to-date
- Coordinates and starting time in the URL parameter
- Milky way in the background

## Next steps

- Add planets
- Improve stars/planets catalogue accuracy
- Prevent sextant from picking negative angles
- Add dynamic colors to the sky to match the twilight
- Add the Moon
- Add the Sun
- Improve controls
- Add some obscuration to the sky above the horizon
- Use "global uniforms" for webgl2 simplicity
- Radial gradiant around sextant scope
- Button to get link with coordinates instead of being always in the URL
