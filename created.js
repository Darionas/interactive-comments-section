let staticTime = new Date().getTime();
export let s;

export function createdTime() {
    let interactiveTime = new Date().getTime();
    let time = interactiveTime - staticTime;
    //document.querySelector('#send').click();
    
    
    
if(time > 0 && time < 6e4) {
    //s = document.getElementsByClassName('comment_header-time');
    //console.log(s.parentNode.parentNode.parentNode.id);
    s = 'now';
    console.log(s);
    //return s;
    //console.log(s);
    
} else if(time >= 6e4 && time < 36e5) {
    s = Math.floor(time / 60000) + ' min ago';
    console.log(s);
    //return s;
    
} else if(time >= 36e5 && time < 864e5) {
    s = (time >= 36e5 && time < 72e5) ? Math.floor(((time / 60000) / 60)) + ' hour ago' : Math.floor(((time / 60000) / 60)) + ' hours ago';
    console.log(s);
    
} else if(time >= 864e5 && time < 6048e5) {
    s = (time >= 864e5 && time < 1728e5) ? Math.floor((((time / 60000) / 60))/24) + ' day ago' : Math.floor((((time / 60000) / 60))/24) + ' days ago';
    console.log(s);
    
} else if(time >= 6048e5 && time < 2592e6) {
    s = (time >= 6048e5 && time < 12096e5) ? Math.floor(((((time / 60000) / 60))/24)/7) + ' week ago' : Math.floor(((((time / 60000) / 60))/24)/7) + ' weeks ago';
    console.log(s);
    
} else if(time >= 2592e6 && time < 31536e6) {
    s = (time >= 2592e6 && time < 5184e6) ? Math.floor(((((time / 60000) / 60))/24)/30) + ' month ago' : Math.floor(((((time / 60000) / 60))/24)/30) + ' months ago';
    console.log(s);
    
} else if(time >= 31536e6) {
    s = (time >= 31536e6 && time < 63072e6) ? Math.floor(((((time / 60000) / 60))/24)/365) + ' year ago' : Math.floor(((((time / 60000) / 60))/24)/365) + ' years ago';
    console.log(s);
} 

} 

setInterval(createdTime, 1000);
