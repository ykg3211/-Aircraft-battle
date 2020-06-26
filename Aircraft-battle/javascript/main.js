// JavaScript Document
var game = {
    planeX : 195,
    planeY : 380,
    
    score : 0,
    level : 0,
    EnemyHP : 1,
    
    Ashot : 0,
    Aenemy : 0,
    start : function(){
        var bgm = document.getElementById('audio');
        bgm.volume = 0.5;
        bgm.play();

        document.getElementById('start').style.opacity = '0';

        var gameBox = document.getElementById('gamebox');
        var ammoBox = document.getElementById('ammobox');
        var enemyBox = document.getElementById('enemybox');
        
        this.addPlane(gameBox);
        var that = this;

        game.Ashot = setInterval(() => {
            that.shot(ammoBox);
        }, 300);

        game.Aenemy = setInterval(() => {
            that.addEnemy(enemyBox);
        }, 700-game.level*50);
    },

    addPlane : function(gameBox){
        var plane = new Image();
            plane.src = 'assets/plane.png';
            plane.style.width = '50px';
            plane.style.top = '400px';
            plane.style.left = '175px';
            plane.style.position = 'absolute';
            plane.ondragstart = function(){return false};
            plane.id = 'plane';
            plane.className = 'plane';

        gameBox.appendChild(plane);

        var bodywidth = document.body.offsetWidth;
        var nullwidth = bodywidth/2 - 200;
        var top,left;
        var that = this;

        window.onmousemove = function(e){
            top = ((e.clientY - 35)>85)?e.clientY - 35:85;
            top = (top > 545)?545:top;
            left = ((e.clientX - 35 - nullwidth)<0?0:e.clientX - 35 - nullwidth);
            left = (left > 350?350:left);

            that.planeX = left + 20;
            that.planeY = top - 20;

            if(this.document.getElementById('plane')){
                this.document.getElementById('plane').style.top = top + 'px';
                this.document.getElementById('plane').style.left = left + 'px';
            }
        }
    },

    addEnemy : function(enemyBox){
        var ifBoss = false;
        if(game.level >= 5){
            ifBoss = ((Math.random()*10)>7)?true:false;
        }
        var speed = Math.random()*3 + game.level/5 + (ifBoss?0:2);

        var arr = [];

        var enemy = new Image;
            enemy.src = ifBoss?'assets/boss.png':'assets/enemy.png';
            enemy.style.position = 'absolute';
            enemy.style.width = ifBoss?'120px':'70px';
            enemy.style.top = '40px';
            enemy.style.left = Math.random() * 330 + 'px';
            enemy.className = 'enemy';
            enemy.num = game.EnemyHP * (ifBoss?2:1);

        enemy.move = setInterval(() => {
            enemy.style.top = enemy.offsetTop + speed + 'px';
            if(enemy.offsetTop > 550){
                clearInterval(enemy.move);
                enemy.parentNode.removeChild(enemy);
            }
            arr = game.getClass('ammo')
            for(var i = 0;i < arr.length;i++){
                if(game.distance(enemy.offsetLeft+(ifBoss?63:35),enemy.offsetTop+(ifBoss?50:35),arr[i].offsetLeft+5,arr[i].offsetTop) < (ifBoss?50:25)){
                    console.log(enemy.num)
                    enemy.num --;
                    if(enemy.num == 0){
                        game.score += (ifBoss?50:20);
                        document.getElementById('score').textContent = game.score;
                        game.level = Math.floor(game.score/100)
                        document.getElementById('level').textContent = game.level;
                        game.EnemyHP = (game.level>=10)?2:1;

                        var bomb = new Audio;
                        bomb.src = 'assets/bomb.mp3';
                        bomb.volume = (ifBoss?1:0.5);
                        bomb.play();
                        clearInterval(enemy.move);
                        enemy.parentNode.removeChild(enemy);
                    }

                    arr[i].parentNode.removeChild(arr[i]);
                }
                if(game.distance(enemy.offsetLeft+(ifBoss?63:35),enemy.offsetTop+(ifBoss?63:35),game.planeX + 10,game.planeY + 40) < (ifBoss?63:30)){
                    console.log('crash!!');
                    game.gameOver();
                }
            }
        }, 20);

        enemyBox.appendChild(enemy);
    },

    shot : function(ammoBox){
        // console.log('planeX: '+this.planeX+' planeY: '+this.planeY);
        var x = this.planeX;
        var y = this.planeY;
        var ammo = new Image();
            ammo.src = 'assets/ammo.png';
            ammo.style.position = 'absolute';
            ammo.style.top = y + 'px';
            ammo.style.left = x + 'px';
            ammo.className = 'ammo';

        var audio = new Audio;
            audio.src = 'assets/launchAudio.mp3';
            audio.volume = 0.14;
            audio.play();

        ammo.out = setInterval(() => {
            y -= 10;
            ammo.style.top = y + 'px';
            if(ammo.offsetTop < 85){
                clearInterval(ammo.out);
                if(ammo.parentNode){
                    ammo.parentNode.removeChild(ammo);
                }
            }
        },10)
        ammoBox.appendChild(ammo);
    },

    gameOver : function(){
        clearInterval(game.Ashot);
        clearInterval(game.Aenemy);
        
        game.level = 0;
        game.score = 0;
        
        document.getElementById('start').style.opacity = '1';
        document.getElementById('ammobox').innerHTML = '';
        document.getElementById('enemybox').innerHTML = '';
        document.getElementById('gamebox').innerHTML = '';
        document.getElementById('score').textContent = game.score;
        document.getElementById('level').textContent = game.level;


    },

    playAudio : function(){
        var bgm = document.getElementById('audio')
        bgm.play()
    },



    distance : function(x1,y1,x2,y2){
        return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
    },

    getClass : function( cName , parent ){
        parent = parent || document;
        if ( document.getElementsByClassName)
        {
            return parent.getElementsByClassName( cName );
        }
        else
        {
            var all = parent.getElementsByTagName('*');
            var arr = [];
            for( var i=0;i<=all.length;i++ )
            {
                arrClass = all.className.split('');
                for ( var j=0;j<=arrClass.length;j++ )
                {
                    if ( arrClass[j]==cName )
                    {
                        arr.push( all[i] );
                        break;
                    }
                }
            }
            return arr;
        }
    },
}