/*'Use strict'*/
/*jshint esversion: 8*/

import {members} from './members.js';
import {users} from './users.js';
members();


let comment, get, getOld, getNew, get_update, comm, ownerImage, comment_repl, reply, comment__noReplay, comment__reply,
comment__you, comment__editor, reply__you, reply__editor, currentUser_update, reply__container;
let x = 0;
let m = 10;
let genId, genIds, delet, getOwnerName, getUserId;
let commId, getIdx, currentUser, comments, data, comms, replyContainer, mainRespond, ownerContainer;
let owner = document.querySelectorAll('.owner');
let flag = false;
let delCont, delComm, delWrap, delGroup, tor, childrens, answ, test;




//https://stackoverflow.com/questions/74522728/how-to-use-data-json-in-browsers-local-storage-to-load-the-page-with-javascript
//fetch data from json and set it to local storage
fetch('data.json')
    .then(function(response) {
        //console.log(response.json());
        return response.json();
    })
    .then(function(data) {
        if(typeof(Storage) !== 'undefined') {
            //console.log(data);
            localStorage.setItem('data', JSON.stringify(data));
            getData();
            owner[0].classList.add('userstyle');
            exec();
            
            //datos = JSON.parse(localStorage.getItem('data'));
            //objDestr();
        } else {
            alert('Sorry! No Web Storage support.')
        }
    })
    .catch(function(err) {console.log(err.message)});

//get/parse data from local storage
function getData() {
    data = JSON.parse(localStorage.getItem('data'));
    currentUser = data.currentUser;
    comments = data.comments;
    //console.log(currentUser);
}


//navigate between users
for(let i = 0; i < owner.length; i++) {
    owner[i].addEventListener('click', function() { 
        let checkClass = owner[i].classList.contains('userstyle');
        if(checkClass) {
            console.log(owner[i].parentNode);
            currentUser.username = owner[i].classList[0];
            currentUser.id = users[i].id;
            currentUser.image.png = owner[i].parentNode.childNodes[3].srcset; //get siblings innerHTML
            currentUser.image.webp = owner[i].parentNode.childNodes[1].srcset; //get siblings innerHTML
           
            localStorage.setItem('data', JSON.stringify(data));
            comms.innerHTML = '';
            exec();
        }   
    })
}


function exec() {
    //owner[0].classList.add('userstyle');
    /* data = JSON.parse(localStorage.getItem('data'));
    currentUser = data.currentUser;
    comments = data.comments;
    console.log(currentUser);
    console.log(comments);
    console.log(data); */
    getData();
    //console.log(data);
    //console.log(currentUser);
    console.log(comments);
    console.log(currentUser);
    
    let n = 0;
    comments.forEach((item) => {
        //console.log(item.user.username);
        //console.log(currentUser.username);
        //console.log(Object.values(item.user).includes(currentUser.username));
        if(Object.values(item.user).includes(currentUser.username)) {
           //console.log(item.user.username);
            //console.log(currentUser.username);
           comment__you = `<span class="comment_header-owner">you</span>`;
           comment__editor = `<div class="comment_editor">
           <div class="comment_delete"><img class="delete" src="images/icon-delete.svg" alt="Delete" />Delete</div>
           <div class="comment_edit"><img class="edit" src="images/icon-edit.svg" alt="Edit" />Edit</div>
       </div>`
        } else {
            comment__you = ``;
            comment__editor = `<div class="comment_editor">
            <div class="comment_reply c_reply-single"><img class="replay" src="images/icon-reply.svg" alt="Replay" />Reply</div>
        </div>`;
        }
            
        //Comment without reply construct
       /*  if(item.replies.length === 0) {
            genId = Math.floor(Math.random() * 1001);
            //console.log(name);
            comment__noReplay =
                `<div class='wrapper__comment' id='${item.id}${genId}'>
                <div class='comment' id='${item.id}' style='margin: 0 0 1rem 0;'>
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
                    <div class="comment_content" contenteditable='true'>${item.content}</div>
                    <button class="comment_update">update</button>
                    <div class="comment_vote">
                        <span class="comment_vote-plus"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class='plus' d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></span>
                        <span class="comment_vote-content">${item.score}</span>
                        <span class="comment_vote-minus"><svg width="11" height="7" xmlns="http://www.w3.org/2000/svg"><path class="minus" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></span>
                    </div>
                    ${comment__editor}
                    <div>
                </div>`.trim();
              
            document.querySelector('.main_comments-replies-section').innerHTML += comment__noReplay;
            
        } */

        //Comment with at least one reply construct
            comment = 
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
                    <div class="comment_content" contenteditable='true'>${item.content}</div>
                    <button class="comment_update">update</button>
                    <div class="comment_vote">
                        <span class="comment_vote-plus"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class='plus' d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></span>
                        <span class="comment_vote-content">${item.score}</span>
                        <span class="comment_vote-minus"><svg width="11" height="7" xmlns="http://www.w3.org/2000/svg"><path class="minus" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></span>
                    </div>
                    ${comment__editor}
                </div>`.trim();   
          
            //comm = document.querySelector('.main__comments-replies-section');       
            //comment_repl = document.createElement('div');
            //comment_repl.classList.add('main_comment-reply-group');
            //comm.appendChild(comment_repl);
            comms = document.querySelector('.main__comments-section');
            //comms.insertAdjacentHTML('afterbegin', comment);
            //comms.insertAdjacentHTML('afterend', comment);
            //comms.insertAdjacentHTML('beforebegin', comment);
            
            comms.insertAdjacentHTML('beforeend', comment);
            
            //const lol = item.id + `${genId}`;
            //console.log(lol);
            //const lor = document.getElementById(lol);
            //console.log(lor.parentNode);
            
                       
            //console.log(item.replies.length);
            if(item.replies.length > 0) {
            n++;
            reply = item.replies; //comments[n].replies;
            //console.log(reply);
            reply.forEach((item) => {
                //console.log(item);
                genIds = Math.floor(Math.random() * 1001);
                //console.log(genIds);
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

                //const reply_container = document.createElement('div');
                reply__container =
                    `<div class='rep'>
                    <div class="reply" id='${item.id}' style='margin: 0 0 1rem 0;'>
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
                            <div class="reply_content" contenteditable="true"><span class="replayinTo">${'@'+item.replyingTo}</span> ${item.content}</div>
                            <button class="reply_update">update</button>
                            <div class="reply_vote">
                                <span class="reply_vote-plus"><svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class='plus' d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg></span>
                                <span class="reply_vote-content">${item.score}</span>
                                <span class="reply_vote-minus"><svg width="11" height="7" xmlns="http://www.w3.org/2000/svg"><path class="minus" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg></span>
                            </div>
                            ${reply__editor}
                        </div>
                        </div>`.trim();
               
                //lor.after(reply_container);
                
                    //let comm = document.querySelector('.main__replies-section');
                    //comm.innerHTML += reply__container;
                    //console.log(comm[i]);
                    comms.insertAdjacentHTML('beforeend', reply__container);
                    
        
                //comm.insertAdjacentHTML('afterend', reply__container);
                //comm.insertAdjacentHTML('afterbegin', reply__container);
                //comm.insertAdjacentHTML('beforebegin', reply__container);
                //comm.insertAdjacentHTML('beforeend', reply__container);
            
    //new reply (construct) to reply
    let replyReply = document.querySelectorAll('.reply_editor');
    
    replyReply.forEach((item) => {
       item.onclick = function (event) {
           /* let parentId = event.target.parentNode.parentNode.id;
           console.log(parentId); */
           
        newReplyConstruct(event);  
       
        /* let parent = document.getElementById(parentId).parentNode;//.parentNode;
       console.log(parent);
       parent.insertAdjacentHTML('afterend', replyContainer); */
       
       }
       
    })
            
            
            })
        
           }
           
           
           
           
    //new reply (construct) to comment
    let commentReply = document.querySelectorAll('.comment_editor');
    
    commentReply.forEach((item) => {
       item.onclick = function (event) {
        newReplyConstruct(event);    
       
       }
       
    })
      
    //comment editing
    let del = document.querySelectorAll('.comment_delete');
    //console.log(del);
    del.forEach((item, key) => {
        //console.log(key);
        //console.log(item);
        item.onclick = function(event) {
            console.log(item);
        }
    })
           
    })
    
    ownerInteractiveContainer();
    
}
//exec();


function  ownerInteractiveContainer() {
    //owner container
//if(currentUser.username == item.user.username) {
//console.log(currentUser.id);
ownerContainer = 
`<picture class="main__respond-picture">
    <source srcset="${currentUser.image.webp}" type="image/webp">
    <source srcset="${currentUser.image.png}" type="image/jpeg"> 
    <!--stop animation in inline style-->
    <img class="${currentUser.username}" src="${currentUser.image.png}" alt="${currentUser.username}" style="visibility: visible; animation-duration: 0s; !important;">
</picture>
<textarea class="main__respond-content" name='txtArea' rows="3" aria-label="Write comment" placeholder="Add a comment..."></textarea>
<button id="send">send</button>`.trim();
//console.log(currentUser.username);

mainRespond = document.querySelector('.main__respond');
mainRespond.innerHTML = '';
mainRespond.insertAdjacentHTML('beforeend', ownerContainer);

let send = document.querySelector('#send');
//console.log(send.parentNode.childNodes[0].id);

 send.addEventListener('click', function() {
    //alert('Hey');
    getData();
    let content = document.querySelector('.main__respond-content').value;
    let created = '1 min ago';
    let score = 0;
    
    
    function NewComment(id, content, createdAt, score, user, replies) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.score = score;
        this.user = user;
        this.replies = replies;
    }
    
    let newComment = new NewComment(m++, content, created, score, {image: {png: `${currentUser.image.png}`, webp: `${currentUser.image.webp}`}, username: `${currentUser.username}`}, []);
    //console.log(newComment.id);
    document.querySelector('.main__respond-content').value = '';
    comments.push(newComment);
    //console.log(comments);   
    
    if(content.length > 0 && content != ' ' && content != null && content != undefined) {
        localStorage.setItem('data', JSON.stringify(data));
    }
    //getData();
    comms.innerHTML = '';
    exec();
    setTimeout(commentVote, 50);
    setTimeout(replyVote, 50);
    
})

}

//Voting in comments
function commentVote() {
    let vote_container = document.querySelectorAll('.comment_vote');
    let vote = document.querySelectorAll('.comment_vote-content');
    let plus = document.querySelectorAll('.comment_vote-plus');
    let minus = document.querySelectorAll('.comment_vote-minus');
   
    let counter;
    vote_container.forEach((cont, key) => {
        cont.addEventListener('mouseover', function() {
            counter = Number(vote[key].innerHTML);
        })
    })

    plus.forEach((item, key) => {
        item.addEventListener('click', function() {
            counter++;
            //console.log(counter);
            vote[key].innerHTML = counter;            
        }) 
    })

    minus.forEach((item, key) => {
        item.addEventListener('click', function() {
            if(counter < 1) {
                return 0;
            } else {
                counter--;
                //console.log(counter); 
                vote[key].innerHTML = counter;
            }          
        })
    })
}

//commentVote();
setTimeout(commentVote, 50);


//Voting in reply
function replyVote() {
    let vote_container = document.querySelectorAll('.reply_vote');
    let vote = document.querySelectorAll('.reply_vote-content');
    let plus = document.querySelectorAll('.reply_vote-plus');
    let minus = document.querySelectorAll('.reply_vote-minus');
   
    let counter = 0;
    vote_container.forEach((cont, key) => {
        cont.addEventListener('mouseover', function() {
            counter = Number(vote[key].innerHTML);
        })
    })

    plus.forEach((item, key) => {
        item.addEventListener('click', function() {
            counter++;
            //console.log(counter);
            vote[key].innerHTML = counter;            
        }) 
    })

    minus.forEach((item, key) => {
        item.addEventListener('click', function() {
            if(counter < 1) {
                return 0;
            } else {
                counter--;
                //console.log(counter); 
                vote[key].innerHTML = counter;
            }          
        })
    })
}

setTimeout(replyVote, 50);


function newReplyConstruct(event) {
    replyContainer = 
        `<div class='reply_owner'>
        <picture class="reply_owner-picture">
            <source srcset="${currentUser.image.webp}" type="image/webp">
            <source srcset="${currentUser.image.png}" type="image/jpeg"> 
            <!--stop animation in inline style-->
            <img class="${currentUser.username}" src="${currentUser.image.png}" alt="${currentUser.username}" style="visibility: visible; animation-duration: 0s; !important;">
        </picture>
        <textarea class="reply_owner-content" name='txtContent' rows="3" aria-label="Write comment" placeholder="Add a comment..."></textarea>
        <button class="sendReply">Reply</button>
        </div>`.trim();
        
        let parentElem = event.target.parentNode.parentNode;
        let parentId = event.target.parentNode.parentNode.id;
        //console.log(parentElem);
        let parentClassCheck = parentElem.classList.contains('comment');
        //console.log(event.target.parentNode.parentNode.getElementsByClassName('comment_header-name')[0].textContent);
           
       //newReplyConstruct();        
       
       let parent = parentClassCheck ? document.getElementById(parentId) : document.getElementById(parentId).parentNode;
       //console.log(parent);
       parent.insertAdjacentHTML('afterend', replyContainer);
       
       let sendReply = document.querySelector('.sendReply');
       //console.log(sendReply);
       sendReply.addEventListener('click', function() {
           //console.log('Hey');
           let content = document.querySelector('.reply_owner-content').value;
           //console.log(content);
           let created = '1 min ago';
           let score = 0;
           let replyingTo = parentClassCheck ? event.target.parentNode.parentNode.getElementsByClassName('comment_header-name')[0].textContent : event.target.parentNode.parentNode.getElementsByClassName('reply_header-name')[0].textContent;
           
           function NewReply(id, content, createdAt, score, replyingTo, user) {
               this.id = id;
               this.content = content;
               this.createdAt = createdAt;
               this.score = score;
               this.replyingTo = replyingTo;
               this.user = user;
              
           }
           
           let newReply = new NewReply(m++, content, created, score, replyingTo, {image: {png: `${currentUser.image.png}`, webp: `${currentUser.image.webp}`}, username: `${currentUser.username}`});
           //console.log(newReply);
           document.querySelector('.reply_owner').style.display = 'none';
         
           comments.forEach((item, key) => {
               if(item.id == parentId) {
                   //console.log(comments[key].replies);
                   let commReply = comments[key].replies;
                   //console.log(replies)
                   commReply.unshift(newReply);
                   //console.log(replies);
                   //getData();
                   localStorage.setItem('data', JSON.stringify(data));
                   comms.innerHTML = '';
                   //getData();
                   exec();
               }
               
            let reply = item.replies;
            reply.forEach((item, key) => {
            if(item.id == parentId) {
                //console.log(item);
                //console.log(key);
                //console.log(reply[key]);
                reply.splice(key + 1, 0, newReply);
                localStorage.setItem('data', JSON.stringify(data));
                comms.innerHTML = '';
                exec(); 
            }
        })
               
           })
       })
         
}