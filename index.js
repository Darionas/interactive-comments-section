//'Use strict'
/*jshint esversion: 8*/

import {members} from './members.js';
members();


let myData, comments, reply, currentUser, comment_container, comment_container_reply, reply_container;


fetch('data.json')
    .then((response) => response.json())
    .then((data) => {
        if(typeof(Storage) !== 'undefined') {
            //console.log(data);
            localStorage.setItem('data', JSON.stringify(data));
        } else {
            alert('Sorry! No Web Storage support.')
        }

        myData = localStorage.getItem('data');

        if(localStorage.getItem('data')) {
        const get = JSON.parse(myData);
        console.log(get);
        comments = get.comments;
        currentUser = get.currentUser;       
        exec();
        }
    })


    
function exec() {
    comments.forEach((item) => {
        let n = 0;
        //console.log(item);
        
        if(item.replies.length === 0) {
            //console.log(item.replies);
            comment_container =
                `<div class='comment' data-id='${item.id}' style='margin: 0 0 1rem 0;'>
                    <div class="comment_header">
                        <picture class="comment_header-picture">
                            <source srcset="${item.user.image.webp}" type="image/webp">
                            <source srcset="${item.user.image.png}" type="image/jpeg"> 
                            <img src="${item.user.image.png}" alt="${item.user.username}">
                        </picture>
                        <div class="comment_header-container">
                            <span class="comment_header-name">${item.user.username}</span>
                            <span class="comment_header-owner">you</span>
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
                    <div class="comment_editor">
                        <div class="comment_delete"><img class="delete" src="images/icon-delete.svg" alt="Delete" />Delete</div>
                        <div class="comment_edit"><img class="edit" src="images/icon-edit.svg" alt="Edit" />Edit</div>
                        <div class="comment_reply"><img class="replay" src="images/icon-reply.svg" alt="Replay" />Reply</div>
                    </div>
                </div>`.trim();
              
               document.querySelector('.main_comments-replies-section').innerHTML += comment_container;   
        }
        
        if(item.replies.length > 0) {
            //console.log(item.replies);  
            comment_container_reply = 
            `<div class='comment' data-id='${item.id}' style='margin: 0 0 1rem 0;'>
            <div class="comment_header">
                <picture class="comment_header-picture">
                    <source srcset="${item.user.image.webp}" type="image/webp">
                    <source srcset="${item.user.image.png}" type="image/jpeg"> 
                    <img src="${item.user.image.png}" alt="${item.user.username}">
                </picture>
                <div class="comment_header-container">
                    <span class="comment_header-name">${item.user.username}</span>
                    <span class="comment_header-owner">you</span>
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
            <div class="comment_editor">
                <div class="comment_delete"><img class="delete" src="images/icon-delete.svg" alt="Delete" />Delete</div>
                <div class="comment_edit"><img class="edit" src="images/icon-edit.svg" alt="Edit" />Edit</div>
                <div class="comment_reply"><img class="replay" src="images/icon-reply.svg" alt="Replay" />Reply</div>
            </div>
        </div>`;    
        const comm = document.querySelector('.main_comments-replies-section');       
        const comment_reply = document.createElement('div');
        comment_reply.classList.add('main_comment-reply-container');
        comm.appendChild(comment_reply);
        document.querySelector('.main_comment-reply-container').innerHTML += comment_container_reply; 

        n++;
        reply = comments[n].replies;
        console.log(reply);
        reply.forEach((items) => {
            reply_container =
                `<div class="reply" style='margin: 0 0 1rem 0;'>
                    <div class="reply_header">
                        <picture class="reply_header-picture">
                            <source srcset="${items.user.image.webp}" type="image/webp">
                            <source srcset="${items.user.image.png}" type="image/jpeg"> 
                            <img src="${items.user.image.png}" alt="${items.user.username}">
                        </picture>
                        <div class="reply_header-container">
                            <span class="reply_header-name">${items.user.username}</span>
                            <span class="reply_header-owner">you</span>
                            <span class="reply_header-time">${items.createdAt}</span>
                        </div>
                    </div>
                    <div class="reply_content" contenteditable="false"><span class="replayinTo">${'@'+items.replyingTo}</span> ${items.content}</div>
                    <button class="reply_update">update</button>
                    <div class="reply_vote">
                        <span class="reply_vote-plus"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class='plus' d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></span>
                        <span class="reply_vote-content">${items.score}</span>
                        <span class="reply_vote-minus"><svg width="11" height="7" xmlns="http://www.w3.org/2000/svg"><path class="minus" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></span>
                    </div>
                    <div class="reply_editor">
                        <div class="reply_delete"><img class="delete" src="images/icon-delete.svg" alt="Delete" />Delete</div>
                        <div class="reply_edit"><img class="edit" src="images/icon-edit.svg" alt="Edit" />Edit</div>
                        <div class="reply_reply"><img class="replay" src="images/icon-reply.svg" alt="Replay" />Reply</div>
                    </div>
                </div>`.trim();

                document.querySelector('.main_comment-reply-container').innerHTML += reply_container;

            })

        }
    }); 
} 

    