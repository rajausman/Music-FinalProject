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

async function getMyPlayList(response) {

    let userId = response.userId || user.userId;
    let myCollection = await fetch('http://localhost:4000/songs/'+userId+'/getMySongs', {
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
     getAllSongs();
     getMyPlayList(response);
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
    document.getElementById('audio').style.display = 'block';
    setTimeout(function (){
        document.getElementById('audio').style.display = 'none';
        document.getElementById('player').innerHTML = '<audio id="audio-player" controls="controls" src="'+listItem.song+'" type="audio/mp3">';

    },500)
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

 
    // /*
    //   All audio and images curtosey of archive.org. What a solid website!
    // */
    // const src = [
    //   [
    //     "John Coltrane", "My Favorite Things", "https://ia803202.us.archive.org/10/items/cd_john-coltrane-my-favorite-things_john-coltrane/disc1/01.%20John%20Coltrane%20-%20My%20Favorite%20Things_sample.mp3", "https://upload.wikimedia.org/wikipedia/en/9/9b/My_Favorite_Things.jpg"
    //   ],
    //   [
    //     "Stan Getz", "Winter Wonderland", "https://ia800100.us.archive.org/20/items/cd_west-coast-live_stan-getz-chet-baker/disc1/01.06.%20Stan%20Getz;%20Chet%20Baker%20-%20Winter%20Wonderland_sample.mp3",
    //     "https://ia800100.us.archive.org/20/items/cd_west-coast-live_stan-getz-chet-baker/cd_west-coast-live_stan-getz-chet-baker_itemimage.png"
    //   ],
    //   [
    //     "Monty Alexander", "Pure Imagination", "https://ia800107.us.archive.org/9/items/cd_steamin_monty-alexander/disc1/01.%20Monty%20Alexander%20-%20Pure%20Imagination_sample.mp3", "https://ia800107.us.archive.org/9/items/cd_steamin_monty-alexander/cd_steamin_monty-alexander_itemimage.png"
    //   ],
    //   [
    //     "Ella Fitzgerald", "Sleigh Ride", "https://ia800801.us.archive.org/27/items/cd_ella-wishes-you-a-swinging-christmas_ella-fitzgerald/disc1/05.%20Ella%20Fitzgerald%20-%20Sleigh%20Ride_sample.mp3", "https://ia800801.us.archive.org/27/items/cd_ella-wishes-you-a-swinging-christmas_ella-fitzgerald/cd_ella-wishes-you-a-swinging-christmas_ella-fitzgerald_itemimage.png"
    //   ],
    //   [
    //     "Dave Brubeck", "Greensleeves", "https://ia800705.us.archive.org/16/items/cd_a-dave-brubeck-christmas_dave-brubeck/disc1/07.%20Dave%20Brubeck%20-%20What%20Child%20Is%20This_%20%28Greensleeves%29_sample.mp3", "https://ia800705.us.archive.org/16/items/cd_a-dave-brubeck-christmas_dave-brubeck/cd_a-dave-brubeck-christmas_dave-brubeck_itemimage.png"
    //   ]
    // ];
    
    // for (x = 0; x < src.length; x++) {
    //   var s = src[x];
    //   var number = parseInt(x) + 1;
    //   var artist = document.createTextNode(number + ": " + s[0]);
    //   var track_name = document.createTextNode(s[1]);
      
    //   var listItem = document.createElement('div');
    //   var artist_text = document.createElement('h3');
    //   var track_text = document.createElement('p');
      
    //   artist_text.appendChild(artist);
    //   track_text.appendChild(track_name);
      
    //   listItem.appendChild(artist_text);
    //   listItem.appendChild(track_text);
      
    //   listItem.classList.add('item');
    //   listItem.dataset.index = x;
      
    //   document.getElementById('list').appendChild(listItem);
    // }
    // displayTrack(0);
    
    // var listItems = document.querySelectorAll('.item');
    // listItems.forEach(el => {
    //   el.onclick = () => {
    //     displayTrack(el.dataset.index);
    //   };
    // });
    
    // function displayTrack(x) {
    //   var active = document.querySelector('.is-active');
    //   if (active) {
    //     active.classList.remove('is-active'); 
    //   }
    //   var el = document.getElementById('list').children[x];
    //   el.classList.add('is-active');
    //   var s = src[x],
    //       artist = s[0],
    //       track = s[1],
    //       audio = s[2],
    //       img = s[3],
    //       number = parseInt(x) + 1;
    //   document.getElementById('title').innerText = number + ": " + artist;
    //   document.getElementById('song_title').innerText = track;
    //   var albumArt = document.getElementById('art');
    //   albumArt.src = img;
    //   albumArt.alt = artist + " " + track;
    //   document.getElementById('audio').src = audio;
    // }
  

 
 
}