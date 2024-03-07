/* Elementlere ulasmak */

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

//sira
let index = 1;

//dongu
let loop = true;

//json verisi
const songsList = [
  {
    name: "Sarmasik",
    link: "assets/Mabel Matiz.mp3",
    image: "assets/mabel.jpg",
    artist: "Mabel Matiz",
  },
  {
    name: "Vursalar Ölemem",
    link: "assets/Melek Mosso.mp3",
    image: "assets/melek.jpg",
    artist: "Melek Mosso",
  },
  {
    name: "Sen Rahat Uyu",
    link: "assets/TARKAN.mp3",
    image: "assets/tarkan.jpg",
    artist: "Tarkan",
  },
];

//oynat

const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); // Duraklat butonunu göster
  playButton.classList.add("hide"); // Oynat butonunu gizle
};

//durdur

const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

//sarki ata
const setSong = (arrayIndex) => {
  if (arrayIndex >= 0 && arrayIndex < songsList.length) {
    let { name, link, image, artist } = songsList[arrayIndex];

    audio.src = link;
    songName.innerHTML = name;
    songArtist.innerHTML = artist;
    songImage.src = image;

    audio.onloadedmetadata = () => {
      maxDuration.innerText = timeFormatter(audio.duration);
    };
    playListContainer.classList.add("hide");
    playAudio();
  } else {
    console.error("Invalid index for setSong");
  }
};

//surekli saniye kontrolu yap
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  //progress i ilerletecez 30%
  currentProgress.style.width =
    (audio.currentTime / audio.duration) * 100 + "%";
}, 1000);

//sarki suresi degisim kismi tiklanildiginda
progressBar.addEventListener("click", (event) => {
  //baslangıc
  let coordStart = progressBar.getBoundingClientRect().left;
  console.log(coordStart);

  //x ekseninde tiklama noktasi
  let coordEnd = event.clientX;
  console.log(coordEnd);
  console.log(progressBar.offsetWidth);

  //yüzdelik olarak hesaplama yap
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
  console.log(progress);

  //progress i ilerlet
  currentProgress.style.width = progress * 100 + "%";

  //sesin anlık süresini değiştir
  audio.currentTime = audio.duration * progress;

  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

//zaman formatla

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index = index - 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
};

const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index = index + 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
};

//tekrar butonuna tıklanıldığında
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

//karıştırıcı tıklanıldığında
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    audio.loop = true;
  } else {
    shuffleButton.classList.add("active");
    audio.loop = false;
  }
});

//sarki bittiginde
audio.onended = () => {
  nextSong(); //sonraki sarkiyi cagir
};

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

//oynat butonuna tiklanildiginda
playButton.addEventListener("click", playAudio);

//durdur butonuna tıklanıldığında
pauseButton.addEventListener("click", pauseAudio);

//önceki tiklanirsa
prevButton.addEventListener("click", previousSong);

//sonraki tiklanildiginda
nextButton.addEventListener("click", nextSong);

const initializePlaylist = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `<li class="playlistSong" onclick="setSong(${i})">
            <div class="playlist-image-container">
                <img src="${songsList[i].image}" />
            </div>

            <div class="playlist-song-details">
                <span id="playlist-song-name">${songsList[i].name}</span> -
                <span id="playlist-song-artist-album">${songsList[i].artist}</span>
            </div>
         </li>`;
  }
};

window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlaylist();
};
