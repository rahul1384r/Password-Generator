const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');

const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generate-password-btn');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const numb = '0123456789';
const symbols = '!@#$%^&*()_+{}[]":;~`<>\,.?/|';

let password = '';
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.dropshadow = '1px 1px 1px white';
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    const randmNumb = getRndInteger(0,numb.length);
    return numb.charAt(randmNumb);
}

function generateLowercase(){
    const randlower = getRndInteger(0,lowercase.length);
    return lowercase.charAt(randlower);
}

function generateUppercase(){
    const randupper = getRndInteger(0,uppercase.length)
    return uppercase.charAt(randupper);
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator('#0f0');
    }else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength>=6
    ){
        setIndicator('#ff0');
    }else{
        setIndicator('#f00');
    }
    
}


async function copyTextMsg(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = 'Copied';
        passwordDisplay.select();
    }
    catch(e){
        copyMsg.innerText = 'Failed';
    }
    copyMsg.classList.add('active');
    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

function shufflePassword(array){
    // Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyTextMsg();
    }
});

generateBtn.addEventListener('click', () => {
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = '';
    
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    for(let i=0;i<passwordLength - funcArr.length;i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    // show password
    passwordDisplay.value = password;

    calcStrength();
    console.log("Done");

});