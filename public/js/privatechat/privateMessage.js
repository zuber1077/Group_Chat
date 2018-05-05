

$(document).ready(function () {
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    //console.log(paramOne);

    var newParam = paramOne.split('.');
    //console.log('1', newParam);
    swap(newParam, 0, 1);
    //console.log('2', newParam);
    var paramTwo = newParam[0]+'.'+newParam[1];
});

function swap(input, value_1, value_2) {
    var temp = input[value_1]; //storing value inside temperiar
    input[value_1] = input[value_2];
    input[value_2] = temp;
}