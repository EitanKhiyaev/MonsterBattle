const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;
const LOG_EVENT_PLAYER_ATTACK='PLAYER_ATTACK'
const LOG_EVENT_PLAYER_STRONG_ATTACK='PLAYER_STRONG_ATTACK'
const LOG_EVENT_MONSTER_ATTACK='MONSTER_ATTACK'
const LOG_EVENT_PLAYER_HEAL='PLAYER_HEAL'
const LOG_EVENT_GAME_OVER='GAME_OVER'
const enteredValue=prompt('Maximum Life', '100')
let chosenMaxLife = parseInt(enteredValue);
let battleLog=[]

if(isNaN(chosenMaxLife) || chosenMaxLife<=0){
chosenMaxLife=100;
}
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);
function writeToLog(ev,val,finMonster,PlayerHealth){
  let logEntry={
    event:ev,
    value: val,
    finalMonsterHealth: finMonster,
    finalPlayerHealth: PlayerHealth
  };
if(ev===LOG_EVENT_PLAYER_ATTACK){
logEntry.target='MONSTER'
}
else if(ev===LOG_EVENT_PLAYER_STRONG_ATTACK){ 
  logEntry.target='MONSTER'
}
else if(ev===LOG_EVENT_MONSTER_ATTACK){
  logEntry.target='PLAYER'
}
else if(ev===LOG_EVENT_PLAYER_HEAL){
  logEntry.target='PLAYER'
}
battleLog.push(logEntry)
}
function reset(){
  currentMonsterHealth = chosenMaxLife;
 currentPlayerHealth = chosenMaxLife;
 resetGame(chosenMaxLife)
}
function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(LOG_EVENT_MONSTER_ATTACK, 
    playerDamage, 
    currentMonsterHealth, 
    currentPlayerHealth)
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert('You would be dead but the bonus life saved you!');
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert('You won!');
    writeToLog(LOG_EVENT_GAME_OVER, 
      'player won', 
      currentMonsterHealth, 
      currentPlayerHealth)
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert('You lost!');
    writeToLog(LOG_EVENT_GAME_OVER, 
      'monster won', 
      currentMonsterHealth, 
      currentPlayerHealth)
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert('You have a draw!');
    writeToLog(LOG_EVENT_GAME_OVER, 
      'IT\'S A DRAW', 
      currentMonsterHealth, 
      currentPlayerHealth)
  }
  if (currentMonsterHealth <= 0 || currentPlayerHealth<=0) {
      reset();
}
}

function attackMonster(mode) {
  let maxDamage;
  let logEvent;
  if (mode === 'ATTACK') {
    maxDamage = ATTACK_VALUE;
    logEvent=LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === 'STRONG_ATTACK') {
    maxDamage = STRONG_ATTACK_VALUE;
    logEvent=LOG_EVENT_PLAYER_STRONG_ATTACK
  }
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, 
    damage, 
    currentMonsterHealth, 
    currentPlayerHealth)
  endRound();
}

function attackHandler() {
  attackMonster('ATTACK');
}

function strongAttackHandler() {
  attackMonster('STRONG_ATTACK');
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than your max initial health.");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(LOG_EVENT_PLAYER_HEAL, 
    healValue, 
    currentMonsterHealth, 
    currentPlayerHealth)
  endRound();
}
function printLogHandler(){
  console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);