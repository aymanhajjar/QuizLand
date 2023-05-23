function follow(targetuser, thisuser){
    $.ajax({
        url: `../profile/${targetuser}/follow`,
        type: "POST",
        data: {
            'thisuser': `${thisuser}`,
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
        }
    }).done(function(returned_data){
        console.log('parsed json', returned_data)
        document.getElementById(`flwcount`).innerHTML = `<b>${returned_data.followercount}</b> followers`;
        document.getElementById(`flwingcount`).innerHTML = `<b>${returned_data.followingcount}</b> following`;
        document.getElementById(`followbtn`).style.display = 'none';
        document.getElementById(`unfollowbtn`).style.display = 'inline-block';

    });
}

function unfollow(targetuser, thisuser){
    $.ajax({
        url: `../profile/${targetuser}/unfollow`,
        type: "POST",
        data: {
            'thisuser': `${thisuser}`,
            csrfmiddlewaretoken: document.getElementsByName('csrfmiddlewaretoken')[0].value
        }
    }).done(function(returned_data){
        console.log('parsed json', returned_data)
        document.getElementById(`flwcount`).innerHTML = `<b>${returned_data.followercount}</b> followers`;
        document.getElementById(`flwingcount`).innerHTML = `<b>${returned_data.followingcount}</b> following`;
        document.getElementById(`followbtn`).style.display = 'inline-block';
        document.getElementById(`unfollowbtn`).style.display = 'none';
    });
}