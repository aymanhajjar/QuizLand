var tab = 0;
var questions = 1;
var choices = [2];
var points = 0;
var added = [0, 0];
var modded = [0, 0];
var pointsarray = [0];
var removed = [0, 0];

$(document).ready(function(){
    $('#checkbox1').click(function(){
        $('#checkfield').attr('disabled', !this.checked)
    })
    showtab(tab);
})


function showtab(n) {

    var x = $('.tab');

    $(x[n]).show();
    $(x[n+1]).hide();
    console.log("n = " + n);

    if (n==0) {
        $('#prevBtn').hide();
        $('#addaq').hide();
        $('#removeq').hide();
    }
    else if(n==1){
        $('#prevBtn').show();
        $('#addaq').show();
        $('#removeq').hide();
    }
    else if (questions > 1 && 1<n<(x.length - 1)){
        $('#removeq').show();
        $('#prevBtn').show();
        $('#addaq').show();
    }
    

    if (n == (x.length - 1)) {
        console.log('added = ' +added[2])
        console.log('removed = '+ removed[2])
        console.log('pointsarr = '+pointsarray[2])

        $('#addaq').hide();
        $('#removeq').hide();

        $('#quizname').html('<b>Quiz Name: </b>' + $('#quiznamefield').val());
        $('#quizdesc').html($('#quizdescfield').val());

        if ($('#checkbox1').is(":checked")) {
            $('.timerdetails').show();
            $('#timerdetails').html($('#checkfield').val() + ' s');
        }
        else {
            $('.timerdetails').hide();
        }

        $('#quiznumber').html(`${questions}`);

        $('#nofq').val(questions)

        $('#nextBtn').html('Submit');

        for (i=0; i<questions; i++) {
            if (added[i+1] != true && modded[i+1] <1 && removed[i+1] == false) {
                points = points + parseFloat($(`#pointfield${i+1}`).val());
                pointsarray[i+1] = parseFloat($(`#pointfield${i+1}`).val());
                modded[i+1] = modded[i+1] + 1;
                added[i+1] = true;
                $('#totpoints').val(points)  
                console.log('notmod')
            }
            else if (added[i+1] != true && modded[i+1] >=1 && removed[i+1] == false) {
                points = points + parseFloat($(`#pointfield${i+1}`).val());
                points = points - pointsarray[i+1];
                pointsarray[i+1] = parseFloat($(`#pointfield${i+1}`).val());
                added[i+1] = true;
                $('#totpoints').val(points)   
                console.log('mod')
            }
        };

        $('#quizpoints').html(points);
    }
    else {
        $('#nextBtn').html('Next');
    }


    if (questions >= 2 && n != 0 && n != (x.length - 1) ) {
        $('#totalquestions').show();
    }
    else {
        $('#totalquestions').hide();
    }
    showsteps(n);
}

function nextPrev (n) {

    var x = $('.tab');

    if (n == 1 && !validateForm()) return false;

    $(x[tab]).hide();

    tab = tab + n;

    
    console.log('tab = ' + tab);
    
    if (tab >= x.length) {
        $('#createform').submit();
        return false;
      };

    showtab(tab);
}

function validateForm() {
    var x, y, i, valid = true;

    x = $('.tab');
    y = x[tab].getElementsByTagName('input');
    z = x[tab].getElementsByTagName('textarea');

    for (i=0; i < y.length; i++) {
        if (y[i].value == "" && y[i].id != 'checkfield' && !$(y[i]).prop('disabled')) {

            y[i].className += " invalid";
            valid = false;
          }
        
        else if (y[i].id == 'checkfield' && y[i].value == '' && questions == 1) {
            if ($('#checkbox1').is(":checked")) {
                y[i].className += " invalid";
                valid = false;
            }
            else {
                y[i].className.replace(" invalid", "");
            }
        }
    }

    for (i=0; i < z.length; i++) {
        if ($(z[i]).val() == "") {

            z[i].className += " invalid";
            valid = false;
          }
        }

    if (valid) {
        document.getElementsByClassName("step")[tab].className += " finished";
    }

    return valid;
}

function showsteps(n) {
    var i, x = $('.step');

    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }

    $(x[n]).addClass('active');
}

function changechoice(n, q) {

    console.log(choices[q-1], choices[q])
    choices[q-1] = choices[q-1] + n;

    if (choices[q-1] <= 2) {
        choices[q-1] = 2;
        $(`#removebtnq${q}`).attr('disabled', true);
        $(`#choicenumq${q}`).html(choices[q-1]);
        $(`#choice3q${q}`).attr('type', 'hidden');
        $(`#choice4q${q}`).attr('type', 'hidden');
        $(`#choice3q${q}`).attr('disabled', true);
        $(`#choice4q${q}`).attr('disabled', true);
        $(`#choice3q${q}`).val("");
        $(`#choice4q${q}`).val("");

    }
    else if (choices[q-1] >=4) {
        choices[q-1] = 4;
        $(`#addbtnq${q}`).attr('disabled', true);
        $(`#choicenumq${q}`).html(choices[q-1]);
        $(`#choice3q${q}`).attr('type', 'text');
        $(`#choice3q${q}`).attr('disabled', false);
        $(`#choice4q${q}`).attr('type', 'text');
        $(`#choice4q${q}`).attr('disabled', false);
    }
    else {
        $(`#addbtnq${q}`).attr('disabled', false);
        $(`#removebtnq${q}`).attr('disabled', false);
        $(`#choicenumq${q}`).html(choices[q-1]);
        $(`#choice${choices[q-1]}q${q}`).attr('type', 'text');
        $(`#choice${choices[q-1]}q${q}`).attr('disabled', false);
        $(`#choice${choices[q-1]+1}q${q}`).attr('type', 'hidden');
        $(`#choice${choices[q-1]+1}q${q}`).attr('disabled', true);
        $(`#choice${choices[q-1]+1}q${q}`).val("");
    }
}

function addaquestion() {

    questions = questions + 1;

    if (questions > 30) {
        questions = 30;
        $('#maximum').show();
    }
    else {
    let html =
    `
    <div class="tab" id="question${questions}">
        <h5>Question #${questions}:</h5>
        <div class="qdesc">
            Add another question; leave empty for this question to be ignored.
            </div>
            <input type="text" class="form-control" id="q${questions}" name="question${questions}" placeholder="Question ${questions}">
            <div class="questiondetails">
                <div class="choices">
                    <input type="text" class="form-control choicefield" name="choice1q${questions}" placeholder="Correct Choice">
                    <input type="text" class="form-control choicefield" name="choice2q${questions}" placeholder="Choice 2">
                    <input type="hidden" id="choice3q${questions}" class="form-control choicefield" name="choice3q${questions}" placeholder="Choice 3" disabled>
                    <input type="hidden" id="choice4q${questions}" class="form-control choicefield" name="choice4q${questions}" placeholder="Choice 4" disabled>
                </div>
                <div class="points">
                    <label>Points: </label> <input class="pointfield" id="pointfield${questions}" name="pointfield${questions}" type="number" onkeyup="modified()"><br>
                    <span>Choices:</span><br>
                    <button type='button' class="btn" id="removebtnq${questions}" onclick="changechoice(-1, '${questions}')" disabled><i class="fas fa-minus"></i></button>  
                    <span id="choicenumq${questions}">2</span>   
                    <button type='button' class="btn" id="addbtnq${questions}" onclick="changechoice(+1, '${questions}')"><i class="fas fa-plus"></i></button><br>
                </div>
            </div>
    </div>
    `;

    let step = `<span class="step" id="step${questions}"></span>`;

    choices.push(2);

    $('#tot').html(questions);

    $('#totalquestions').show();

    $('#addtabs').append(html);

    $('#addsteps').append(step);

    added.push(false);

    modded.push(0);

    removed.push(false);

    nextPrev(1);

    }

}

function removequestion() {

    qtab = tab;
    
    
    nextPrev(-1);

    $(`#question${qtab}`).remove();

    $(`#step${qtab}`).remove();

    questions = questions - 1;

    $('#tot').html(questions);

    removed[qtab] = true;

    
    if (added[qtab] == true && removed[qtab] == true) {
        points = points - pointsarray[qtab];
        added.splice(qtab, 1);
        removed.splice(qtab, 1);
        modded.splice(qtab, 1);
        pointsarray.splice(qtab, 1);
        console.log('removeed')
    } else {
        added.splice(qtab, 1);
        removed.splice(qtab, 1);
        modded.splice(qtab, 1);
        pointsarray.splice(qtab, 1);
    }


    
}

function modified() {
    input = $(`#pointfield${tab}`)
    if (input.val() != pointsarray[tab]){
        added[tab] = false;
    }
    else {
        added[tab] = true;
    }

    
}