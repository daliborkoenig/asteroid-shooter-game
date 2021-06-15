const canvas = document.querySelector("#game-wrapper")
let hero
let heroShip
const score = document.querySelector("#score")
const finalScore = document.querySelector("#final-score")
const lives = document.querySelector("#lives")
const startGame = document.querySelector(".start-game")
const gameOver = document.querySelector(".game-over")
const playAgainBtn = document.querySelector("#play-again")
const startGameBtn = document.querySelector("#start-game")
const gameMusic = new Audio('./sounds/game_music.mp3');
gameMusic.volume = 0.20 
const missileSound = new Audio('./sounds/missile.wav');
const explosionMis = new Audio('./sounds/explosion2.wav');
const explosionShip = new Audio('./sounds/explosion2.wav');
const cursor = new Audio('./sounds/cursor.wav');


class Player{
  constructor(){
    this.up = false
    this.down = false
    this.left = false
    this.right = false
    this.fire = false
    this.score = 0
    this.lives = 3
    this.posX = 0
    this.posY = window.innerHeight/2
    this.speed = 20
  }
  create(){
    const player = document.createElement("div");
    player.className = "player";
    player.style.left = `${this.posX}px`
    player.style.top = `${this.posY}px`
    canvas.appendChild(player)
  }
}

class Asteroid{
  constructor(){
    this.posX = window.innerWidth-100
    this.position = window.innerWidth-100
    this.posY = Math.floor(Math.random()*(window.innerHeight-100))
    this.speed = 20
  }
  create(){
    const asteroid = document.createElement("div");
    asteroid.className = "asteroid";
    asteroid.style.left = `${this.posX}px`
    asteroid.style.top = `${this.posY}px`
    canvas.appendChild(asteroid)
    const sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
    const move = async () => {
      for (let i = this.position+100; i > 0 ; i-=this.speed) {
        await sleep(50)
        this.posX -= this.speed
        asteroid.style.left = `${this.posX}px`
        if (Math.abs(this.posY - hero.posY) < 80 && this.posX <= hero.posX+100){
          i = 0
          explosionShip.play()
          asteroid.remove()
          hero.lives -= 1
          lives.textContent = hero.lives
          if(hero.lives == 0){
            stopGame()
            return
          }
        }
      }
      asteroid.remove()
      createEnemy()
    }
    move()
  }
}
class Missile{
  constructor(){
    this.posX = hero.posX
    this.posY = hero.posY
    this.speed = 20
    this.position = hero.posX+40
  }
  fire(){
    const missile = document.createElement("div");
    missile.className = "missile";
    missile.style.left = `${this.posX+40}px`
    missile.style.top = `${this.posY+70}px`
    canvas.appendChild(missile)
    missileSound.play()
    const sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
    const move = async () => {
      for (let i = this.position; i < window.innerWidth-20 ; i+=this.speed) {
        await sleep(50)
        this.posX += this.speed
        missile.style.left = `${this.posX}px` 
        if (Math.abs(enemy.posY - this .posY) < 80 && enemy.posX <= this.posX+30){
          i = window.innerWidth-40
          explosionMis.play()
          missile.remove()
          const asteroid = document.querySelector(".asteroid")
          asteroid.remove()
          hero.score +=1
          score.textContent = hero.score
        }
      }
      missile.remove()
    }
    move()
  }
}

function checkKeys(){  
  heroShip = document.querySelector(".player")
  window.onkeydown = (e) => {
    if(e.code == "KeyW" || e.code == "ArrowUp"){
      hero.up = true
    }
    if(e.code == "KeyS" || e.code == "ArrowDown"){
      hero.down = true
    }
    if(e.code == "KeyA" || e.code == "ArrowLeft"){
      hero.left = true
    }
    if(e.code == "KeyD" || e.code == "ArrowRight"){
      hero.right = true
    }
    if(e.code == "Space"){
      hero.fire = true
    }
    playerMove()
  }
  window.onkeyup = (e) => {
    if(e.code == "KeyW" || e.code == "ArrowUp"){
      hero.up = false
    }
    if(e.code == "KeyS" || e.code == "ArrowDown"){
      hero.down = false
    }
    if(e.code == "KeyA" || e.code == "ArrowLeft"){
      hero.left = false
    }
    if(e.code == "KeyD" || e.code == "ArrowRight"){
      hero.right = false
    }
    if(e.code == "Space"){
      hero.fire = false
    }
  }
  function playerMove(){
    if(hero.up){
      hero.posY -= hero.speed
      heroShip.style.top = `${hero.posY}px`
    }
    if(hero.down){
      hero.posY += hero.speed
      heroShip.style.top = `${hero.posY}px`
    }
    if(hero.left){
      hero.posX -= hero.speed
      heroShip.style.left = `${hero.posX}px`
    }
    if(hero.right){
      hero.posX += hero.speed
      heroShip.style.left = `${hero.posX}px`
    }
    else if(hero.fire){
      console.log("bang bang");
      fire()
    }
  }
}
function createPlayer(){
  hero = new Player()
  hero.create()
  checkKeys()
}
function createEnemy(){
  enemy = new Asteroid()
  enemy.create()
  // new Asteroid
  // const enemy = document.querySelector(".asteroid")
}

function fire(){
  missile = new Missile()
  missile.fire ()
}

function gameStart(){
  createPlayer()
  createEnemy()
}
function stopGame(){
  gameOver.style.display = "block"
  finalScore.textContent = hero.score
  const player = document.querySelector(".player")
  player.remove();
}
startGameBtn.onclick = () =>{
  startGame.style.display = "none"
  gameStart()
}
playAgainBtn.onclick = () =>{
  gameOver.style.display = "none"
  gameStart()
}
startGameBtn.onmouseover = () =>{
  cursor.play();
}
playAgainBtn.onmouseover = () =>{
  cursor.play();
}
gameMusic.play();







