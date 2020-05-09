///
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
var priority1 = ['^'];
var priority2 = ['*','/'];
var priority3 = ['+','-'];
var operands = ['0','1','2','3','4','5','6','7','8','9','.',','];



var button = document.querySelector('button');
var line;


button.onclick = function(){
    var form = document.querySelector('input');
    line = form.value;

}

button.ondblclick = function(){
    toRPN(line);

}


///функция преобразования в опн 
///вход: строка выражения в обычной записи
///выход: строка в обратной польской нотации
var toRPN = function(line){
    var sepLine = splitIntoTokens(line);
    //alert(sepLine);
    var noMinusLine = checkMinuses(sepLine);
    //alert(noMinusLine);
    var afterF = opn(noMinusLine);
    //alert(afterF);
    var result = count(afterF);
    alert(result);
}

///функция разбиения выражения на токены (2 пункт)
///вход: строка в обычной записи
///выход: массив токенов
var splitIntoTokens = function(line){
    var array = Array.from(line);
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

///алгоритм подсчета строки ОПН
///вход: строка в ОПН
///выход: ответ выражения
var count = function(line){
    var stack = [];
    var result;
    var a;
    var b;
    var l = line.length;
    for(var i = 0;i<l;i++){
        if(!(operators.includes(line[i]))){
            stack.push(line[i]);
            //alert('ебать закинул число в стэк');
        } else {
            b = stack.pop();
            a = stack.pop();
            switch (line[i]){
                case '+':
                    result = sum(a,b);
                    stack.push(result);
                    break;
                case '-':
                    result = sub(a,b);
                    stack.push(result);
                    break;
                case '*':
                    result = mul(a,b);
                    stack.push(result);
                    break;
                case '/':
                    result = div(a,b);
                    stack.push(result);
                    break;
                case '^':
                    result = pow(a,b);
                    stack.push(result);
                    break;
            }
            //alert('ебать я что-то посчитал '+ result);
        }
    }
    if(stack.length!=1){
        //alert('нихуя error');
    }
    return stack[0];
}

var sum = function(a,b){
    return +a + +b;
}

var sub = function(a,b){
    return a-b;
}

var mul = function(a,b){
    return a*b;
}

var div = function(a,b){
    return a/b;
}

var pow = function(a,b){
    return a**b;
}