var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided,trex_down,trex_party;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var gameOver, restart;
var bg, bgImg;
var ave,aveImg;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_down= loadAnimation("trexab1.1.png","trexab2.2.png");
  trex_party= loadAnimation("trexfiesta1.png","trexfiesta2.png","trexfiesta3.png");
  aveImg= loadAnimation("ave1.png","ave2.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  bgImg = loadImage("bg2.jpg");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
 
 
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("down",trex_down);
  trex.addAnimation("party",trex_party);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  aveGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(bgImg);
  text("Puntuación: "+ score, 500,50);
 // camera.position.x=trex.x;

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    if(keyDown("RIGHT_ARROW") ) {
      trex.changeAnimation("party",trex_party);
    }
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
    }

    
    if(keyDown("DOWN_ARROW") ) {
      trex.changeAnimation("down",trex_down);
    } else if(keyDown("space"))
    trex.changeAnimation("running",trex_running);

    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnAves();

    if(aveGroup.isTouching(trex)){
      gameState = END;
  }
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    aveGroup.destroyEach();
   
    //establece velocidad de cada objeto del juego en 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    aveGroup.setVelocityXEach(0);
    //cambia la animación de Trex
    trex.changeAnimation("collided",trex_collided);
    
    
    //establece ciclo de vida a los objetos del juego para que nunca puedan ser destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    aveGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asigna ciclo de vida a la variable
    cloud.lifetime = 200;
    
    //ajusta la profundiad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agrega cada nube al grupo
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //genera obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //asigna escala y ciclo de vida al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //agrega cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
  }
}

function spawnAves() {
  //escribe el código aquí para aparecer las aves
  if (frameCount % 250 === 0) {
    var ave= createSprite(600,120,20,50);
    ave.y = Math.round(random(50,120));
    ave.addAnimation("fly",aveImg);
    ave.scale = 0.4;
    ave.velocityX = -(6 + 3*score/100);
    
     //asigna ciclo de vida a la variable
    ave.lifetime = 200;
   
    //agrega cada nube al grupo
    aveGroup.add(ave);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  aveGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}