function noletters(){
  /*  if (event.keyCode < 48 || event.keyCode > 57){
        event.returnValue = false;
    }*/
}

//var number = {
    //numinator,
    //denuminator,
//}

///
///
/// алгоритм:
/// 1. строка заносится в var
/// 2. строка преобразуется в опн
/// 3. строка вычилсяется по алгоритму опн но с преобразованием операндов в дроби
/// 4. идет проверка на сокращаемость результата
/// 5. результат выводится на экран
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
    torpn(line);
}


///алгоритм преобразования в опн (2 пункт)
///вход: строка выражения в обычной записи
///выход: строка в обратной польской нотации
var torpn = function(line){
    var sepline = split(line);
    for(let el of sepline){
        if(el=''){}
    }
    alert(sepline);
}

///алгоритм разбиения выражения на операторы и операнды
///вход: строка в обычной записи
///выход: массив??
var split = function(line){
    ///
    /// нужна функция, что меняет -1 на (0-1)
    ///
    /*for(var i;i<line.length;i++){
        if(line[i]='-' && line[i-1]){}
    }*/
    var array = Array.from(line);
    var i = array.length-2;
    for(var i;i>0;i--){
        if(!(operands.includes(array[i])&&operands.includes(array[i+1]))){
            array.splice(i+1,0,' ');
        }
    }
    return array.join('').split(' ');
}
