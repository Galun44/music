const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playList = $('.playlist')

const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const heading = $('.heading h2')
const author = $('.heading h4')
const audio = $('.audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progressBar = $('.progress-bar')
const progressArea = $('.progress-area')
const musicDuration = $('.max-duration')
const musicCurrentTime = $('.current-time')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Nơi này có anh',
            singer: 'Sơn Tùng M-TP',
            path: './assets/audio/noi-nay-co-anh.mp3',
            image: './assets/img/noi-nay-co-anh.jpg'
        },
        {
            name: 'Chúng ta không thuộc về nhau',
            singer: 'Sơn Tùng M-TP',
            path: './assets/audio/chung-ta-khong-thuoc-ve-nhau.mp3',
            image: './assets/img/chung-ta-khong-thuoc-ve-nhau.jpg'
        },
        {
            name: 'Chạy ngay đi',
            singer: 'Sơn Tùng M-TP',
            path: './assets/audio/chay-ngay-di.mp3',
            image: './assets/img/chay-ngay-di.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng M-TP',
            path: './assets/audio/muon-roi-ma-sao-con.mp3',
            image: './assets/img/muon-roi-ma-sao-con.jpg'
        },
        {
            name: 'Lạc trôi',
            singer: 'Sơn Tùng M-TP',
            path: './assets/audio/lac-troi.mp3',
            image: './assets/img/lac-troi.jpg'
        },
        {
            name: 'Bo xì bo',
            singer: 'Hoàng Thùy Linh',
            path: './assets/audio/BoXiBo-HoangThuyLinh-7702270.mp3',
            image: './assets/img/bo-xi-bo.jpg'
        },
        {
            name: 'Có như không có',
            singer: 'Đạt G',
            path: './assets/audio/CoNhuKhongCoLiveAtDearOcean-DatG-8446673.mp3',
            image: './assets/img/co-nhu-khong-co.jpg'
        },
        {
            name: 'Sống xa anh chẳng dễ dàng',
            singer: 'Bảo Anh',
            path: './assets/audio/SongXaAnhChangDeDang-BaoAnh-5259328.mp3',
            image: './assets/img/song-xa-anh-chang-de-dang.jpg'
        },
        {
            name: 'Thấy chưa',
            singer: 'Ngọt',
            path: './assets/audio/ThayChua-Ngot-7963751.mp3',
            image: './assets/img/thay-chua.jpg'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="song-thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h2>${song.name}</h2>
                <h4>${song.singer}</h4>
            </div>
            <div class="option">
                <i class="fa-solid fa-ellipsis"></i>
            </div>
        </div>`
        })
        playList.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        author.textContent = this.currentSong.singer
    },

    scrollToActive: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 100)
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    

    handlEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý khi quay Cd
        const cdThumbAnimation = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        }
        )
        cdThumbAnimation.pause()

        // Xử lý khi thu nhỏ Cd
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        }

        // Xử lý khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimation.play()
        }

        // Xử lý khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }

        // Xử lý khi nhấn nút play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Xử lý khi chạy tiến độ song
        audio.addEventListener("timeupdate", (e) => {
            const currentTime = e.target.currentTime
            const duration = e.target.duration
            const progressWidth = (currentTime / duration * 100)
            progressBar.style.width = progressWidth + '%'

            audio.addEventListener("loadeddata", (e) => {
                const audioDuration = e.target.duration
                const totalMin = Math.floor(audioDuration / 60)
                let totalSec = Math.floor(audioDuration % 60)
                if(totalSec < 10) {
                    totalSec = `0${totalSec}`
                }
                musicDuration.innerText = `${totalMin}:${totalSec}`
            })
            const currentMin = Math.floor(currentTime / 60)
            let currentSec = Math.floor(currentTime % 60)
            if(currentSec < 10) {
                currentSec = `0${currentSec}`
            }
            musicCurrentTime.innerText = `${currentMin}:${currentSec}`
        })

        // Xử lý khi tua song
        progressArea.onclick = function(e) {
            progressWidth = progressArea.offsetWidth
            const songDuration = audio.duration
            const clickOffsetX = e.offsetX
            audio.currentTime = (clickOffsetX / progressWidth) * songDuration
        }

        // Xử lý khi next song
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActive()
        }

        // Xử lý khi prev song
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
        }

        // Xử lý khi nhấn random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý khi nhấn repeat
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý khi end song
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()   
            } else {
                nextBtn.click()
            }
        }

        // Xử lý khi nhấn playlist
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('.option')) {

                }
            }
        }

    },

    start: function() {
        this.defineProperties()
        this.render()
        this.loadCurrentSong()
        this.handlEvents()
    },
}

app.start()