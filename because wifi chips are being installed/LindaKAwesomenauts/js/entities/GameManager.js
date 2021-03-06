game.GameTimerManager = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		this.paused = false;
		this.lastCreep = new Date().getTime();
		this.alwaysUpdate = true;
	},

	update: function(){
		this.now = new Date().getTime();
		this.goldTimerCheck();
		this.creepTimerCheck();

		return true;
//hai
	},
	goldTimerCheck: function(){
		if(Math.round(this.now/1000)%20 ===0 && (this.now - this.lastCreep >= 1000)){
			game.data.gold += me.save.exp1 + 1;
			console.log("Current gold count:" + game.data.gold);
		}
	},

	creepTimerCheck: function(){
		if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >= 1000)){
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
			var creepe2 = me.pool.pull("MyCreep", 100, 0, {});
			me.game.world.addChild(creepe2, 5);
		}
	}

});

game.HeroDeathManager = Object.extend({
	init: function(x, y, settings){
	this.alwaysUpdate = true;
	},

	update: function(){
		if(game.data.player.dead){
			me.game.world.removeChild(game.data.player);
			me.state.current().resetPlayer(10, 0);
		}
			return true;
	},
});

game.ExperienceManager = Object.extend({
	init: function(x, y, settings){
		this.alwaysUpdate = true;
		this.gameOver = false;
	},
	update: function(){
		if(game.data.win === true && !this.gameover){
			this.gameOver = true;
		} else if(game.data.win === false && !this.gameover){
			this.gameOver = false;
		}
		return true; 
	},

	gameOver: function(win){
		if(win){
		game.data.exp += 10;
	}else {
			game.data.exp += 1;
	}
			this.gameover = true;
		me.save.exp = game.data.exp;
		//for testing only
		me.save.exp4 = 4;
	}

});

game.SpendGold = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		this.paused = false;
		this.lastBuy = new Date().getTime();
		this.alwaysUpdate = true;
		this.updateWhenPaused = true;
		this.buying = false;
	},
	update: function(){
		this.now = new Date().getTime();

		if(me.input.isKeyPressed("buy") && this.now-this.lastBuy >=1000){
			this.lastBuy = this.now;
			if(!this.buying){
				this.startBuying();
			}else{
				this.stopBuying();
			}

		}
		return true;
	},
	startBuying: function(){
		this.buying = true;
		me.state.pause(me.state.PLAY);
		game.data.pausePos = me.game.viewport.localToWorld(0, 0);
		game.data.buyscreen = new me.Sprite(game.data.pausePos.x, game.data.pausePos.y, me.loader.getImage('gold-screen'));
		game.data.buyscreen.updateWhenPaused = true;
		game.data.buyscreen.setOpacity(0.8);
		me.game.world.addChild(game.data.buyscreen, 34);
		game.data.player.body.setVelocity(0, 0);
		//me.state.pause(me.state.PLAY);
		me.input.bindKey(me.input.KEY.F1, "F1", true);
		me.input.bindKey(me.input.KEY.F2, "F2", true);
		me.input.bindKey(me.input.KEY.F3, "F3", true);
		me.input.bindKey(me.input.KEY.F4, "F4", true);
		me.input.bindKey(me.input.KEY.F5, "F5", true);
		me.input.bindKey(me.input.KEY.F6, "F6", true);
		this.setBuyText();
	},

	setBuyText: function(){
		var exp1cost = ((game.data.exp1 + 1)* 2);
		game.data.buytext = new (me.Renderable.extend({
			init: function(){
				this._super(me.Renderable, 'init', [game.data.pausePos.x, game.data.pausePos.y, 300, 50]);
				this.font = new me.Font("Arial", 35, "white");
				this.updateWhenPaused = true;
				this.alwaysUpdate = true;
				//me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
			},
			draw: function(renderer){
				this.font.draw(renderer.getContext(), "Press F1-F6 to buy, B to exit. Current Gold:" + me.save.gold, this.pos.x, this.pos.y+50);
				this.font.draw(renderer.getContext(), "Skill 1: Increase Damage. Current Level:" + me.save.exp1 + "Cost: " + ((me.save.exp1+1)*2), this.pos.x, this.pos.y+100);
				this.font.draw(renderer.getContext(), "Skill 2: Run Faster" + me.save.exp2 + "Cost: " + ((me.save.exp2+1)*2), this.pos.x, this.pos.y+150);
				this.font.draw(renderer.getContext(), "Skill 3: Increase Health" + me.save.exp3 + "Cost: " + ((me.save.exp3+1)*2), this.pos.x, this.pos.y+200);
				this.font.draw(renderer.getContext(), "Q Ability" + me.save.exp4 + "Cost: " + ((me.save.exp4+1)*2), this.pos.x, this.pos.y+250);
				this.font.draw(renderer.getContext(), "W Ability" + me.save.exp5 + "Cost: " + ((me.save.exp5+1)*2), this.pos.x, this.pos.y+300);
				this.font.draw(renderer.getContext(), "E Ability" + me.save.exp6 + "Cost: " + ((me.save.exp6+1)*2), this.pos.x, this.pos.y+350);

			},

			}));
			me.game.world.addChild(game.data.buytext, 35);
	},

	stopBuying: function(){
		this.buying = false;
		me.state.resume(me.state.PLAY);
		game.data.player.body.setVelocity(game.data.playerMoveSpeed, 20);
		me.game.world.removeChild(game.data.buyscreen);
		me.input.unbindKey(me.input.KEY.F1, "F1", true);
		me.input.unbindKey(me.input.KEY.F2, "F2", true);
		me.input.unbindKey(me.input.KEY.F3, "F3", true);
		me.input.unbindKey(me.input.KEY.F4, "F4", true);
		me.input.unbindKey(me.input.KEY.F5, "F5", true);
		me.input.unbindKey(me.input.KEY.F6, "F6", true);
		me.game.world.removeChild(game.data.buytext);
	},

});