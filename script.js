
///
/// алгоритм:
/// 1. строка заносится в var
/// 2. var делится на токены
/// 3. идет определение унарности или бинарности минусов в выражении
/// 3.5 добавить проверку правильности строки?
/// 4. массив токенов преобразуется в опн
/// 5. строка вычилсяется по алгоритму опн но с преобразованием операндов в дроби
/// 6. идет проверка на сокращаемость результата
/// 7. результат выводится на экран
///
///

var operators = ['+','-','/','*','^','(',')'];
var operatorByPrio = ['^','*','/','+','-'];
var priority1 = ['^'];
var priority2 = ['*','/'];
var priority3 = ['+','-'];
var operands = ['0','1','2','3','4','5','6','7','8','9','.',','];



var button = document.querySelector('button');
var line;


button.onclick = function(){
    var form = document.querySelector('input');
    line = form.value;
    if(line!=''){
    display(coolAnswer(count(toRPN(line))));
    } else {
        display('no-text');
    }
}

button.ondblclick = function(){

    //var a = pow(2,(1/2));
    //alert(2.79535*100000);
    //(coolAnswer(count(toRPN(line))));
    //display(coolAnswer(count(toRPN(line))));
    //alert('result lmao');
    //alert(Math.round(((Math.pow((Math.pow(4,7)),1/9))+Number.EPSILON)*10000)/10000);
}

var whole = document.querySelector('#whole');
var num = document.querySelector('.top');
var den = document.querySelector('.bottom');
var eq = document.querySelector('#equal');
var ap = document.querySelector('#approx');

var display = function(answer){
    if(answer=='no-text'){
        whole.innerHTML = 'Вы не ввели выражение';
        num.innerHTML = '';
        den.innerHTML = '';
        eq.innerHTML = '';
        ap.innerHTML = '';
    } else if (answer=='div-error'){
        whole.innerHTML = 'Делить на ноль запрещено';
        num.innerHTML = '';
        den.innerHTML = '';
        eq.innerHTML = '';
        ap.innerHTML = '';
    } else if (answer=='pow-error'){
        whole.innerHTML = 'Ошибка со степенями';
        num.innerHTML = '';
        den.innerHTML = '';
        eq.innerHTML = '';
        ap.innerHTML = '';
    } else if (answer=='input-error'){
        whole.innerHTML = 'Вы неверно ввели выражение';
        num.innerHTML = '';
        den.innerHTML = '';
        eq.innerHTML = '';
        ap.innerHTML = '';
    } else {
        var line = [];
        line = answer.split(':');
        //alert(line);
        if(line[0]==''){
            whole.innerHTML = line[0];
            num.innerHTML = line[1];
            den.innerHTML = line[2];
            eq.innerHTML = '≈';
            ap.innerHTML = +(line[1]/line[2]).toFixed(6);
        } else if(line[0]=='-'){
            whole.innerHTML = line[0];
            num.innerHTML = line[1];
            den.innerHTML = line[2];
            eq.innerHTML = '≈';
            ap.innerHTML = -(line[1]/line[2]).toFixed(6);
        } else if(line.length==3){
            whole.innerHTML = line[0];
            num.innerHTML = line[1];
            den.innerHTML = line[2];
            eq.innerHTML = '≈';
            ap.innerHTML = +line[0] + +(line[1]/line[2]).toFixed(6);
        } else {
            whole.innerHTML = line[0];
            num.innerHTML = '';
            den.innerHTML = '';
            eq.innerHTML = ' ';
            ap.innerHTML = ' ';
        }
    }
}

///функция преобразования в опн 
///вход: строка выражения в обычной записи
///выход: строка в обратной польской нотации
var toRPN = function(line){
    var sepLine = splitIntoTokens(line);
    var noMinusLine = checkMinuses(sepLine);
    var afterF = opn(noMinusLine);
    var afterA = useFractions(afterF);
    return afterA;
}

///функция разбиения выражения на токены (2 пункт)
///вход: строка в обычной записи
///выход: массив токенов
var splitIntoTokens = function(line){
    var array = Array.from(line.split(' ').join(''));
    var i = array.length-1;
    for(i;i>0;i--){
        if(!(operands.includes(array[i-1])&&operands.includes(array[i]))){
            array.splice(i,0,' ');
        }
    }
    return array.join('').split(' ');
}

///алгоритм определения унарности минуса в выражении (3 пункт)
///в случае нахождения унарного минуса добавляет 0 перед ним (необходимо для правильной работы ОПН)
///вход: массив токенов
///выход: измененный массив токенов
var checkMinuses = function(tokens){
    var i = tokens.length-1;
    for(i;i>0;i--){
        if((tokens[i-1]=='(') && (tokens[i]=='-')){
            tokens.splice(i,0,'0');
        }
    }
    if(tokens[0]=='-'){
        tokens.splice(0,0,'0');
    }
    return tokens;
}

///алгоритм преобразования в ОПН
/* Пока есть ещё символы для чтения:
    Читаем очередной символ.
    Если символ является числом, добавляем его к выходной строке.
    Если символ является открывающей скобкой, помещаем его в стек.
    Если символ является закрывающей скобкой:
    До тех пор, пока верхним элементом стека не станет открывающая скобка, выталкиваем элементы из стека в выходную строку. 
    При этом открывающая скобка удаляется из стека, но в выходную строку не добавляется. 
    Если стек закончился раньше, чем мы встретили открывающую скобку, это означает, 
    что в выражении либо неверно поставлен разделитель, либо не согласованы скобки.
    Если символ является бинарной операцией о1, тогда:
    1) пока операция на вершине стека приоритетнее o1
    … ИЛИ операция на вершине стека левоассоциативная с приоритетом как у o1
    … выталкиваем верхний элемент стека в выходную строку;
    2) помещаем операцию o1 в стек.
    Когда входная строка закончилась, выталкиваем все символы из стека в выходную строку. 
    В стеке должны были остаться только символы операций; если это не так, значит в выражении не согласованы скобки.*/
///вход: массив токенов в инфиксной записи
///выход: массив токенов в ОПН
var opn = function(tokens){
    var stack = [];
    var output = [];
    var l = tokens.length;
    for(var i = 0;i<l;i++){
        if(!(operators.includes(tokens[i]))){
            output.push(tokens[i]);
            //alert('ебать ввел число в output');
        } else if(tokens[i]=='('){
            stack.push(tokens[i]);
        } else if(tokens[i]==')'){
            while(stack[stack.length-1]!='('){
                output.push(stack.pop());
            }
            stack.pop();
        } else {
            //alert('ебать это нихуя не число');
            while(
            ((priority1.includes(stack[stack.length-1])) && (priority2.includes(tokens[i]))) || 
            ((priority2.includes(stack[stack.length-1])) && (priority3.includes(tokens[i]))) ||
            ((priority1.includes(stack[stack.length-1])) && (priority3.includes(tokens[i]))) ||
            ((priority2.includes(stack[stack.length-1])) && (priority2.includes(tokens[i]))) ||
            ((priority3.includes(stack[stack.length-1])) && (priority3.includes(tokens[i])))){
                output.push(stack.pop());
            }
            stack.push(tokens[i]);
        }
    }
    //alert(stack);
    //alert(output);
    var l = stack.length;
    for(var i = 0;i<l;i++){
        output.push(stack.pop());
        //alert('eбать я ща элемент вкинул');
    }
    return output;
}


///вход: массив токенов
///выход: массив токенов-объектов
var useFractions = function(tokens){
    var l = tokens.length;
    var line = [];
    for(var i = 0;i<l;i++){
        if(!(operators.includes(tokens[i]))){
 
            if(Array.from(tokens[i]).includes('.')){
                var n = afterPoint(tokens[i],'.');
                var fraction = `${tokens[i].split('.').join('')}:${10**n}`;
                line.push(fraction);
            } else if (Array.from(tokens[i]).includes(',')) {
                var n = afterPoint(tokens[i],',');
                var fraction = `${tokens[i].split(',').join('')}:${10**n}`;
                line.push(fraction);
            } else {
                var fraction = `${tokens[i]}:1`;
                line.push(fraction);
            }
        }else{
            line.push(tokens[i]);
        }
    }
    return line;
}

///алгоритм подсчета строки ОПН
///вход: строка в ОПН
///выход: ответ выражения
var count = function(line){
    var stack = [];
    var result;
    var l = line.length;
    for(var i = 0;i<l;i++){
        if(!(operators.includes(line[i]))){
            stack.push(line[i]);
            //alert('ебать закинул число в стэк');
        } else {
            var b = stack.pop();
            var a = stack.pop();
            switch (line[i]){
                case '+':
                    result = sum(a,b);
                    stack.push(reduce(result));
                    break;
                case '-':
                    result = sub(a,b);
                    stack.push(reduce(result));
                    break;
                case '*':
                    result = mul(a,b);
                    stack.push(reduce(result));
                    break;
                case '/':
                    result = div(a,b);
                    if(result=='error'){
                        result='div-error';
                        break;
                    }
                    stack.push(reduce(result));
                    break;
                case '^':
                    result = pow(a,b);
                    if(result=='error'){
                        result='pow-error';
                        break;
                    }
                    stack.push(reduce(result));
                    break; 
            }
            //alert('ебать я что-то посчитал '+ result);

        }
    }
    if(result=='div-error'){
        return result;
    }
    if(result=='pow-error'){
        return result;
    }
    if(stack.length!=1){
        return 'Ебать ты сам понял че написал';
    }
    //alert(stack[0]);
    return stack[0];
}

//
var coolAnswer = function(notCoolAnswer){
    //alert(notCoolAnswer);
    if(notCoolAnswer=='div-error'){
        return 'div-error';
    }
    if(notCoolAnswer=='pow-error'){
        return 'pow-error';
    }
    var red = reduce(notCoolAnswer);
    var line = red.split(':');
    var num = line[0];
    var den = line[1];
    //alert(num);
    //alert(den);
    //alert(parseInt(num,10)>parseInt(den,10));
    if(den=='1'){
        return num;
    } else if(den=='-1'){
        return -num;
    } else if (100000000000%den==0){
        var isNegative;
        if(den*num<0){
            isNegative = true;
        } else {
            isNegative = false;
        }
        num = Math.abs(num);
        den = Math.abs(den);
        var factor = 100000000000/den;
        num = (num*factor).toFixed();
        den = (den*factor).toFixed();
        var anum = Array.from(num);
        //alert(anum);
    
        var aden = Array.from(den);
        //alert(aden);
        var a;
        var b;

        do{
            a = anum.pop();
            b = aden.pop();
        } while(!((a!='0')||(b!='0')));

        anum.push(a);
        aden.push(b);
        //alert(anum);
       // alert(aden);
        num = Math.abs(parseInt(anum.join(''),10));
        den = Math.abs(parseInt(aden.join(''),10));
        var answer = [];
        //alert(num>den);
        if(num>den){
            var modulo = num%den;
            if(isNegative){
                answer.push('-');
            }
            answer.push((num-modulo)/den);
            answer.push('.');
            //alert(modulo.toString().length);
            for(var i = 0; i<(aden.length-modulo.toString().length-1);i++){
                answer.push('0');
            }
            answer.push(modulo);
            return answer.join('');
        } else {
            if(isNegative){
                answer.push('-');
            }
            answer.push('0.');
            for(var i = 0; i<(aden.length-anum.length-1);i++){
                answer.push('0');
            }
            answer.push(num);
            return answer.join('');
        }
        
    } else {
        if(Math.abs(parseInt(num,10))>Math.abs(parseInt(den,10))){
            num = parseInt(num,10);
            den = parseInt(den,10);
            return `${(num-num%den)/den}:${Math.abs(num%den)}:${Math.abs(den)}`;
        } else {
            if(num*den<0){
                return '-:'+`${Math.abs(num%den)}:${Math.abs(den)}`;
            } else {
                return ':'+`${Math.abs(num%den)}:${Math.abs(den)}`;
            }
        }
    }
}

var sum = function(a,b){
    //alert(`ебать суммирую ${a} и ${b}`);
    var lineA = a.split(':');
    var lineB = b.split(':');
    var numA = lineA[0];
    var denA = lineA[1];
    var numB = lineB[0];
    var denB = lineB[1];
    var numR = +(numA*denB) + +(numB*denA);
    //alert(numR);
    var denR = (denA*denB).toString();
    //alert(denR);
    var result = numR+':'+denR;
    //alert(result);
    return result;
}

var sub = function(a,b){
    //alert(`ебать вычитаю ${b} из ${a}`);
    var lineA = a.split(':');
    var lineB = b.split(':');
    var numA = lineA[0];
    var denA = lineA[1];
    var numB = lineB[0];
    var denB = lineB[1];
    var numR = +(numA*denB) - +(numB*denA);
    var denR = (denA*denB).toString();
    var result = numR+':'+denR;
    return result;
}

var mul = function(a,b){
    //alert(`ебать умножаю ${a} и ${b}`);
    var lineA = a.split(':');
    var lineB = b.split(':');
    var numA = lineA[0];
    var denA = lineA[1];
    var numB = lineB[0];
    var denB = lineB[1];
    var numR = (numA*numB).toString();
    //alert(numR);
    var denR = (denA*denB).toString();
    //alert(denR);
    var result = numR+':'+denR;
    //alert(result);
    return result;
}

var div = function(a,b){
    //alert(`ебать делю ${a} на ${b}`);
    var lineA = a.split(':');
    var lineB = b.split(':');
    var numA = lineA[0];
    var denA = lineA[1];
    var numB = lineB[0];
    var denB = lineB[1];
    var numR = (numA*denB).toString();
    //alert(numR);
    var denR = (denA*numB).toString();
    //alert(denR);
    if(numB=='0'){
        return 'error';
    } else {
        return numR+':'+denR;
    }
}


var pow = function(a,b){
    //alert(`ебать возвожу ${a} в степень ${b}`);
    var lineA = a.split(':');
    var lineB = b.split(':');
    var numA = lineA[0];
    var denA = lineA[1];
    var numB = lineB[0];
    var denB = lineB[1];
    if((numA*denA<0)&&(denB!='1')){
        return 'error';
    } else if (numA==0&&numB==0){
        return 'error';
    } else {
        var numR = Math.round(((Math.pow((Math.pow(numA,numB)),1/denB))+Number.EPSILON)*10000)/10000;
        //alert(numR);
        var denR = Math.round(((Math.pow((Math.pow(denA,numB)),1/denB))+Number.EPSILON)*10000)/10000;
        //alert(denR);
        var n = Math.max(afterPoint(numR,'.'),afterPoint(denR,'.'));
        numR = (numR * Math.pow(10,n)).toFixed();
        denR = (denR * Math.pow(10,n)).toFixed();
        return numR+':'+denR;
    }
}

///сокращение дроби
var reduce = function(fraction){
    var line = fraction.split(':');
    var num = line[0];
    var den = line[1];
    if(fraction=='error' || den==0){
        return 'error';
    } else if (num==0){
        return `${0}:${1}`;
    } else {
    var g = gcd(num,den);
    num = num/g;
    den = den/g;
    return num+':'+den;
    }
}

///нахождение НОД
var gcd = function(a, b){
    if (b===0) {
        return a;
    }
    return gcd(b, a % b);
}

///сколько цифр после запятой
var afterPoint = function(num,typeOfPoint){
    if(num.toString().includes(typeOfPoint)){
        return num.toString().split(typeOfPoint).pop().length;
    } else {
        return '0';
    }
}