function noletters(){
  /*  if (event.keyCode < 48 || event.keyCode > 57){
        event.returnValue = false;
    }*/
}

///
///
/// алгоритм:
/// 1. строка заносится в var
/// 2. var делится на токены
/// 3. идет определение унарности или бинарности минусов в выражении
/// 4. массив токенов преобразуется в опн
/// 5. строка вычилсяется по алгоритму опн но с преобразованием операндов в дроби
/// 6. идет проверка на сокращаемость результата
/// 7. результат выводится на экран
///
///

var operators = ['+','-','/','*','^','(',')'];
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


///алгоритм преобразования в опн (2 пункт)
///вход: строка выражения в обычной записи
///выход: строка в обратной польской нотации
var toRPN = function(line){
    var sepLine = splitIntoTokens(line);
    alert(sepLine);
    var noMLine = checkMinuses(sepLine);
    alert(noMLine);
}

///алгоритм разбиения выражения токены (2 пункт)
///вход: строка в обычной записи
///выход: массив токенов
var splitIntoTokens = function(line){
    var array = Array.from(line);
    var i = array.length-1;
    for(var i;i>0;i--){
        if(!(operands.includes(array[i-1])&&operands.includes(array[i]))){
            array.splice(i,0,' ');
        }
    }
    return array.join('').split(' ');
}

var checkMinuses = function(tokens){
    var i = tokens.length-1;
    for(var i;i>0;i--){
        if((tokens[i-1]=='(') && (tokens[i]=='-')){
            tokens.splice(i,0,'0');
        }
    }
    if(tokens[0]=='-'){
        tokens.splice(0,0,'0');
    }
    return tokens;
}