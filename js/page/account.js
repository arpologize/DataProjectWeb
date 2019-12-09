let list03 = document.querySelector('.account-login');
let list04 = document.querySelector('.AccountInfo');
let list05 = document.querySelector('.AccountInfo2');

if (sessionStorage.getItem('USER')) {
    var username = JSON.parse(sessionStorage.getItem('USER'));
    }
    else
    {
        location.replace(location.origin + "/login");
    }
list03.innerHTML=`
                  <a>${username.jobTitle}</a>
                  <a href="${location.origin}/employeeInfo?employeeNumber=${username.employeeNumber}">${username.firstName} ${username.lastName}</a>`;
console.log(username.firstName);

list04.innerHTML=`<a class="fa fa-user" href="${location.origin}/employeeInfo?employeeNumber=${username.employeeNumber}"> Account Info</a>`;
list05.innerHTML=`<a class="fa fa-user" href="${location.origin}/employeeInfo?employeeNumber=${username.employeeNumber}"> Account Info</a>`;