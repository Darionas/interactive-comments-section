/*'Use strict'*/
/*jshint esversion: 8*/

import {members} from './members.js';
import {users} from './users.js';
members();


let comment, reply, comment__you, comment__editor, reply__you, 
reply__editor, commentEdit, replyEdit, reply__container, ownerContainer, 
score, currentUser, comments, data, comms, replyContainer, 
mainRespond;
let owner = document.querySelectorAll('.owner');
let m = 10;





//https://stackoverflow.com/questions/74522728/how-to-use-data-json-in-browsers-local-storage-to-load-the-page-with-javascript
//fetch data from json and set it to local storage
async function fetchData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        if (typeof Storage !== 'undefined') {
            localStorage.setItem('data', JSON.stringify(data));
            getData();
            owner[0]?.classList.add('userstyle'); // Optional chaining for safety
            exec();
        } else {
            alert('Sorry! No Web Storage support.');
        }
    } catch (err) {
        console.error('Error fetching or processing data:', err.message);
    }
}
fetchData();


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
    
    //Comment, reply construct
    comments.forEach((item) => {
        if(Object.values(item.user).includes(currentUser.username)) {
            comment__you = `<span class="comment__header-owner">you</span>`;
            comment__editor = `<div class="comment__editor">
               <div class="comment__delete del"><img src="images/icon-delete.svg" alt="Delete" />Delete</div>
               <div class="comment__edit edit"><img src="images/icon-edit.svg" alt="Edit" />Edit</div>
            </div>`
        } else {
            comment__you = ``;
            comment__editor = `<div class="comment__editor">
                <div class="comment__reply"><img src="images/icon-reply.svg" alt="Replay" />Reply</div>
            </div>`;
        }
            
        comment = 
           `<div class='comment' id='${item.id}' style='margin: 0 0 1rem 0;'>
                <div class="comment__header">
                    <picture class="comment__header-picture">
                        <source srcset="${item.user.image.webp}" type="image/webp">
                        <source srcset="${item.user.image.png}" type="image/jpeg"> 
                        <img src="${item.user.image.png}" alt="${item.user.username}">
                    </picture>
                    <div class="comment__header-container">
                        <span class="comment__header-name">${item.user.username}</span>
                        ${comment__you}
                        <span class="comment__header-time">${item.createdAt}</span>
                    </div>
                </div>
                <div class="comment__content">${item.content}</div>
                <button class="comment__update">update</button>
                <div class="comment__vote vote">
                    <span class="comment__vote-plus vote-plus">+</span>
                    <span class="comment__vote-content vote-content">${item.score}</span>
                    <span class="comment__vote-minus vote-minus">-</span>
                </div>
                ${comment__editor}
            </div>`.trim();   
                     
            comms = document.querySelector('.main__comments-section');
            comms.insertAdjacentHTML('beforeend', comment);
            
        if(item.replies.length > 0) {
            reply = item.replies; 
            reply.forEach((item) => {
                if(item.user.username === currentUser.username) {
                    reply__you = `<span class="reply__header-owner">you</span>`;
                    reply__editor = `<div class="reply__editor">
                        <div class="reply__delete del"><img src="images/icon-delete.svg" alt="Delete" />Delete</div>
                        <div class="reply__edit edit"><img src="images/icon-edit.svg" alt="Edit" />Edit</div>
                    </div>`
                } else {
                    reply__you = ``;
                    reply__editor = `<div class="reply__editor">
                        <div class="reply__reply"><img src="images/icon-reply.svg" alt="Replay" />Reply</div>
                    </div>`;
                }
                
                reply__container =
                    `<div class='rep'>
                        <div class="reply" id='${item.id}' style='margin: 0 0 1rem 0;'>
                            <div class="reply__header">
                                <picture class="reply__header-picture">
                                    <source srcset="${item.user.image.webp}" type="image/webp">
                                    <source srcset="${item.user.image.png}" type="image/jpeg"> 
                                    <img src="${item.user.image.png}" alt="${item.user.username}">
                                </picture>
                                <div class="reply__header-container">
                                    <span class="reply__header-name">${item.user.username}</span>
                                    ${reply__you}
                                    <span class="reply__header-time">${item.createdAt}</span>
                                </div>
                            </div>
                            <div class="reply__content"><div class='content'><span class="replyingTo">${'@'+item.replyingTo + ' '}</span>${item.content}</div></div>
                            <button class="reply__update">update</button>
                            <div class="reply__vote vote">
                                <span class="reply__vote-plus vote-plus">+</span>
                                <span class="reply__vote-content vote-content">${item.score}</span>
                                <span class="reply__vote-minus vote-minus">-</span>
                            </div>
                            ${reply__editor}
                        </div>
                    </div>`.trim();
               
                    comms.insertAdjacentHTML('beforeend', reply__container);
                    
                    
                    //new reply (construct) to reply
                    let replyReply = document.querySelectorAll('.reply__reply');

                    replyReply.forEach((item) => {
                        item.onclick = function (event) {
                            newReplyConstruct(event);  
                        }
                    })           
            })
        }   

        //new reply (construct) to comment
        let commentReply = document.querySelectorAll('.comment__reply');
    
        commentReply.forEach((item) => {
            item.onclick = function (event) {
                newReplyConstruct(event);    
            }
        })
      
        //comment, reply editing 
        let edit = document.querySelectorAll('.edit');
        edit.forEach((item) => {
            item.onclick = function(event) { 
                //Basic method https://www.tutorialspoint.com/how-to-set-cursor-position-in-content-editable-element-using-javascript
                //Adopted to my project method https://stackoverflow.com/questions/2388164/set-focus-on-div-contenteditable-element/#answer-59437681
                //set cursor at the end of text
                let selectedText = window.getSelection();
                let selectedRange = document.createRange();
                let goter;
                let gotter;
                
                if(item.classList.contains('comment__edit')) {
                    commentEdit = item.parentNode.parentNode.childNodes[3];
                    //console.log(foc);
                    commentEdit.setAttribute('contenteditable', 'true');
                    commentEdit.focus();
                    commentEdit.classList.add('border__show');
                    commentEdit.classList.add('pointTo__element');                
                    if(commentEdit.hasChildNodes()) {
                        let address = commentEdit.childElementCount > 0 ? commentEdit.lastChild : commentEdit;
                        selectedRange.setStart( address, 1);
                    } 
                }         
        
                //https://stackoverflow.com/questions/14966841/select-element-without-a-child
                //element has child how to skip child but select element in javascript
                if(item.classList.contains('reply__edit')) {
                console.log(item.classList.contains('reply__edit'));
                    let replyId = item.parentNode.parentNode.id;
                    //console.log(replyId);
                    replyEdit = item.parentNode.parentNode.childNodes[3].childNodes[0];
                    //console.log(replyEdit);
                    //console.log(replyEdit.querySelector('.replyingTo').nextSibling.nodeValue);
                    //console.log(replyEdit.lastChild);
                    gotter = replyEdit.querySelector('.replyingTo').nextSibling.nodeValue;
                    //console.log(gotter);
                   
                    //console.log(gotter.concat(replyEdit.lastChild.innerHTML));
                    let receiver = replyEdit.firstChild.textContent.length;
                    //console.log(fac.firstChild.textContent.length);
                    goter = replyEdit.lastChild;
                    //console.log(goter);
                    let replyContent = document.querySelector('.reply__content');
                    let parent = document.getElementById(replyId);
                    replyEdit.classList.add('pointTo__element');
                    replyEdit.setAttribute('contenteditable', 'true');
                    replyEdit.focus(); 
                    replyEdit.classList.add('border__show');
                    //console.log(replyEdit);
                    
                    if(replyEdit.hasChildNodes()) {
                        let addressrep = replyEdit.childElementCount > 0 ? replyEdit.lastChild : replyEdit;
                        let offset = replyEdit.childElementCount > 1 ? 1 : replyEdit.textContent.length - receiver;
                        //let offset = replyEdit.childElementCount > 1 ? replyEdit.childNodes[replyEdit.childElementCount] : 1;
                        //console.log(fac.textContent.length);
                        selectedRange.setStart(addressrep, offset);
                        //selectedRange.setStart(fac.childNodes[1], fac.childNodes[1].length);
                    }
                    
                } 
        
                selectedRange.collapse(true);
                selectedText.removeAllRanges();
                selectedText.addRange(selectedRange);

              
                let update = item.parentNode.parentNode.childNodes[5];
                update.classList.add('show__element');
                update.addEventListener('click', function() {
                    update.classList.remove('show__element');               
                    newReplyConstruct(event);
                    document.querySelector('.reply__owner').remove();
                
                    if(commentEdit) {
                        commentEdit.setAttribute('contenteditable', 'false');
                        commentEdit.classList.remove('pointTo__element');
                        commentEdit.classList.remove('border__show');
                        comments.forEach((item) => {
                            if(item.id == commentEdit.parentNode.id) {
                                item.content = commentEdit.innerHTML;
                                localStorage.setItem('data', JSON.stringify(data));
                                comms.innerHTML = '';
                                exec();
                                setTimeout(vote, 50);
                            }
                        })
                    }
                
                    if(replyEdit) {
                        replyEdit.setAttribute('contenteditable', 'false');
                        replyEdit.classList.remove('pointTo__element');
                        comments.forEach((item) => {
                            let reply = item.replies;
                            /* console.log(replyEdit.innerHTML);
                            console.log(replyEdit.firstChild.textContent.length)
                            console.log(replyEdit) */
                            reply.forEach((item) => {
                                //console.log(item.id);
                                if(item.id == replyEdit.parentNode.parentNode.id) {
                                    /* let res = document.querySelector('.content:not(replyingTo)').innerHTML;
                                    console.log(res); */
                                    //console.log(replyEdit.firstChild);
                                    replyEdit.firstChild.remove();
                                    item.content = replyEdit.innerHTML;
                                    //console.log(item);
                                    //console.log(item.content);
                                    localStorage.setItem('data', JSON.stringify(data));
                                    //console.log(item)
                                    //goter.innerHTML = ''; //style.display = 'none';
                                    comms.innerHTML = '';
                                    exec();
                                    setTimeout(vote, 50);
                                }
                            })
                        })
                        
                    }
                })
            }
        })
    
    
        //comment/reply delete
        let del = document.querySelectorAll('.del')
        del.forEach((delBtn) => {
            delBtn.onclick = function() {
                let erace = 
                    `<div class = 'overlay'>
                        <div class = 'deletion__container'>
                            <h3 class = 'deletion__title'>Delete comment</h3>
                            <p class = 'deletion__text'>Are you sure you want to delete this
                            comment? This will remove the comment and can't be undone.</p>
                            <button class = 'cancel__btn'>no, cancel</button>
                            <button class = 'delete__btn'>yes, delete</button>
                        </div>
                    </div>`
                
                let gridContainer = document.querySelector('.grid__container');
                gridContainer.insertAdjacentHTML('beforebegin', erace); 
                document.getElementsByClassName('overlay')[0].style.width = '100%';
                
                let cancelBtn = document.querySelector('.cancel__btn');
                cancelBtn.addEventListener('click', off);
                
                let overlay = document.querySelector('.overlay');
                overlay.style.display = 'grid';
                
                function off() {
                    overlay.remove();
                }
                
                let deleteBtn = document.querySelector('.delete__btn');
                deleteBtn.addEventListener('click', delo);
                
                function delo() {
                    let rep = delBtn.parentNode.parentNode.parentNode;
                    let com = delBtn.parentNode.parentNode;
                        
                    comments.forEach((item, key) => {
                        if(com.classList.contains('comment')) {
                            if(com.id == item.id) {
                                comments.splice(key, 1);
                                com.remove();
                                localStorage.setItem('data', JSON.stringify(data));
                                comms.innerHTML = '';
                                exec();
                                setTimeout(vote, 50);
                            }
                        }
                    
                        if(rep.classList.contains('rep')) {
                            item.replies.forEach((repItem, key) => {
                                if(rep.childNodes[1].id == repItem.id) {
                                    item.replies.splice(key, 1);
                                    rep.remove();
                                    localStorage.setItem('data', JSON.stringify(data));
                                    comms.innerHTML = '';
                                    exec();
                                    setTimeout(vote, 50);
                                }
                            });
                        } 
                    });                    
                
                    overlay.remove();
                    
                }                
            }
        }) 
    })
    
    
    ownerInteractiveContainer();
    
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
            `<div class='reply__owner'>
                <picture class="reply__owner-picture">
                    <source srcset="${currentUser.image.webp}" type="image/webp">
                    <source srcset="${currentUser.image.png}" type="image/jpeg"> 
                    <!--stop animation in inline style-->
                    <img class="${currentUser.username}" src="${currentUser.image.png}" alt="${currentUser.username}" style="visibility: visible; animation-duration: 0s; !important;">
                </picture>
                <textarea class="reply__owner-content" name='txtContent' rows="3" aria-label="Write comment" placeholder="Add a comment..."></textarea>
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
            let content = document.querySelector('.reply__owner-content').value;
            let createdAt = '1 min ago';
            score = 0; 
            //let replyingTo = parentClassCheck ? event.target.parentNode.parentNode.getElementsByClassName('comment__header-name')[0].textContent : event.target.parentNode.parentNode.getElementsByClassName('reply__header-name')[0].textContent;
            let replyingTo = parentElem.childNodes[1].childNodes[3].childNodes[1].innerHTML;
            
            if(content.length > 0) {
                let NewReply = function (id, content, createdAt, score, replyingTo, user) {
                    this.id = id;
                    this.content = content;
                    this.createdAt = createdAt;
                    this.score = score;
                    this.replyingTo = replyingTo;
                    this.user = user;
                }
        
                let newReply = new NewReply(m++, content, createdAt, score, replyingTo, {image: {png: `${currentUser.image.png}`, webp: `${currentUser.image.webp}`}, username: `${currentUser.username}`});
                document.querySelector('.reply__owner').style.display = 'none';
            
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
                            reply.splice(key + 1, 0, newReply);
                            localStorage.setItem('data', JSON.stringify(data));
                            comms.innerHTML = '';
                            exec();
                        }
                    })
                })
            } else {
                let retu = document.querySelector('.reply__owner');
                retu.remove();
            }
        })
    }

}

//Voting in comments and replys
let counter = 0;
function vote() {
    //let vote_container = document.querySelectorAll('.vote');
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

