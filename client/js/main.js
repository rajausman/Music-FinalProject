window.onload = function () {
    const user = getSessionStorage();
    hideShowControls("searchDiv", "formDiv", user);
    let globalSongsList = [];
    let myPlayList = [];

    async function loginUser() {
        let result = await fetch('http://localhost:4000/users/auth-user', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
        
        body: JSON.stringify({
        
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
   })
        
 }).then(res => res.json());
   const response = result;
   if(response.status == 404) {
     document.getElementById("error").innerText ="Incorrect username and password."
   }
   else {
    setSessionStorage(result);
    hideShowControls("searchDiv", "formDiv", result);
   }
 }

 async function getAllSongs () {
    let collection = await fetch('http://localhost:4000/songs/getAll', {
        method: 'GET',
        headers: {
         'Content-type': 'application/json',
         'token': getSessionStorage().token
       },

    }).then(response =>  response.json()

        // if(response.status == 401) {
        //     sessionStorage.removeItem('userDetails');
        //     hideShowControls("searchDiv", "formDiv", getSessionStorage())
        //     return;
        // }
        // else {
         
        //}
    )

    globalSongsList = collection;
    collection.forEach(song => renderSongs(song));
 }

 function renderSongs(prod) {
    const div = document.createElement('div');
    div.classList = 'col';
    const cardDiv = document.createElement('div');
    cardDiv.classList = 'card';
    const img = document.createElement('img')
          img.src = prod.img;
          img.classList = "card-img-top";
          cardDiv.append(img);
    const cardBody = document.createElement('div');
    cardBody.classList = "card-body";
    const h5 = document.createElement('h5');
    h5.classList = "card-title";
    h5.title = "Artist Name"
    h5.innerText = prod.artistName;
    const p = document.createElement('p');
    p.classList = "card-text";
    p.title = "Song name";
    p.innerText = prod.songName;
    cardBody.append(h5);
    cardBody.append(p);
    


    const addInPlayList = document.createElement('a');
    addInPlayList.id = prod.id;
    addInPlayList.classList = 'icons fa-solid fa-circle-plus fa-2x';

    addInPlayList.addEventListener('click', function(event) {
        event.preventDefault();
      const currentObject = globalSongsList.find((e) => e.id ==  prod.id);
      const index = myPlayList.findIndex(item => item.id == prod.id);
      if(index < 0) {
         myPlayList.push(currentObject);
         renderPlayList(currentObject);
         addSongsToMyPlaylist(currentObject);
      }

    });

    cardBody.appendChild(addInPlayList);
    cardDiv.append(cardBody);
    div.append(cardDiv);

    document.getElementById('products').appendChild(div);
}

  async function addSongsToMyPlaylist (song) {
    let result = await fetch('http://localhost:4000/songs/addSongInPlaylist', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'token': getSessionStorage().token
          },
        
        body: JSON.stringify({ 

          userId: user.userId,
          id: song.id,
   })
        
 }).then(res => res.json());

 const addedSong = await result;
}

async function getMyPlayList(response) {

    let userId = response.userId || user.userId;
    let myCollection = await fetch('http://localhost:4000/songs/'+userId+'/getMySongs', {
           method: 'GET',
           headers: {
            'Content-type': 'application/json',
            'token': getSessionStorage().token
          },

       }   
    
    ).then(response => response.json());
        

     if(myCollection && myCollection.songList && myCollection.songList.length > 0) {
        myPlayList = myCollection.songList;
        myCollection.songList.forEach(song => renderPlayList(song));
     }
}

function renderPlayList(item) {
    document.getElementById("labelPlaylist").style.display = 'block';

    const div = document.createElement('div');
    div.classList = 'col';
    const cardDiv = document.createElement('div');
    cardDiv.classList = 'card';
    const img = document.createElement('img')
          img.src = item.img;
          img.classList = "card-img-top";
          cardDiv.append(img);
    const cardBody = document.createElement('div');
    cardBody.classList = "card-body";
    const h5 = document.createElement('h5');
    h5.classList = "card-title";
    h5.title = "Artist Name"
    h5.innerText = item.artistName;
    const p = document.createElement('p');
    p.classList = "card-text";
    p.title = "Song name";
    p.innerText = item.songName;
    cardBody.append(h5);
    cardBody.append(p);
    


    const playButton = document.createElement('a');
    playButton.id = item.id;
    playButton.classList = 'icons fa-solid fa-circle-play fa-2x';
    playButton.addEventListener('click', function(event) {
        event.preventDefault();
        playTrack(item);

    });

    const deleteBtn = document.createElement('a');
    deleteBtn.id = item.id;
    deleteBtn.classList = 'icons m-25 fa-solid fa-circle-xmark fa-2x';
    deleteBtn.addEventListener('click', function(event) {
        event.preventDefault();
        deleteItem(item.id);
        const index = myPlayList.findIndex(myItem => myItem.id == item.id);
        if(index > -1) {
           myPlayList.splice(index, 1);
           div.remove();
        }

    });

   

    cardBody.appendChild(playButton);
    cardBody.appendChild(deleteBtn);
    cardDiv.append(cardBody);
    div.append(cardDiv);

    document.getElementById('playList').appendChild(div);
} 


async function deleteItem (songId) {

    let myCollection = await fetch('http://localhost:4000/songs/'+songId+'/'+user.userId+'/deletePlayListItem', {
           method: 'DELETE',
           headers: {
            'Content-type': 'application/json',
            'token': getSessionStorage().token
          },

       }   
    
    ).then(response => response);
}

 function hideShowControls (searchDiv, formDiv, response) {
    if(response) {
     document.getElementById(searchDiv).style.display = 'block';
     document.getElementById(formDiv).style.display = 'none';
     document.getElementById("userInfoDiv").style.display = 'block';
     document.getElementById("userInfo").innerText = "Hi "+ response.username;
     document.getElementById("gallery").style.display = 'none';
     document.getElementById("error").innerText = "";
     document.getElementById("footer").style.display = 'block';
     getAllSongs();
     getMyPlayList(response);
    }
    else {
     document.getElementById(searchDiv).style.display = 'none';
     document.getElementById("userInfoDiv").style.display = 'none';
     document.getElementById(formDiv).style.display = 'block';
     document.getElementById("gallery").style.display = 'block';
     document.getElementById("footer").style.display = 'none';
     document.getElementById("products").innerHTML = "";
     document.getElementById("playList").innerHTML = "";
    }
    
 }

 let filteredSongs = [];
 function searchSongs (query) {

    if(query.trim() == "")
      filteredSongs = globalSongsList;
    else 
      filteredSongs = globalSongsList.filter(item => item.songName.toLowerCase().includes(query.toLowerCase()));

     document.getElementById("products").innerHTML = "";
     filteredSongs.forEach(song => renderSongs(song));

 }

 function setSessionStorage(item) {
    sessionStorage.setItem('userDetails', JSON.stringify(item));
 }

 function getSessionStorage () {
   const response = sessionStorage.getItem('userDetails');
     return JSON.parse(response);
      
 }

 function playTrack (listItem) {
   
    document.getElementById('player').innerHTML = "";
    document.getElementById('songName').innerHTML = "";
    document.getElementById('audio').style.display = 'block';

    setTimeout(function () {
        document.getElementById('audio').style.display = 'none';
        document.getElementById('songName').innerHTML = "<i class='fa-solid fa-music'></i> " +listItem.songName;
        document.getElementById('player').innerHTML = '<audio id="audio-player" class="audio-player" controls="controls" data-repeat="" data-id="'+listItem.id+'" src="'+listItem.song+'" type="audio/mp3">';
        document.getElementById('audio-player').addEventListener("ended", function() {
          let audioElement = document.getElementById("audio-player");
          const songRepition = Number(audioElement && audioElement.getAttribute('data-repeat'));
          if(songRepition > 0) {
             
             const songItem = myPlayList.find(item => item.id == audioElement.getAttribute('data-id'));
             playTrack(songItem);
             setTimeout(function () {
               document.getElementById("audio-player").setAttribute('data-repeat', songRepition - 1);
               document.getElementById("audio-player").play();
            },1000)
           }
      });

    },500);
  }


 document.getElementById('login').onclick = function(event) {
    event.preventDefault();
   loginUser();
}

    document.getElementById('searchSongs').onclick = function(event) {
    event.preventDefault();
    searchSongs(document.getElementById("searchText").value);
}

  document.getElementById('logout').onclick = function(event) {
    event.preventDefault();
    sessionStorage.removeItem('userDetails');
    hideShowControls("searchDiv", "formDiv", getSessionStorage())
  }

  document.getElementById("next").onclick = function () {
  
    const audioElement = document.getElementById("audio-player");
    const audioSongId = audioElement && audioElement.getAttribute('data-id');
    if(audioSongId) {
    const currentIndex =  myPlayList.findIndex(item => item.id == audioSongId);
    const nextIndex = (currentIndex + 1) % myPlayList.length;

    if(nextIndex > -1)
      playTrack(myPlayList[nextIndex]);
    }
  }


  document.getElementById("previous").onclick = function () {
    const audioElement = document.getElementById("audio-player");
    const audioSongId = audioElement && audioElement.getAttribute('data-id');
    if(audioSongId) {
    const currentIndex =  myPlayList.findIndex(item => item.id == audioSongId);
    const prevIndex = (currentIndex + myPlayList.length - 1) % myPlayList.length;

    if(prevIndex > -1)
       playTrack(myPlayList[prevIndex]);
    }
  }

  document.getElementById("shuffle").onclick = function () {
   const shuffleItem = myPlayList[Math.floor(Math.random() * myPlayList.length)];
   if(shuffleItem) {
      playTrack(shuffleItem);
   }
  }

  document.getElementById("repeat").onclick = function () {
    const audioElement = document.getElementById("audio-player");
    const songRepition = Number(audioElement && audioElement.getAttribute('data-repeat'));
    if(audioElement && songRepition >= 0) {
      audioElement.setAttribute('data-repeat', songRepition + 1);

    }

    
   }

 
 
}