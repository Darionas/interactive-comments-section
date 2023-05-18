import {users} from './users.js';
const header = document.querySelector('.header');

export function members() {

    users.forEach((item) => {
        const image = document.createElement('picture');
        image.classList.add('header__image');
        header.appendChild(image);
  
        image.innerHTML =
        `<source srcset="${item.image.webp}" type="image/webp">
        <source srcset="${item.image.png}" type="image/jpeg"> 
        <img class="${item.username}" src="${item.image.png}" alt="${item.username}">
        `.trim();
    
    })

const juliusomo = document.querySelector('.juliusomo');
const amyrobson = document.querySelector('.amyrobson');
const maxblagun = document.querySelector('.maxblagun');
const ramsesmiron = document.querySelector('.ramsesmiron');

juliusomo.addEventListener('animationstart', function(){
    juliusomo.style.visibility = 'visible';
}, false)

amyrobson.addEventListener('animationstart', function(){
    amyrobson.style.visibility = 'visible';
}, false)

maxblagun.addEventListener('animationstart', function(){
    maxblagun.style.visibility = 'visible';
}, false)

ramsesmiron.addEventListener('animationstart', function(){
    ramsesmiron.style.visibility = 'visible';
}, false)
}