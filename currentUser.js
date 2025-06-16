/*'Use strict'*/
/*jshint esversion: 9*/

import {users} from './users.js';
const header = document.querySelector('.header');


export function removeAllOwnerStyles() {
        document.querySelectorAll('.owner').forEach(btn => btn.classList.remove('userstyle'));
}

//populate owners of chat
export function admin() {
    if (!header) return; // Prevent errors if header is missing
    users.forEach((items) => {
        const image = document.createElement('div');
        image.classList.add('header__image');
        
        image.innerHTML =
            `<button type="button" class="${items.username} owner" aria-label="Switch to user ${items.username}">
                 <img src="${items.image.png}" alt="Profile picture of ${items.username}">
            </button>`.trim();
            
        header.appendChild(image);
    });
    
    
    let setOwner = document.querySelectorAll('.owner');
       // Set first user as active by default
       setOwner[0]?.classList.add('userstyle'); 

    setOwner.forEach(ownerBtn => {
        ownerBtn.addEventListener('click', () => {
            removeAllOwnerStyles();
            ownerBtn.classList.add('userstyle');
        });
        ownerBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                ownerBtn.click();
            }
        });
    });
    
    let styleOwner = document.querySelectorAll('.owner');
    for(let i = 0; i < styleOwner.length; i++) {
        styleOwner[i].addEventListener('animationstart', function(){
            styleOwner[i].style.visibility = 'visible';
        }, false);
    }

}

