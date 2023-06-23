//'Use strict'
/*jshint esversion: 8*/

import {members} from './members.js';
import {users} from './users.js';
members();



let get, getOld, getNew, get_update, comments, comm, ownerImage, comment_reply, reply, currentUser, comment_container, comment_container_reply, reply_container,
comment_reply_owner, comment__you, comment__editor, reply__you, reply__editor, currentUser_update, vote, plus, minus;
let x = 0;



//https://stackoverflow.com/questions/74522728/how-to-use-data-json-in-browsers-local-storage-to-load-the-page-with-javascript
//fetch data fron json and set it to localStorage and get it from localStorage

fetch('data.json')
    .then((response) => response.json())
    .then((data) => {
        if(typeof(Storage) !== 'undefined') {
            //console.log(data);
            localStorage.setItem('data', JSON.stringify(data));
            init();
        } else {
            alert('Sorry! No Web Storage support.')
        }
    })

//dynamically populate data to html  
function exec() {
    let n = 0;
    comments.forEach((item) => {
        //console.log(item.user.username);
        //console.log(currentUser.username);
        if(item.user.username === currentUser.username) {
           comment__you = `<span class="comment_header-owner">you</span>`;
           comment__editor = `<div class="comment_editor">
           <div class="comment_delete"><img class="delete" src="images/icon-delete.svg" alt="Delete" />Delete</div>
           <div class="comment_edit"><img class="edit" src="images/icon-edit.svg" alt="Edit" />Edit</div>
       </div>`
        } else {
            comment__you = ``;
            comment__editor = `<div class="comment_editor">
            <div class="comment_reply"><img class="replay" src="images/icon-reply.svg" alt="Replay" />Reply</div>
        </div>`;
        }

        
        //Comment without reply construct
        if(item.replies.length === 0) {
            //console.log(name);
            comment_container =
                `<div class='comment' id='${item.id}' style='margin: 0 0 1rem 0;'>
                    <div class="comment_header">
                        <picture class="comment_header-picture">
                            <source srcset="${item.user.image.webp}" type="image/webp">
                            <source srcset="${item.user.image.png}" type="image/jpeg"> 
                            <img src="${item.user.image.png}" alt="${item.user.username}">
                        </picture>
                        <div class="comment_header-container">
                            <span class="comment_header-name">${item.user.username}</span>
                            ${comment__you}
                            <span class="comment_header-time">${item.createdAt}</span>
                        </div>
                    </div>
                    <div class="comment_content" contenteditable="false">${item.content}</div>
                    <button class="comment_update">update</button>
                    <div class="comment_vote">
                        <span class="comment_vote-plus"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class='plus' d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></span>
                        <span class="comment_vote-content">${item.score}</span>
                        <span class="comment_vote-minus"><svg width="11" height="7" xmlns="http://www.w3.org/2000/svg"><path class="minus" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></span>
                    </div>
                    ${comment__editor}
                </div>`.trim();
              
            document.querySelector('.main_comments-replies-section').innerHTML += comment_container;
       
        }

        //Comment with at least one reply construct
        if(item.replies.length > 0) {
            //console.log(item.replies);  
            comment_container_reply = 
                `<div class='comment' id='${item.id}' style='margin: 0 0 1rem 0;'>
                    <div class="comment_header">
                        <picture class="comment_header-picture">
                            <source srcset="${item.user.image.webp}" type="image/webp">
                            <source srcset="${item.user.image.png}" type="image/jpeg"> 
                            <img src="${item.user.image.png}" alt="${item.user.username}">
                        </picture>
                        <div class="comment_header-container">
                            <span class="comment_header-name">${item.user.username}</span>
                            ${comment__you}
                            <span class="comment_header-time">${item.createdAt}</span>
                        </div>
                    </div>
                    <div class="comment_content" contenteditable="false">${item.content}</div>
                    <button class="comment_update">update</button>
                    <div class="comment_vote">
                        <span class="comment_vote-plus"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class='plus' d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></span>
                        <span class="comment_vote-content">${item.score}</span>
                        <span class="comment_vote-minus"><svg width="11" height="7" xmlns="http://www.w3.org/2000/svg"><path class="minus" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></span>
                    </div>
                    ${comment__editor}
                </div>`.trim();    
            comm = document.querySelector('.main_comments-replies-section');       
            comment_reply = document.createElement('div');
            comment_reply.classList.add('main_comment-reply-container');
            comm.appendChild(comment_reply);
            document.querySelector('.main_comment-reply-container').innerHTML += comment_container_reply; 

            n++;
            reply = comments[n].replies;
            //console.log(reply);
            reply.forEach((item) => {
                if(item.user.username === currentUser.username) {
                    reply__you = `<span class="reply_header-owner">you</span>`;
                    reply__editor = `<div class="reply_editor">
                    <div class="reply_delete"><img class="delete" src="images/icon-delete.svg" alt="Delete" />Delete</div>
                    <div class="reply_edit"><img class="edit" src="images/icon-edit.svg" alt="Edit" />Edit</div>
                </div>`
                 } else {
                     reply__you = ``;
                     reply__editor = `<div class="reply_editor">
                     <div class="reply_reply"><img class="replay" src="images/icon-reply.svg" alt="Replay" />Reply</div>
                 </div>`;
                 }
                reply_container =
                    `<div class='replies'>
                        <div class="reply" id="${item.id}" style='margin: 0 0 1rem 0;'>
                            <div class="reply_header">
                                <picture class="reply_header-picture">
                                    <source srcset="${item.user.image.webp}" type="image/webp">
                                    <source srcset="${item.user.image.png}" type="image/jpeg"> 
                                    <img src="${item.user.image.png}" alt="${item.user.username}">
                                </picture>
                                <div class="reply_header-container">
                                    <span class="reply_header-name">${item.user.username}</span>
                                    ${reply__you}
                                    <span class="reply_header-time">${item.createdAt}</span>
                                </div>
                            </div>
                            <div class="reply_content" contenteditable="false"><span class="replayinTo">${'@'+item.replyingTo}</span> ${item.content}</div>
                            <button class="reply_update">update</button>
                            <div class="reply_vote">
                                <span class="reply_vote-plus"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class='plus' d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></span>
                                <span class="reply_vote-content">${item.score}</span>
                                <span class="reply_vote-minus"><svg width="11" height="7" xmlns="http://www.w3.org/2000/svg"><path class="minus" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></span>
                            </div>
                            ${reply__editor}
                        </div>
                    </div>`.trim();

                document.querySelector('.main_comment-reply-container').innerHTML += reply_container;
            })
        }
      
    });


    //Reply construct
    comment_reply_owner = document.getElementsByClassName('comment');
    let wow = document.getElementsByClassName('comment_reply');
    for(let i=0; i < wow.length; i++) {
        wow[i].addEventListener('click', function() {
            if(comment_reply_owner[i]) {
                const newreply = document.createElement('div');
                newreply.classList.add('reply_container');
                for(let e=0; e < users.length; e++) {
                    users[e];
                }

                newreply.innerHTML = 
                    `<div class="reply_owner">
                        <picture class="picture_owner">
                            <source srcset="${users[x].image.webp}" type="image/webp">
                            <source srcset="${users[x].image.png}" type="image/jpeg"> 
                            <img class="owner-img" src="${users[x].image.png}" alt="${users[x].username}">
                        </picture>
                        <textarea class="reply_owner-content" rows="3" aria-label="Write comment" placeholder="Add a comment..."></textarea>
                        <button class="reply_btn">reply</button>
                    </div>`;
                    
                    Element.prototype.appendAfter = function(element) {
                        element.parentNode.insertBefore(this, element.nextSibling);
                    }, false;
                    
                    newreply.appendAfter(comment_reply_owner[i]); 
            }
        })
    }
    
}

function init() {
    getOld = JSON.parse(localStorage.getItem('data'));
    if(localStorage.getItem('data')) {
        if(getNew) {
            while(comm.firstChild) {
                comm.removeChild(comm.firstChild);
            }
            get = Object.assign(getNew, getOld);
        } else {
            get = getOld;
        }

        //console.log(get);
        comments = get.comments;
        currentUser = get.currentUser;       
        exec();
        go();
    }
}

//init();

//--------------------------------------------------------------

//https://stackoverflow.com/questions/50338791/javascript-loop-through-object-array-and-pushing-elements-into-one-array
/*
let memb = [];
for(let i=0; i < users.length; i++) {
   name = users[i].username;
    //console.log(name);
    memb = memb.concat(name.split(','));
    
}
*/


//----------------------------------------------------------

    //Main reply construct with optional owner
    const owner = document.querySelectorAll('.owner');
    owner[0].classList.add('userstyle');  
    //window.onload = function() {return comments.} 
        //click one of iterated value, and on the same event remove class from anothers iterated values
        //https://stackoverflow.com/questions/56517103/add-a-simple-class-to-this-element-when-clicked-on-and-remove-class-from-other#answer-56517202
        owner.forEach(function(i) {
            i.addEventListener('click', function() {
                for(let i of owner) {
                    i.classList.remove('userstyle')
                }
                x = i.id
                this.classList.add('userstyle');
                currentUser.id = users[x].id;              
                currentUser.username = users[x].username;
                currentUser.image.png = users[x].image.png;
                currentUser.image.webp = users[x].image.webp;
                comments = get.comments;
                localStorage.setItem('data', JSON.stringify(get));
                getNew = JSON.parse(localStorage.getItem('data'));
                //console.log(JSON.parse(localStorage.getItem('data')));                  
                init();       
            });  
        });
        

    
    function go() {
        get_update = JSON.parse(localStorage.getItem('data'));
        currentUser_update = get_update.currentUser;
        
        ownerImage = 
        `<picture id="${currentUser_update.id}" class="main_respond-picture">
            <source srcset="${currentUser_update.image.webp}" type="image/webp">
            <source srcset="${currentUser_update.image.png}" type="image/jpeg"> 
            <!--stop animation in inline style-->
            <img class="${currentUser_update.username}" src="${currentUser_update.image.png}" alt="${currentUser_update.username}" style="visibility: visible; animation-duration: 0s; !important;">
        </picture>
        <textarea class="main_respond-content" rows="3" aria-label="Write comment" placeholder="Add a comment..."></textarea>
        <button class="send">send</button>`.trim();
    
        document.querySelector('.main_respond').innerHTML = ownerImage;
    }
    

    //Voting
setTimeout(vot, 100);
function vot() {
    vote = document.querySelectorAll('.comment_vote-content');
    plus = document.querySelectorAll('.comment_vote-plus');
    minus = document.getElementsByClassName('.comment_vote-minus');
 

    plus.forEach((item, key) => {
        let counter = Number(vote[key].innerHTML);
        item.addEventListener('click', function() {
            counter++;
            console.log(counter);           
        })
    
    })
}

    
    



