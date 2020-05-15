/* json-server --watch Desktop/TW/db.json */


const startBtn = document.getElementById("start-btn")
const nextButton = document.getElementById("next-btn")
const HighscoreButton = document.getElementById("hscr-btn")
const ResetScores = document.getElementById("reset-scores-btn")
const MenuButton = document.getElementById("btomenu-btn")
const ManageButton = document.getElementById("manage-btn")
const DeleteButton = document.getElementById("delete-btn")
const LogoutButton = document.getElementById("logout-btn")
const startText = document.getElementById("start-title")
const questionContElem = document.getElementById('question-container')
const questionElem = document.getElementById('question')
const answerButtons = document.getElementById('answer-buttons')
const scoreText = document.getElementById('score-txt')
const HighscoreTitle = document.getElementById('highscore-title')
const HighscoreText = document.getElementById('highscore-text')
const enc = document.getElementById('enc-txt')
var score
var checked
var question = []
var questionrequest = new XMLHttpRequest();
const loginform = document.getElementById('login')
const loginbutt = document.getElementById('loginbtn')
const registerbutt = document.getElementById('registerbtn')
const manageBD = document.getElementById('manage-user')
const manageTitle = document.getElementById('manage-title')
const manageText = document.getElementById('manage-text')
loginbutt.addEventListener('click', login)
registerbutt.addEventListener('click',to_register)
var users;
var usersrequest = new XMLHttpRequest();

questionrequest.open('GET','http://localhost:3000/questions');
questionrequest.onload = function(){
    questions = JSON.parse(questionrequest.responseText);
};
questionrequest.send();
let shuffledQ, currentQindex

usersrequest.open('GET','http://localhost:3000/users');
usersrequest.onload = function()
{
    users = JSON.parse(usersrequest.responseText);
}
usersrequest.send();


startBtn.addEventListener("click", startGame)
LogoutButton.addEventListener("click", local_clear)
HighscoreButton.addEventListener("click", to_highscores)
MenuButton.addEventListener("click", to_menu)
ManageButton.addEventListener("click", to_manage)
DeleteButton.addEventListener("click", to_delete)

nextButton.addEventListener("click", () => {
    currentQindex++
    set_next_q()
})

function local_clear()
{
    localStorage.clear()
    location.reload(true)
}

function startGame()
{   
    checked = 0
    score = 0

    console.log('started')
    startBtn.classList.add('hide')
    HighscoreButton.classList.add('hide')
    ManageButton.classList.add('hide')
    LogoutButton.classList.add('hide')
    startText.classList.add('hide')
    shuffledQ = questions.sort(() => Math.random() - .5)
    currentQindex = 0
    scoreText.innerText = 'Score:'
    scoreText.innerText += 0
    questionContElem.classList.remove('hide')
    scoreText.classList.remove('hide')
    enc.innerText = 'You can do it!'
    enc.classList.remove('hide')
    set_next_q()
}


function set_next_q()
{   
    checked = 0
    resetState()
    showQuestion(shuffledQ[currentQindex])
}


function showQuestion(question)
{   
    enc.innerText = "Come on, "
    for(let i = 0; i < users.length; i++)
        {
            if(users[i].username == localStorage.username)
            {
                let nameuser = users[i].name
                enc.innerText += nameuser
                break
            }
        }
    enc.innerText += "!! You can do it!"
    questionElem.innerText = question.question
    question.answers.forEach(answer =>{
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        if (answer.correct)
        {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', is_checked)
        answerButtons.appendChild(button)
    })
}

function is_checked(e)
{   
    if(checked == 0)
    {
        select_answer(e)
    }
}

function resetState()
{
    clearStatusClass(document.getElementById('quiz-bd'))
    nextButton.classList.add('hide')
    while (answerButtons.firstChild)
    {
        answerButtons.removeChild
        (answerButtons.firstChild)
    }
}

function select_answer(e)
{   
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.getElementById('quiz-bd') , correct)
    Array.from(answerButtons.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    if(correct)
    {
        score++
        scoreText.innerText = 'Score: '
        scoreText.innerText += score
        enc.innerText = 'Good job, '
        for(let i = 0; i < users.length; i++)
        {
            if(users[i].username == localStorage.username)
            {
                let nameuser = users[i].name
                enc.innerText += nameuser
                break
            }
        }
        enc.innerText +='!! (づ｡◕‿‿◕｡)づ '
    }
    else
    {
        enc.innerText = 'Better luck next time :('
    }
    
    if (shuffledQ.length > currentQindex + 1)
    {
        nextButton.classList.remove('hide')
    }
    else
    {   
        console.log(users)
        nhs = 0;
        checkHighScore()
        if(nhs == 1)
        {
            enc.innerText = 'Congrats! You beat your highest score. Your new High Score is:'
            enc.innerText += score
        }
        else
        {   
            enc.innerText = 'Maybe one more round?'
        }
        startBtn.innerText = 'Restart'
        startBtn.classList.remove('hide')
        HighscoreButton.classList.remove('hide')
        LogoutButton.classList.remove('hide')
    }
    checked = 1
}

function checkHighScore()
{   
    let index
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].username == localStorage.username)
        {
            index = i
            break
        }
    }

    if(users[0].score < score)
    {
        nhs = 1
        setHighScore()
    }
    
}



function setHighScore()
{
    let j
    let i
    for(i = 0; i < users.length; i++)
    {
        if(users[i].username == localStorage.username)
        {
            j = i
            break
        }
    }
    let idu = users[j].id
    let name = users[j].name
    let pasu = users[j].password
    let email = users[j].email
    var UserUP = {
        "username": localStorage.username,
        "password": pasu,
        "name": name,
        "email": email,
        "score": score
    }
    console.log(UserUP, idu)
    fetch('http://localhost:3000/users/' + idu, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(UserUP)
    }).then(function(response) {
        console.log(response)
    })
}





function setStatusClass(element, correct)
{
    clearStatusClass(element)
    if(correct)
    {   
        element.classList.add('correct')
    }
    else
    {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element)
{
    element.classList.remove('correct')
    element.classList.remove('wrong')
}



function check_login()
{
    if(localStorage.username)
    {  
        login_succes()
    }
}

function login_succes()
{   

    loginform.classList.add("hide")
    startBtn.classList.remove("hide")
    startText.classList.remove("hide")
    HighscoreButton.classList.remove("hide")
    LogoutButton.classList.remove('hide')
    if(localStorage.username == "admin")
    {
        ManageButton.classList.remove("hide")
    }
    check_login = 1
}


function login()
{   
    let user = document.getElementById("username").value
    let pass = document.getElementById("password").value
    let ok = 0
    for(let i = 0; i < users.length; i++)
    {
        if(users[i].username == user && users[i].password == pass )
        {
            ok = 1
            break
        }
    }
    if(ok)
    {
        localStorage.setItem("username",user)
        login_succes()
    }
    else
    {
        let warning = document.getElementById("warning")
        warning.innerText = "Username or Password Incorrect"
        
    }
}


function to_register()
{
    document.getElementById("warning").innerText = ''
    document.getElementById('registerform').classList.remove('hide')
    loginbutt.removeEventListener('click',login)
    loginbutt.addEventListener('click',to_login)
    registerbutt.removeEventListener('click',to_register)
    registerbutt.addEventListener('click', register)
}

function to_login()
{
    document.getElementById('warning').innerText = ''
    document.getElementById('registerform').classList.add('hide')
    loginbutt.removeEventListener('click',to_login)
    loginbutt.addEventListener('click', login)
    registerbutt.removeEventListener('click', register)
    registerbutt.addEventListener('click', to_register)

}


function register()
{
    let user = document.getElementById('username').value
    let pass = document.getElementById('password').value
    let passc = document.getElementById('confirmpassword').value
    let name = document.getElementById('fullname').value
    let email = document.getElementById('email').value
    let warning = document.getElementById('warning')
    if(pass != passc)
    {
        warning.innerText = 'Passwords are not the same'
    }
    else
    {
        let ok = 1
        for(let i = 0; i < users.length; i++)
        {
            if(users[i].username == user)
            {
                ok = 0
                break
            }
        }

        if(ok == 0)
        {
            warning.innerText = 'Username already exists!'
        }
        else
        {
            var newuser = {
                "username": user,
                "password": pass,
                "name": name,
                "email": email,
                "score": 0
            }
            console.log(newuser)
            fetch('http://localhost:3000/users', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newuser)
            }).then(function(response){
                console.log(response)
            })
        }
    }
    
}


function to_highscores()
{
    resetState()
    HighscoreTitle.classList.remove('hide')
    HighscoreText.classList.remove('hide')
    startText.classList.add('hide')
    scoreText.classList.add('hide')
    enc.classList.add('hide')
    questionContElem.classList.add('hide')
    startBtn.classList.add('hide')
    HighscoreButton.classList.add('hide')
    LogoutButton.classList.add('hide')
    startText.classList.add('hide')
    if(localStorage.username == 'admin')
    {
        ManageButton.classList.add('hide')
        ResetScores.classList.remove('hide')
    }
    MenuButton.classList.remove('hide')
    for(let i = 0; i < users.length; i++)
    {
        HighscoreText.innerHTML += "<p> Username: " + users[i].username + "<br> Score: " + users[i].score + "<br> </p>"
    }
}

function to_menu()
{

    HighscoreTitle.classList.add('hide')
    manageText.innerHTML = ""
    manageText.classList.add('hide')
    manageBD.classList.add('hide')
    HighscoreText.innerHTML = ""
    HighscoreText.classList.add('hide')
    startBtn.classList.remove('hide')
    HighscoreButton.classList.remove('hide')
    LogoutButton.classList.remove('hide')
    startText.classList.remove('hide')
    if(localStorage.username == 'admin')
    {
        ResetScores.classList.add('hide')
        ManageButton.classList.remove('hide')
        DeleteButton.classList.add('hide')
    }
    MenuButton.classList.add('hide')
}

function to_manage()
{
    MenuButton.classList.remove('hide')
    startText.classList.add('hide')
    scoreText.classList.add('hide')
    enc.classList.add('hide')
    questionContElem.classList.add('hide')
    startBtn.classList.add('hide')
    HighscoreButton.classList.add('hide')
    LogoutButton.classList.add('hide')
    startText.classList.add('hide')
    ManageButton.classList.add('hide')
    DeleteButton.classList.remove('hide')
    manageBD.classList.remove('hide')
    manageTitle.classList.remove('hide')
    manageText.classList.remove('hide')
    for(let i = 0; i < users.length; i++)
    {
        manageText.innerHTML += "<p> Username: " + users[i].username + "<br> ID: " + users[i].id + "<br> </p>"
    }
}

function to_delete()
{
    let DelUserID = document.getElementById("userdel").value
    fetch('http://localhost:3000/users/' + DelUserID, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(response) {
        window.location.reload();
    })
}

window.onload = function(){
    check_login()
}