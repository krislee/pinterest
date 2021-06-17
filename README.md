# Challenge #1 - Infinite Scroll
This project is an implementation of combining rendering pins from a static JSON dataset with infinite scroll feature.  

## Description
To provide the most succinct way to render pins from a static JSON dataset, only the frontend React framework was used while a backend framework was abstained. To implement the infinite scroll feature of the pins, the Intersection Observer API was used so that the "page" number changes when the scrollbar is at the bottom. When the "page" number changes, the next set of JSON pins are retrieved and rendered. 
## Getting Started
### Dependencies
The Internet Explorer browser does not support Intersection Observer API. Hence, infinite scrolling is not supported by Internet Explorer.
<br>
### Installing
Install the dependencies for this project (be sure you are inside the `Pinterest` folder when installing).
```
npm i
```
<br>

### Executing program
After installing dependencies, run the program locally (still be inside of the `Pinterest` folder).
```
npm start
```

## Acknowledgments
- [Masonary CSS Layout](https://dev.to/anobjectisa/build-a-pinterest-layout-using-html-css-2m2d)