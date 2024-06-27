/*'Use strict'*/
/*jshint esversion: 8*/

import {members} from './members.js';
import {users} from './users.js';
members();


let comment, reply, comment__you, comment__editor, reply__you, reply__editor;
let foc, NewReply, newReply, reply__container, ownerContainer;
let score, currentUser, comments, data, comms, replyContainer, mainRespond;
let owner = document.querySelectorAll('.owner');
let m = 10;



//https://stackoverflow.com/questions/74522728/how-to-use-data-json-in-browsers-local-storage-to-load-the-page-with-javascript
//fetch data from json and set it to local storage
fetch('data.json')
    .then(function(response) {
        
        return response.json();
    })
    .then(function(data) {
        if(typeof(Storage) !== 'undefined') {
            
            localStorage.setItem('data', JSON.stringify(data));
            getData();
            owner[0].classList.add('userstyle');
            exec();
            
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
    
}



//navigate between users
for(let i = 0; i < owner.length; i++) {
    owner[i].addEventListener('click', function() { 
        let checkClass = owner[i].classList.contains('userstyle');
        if(checkClass) {
            
            currentUser.username = owner[i].classList[0];
            currentUser.id = users[i].id;
            currentUser.image.png = owner[i].parentNode.childNodes[3].srcset; //get siblings innerHTML
            currentUser.image.webp = owner[i].parentNode.childNodes[1].srcset; //get siblings innerHTML
           
            localStorage.setItem('data', JSON.stringify(data));
            comms.innerHTML = '';
            exec();
            setTimeout(vote, 50);
        }   
    })
}


function exec() {
    getData();
   
    console.log(comments);
    console.log(currentUser);


    comments.forEach((item) => {
        
        if(Object.values(item.user).includes(currentUser.username)) {
           comment__you = `<span class="comment_header-owner">you</span>`;
           comment__editor = `<div class="comment_editor">
           <div class="comment_delete"><img class="delete" src="images/icon-delete.svg" alt="Delete" />Delete</div>
           <div class="comment_edit edit"><img class="edit" src="images/icon-edit.svg" alt="Edit" />Edit</div>
       </div>`
        } else {
            comment__you = ``;
            comment__editor = `<div class="comment_editor">
            <div class="comment_reply c_reply-single"><img class="replay" src="images/icon-reply.svg" alt="Replay" />Reply</div>
        </div>`;
        }
            

        //Comment, reply construct
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
                    <div class="comment_vote vote">
                        <span class="comment_vote-plus vote-plus">+</span>
                        <span class="comment_vote-content vote-content">${item.score}</span>
                        <span class="comment_vote-minus vote-minus">-</span>
                    </div>
                    ${comment__editor}
                </div>`.trim();   
          
            
            comms = document.querySelector('.main__comments-section');
            
            comms.insertAdjacentHTML('beforeend', comment);
            
                     
            if(item.replies.length > 0) {
            
            reply = item.replies; 
           
            reply.forEach((item) => {
                               
                if(item.user.username === currentUser.username) {
                    reply__you = `<span class="reply_header-owner">you</span>`;
                    reply__editor = `<div class="reply_editor">
                    <div class="reply_delete"><img class="delete" src="images/icon-delete.svg" alt="Delete" />Delete</div>
                    <div class="reply_edit edit"><img class="edit" src="images/icon-edit.svg" alt="Edit" />Edit</div>
                </div>`
                 } else {
                     reply__you = ``;
                     reply__editor = `<div class="reply_editor">
                     <div class="reply_reply"><img class="replay" src="images/icon-reply.svg" alt="Replay" />Reply</div>
                 </div>`;
                 }

                
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
                            <div class="reply_content" contenteditable="true"><span class="replayinTo">${'@'+item.replyingTo + ''}</span>${item.content}</div>
                            <button class="reply_update">update</button>
                            <div class="reply_vote vote">
                                <span class="reply_vote-plus vote-plus">+</span>
                                <span class="reply_vote-content vote-content">${item.score}</span>
                                <span class="reply_vote-minus vote-minus">-</span>
                            </div>
                            ${reply__editor}
                        </div>
                        </div>`.trim();
               
                    comms.insertAdjacentHTML('beforeend', reply__container);
                    
        
               
    //new reply (construct) to reply
    let replyReply = document.querySelectorAll('.reply_reply');
    
    replyReply.forEach((item) => {
       item.onclick = function (event) {
           
        newReplyConstruct(event);  
       
       }
       
    })           
            })
        
           }
           
           
           
           
    //new reply (construct) to comment
    let commentReply = document.querySelectorAll('.comment_reply');
    
    commentReply.forEach((item) => {
       item.onclick = function (event) {
        newReplyConstruct(event);    
        
       }
       
    })
      
    //comment, reply editing       
    let edit = document.querySelectorAll('.edit');
    edit.forEach((item, key) => {

        item.onclick = function(event) {
          
           let comfirm = item.classList.contains('comment_edit');
            
            foc = item.parentNode.parentNode.childNodes[3];
    //https://www.tutorialspoint.com/how-to-set-cursor-position-in-content-editable-element-using-javascript
    //set cursor at the end of text
        let selectedText = window.getSelection();
        let selectedRange = document.createRange();
        if(comfirm) {
            selectedRange.setStart(foc.childNodes[0], foc.textContent.length);
        } else {
            selectedRange.setStart(foc.childNodes[1], foc.childNodes[1].textContent.length);
        }
    
        selectedRange.collapse(true);
        selectedText.removeAllRanges();
        selectedText.addRange(selectedRange);
        foc.focus();
              
            let update = item.parentNode.parentNode.childNodes[5];
            update.classList.add('show');
            update.addEventListener('click', function() {
                update.classList.remove('show');               
                newReplyConstruct(event);
                document.querySelector('.reply_owner').remove();
            })
            
        }
    })
    
    })
    
    ownerInteractiveContainer();
    
}



function  ownerInteractiveContainer() {

ownerContainer = 
`<picture class="main__respond-picture">
    <source srcset="${currentUser.image.webp}" type="image/webp">
    <source srcset="${currentUser.image.png}" type="image/jpeg"> 
    <!--stop animation in inline style-->
    <img class="${currentUser.username}" src="${currentUser.image.png}" alt="${currentUser.username}" style="visibility: visible; animation-duration: 0s; !important;">
</picture>
<textarea class="main__respond-content" name='txtArea' rows="3" aria-label="Write comment" placeholder="Add a comment..."></textarea>
<button id="send">send</button>`.trim();


mainRespond = document.querySelector('.main__respond');
mainRespond.innerHTML = '';
mainRespond.insertAdjacentHTML('beforeend', ownerContainer);

let send = document.querySelector('#send');


 send.addEventListener('click', function() {
   
    setTimeout(vote, 50);
    getData();
    let content = document.querySelector('.main__respond-content').value;
    let created = '1 min ago';
    score = 0; 
    
    
    function NewComment(id, content, createdAt, score, user, replies) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.score = score;
        this.user = user;
        this.replies = replies;
    }
    
    let newComment = new NewComment(m++, content, created, score, {image: {png: `${currentUser.image.png}`, webp: `${currentUser.image.webp}`}, username: `${currentUser.username}`}, []);

    document.querySelector('.main__respond-content').value = '';
    comments.push(newComment); 
    
    if(content.length > 0 && content != ' ' && content != null && content != undefined) {
        localStorage.setItem('data', JSON.stringify(data));
    }

    comms.innerHTML = '';
    exec();
    
})

}


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
       
        let parentClassCheck = parentElem.classList.contains('comment');        
       
       let parent = parentClassCheck ? document.getElementById(parentId) : document.getElementById(parentId).parentNode;
       
        parent.insertAdjacentHTML('afterend', replyContainer);
       
    
       let sendReply = document.querySelector('.sendReply');
       sendReply.addEventListener('click', function(event) {
        setTimeout(vote, 50);
           let content = document.querySelector('.reply_owner-content').value;
           let created = '1 min ago';
            score = 0; 
           let replyingTo = parentClassCheck ? event.target.parentNode.parentNode.getElementsByClassName('comment_header-name')[0].textContent : event.target.parentNode.parentNode.getElementsByClassName('reply_header-name')[0].textContent;
           
          NewReply = function (id, content, createdAt, score, replyingTo, user) {
               this.id = id;
               this.content = content;
               this.createdAt = createdAt;
               this.score = score;
               this.replyingTo = replyingTo;
               this.user = user;
              
           }
        
           newReply = new NewReply(m++, content, created, score, replyingTo, {image: {png: `${currentUser.image.png}`, webp: `${currentUser.image.webp}`}, username: `${currentUser.username}`});
           console.log(newReply);
           
           document.querySelector('.reply_owner').style.display = 'none';
            
           comments.forEach((item, key) => {
               if(item.id == parentId) {
                  let commReply = comments[key].replies;
                   commReply.unshift(newReply);
                   localStorage.setItem('data', JSON.stringify(data));
                   comms.innerHTML = '';
                   exec();
               }
               
               
            let reply = item.replies;
            reply.forEach((item, key) => {
            if(item.id == parentId) {
                console.log(reply[key]);
                reply.splice(key + 1, 0, newReply);
                localStorage.setItem('data', JSON.stringify(data));
                comms.innerHTML = '';
                exec();
            }
        })
               
           })
           
           
       })

}


//Voting in comments and replays
 let counter = 0;
function vote() {
    let vote_container = document.querySelectorAll('.vote');
    let voteNr = document.querySelectorAll('.vote-content');
    let plus = document.querySelectorAll('.vote-plus');
    let minus = document.querySelectorAll('.vote-minus');
   
   
    //voting up
    voteNr.innerHTML = 0;
    for(let i = 0; i < plus.length; i++) {
        plus[i].addEventListener('click', () => {
            let commentClass = plus[i].parentNode.parentNode.classList.contains('comment');
            let replyClass = plus[i].parentNode.parentNode.classList.contains('reply');
            let elementId = plus[i].parentNode.parentNode.id;
            if(commentClass) {
                comments.forEach((item) => {
                    //console.log(item);
                    if(item.id == elementId) {
                    item.score = 1 + voteNr[i].innerHTML++;
                    localStorage.setItem('data', JSON.stringify(data));
                    }
                    
                })
            }
            
            if(replyClass) {
            comments.forEach((item) => {
                let replyScore = item.replies;
                replyScore.forEach((item) => {
                    if(item.id == elementId) {
                        //console.log(item.score);
                        item.score = 1 + voteNr[i].innerHTML++;
                        localStorage.setItem('data', JSON.stringify(data));
                    }
                })
            })
        }
        });
    }
    
    //voiting down
    for(let i = 0; i < minus.length; i++) {
        minus[i].addEventListener('click', () => {
            let commentClass = minus[i].parentNode.parentNode.classList.contains('comment');
            let replyClass = minus[i].parentNode.parentNode.classList.contains('reply');
            let elementId = minus[i].parentNode.parentNode.id;
            if(commentClass) {
                comments.forEach((item) => {
                    //console.log(item);
                    if(item.id == elementId) {
                    item.score = voteNr[i].innerHTML < 1 ? voteNr[i].innerHTML = 0 : (voteNr[i].innerHTML--) - 1;
                    localStorage.setItem('data', JSON.stringify(data));
                    }
                    
                })
            }
            
            if(replyClass) {
            comments.forEach((item) => {
                let replyScore = item.replies;
                replyScore.forEach((item) => {
                    if(item.id == elementId) {
                        item.score = voteNr[i].innerHTML < 1 ? voteNr[i].innerHTML = 0 : (voteNr[i].innerHTML--) - 1;
                        localStorage.setItem('data', JSON.stringify(data));
                    }
                })
            })
        }
        });
    }
    
}
setTimeout(vote, 50);