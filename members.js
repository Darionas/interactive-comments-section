import {users} from './users.js';
const header = document.querySelector('.header');

export function members() {
    users.forEach((items) => {
        const image = document.createElement('div');
        image.classList.add('header__image');
        header.appendChild(image);
  
        image.innerHTML =
        `<picture data-Id="${items.id}">
        <source srcset="${items.image.webp}" type="image/webp">
        <source srcset="${items.image.png}" type="image/jpeg"> 
        <img class="${items.username} owner" src="${items.image.png}" alt="${items.username}">
        </picture>`.trim();
       
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

