import {users} from './users.js';
//import {exec} from './index.js';
const header = document.querySelector('.header');


//populate owner of chat
export function members() {
    users.forEach((items) => {
        const image = document.createElement('div');
        image.classList.add('header__image');
        header.appendChild(image);
        
        
        image.innerHTML =
            `<picture>
                <source class = 'webp' srcset="${items.image.webp}" type="image/webp">
                <source class = 'png' srcset="${items.image.png}" type="image/jpeg"> 
                <img class="${items.username} owner" src="${items.image.png}" alt="${items.username}">
            </picture>`.trim();
        
    })
    
    
    let setOwner = document.querySelectorAll('.owner');
    //setOwner[0].classList.add('userstyle');
        for(let i = 0; i < setOwner.length; i++) {
            setOwner[i].addEventListener('click', function() {
                execo();
                setOwner[i].classList.add('userstyle');
                //exec();
            })
        }
    
    function execo() {
        let removeOwner = document.querySelectorAll('.owner');
        for(let i = 0; i < removeOwner.length; i++) {
            let classCheck = removeOwner[i].classList.contains('userstyle');
            if(classCheck) {
                removeOwner[i].classList.remove('userstyle');
            }
        }
    }
    
    let styleOwner = document.querySelectorAll('.owner');
    for(let i = 0; i < styleOwner.length; i++) {
        styleOwner[i].addEventListener('animationstart', function(){
            styleOwner[i].style.visibility = 'visible';
        }, false)
    }

}

