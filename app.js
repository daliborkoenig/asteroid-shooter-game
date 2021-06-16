const canvas = document.querySelector("#game-wrapper")
let hero
let heroShip
const score = document.querySelector("#score")
const finalScore = document.querySelector("#final-score")
const lives = document.querySelector("#lives")
const level = document.querySelector("#level")
const startGame = document.querySelector(".start-game")
const gameOver = document.querySelector(".game-over")
const playAgainBtn = document.querySelector("#play-again")
const startGameBtn = document.querySelector("#start-game")
const gameMusic = new Audio('./sounds/game_music.mp3');
gameMusic.volume = 0.2
const missileSound = new Audio('./sounds/missile.wav');
const explosionMis = new Audio('./sounds/explosion2.wav');
const explosionShip = new Audio('./sounds/explosion2.wav');
const cursor = new Audio('./sounds/cursor.wav');
const explosion = document.querySelector('#explosion')


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
    this.level = 1
    this.levelScore = 0 
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
    this.speed = 10
    this.run = true
  }
  create(){
    const asteroid = document.createElement("div");
    asteroid.className = "asteroid";
    asteroid.style.left = `${this.posX}px`
    asteroid.style.top = `${this.posY}px`
    canvas.appendChild(asteroid)
    checkLevel()
    const sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
    const move = async () => {
      for (let i = this.position+100; i > 0 ; i-=this.speed) {
        if (this.run) {
          await sleep(50)
          this.posX -= this.speed
          asteroid.style.left = `${this.posX}px`
          if (Math.abs(this.posY - hero.posY) < 80 && this.posX <= hero.posX+100){
            i = 0
            explosionShip.play()
            explosion.style.display = "block"
            explosion.style.top = `${hero.posY-50}px`
            explosion.style.left = `${hero.posX+50}px`
            hero.lives -= 1
            lives.textContent = hero.lives
            if(hero.lives == 0){
              stopGame()
              return
            }
            setTimeout(() => {
              explosion.style.display = "none"
            }, 1000);
            asteroid.remove()
            enemy = new Asteroid()
            enemy.create()
            return
          }
        }
        if(!this.run){
          asteroid.remove()
          enemy = new Asteroid()
          enemy.create()
          return
        }
      }
      // hero.lives -= 1
      // lives.textContent = hero.lives
      // if(hero.lives == 0){
      //   stopGame()
      //   return
      // }
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
          explosion.style.display = "block"
          explosion.style.top = `${this.posY}px`
          explosion.style.left = `${this.posX}px`
          missile.remove()
          const asteroid = document.querySelector(".asteroid")
          asteroid.remove()
          hero.score +=1
          hero.levelScore +=1
          if(hero.levelScore == 5){
            hero.level +=1
            hero.levelScore = 0
            level.textContent= hero.level
          }
          score.textContent = hero.score
          setTimeout(() => {
            explosion.style.display = "none"
          }, 1000);
          enemy.run = false
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
      if(hero.posY <= 20){}
      else{
        hero.posY -= hero.speed
        heroShip.style.top = `${hero.posY}px`
      }
    }
    if(hero.down){
      if(hero.posY >= window.innerHeight-120){}
      else{
        hero.posY += hero.speed
        heroShip.style.top = `${hero.posY}px`
      }
    }
    if(hero.left){
      if(hero.posX <= 0){}
      else{
        hero.posX -= hero.speed
        heroShip.style.left = `${hero.posX}px`
      }
    }
    if(hero.right){
      if(hero.posX >= window.innerWidth-150){}
      else{
        hero.posX += hero.speed
        heroShip.style.left = `${hero.posX}px`
      }
    }
    else if(hero.fire){
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

function checkLevel(){
  for (let i = 1; i < hero.level; i++) {
    enemy.speed += 5   
    console.log(enemy.speed); 
  }
}






