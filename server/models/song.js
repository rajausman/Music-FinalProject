
const util = require('../utility/util');
const songs = util.getSongsCollection();
const myPlayList = [];

module.exports = class Song {

    static fetchAll() {
        return songs;
    }

    static deleteById(songId) {
        const index = myPlayList.songList.findIndex(p => p.id === songId);
        if (index > -1) {
            myPlayList.songList = myPlayList.songList.filter(p => p.id !== songId);
        } else {
            throw new Error('NOT Found');
        }
    }

    static addSongs(request) {
        
        const index = myPlayList.findIndex(p => p.userId === request.userId);
        if (index > -1) {

            const mySong = songs.find(song => song.id == request.id);
            console.log("my song", mySong);
            myPlayList[index].songList.push(mySong);

        } else {

        const mySong = songs.filter(song => song.id == request.id);
         myPlayList.push(
         { userId: request.userId, 
           songList : mySong 
         });

            
        }    

        return myPlayList;
    }


    static fetchAllMyPlayList (userId) {
         
        const index = myPlayList.findIndex(p => p.userId == userId);
        if (index > -1)
        return myPlayList.find(item => item.userId == userId);
    }



    

}