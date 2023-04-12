// console.log("hello world")
const logout = document.getElementById('logout')
// console.log(logout)
logout.addEventListener('click',(ev)=> {
    ev.preventDefault()
    
    window.location.replace('http://localhost/login');
    return false;
    
 
})