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
   
  setSessionStorage(result);
  hideShowControls("searchDiv", "formDiv", result);
 }

 async function getAllSongs () {
    let collection = await fetch('http://localhost:4000/songs/getAll').then(response => response.json());
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
    


    // const playButton = document.createElement('a');
    // playButton.id = prod.id;
    // playButton.classList = 'icons fa-solid fa-circle-play fa-2x';
    // playButton.addEventListener('click', function(event) {
    //     event.preventDefault();
    //     console.log(event);
    // });

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
          },
        
        body: JSON.stringify({ 

          userId: user.userId,
          id: song.id,
   })
        
 }).then(res => res.json());

 const addedSong = await result;
}

async function getMyPlayList() {
    let myCollection = await fetch('http://localhost:4000/songs/'+user.userId+'/getMySongs', {
           method: 'GET',
           headers: {
            'Content-type': 'application/json',
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
        console.log(event);
    });

    const deletePlayList = document.createElement('a');
    deletePlayList.id = item.id;
    deletePlayList.classList = 'icons fa-solid fa-trash-plus fa-2x';

    deletePlayList.addEventListener('click', function(event) {
        event.preventDefault();
      

    });

    cardBody.appendChild(playButton);
    cardBody.appendChild(deletePlayList);
    cardDiv.append(cardBody);
    div.append(cardDiv);

    document.getElementById('playList').appendChild(div);
} 


 function hideShowControls (searchDiv, formDiv, response) {
    if(response) {
     document.getElementById(searchDiv).style.display = 'block';
     document.getElementById(formDiv).style.display = 'none';
     document.getElementById("userInfoDiv").style.display = 'block';
     document.getElementById("userInfo").innerText = "Hi "+ response.username;
     document.getElementById("gallery").style.display = 'none';
     getAllSongs();
     getMyPlayList();
    }
    else {
     document.getElementById(searchDiv).style.display = 'none';
     document.getElementById("userInfoDiv").style.display = 'none';
     document.getElementById(formDiv).style.display = 'block';
     document.getElementById("gallery").style.display = 'block';
     document.getElementById("products").innerHTML = "";
     document.getElementById("playList").innerHTML = "";
    }
    
 }

 function setSessionStorage(item) {
    sessionStorage.setItem('userDetails', JSON.stringify(item));
 }

 function getSessionStorage () {
   const response = sessionStorage.getItem('userDetails');
     return JSON.parse(response);
      
 }


 document.getElementById('login').onclick = function(event) {
    event.preventDefault();
   loginUser();
}

  document.getElementById('logout').onclick = function(event) {
    event.preventDefault();
    sessionStorage.removeItem('userDetails');
    hideShowControls("searchDiv", "formDiv", getSessionStorage())
  }

}