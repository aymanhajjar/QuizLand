function startimer() {

}

$(document).ready( function() {
    $('.step').hide();
    $('.summary').hide();
    $('.ctdwntimer').hide();
    $('#quizres').hide();
    $('#loading').hide();
})

var quizname = '', timer = 0, nofq = 0, points = 0, tab = 0, choicemem = [0], totalpoints = 0, choiceval = [0], ctdwntimer = 0, restarted=false;

function startquiz(i) {
    $.ajax({
        url: `../../quizget/${i}`,
        type: 'GET',
        datetype: 'json',
        success: function(data) {
            if (data.time > 0) {
                timer = data.time
            }
            quizname = data.name;
            nofq = data.nofq;
            points = data.points;
            
            for (m=1; m<nofq+1; m++){
                $('#qlist').append(`<li> Question ${m}: <span id="answer${m}"> Unanswered </li>`)
            }

            

            for (i=1; i<nofq+1; i++){
                choicemem[i] = 0;
            }
            

            startcountdown(i);

            if (timer > 0) {
                starttimer();
            }
            

            
        $.ajax({
            url: `/quiztaken/${quizname}`,
            type: 'POST',
            data: {
                csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
            }
        })
        }
    })

    

}

function startcountdown(i, callback) {

    $('.ctmodal').show();

    var count = 3;
    $('#ctdwn').html(count);
    var counttimer = setInterval(function(){
        if(count <= 1){
          clearInterval(counttimer);
          showqsteps();
          showq(1);
          if(timer>0){
            $('.ctdwntimer').show();
          }
        }
        count--;
        $('#ctdwn').html(count);
      }, 1000);
    

}

function showqsteps () {

    $('.ctmodal').hide();
    $('.startpage').hide();

    n_ofsteps = nofq + 1;

    $('#addsteps').html('');

    while (n_ofsteps>0) {
        if (n_ofsteps == 1) {
            $('#addsteps').append('<span class="step last"></span>')
        } 
        else {
            $('#addsteps').append('<span class="step"></span>')
        }
        n_ofsteps-- ;
    }

    $('.step').show()

    $('#nextqBtn').show()

    $('#quizquestions').show()

}

function showq(n) {

    tab = tab + n;

    if (tab <= nofq){
        $.ajax({
            url: `../getq/${quizname}/${tab}`,
            type: 'GET',
            datatype: 'json',
            success: function (data) {
                $('#loading').hide();
                console.log(data)
                $('#questionname').html(`Q${tab}. ` + data.text);
                $('#qpoints').html(data.points)
                
                $('#questionname').show();
                $('.qpoints').show();
                $('#quizquestions').show();
                $('.summary').hide();
                
                $('.choice').attr('hidden', true);
                $('.choice').attr('disabled', true);
                $('.textchoice').attr('hidden', true);

                var choicecount = 1;

                [data.choices].forEach((choiceelement) => {
                    choiceelement.forEach((cho) => {
                    $(`#choicetext${choicecount}`).html(cho.choice);
                    $(`#ch${choicecount}`).attr('hidden', false);
                    $(`#choicetext${choicecount}`).attr('hidden', false);
                    $(`#ch${choicecount}`).attr('disabled', false);
                    $(`#ch${choicecount}`).attr('name', `q${n}`);
                    
                    if (cho.iscorrect == true) {
                        $(`#ch${choicecount}`).val(data.points);
                    }
                    else {
                        $(`#ch${choicecount}`).val(0);
                    }
                    choicecount ++;

                    })
                    
                })
            }
        })

        if (typeof choicemem[tab] === 'undefined'){
            choicemem.push(0);
            choiceval.push(0);
            $(`.choice`).prop('checked', false);
            $(`#arraypost`).append(`<input type="hidden" name="qval${tab-1}" value="0">`)
            console.log(`qval${tab-1} is 0`)
        }
        else {
            if (choicemem[tab] != 0) {
                $(`.choice`).prop('checked', false);
                $(`#ch${choicemem[tab]}`).prop('checked', true);
                $(`#arraypost`).append(`<input type="hidden" name="qval${tab-1}" value="${choiceval[tab-1]}">`)
                console.log(`qval${tab-1} is ${choiceval[tab-1]}`)
            }
            else {
                $(`.choice`).prop('checked', false);
                $(`#arraypost`).append(`<input type="hidden" name="qval${tab-1}" value="${choiceval[tab-1]}">`)
                console.log(`qval${tab-1} is ${choiceval[tab-1]}`)
            }
        }
    }
    else if (tab==nofq+1){
        $('#quizquestions').hide();
        $('.summary').show();
        
        for (i=1; i<nofq+1; i++){
            if (choicemem[i] !=0 || typeof choicemem[i] === 'undefined'){
                $(`#answer${i}`).html(`Answered`)
            }
            else {
                $(`#answer${i}`).html(`Unanswered`)
            }
        }

        totalpoints = 0;

        for (a=1; a<nofq+1; a++){
            if(choiceval[a]){
                totalpoints = totalpoints + parseInt(choiceval[a]);
            }
        }
        $('#total').val(totalpoints);
    }
    else {
        if (tab > nofq + 1) {
            clearInterval(ctdwntimer);
            $('.summary').hide();
            $('.ctdwntimer').hide();
            timer = 0;
            $.ajax({
                url: `/quiz/${quizname}`,
                type: 'POST',
                data: {
                    csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value,
                    total: totalpoints,
                },
                success: function(data) {
                    $('#loading').hide();
                    $('#quizres').show();
                    console.log(data)
                    $.each(data,function(index, ques){
                        if (choiceval[index+1] > 0){
                            $('#reslist').append(`<li style="color: darkgreen"> Q${index+1}. ${ques.text} <i class="fas fa-check"></i></li>
                            <span> Correct Answer: ${ques.correctchoice}`)
                        }
                        else {
                            $('#reslist').append(`<li style="color: darkred"> Q${index+1}. ${ques.text} <i class="fas fa-times"></i></li>
                            <span> Correct Answer: ${ques.correctchoice}`)
                        }

                        var avg = points/2

                        if (totalpoints < avg){
                            $('#respoints').html(`<p style="color: darkred">Points Earned: ${totalpoints}/${points}</p>`)
                        }
                        else {
                            $('#respoints').html(`<p style="color: darkgreen">Points Earned: ${totalpoints}/${points}</p>`)
                        }

                        $('#nextqBtn').html('Take more quizzes!');
                        $('#nextqBtn').attr('onclick', 'location.href="/explore"');
                        $('#prevqBtn').hide();
                    })
                }
            })
            return false;
          };
          
        tab = nofq+1;
    }

    

    if (tab==1) {
        $('#prevqBtn').hide();
    }
    else if(tab==2){
        if(restarted != true){
            $('#prevqBtn').show();
        }
    }
    else if (1<tab<nofq+1){
        if(restarted != true){
            $('#prevqBtn').show();
        }
    }
    
    if (tab == nofq +1){
        $('#nextqBtn').html('Submit and Get Results');
        $('#prevqBtn').html('Retry Quiz');
        $('#prevqBtn').attr('onclick', 'restartquiz()')
    }
    else {
        $('#nextqBtn').html('Next');
        $('#prevqBtn').attr('onclick', 'restartquiz()')
    }

    

    changesteps(tab);
}

function remchoice(e) {

    choicemem[tab] = e;
    
    choiceval[tab] = $(`#ch${e}`).val();

}

function changesteps(s){
    var i, x = $('.step');

    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }

    $(x[s-1]).addClass('active');
}

function starttimer() {
    var time = timer + 3
    ctdwntimer = setInterval(function(){
        if(time < 1){
          clearInterval(ctdwntimer);
          tab = nofq;
          showq(1);
        }
        else if(time<=11){
            time--;
            $('#ctdwntimer').html(time);
            $('.ctdwntimer').addClass('redtimer');
        }
        else {
        time--;
            $('#ctdwntimer').html(time);
        }
      }, 1000);
}

function restartquiz() {
    if (timer>0) {
        timer = Math.floor( timer/2 );
        clearInterval(ctdwntimer);
    }
    
    
    tab = 0;
    startcountdown();

    if (timer>0) {
    starttimer();
    }

    restarted = true;
}