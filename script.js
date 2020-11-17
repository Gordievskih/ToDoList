window.onload = function(){
    getContent()

}

let USERS = [];
let UserId = '';
let params = {}
params.start = 0;
params.end = 4;
let time = new Date();

if (localStorage.getItem('USERS')!= undefined){
    USERS = JSON.parse(localStorage.getItem('USERS'));
}


function getContent(){
    for (let i = 0; i < USERS.length; i++){
        if(USERS[i].status === 1){
            RENDER(i);
        }
     
    }
}

function RENDER(i){
            document.querySelector('.auth').style.display = 'none';
            document.querySelector('.content').style.display = 'block';
            document.querySelector('.userName').style.display = 'block'  
            document.querySelector('.todo').style = "top: 1px;"
            UserId = i;  
            pagination()   
            out();
}

function exit(){
    document.querySelector('.auth').style.display = 'block';
    document.querySelector('.content').style.display = 'none';
    document.querySelector('.userName').style.display = 'none';
    USERS[UserId].status = 0;
    UserId = '';
    localStorage.setItem('USERS', JSON.stringify(USERS))
}

function auth(){
    let email = document.querySelector('.auth_inp_email').value;
    let pass = document.querySelector('.auth_inp_pass').value;
    if(email && pass){  
    for (let i = 0; i < USERS.length; i++){
        if ( USERS[i].login === email && USERS[i].pass === pass){
            USERS[i].status = 1;
            localStorage.setItem('USERS', JSON.stringify(USERS))
            RENDER(i);
            document.querySelector('.auth_inp_email').value = '';
            document.querySelector('.auth_inp_pass').value = '';
          break
        }
        else if(USERS[i].login != email){
            document.querySelector('.info_auth').innerHTML = 
            '<div style="color: red;" >Неверный Логин! </div>'
           }
           else if(USERS[i].pass != pass){
            document.querySelector('.info_auth').innerHTML = 
            '<div style="color: red;" >Неверный Пароль! </div>'
           }
        
        }
    }
}

function register(){
    let email = document.querySelector('.auth_inp_email').value;
    let pass = document.querySelector('.auth_inp_pass').value;
    if(email && pass){
        let temp = {}
        temp.login = email;
        temp.pass = pass;
        temp.status = 0;
        temp.tasks = [];
        USERS.push(temp);
    localStorage.setItem('USERS', JSON.stringify(USERS));
    if (USERS[USERS.length - 1].login == email){
        document.querySelector('.info_auth').innerHTML = 
        '<div style="color: green;" >Регистрация успешна! Теперь войдите в систему </div>'
        document.querySelector('.auth_reg_btn').style.display = 'none';
    }
    }

}
function  createTask(){
    let task = document.querySelector('.input').value;
    if(task){
        let temp = {};
        temp.todo = task;
        temp.check = false;
        temp.time = time.getHours() +":"+time.getMinutes()+" "+time.getDate()+"."+(time.getMonth()+1) +"."+time.getFullYear();
        USERS[UserId].tasks.push(temp);
        document.querySelector('.input').value = '';
        out();
        pagination()
        localStorage.setItem('USERS', JSON.stringify(USERS));
    }
}


function pagination(){
    let step = 4;
    let pageNum = []
    let currentPage = 1;
    let countPages = Math.ceil(USERS[UserId].tasks.length / step);
    if(countPages > 1){
        for (let i = 1; i <= countPages; i++){
            pageNum.push( `<li id="${i}">${i}</li>`) 
            document.querySelector('.pagination').innerHTML = 'Стр.' + pageNum.join('');
        }
        let pages = document.querySelectorAll('.pagination li');
        if(pages){
            pages[0].classList.add('active');
            for(let i = 0; i< pages.length; i++){
                pages[i].addEventListener('click', function(){
                    for(let i = 0; i < pages.length; i++){
                        pages[i].classList.remove('active')
                    }
                    pages[i].classList.add('active');
                    currentPage = this.innerHTML;
                    params.start = (currentPage - 1) * step;
                    params.end = params.start + step;
                    out();
                })
            }

        }
    }
}

function out(){
    let out = [];
    if(USERS[UserId].status === 1){
        document.querySelector('.userName').innerHTML = 
        `Привет, ${USERS[UserId].login}!  <button class="exit_btn" onclick="exit()">Выйти</button>`;
    }
    for(let i = params.start; i < params.end; i++){
        if(USERS[UserId].tasks[i] === undefined){
           break;
        }
        if(USERS[UserId].tasks[i].check === true){
            USERS[UserId].tasks[i].check = 'checked';
        }
        out.push(`<div class="doElem ${USERS[UserId].tasks[i].check}" id="${i}">
        <div class="function">
        <input type="checkbox" class="checkbox" data="${i}" ${USERS[UserId].tasks[i].check}> 
        <span class="delete" data="${i}"> &times; </span>
        <span class="change"  onclick="change(${i})"> &#9998; </span> 
        </div>
        
        <span class="text${i}"> ${USERS[UserId].tasks[i].todo}</span>
        <span class="time">${USERS[UserId].tasks[i].time} </span> 
           
    </div>`)
    }
    document.querySelector('.todo').innerHTML = out.join('');    
    
}
function save(i){
    let val = document.querySelector('#change-input'+i).value;
    USERS[UserId].tasks[i].todo = val;
    out();
    localStorage.setItem('USERS', JSON.stringify(USERS));
    document.querySelector('.change').style.display = 'block';
}

function change(i){
    let selector = '.text'+i;
    let val = document.querySelector(selector).innerHTML;
    document.querySelector(selector).innerHTML = 
    `<textarea class="change-input" id="change-input${i}" cols="75">${val}</textarea><br><button onclick="save(${i})">OK</button>`;
    document.addEventListener('click', function(e){
        if(e.target.className === 'change'){
            e.target.style.display = 'none';
        }
    })
}
document.addEventListener('click', function(e){
    if(e.target.className === 'checkbox' ){
        let id = e.target.getAttribute('data')
        if(USERS[UserId].tasks[id].check === false){        
            USERS[UserId].tasks[id].check = true;
            document.querySelector(`.text${id}`).style = "text-decoration: line-through;";
            document.getElementById(id).className += " checked";
            localStorage.setItem('USERS', JSON.stringify(USERS))   
        }else{
           document.getElementById(id).className = "doElem";
           document.querySelector(`.text${id}`).style = "text-decoration: none;";
           USERS[UserId].tasks[id].check = false;
            localStorage.setItem('USERS', JSON.stringify(USERS))
        }
    }
})

document.addEventListener('click',function(e){
    if(e.target.className === 'delete' ){
        let id = e.target.getAttribute('data')
        USERS[UserId].tasks.splice(id , 1);
            localStorage.setItem('USERS', JSON.stringify(USERS)) 
            out();
            pagination() 
    }
})

document.querySelector('input').addEventListener('keydown', function(e){
    if(e.code == 'Enter'){
        createTask();
    }
})
