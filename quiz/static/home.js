window.addEventListener("beforeunload", function () {
    document.body.classList.add("animate-out");
  });

function showprof() {
    if (document.querySelector('#profilemenu').style.display == "none") {
    document.querySelector('#profilemenu').style.display = 'block';
    }
    else{
        document.querySelector('#profilemenu').style.display = 'none';
    }
    
}

const fetchPage = async (url) => {
    let headers = new Headers()
    headers.append("X-Requested-With", "XMLHttpRequest")
    return fetch(url, { headers })
}

document.addEventListener("DOMContentLoaded", () => {
    let sentinel = document.getElementById("ajaxdiv");
    let scrollElement = document.getElementById("explore_quizzes");
    let counter = 2;
    let endcounter = 0;
    let end = false;
    $('#searchpage').hide();
  
    
    let observer = new IntersectionObserver(async (entries) => {
      entry = entries[0];
      if (entry.intersectionRatio > 0) {
          let url = `../../explore?page=${counter}`;
          let req = await fetchPage(url);
          if (req.ok) {
              let body = await req.text();
              scrollElement.innerHTML += body;

              counter++;
          } else {
              // If it returns a 404, stop requesting new items
              end = true;
            if(endcounter == 0){
              body = "<div id='end' style='margin-top:20px;'> You've reached the end!</div>";
              scrollElement.innerHTML += body;
            }

              endcounter++;

              
          }
      }
    })
    observer.observe(sentinel);
  })

  document.addEventListener("DOMContentLoaded", () => {
    let sentinel = document.getElementById("ajaxfolloweddiv");
    let scrollElement = document.getElementById("explore_followed_quizzes");
    let counter = 2;
    let endcounter = 0;
    let end = false;
  
    
    let observer = new IntersectionObserver(async (entries) => {
      entry = entries[0];
      if (entry.intersectionRatio > 0) {
          let url = `../../followed?page=${counter}`;
          let req = await fetchPage(url);
          if (req.ok) {
              let body = await req.text();
              scrollElement.innerHTML += body;

              counter++;
          } else {
              // If it returns a 404, stop requesting new items
              end = true;
            if(endcounter == 0){
              body = "<div id='end' style='margin-top:20px;'> You've reached the end!</div>";
              scrollElement.innerHTML += body;
            }

              endcounter++;

              
          }
      }
    })
    observer.observe(sentinel);
  })

  function makeAjaxRequest() {
    if ($('#txtSearch').val() !=  ''){
      $('#content').fadeOut(100);
      $('#searchpage').fadeIn(300);

      var value = $('#txtSearch').val()
      $('#txt').html(value)

      console.log(`../../../search?q=${value}`)
      $.ajax({
        url: `../../../search?q=${value}`,
        type: 'GET',
        datatype: 'json',
        success: function(data) {
          console.log(data)
          $('#resultsdiv').html('');
          data.forEach((element) => {
            $('#resultsdiv').append(`<div class="quizcontainer_explore" onclick="location.href='/quiz/${element.name}'">
            <div class="firstcol">
                <h4 class="quizname">${element.name}</h4>
                    <p class="quizdesc">
                        <b>Description:</b><br>
                        ${element.description}
                    </p>
                <p class="quizby"><b>By: </b>${element.owner}</p>
                <p class="quizdate"><b>Posted ${element.date}</p>
            </div>
            <div class="seccol">
                <p class="quiznumber"><b>Number of questions: </b>${element.nofq}</p>
                <p class="quizpoints"><b>Total Points: </b>${element.points}</p>
            </div>
        </div>`)
          })
        }
      })
    }
    else {
      $('#content').show();
      $('#searchpage').hide();
    }
  }