/*'Use strict'*/
/*jshint esversion: 9*/

import {admin} from './currentUser.js';
import {removeAllOwnerStyles} from './currentUser.js';
import {users} from './users.js';
admin();


let data, comms, comments, currentUser, modal;


document.addEventListener('DOMContentLoaded', () => {
    fetch('./data.json')
        .then((response) =>{
            if(!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem('data', JSON.stringify(data));
            getData();
            
            // Attach the event listener ONCE after DOM is ready
            const commsSection = document.querySelector('.main__comments-section');
            if (commsSection) {
                commsSection.onclick = function(event) {
                    if (event.target.closest('.edit')) {
                        editing(event, event.target.closest('.edit'));
                    }
                    if (event.target.closest('.del')) {
                        deleting(event, event.target.closest('.del'));
                    }
                    if (event.target.closest('.reply__rc')) {
                        newReplyConstruct(event, data.currentUser, comments);
                    }
                };
            }
        })
        .catch((error) => {
            console.log('There was a problem with the fetch operation ' + error);
       });
});

//get/parse data from local storage
function getData() {
     data = JSON.parse(localStorage.getItem('data'));
     currentUser = data.currentUser;
     comments = data.comments;
     populateData(currentUser, comments);
     setTimeout(vote, 50);
}


//navigate between users
//using event delegation to handle clicks on owner buttons
/* If .owner elements are ever added dynamically, you should use event delegation or re-query them after DOM changes. 
Event delegation is a technique in JavaScript where you attach a single event listener to a parent element instead 
of adding individual listeners to each child element. The parent listens for events that bubble up from its children, 
and you use logic to determine which child triggered the event.
Why use it?
  * It improves performance (fewer event listeners).
  * It works for dynamically added elements (children added after page load).
Example:
// Instead of this (many listeners):
document.querySelectorAll('.reply-btn').forEach(btn => {
  btn.addEventListener('click', handleReply);
});

// Use event delegation (one listener on parent):
document.querySelector('.comments-section').addEventListener('click', function(e) {
  if (e.target.matches('.reply-btn')) {
    handleReply(e);
  }
});
Event delegation means listening for events at a higher level in the DOM and handling them for child elements as needed.
// https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling
*/
document.addEventListener('click', function(e) {
    const ownerBtn = e.target.closest('.owner');
    if (ownerBtn) {
        removeAllOwnerStyles();
        ownerBtn.classList.add('userstyle');
        // Get username from data attribute or class
        const username = ownerBtn.dataset.username || ownerBtn.classList[0];
        const userObj = users.find(u => u.username === username);
        if (userObj) {
            // Update both currentUser and data.currentUser
            currentUser.username = userObj.username;
            currentUser.id = userObj.id;
            currentUser.image = {...userObj.image};
            data.currentUser = {...currentUser};
            localStorage.setItem('data', JSON.stringify(data));
            // Re-render UI
            if (comms) comms.innerHTML = '';
            populateData(currentUser, comments);
            setTimeout(vote, 50);
        }
    }
});

/* populate the data in the main element from localStorage and remove old main before rendering */
 function populateData(currentUser, comments) {
    comms = document.querySelector('.main__comments-section'); 
    if(comms) {
        comms.innerHTML = '';
        //Comment, reply construct
        comments.forEach((item) => {
            let comment__you, comment__editor, reply__you, reply__editor;
            if(Object.values(item.user).includes(currentUser.username)) {
                comment__you = `<span class="comment__header-owner">you</span>`;
                comment__editor = `<div class="comment__editor">
                   <button type="button" class="comment__delete del"><img src="images/icon-delete.svg" alt="Delete" />Delete</button>
                   <button type="button" class="comment__edit edit"><img src="images/icon-edit.svg" alt="Edit" />Edit</button>
                </div>`;
            } else {
                comment__you = ``;
                comment__editor = `<div class="comment__editor">
                    <button type="button" class="reply__rc comment__reply"><img src="images/icon-reply.svg" alt="Reply" />Reply</button>
                </div>`;
            }
    
    
        const comment = 
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
                        <span class="comment__header-time" data-createdat="${item.createdAt}">${timeAgo(item.createdAt)}</span>
                    </div>
                </div>
                <div class="comment__content">${item.content}</div>
                <button type="button" class="comment__update update-btn">update</button>
                <div class="comment__vote vote">
                    <button type="button" class="comment__vote-plus vote-plus">+</button>
                    <span class="comment__vote-content vote-content">${item.score}</span>
                    <button type="button" class="comment__vote-minus vote-minus">-</button>
                </div>
                ${comment__editor}
            </div>`.trim();   
                     
            
        comms.insertAdjacentHTML('beforeend', comment);
            
        if(item.replies.length > 0) {
            let reply = item.replies; 
            reply.forEach((item) => {
                if(item.user.username === currentUser.username) {
                    reply__you = `<span class="reply__header-owner">you</span>`;
                    reply__editor = `<div class="reply__editor">
                        <button type="button" class="reply__delete del"><img src="images/icon-delete.svg" alt="Delete" />Delete</button>
                        <button type="button" class="reply__edit edit"><img src="images/icon-edit.svg" alt="Edit" />Edit</button>
                    </div>`;
                } else {
                    reply__you = ``;
                    reply__editor = `<div class="reply__editor">
                        <button type="button" class="reply__rc reply__reply"><img src="images/icon-reply.svg" alt="Reply" />Reply</button>
                    </div>`;
                }
                
                const reply__container =
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
                                    <span class="reply__header-time" data-createdat="${item.createdAt}">${timeAgo(item.createdAt)}</span>
                                </div>
                            </div>
                            <div class="reply__content"><div class='content'><span class="replyingTo">${'@'+item.replyingTo + ' '}</span>${item.content}</div></div>
                            <button type="button" class="reply__update update-btn">update</button>
                            <div class="reply__vote vote">
                                <button type="button" class="reply__vote-plus vote-plus">+</button>
                                <span class="reply__vote-content vote-content">${item.score}</span>
                                <button type="button" class="reply__vote-minus vote-minus">-</button>
                            </div>
                            ${reply__editor}
                        </div>
                    </div>`.trim();
               
                comms.insertAdjacentHTML('beforeend', reply__container);         
            });
        } 
               
        countAllCommentsAndReplies(comments);
    });
  }
  /* populateData function is now correctly calling ownerInteractiveContainer(currentUser) once, after the comments 
  and replies are rendered. 
  Here’s a summary of why this is good:
    * You only render the owner’s comment box once, after all comments and replies.
    * You avoid unnecessary DOM updates and performance issues.
    * The UI will be consistent and predictable.
  */
  ownerInteractiveContainer(currentUser);
}

/* count all comments and replies*/
function countAllCommentsAndReplies(comments) {
    let count = 0;
    comments.forEach(comment => {
        count += 1; //count the comment itself
        if (comment.replies && comment.replies.length > 0) {
            // recursive for nested replies
            count += countAllCommentsAndReplies(comment.replies); 
        }
    });
    return count;
}

//chat owner container    
function  ownerInteractiveContainer(currentUser) {
    if (!currentUser.image) currentUser.image = { png: '', webp: '' };
        const ownerContainer = 
        `<picture class="main__respond-picture">
            <source srcset="${currentUser.image.webp}" type="image/webp">
            <source srcset="${currentUser.image.png}" type="image/jpeg"> 
            <!--stop animation in inline style-->
            <img class="${currentUser.username}" src="${currentUser.image.png}" alt="${currentUser.username}" style="visibility: visible; animation-duration: 0s; !important;">
        </picture>
        <textarea class="main__respond-content" name='txtArea' rows="3" aria-label="Write comment" placeholder="Add a comment..."></textarea>
        <button type="button" id="send">send</button>`.trim();


    let mainRespond = document.querySelector('.main__respond');
    if (mainRespond) {
        mainRespond.innerHTML = '';
        mainRespond.insertAdjacentHTML('beforeend', ownerContainer);
    }
        
    //block to handle new comment creation
    const sendBtn = document.getElementById('send');
    sendBtn.onclick = function() {
        let textarea = document.querySelector('.main__respond-content');
        const content = textarea.value.trim();
        if (content.length === 0) return;

        // Create new comment object
        const newComment = {
            id: countAllCommentsAndReplies(comments) + 1, 
            content: content,
            createdAt: new Date().toISOString(),
            score: 0,
            user: {
                image: {
                    png: currentUser.image.png,
                    webp: currentUser.image.webp
                },
                username: currentUser.username
            },
            replies: []
        };

        comments.push(newComment);
        localStorage.setItem('data', JSON.stringify(data));
        comms.innerHTML = '';
        populateData(currentUser, comments);
        setTimeout(vote, 50);
        textarea.value = '';
    };
    
     // Close any open edit, reply containers
    const txtAreas = document.querySelector('.main__respond-content');
    if (txtAreas) {
        txtAreas.addEventListener('click', closeAllEditAndReplyContainers);
    }
    
}

//new reply construct
function newReplyConstruct(event, currentUser, comments) {
    // Close any open edit, reply containers
    closeAllEditAndReplyContainers();
    const txtArea = document.querySelector('.main__respond-content');
    if(txtArea) txtArea.value = '';
        
    if (!currentUser.image) currentUser.image = { png: '', webp: '' };
    const replyContainer = 
        `<div class='reply__owner'>
            <picture class="reply__owner-picture">
                <source srcset="${currentUser.image.webp}" type="image/webp">
                <source srcset="${currentUser.image.png}" type="image/jpeg"> 
                <!--stop animation in inline style-->
                <img class="${currentUser.username}" src="${currentUser.image.png}" alt="${currentUser.username}" style="visibility: visible; animation-duration: 0s; !important;">
            </picture>
            <textarea class="reply__owner-content" name='txtContent' rows="3" aria-label="Write comment" placeholder="Add a comment..."></textarea>
            <button type="button" class="sendReply">Reply</button>
        </div>`.trim();
        
    const parentElem = event.target.parentNode.parentNode;
    const parentId = event.target.parentNode.parentNode.id;
    const parentClassCheck = parentElem.classList.contains('comment');        
    const parent = parentClassCheck ? document.getElementById(parentId) : document.getElementById(parentId).parentNode;
       
    parent.insertAdjacentHTML('afterend', replyContainer);
       
        const replyBox = parent.nextElementSibling;
        if (replyBox) {
            const sendReply = replyBox.querySelector('.sendReply');
            if (sendReply) {
                sendReply.addEventListener('click', () => {
                    let m = countAllCommentsAndReplies(comments) + 1;            
                    let content = document.querySelector('.reply__owner-content').value;
                    let createdAt =  new Date().toISOString();
                    let score = 0;
                    let replyingTo = parentElem.querySelector('.comment__header-name, .reply__header-name').textContent;
           
            
                    if(content.length > 0) {
                        let NewReply = function (id, content, createdAt, score, replyingTo, user) {
                            this.id = id;
                            this.content = content;
                            this.createdAt = createdAt;
                            this.score = score;
                            this.replyingTo = replyingTo;
                            this.user = user;
                        };
        
                        let newReply = new NewReply(m++, content, createdAt, score, replyingTo, {image: {png: `${currentUser.image.png}`, webp: `${currentUser.image.webp}`}, username: `${currentUser.username}`});
                        document.querySelector('.reply__owner').style.display = 'none';
            
                        comments.forEach((item, key) => {
                            if(item.id == parentId) {
                                // parent is a comment
                                comments[key].replies.unshift(newReply);
                                localStorage.setItem('data', JSON.stringify(data));
                                comms.innerHTML = '';
                                populateData(currentUser, comments);
                                setTimeout(vote, 50);
                                return;
                            }
               
                            // check if parent is a reply
                            item.replies.forEach((reply, rKey) => {
                                if(reply.id == parentId) {
                                    item.replies.splice(rKey + 1, 0, newReply);
                                    localStorage.setItem('data', JSON.stringify(data));
                                    comms.innerHTML = '';
                                    populateData(currentUser, comments);
                                    setTimeout(vote, 50);
                                    return;
                                }
                            });
                        });
                    } else {
                        replyBox.remove();
                    }
                }); 
            }
        }
        
}
    
//created at time ago function
//https://stackoverflow.com/questions/6108819/how-to-convert-utc-date-string-to-relative-time-in-javascript
function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
}

setTimeout(timeAgo, 1000);

setInterval(() => {
    document.querySelectorAll('.comment__header-time').forEach(el => {
        const createdAt = el.getAttribute('data-createdat');
        el.textContent = timeAgo(createdAt);
    });
    document.querySelectorAll('.reply__header-time').forEach(el => {
        const createdAt = el.getAttribute('data-createdat');
        el.textContent = timeAgo(createdAt);
    });
}, 60000); // update every minute


//Voting in comments and replys
function vote() {
    let voteNr = document.querySelectorAll('.vote-content');
    let plus = document.querySelectorAll('.vote-plus');
    let minus = document.querySelectorAll('.vote-minus');
   
    //voting up
    for(let i = 0; i < plus.length; i++) {
        plus[i].onclick = () => {
            const parent = plus[i].closest('.comment, .reply');
            const elementId = parent.id;
            const isComment = parent.classList.contains('comment');
            const isReply = parent.classList.contains('reply');
            const voteContent = parent.querySelector('.vote-content');
            const currentScore = parseInt(voteContent.innerHTML, 10);
            
            if (isComment) {
                comments.forEach(item => {
                    if (item.id == Number(elementId)) {
                        item.score = currentScore + 1;
                        voteContent.innerHTML = item.score;
                        localStorage.setItem('data', JSON.stringify(data));
                    }
                });
            }
            
            if (isReply) {        
                comments.forEach(item => {
                    item.replies.forEach(reply => {
                        if (reply.id == Number(elementId)) {
                            reply.score = currentScore + 1;
                            voteContent.innerHTML = reply.score;
                            localStorage.setItem('data', JSON.stringify(data));
                        }
                    });
                });
            }
        };
    }
    
    //voiting down
    for (let i = 0; i < minus.length; i++) {
        minus[i].onclick = () => {
            const elementId = minus[i].parentNode.parentNode.id;
            const isComment = minus[i].parentNode.parentNode.classList.contains('comment');
            const isReply = minus[i].parentNode.parentNode.classList.contains('reply');
            const currentScore = parseInt(voteNr[i].innerHTML, 10);

            if (isComment) {
                comments.forEach(item => {
                    if (item.id == elementId) {
                        item.score = Math.max(0, currentScore - 1);
                        voteNr[i].innerHTML = item.score;
                        localStorage.setItem('data', JSON.stringify(data));
                    }
                });
            }
            if (isReply) {
                comments.forEach(item => {
                    item.replies.forEach(reply => {
                        if (reply.id == elementId) {
                            reply.score = Math.max(0, currentScore - 1);
                            voteNr[i].innerHTML = reply.score;
                            localStorage.setItem('data', JSON.stringify(data));
                        }
                    });
                });
            }
        };
    }
}

// editing comment and reply
function editing(event, item) {
    let commentEdit, replyEdit, update;
    
    // Close any open edit, reply containers
    closeAllEditAndReplyContainers();
    const txtArea = document.querySelector('.main__respond-content');
    if(txtArea) txtArea.value = '';

    if(item.classList.contains('comment__edit')) {
        commentEdit = item.parentNode.parentNode.querySelector('.comment__content');
        commentEdit.setAttribute('contenteditable', 'true');
        commentEdit.focus();
        commentEdit.classList.add('border__show', 'pointTo__element'); 
        
        //Basic method https://www.tutorialspoint.com/how-to-set-cursor-position-in-content-editable-element-using-javascript
        //Adopted to my project method https://stackoverflow.com/questions/2388164/set-focus-on-div-contenteditable-element/#answer-59437681
        // Set cursor at the end
        let range = document.createRange();
        range.selectNodeContents(commentEdit);
        range.collapse(false); // false = end
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        
        update = item.parentNode.parentNode.querySelector('.update-btn'); 
    }         
        
    //element has child how to skip child but select element in javascript
    if(item.classList.contains('reply__edit')) {
        replyEdit = item.parentNode.parentNode.querySelector('.reply__content .content');
        replyEdit.classList.add('pointTo__element', 'border__show');
        replyEdit.setAttribute('contenteditable', 'true');
        replyEdit.focus(); 
        // Set cursor at the end
        let range = document.createRange();
        range.selectNodeContents(replyEdit);
        range.collapse(false); // false = end
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
            
        update = item.parentNode.parentNode.querySelector('.update-btn');          
    } 
        
    if(update) {
        update.classList.add('show__element');
        update.onclick = null; // Prevent stacking listeners
        update.onclick = function() {
            update.classList.remove('show__element'); 
            if(commentEdit) {
                commentEdit.setAttribute('contenteditable', 'false');
                commentEdit.classList.remove('pointTo__element', 'border__show');
                comments.forEach((item) => {
                    if(item.id == commentEdit.parentNode.id) {
                        item.content = commentEdit.textContent;
                        localStorage.setItem('data', JSON.stringify(data));
                        comms.innerHTML = '';
                        populateData(data.currentUser, comments);
                        setTimeout(vote, 50);
                    }
                });
            }
                
            if(replyEdit) {
                replyEdit.setAttribute('contenteditable', 'false');
                replyEdit.classList.remove('pointTo__element', 'border__show');
                let replyingToSpan = replyEdit.querySelector('.replyingTo');
                if (replyingToSpan) replyingToSpan.remove();
                    comments.forEach((item) => {
                        item.replies.forEach((reply) => {
                            if(reply.id == replyEdit.parentNode.parentNode.id) {
                                reply.content = replyEdit.textContent;
                                localStorage.setItem('data', JSON.stringify(data));
                                comms.innerHTML = '';
                                populateData(data.currentUser, comments);
                                setTimeout(vote, 50);
                            }
                        });
                    });
                        
            }
        };
    }
    
}

// deleting comment and reply
function deleting(event, delBtn) {
    // Close any open edit, reply containers
    closeAllEditAndReplyContainers();
    const txtArea = document.querySelector('.main__respond-content');
    if(txtArea) txtArea.value = '';
    
    let erace = 
        `<div class = 'overlay'>
            <div class = 'deletion__container'>
                <h3 class = 'deletion__title'>Delete comment</h3>
                <p class = 'deletion__text'>Are you sure you want to delete this
                comment? This will remove the comment and can't be undone.</p>
                <button type="button" class='cancel__btn'>no, cancel</button>
                <button type="button" class='delete__btn'>yes, delete</button>
            </div>
        </div>`;
                
    let gridContainer = document.querySelector('.grid__container');
    if (gridContainer) {
       gridContainer.insertAdjacentHTML('beforebegin', erace);
    } 
    
    //trap focus inside the modal
    modal = document.querySelector('.overlay');
    if (modal) trapFocus(modal);
    
                
    let cancelBtn = document.querySelector('.cancel__btn');
    if (cancelBtn) cancelBtn.addEventListener('click', off);
                
    let overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.style.display = 'grid';
        overlay.style.width = '100%';
    }
                
    function off() {
        overlay.remove();
    }
                
    let deleteBtn = document.querySelector('.delete__btn');
    if (deleteBtn) deleteBtn.addEventListener('click', delo);
                
    function delo() {
        let com = delBtn.closest('.comment');
        let rep = delBtn.closest('.rep');
                        
        comments.forEach((item, key) => {
            if(com && com.id == item.id) {
                comments.splice(key, 1);
                localStorage.setItem('data', JSON.stringify(data));
                comms.innerHTML = '';
                populateData(data.currentUser, comments);
                setTimeout(vote, 50);  
            }
                    
            if(rep) {
                item.replies.forEach((repItem, rKey) => {
                    if(rep.querySelector('.reply').id == repItem.id) {
                        item.replies.splice(rKey, 1);
                        /* rep.remove(); */
                        localStorage.setItem('data', JSON.stringify(data));
                        comms.innerHTML = '';
                        populateData(data.currentUser, comments);
                        setTimeout(vote, 50);
                    }
                });
            } 
        });                    
                
        overlay.remove();
                    
    } 
}

//closing all edit and reply containers
function closeAllEditAndReplyContainers() {
    // Close any open edit containers
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        el.setAttribute('contenteditable', 'false');
        el.classList.remove('border__show', 'pointTo__element');
    });
    document.querySelectorAll('.update-btn').forEach(btn => btn.classList.remove('show__element'));

    // Remove any open reply containers before opening a new one
    document.querySelectorAll('.reply__owner').forEach(el => el.remove());
}

// trap focus inside a modal element:
function trapFocus(modal) {
    const focusableSelectors = [
        'a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])',
        'textarea:not([disabled])', 'button:not([disabled])', '[tabindex]:not([tabindex="-1"])'
    ];
    const focusableEls = modal.querySelectorAll(focusableSelectors.join(','));
    if (!focusableEls.length) return;

    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    function handleTab(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
            }
        } else {
            if (document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        }
    }

    modal.addEventListener('keydown', handleTab);

    // Focus the first element when modal opens
    firstEl.focus();

    // Optional: Remove listener when modal closes
    modal._removeTrapFocus = () => modal.removeEventListener('keydown', handleTab);
}

// When closing the modal, call:
if (modal && modal._removeTrapFocus) modal._removeTrapFocus();







/* const now = new Date();
const oneMonthAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
console.log(oneMonthAgo); */

/*
1 month ago: 2025-05-08T17:25:01.426Z
2 weeks ago: 2025-05-24T17:26:32.136Z
1 week ago: 2025-05-31T17:27:21.230Z
2 days ago: 2025-06-05T17:28:04.107Z
*/