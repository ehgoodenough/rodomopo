var length_of_session = {"work": 25 * 60, "short_break": 5 * 60, "long_break": 10 * 60};

$(document).ready(function()
{
	$("#sessions").find("button").click(function()
	{
		var type = $(this).attr("id");
		var length = length_of_session[type];
		
		Timer.set(length);
		Timer.start();
	});
	
	$("#operations").find("#stop").click(function()
	{
		Timer.stop();
		Timer.set(0);
	});
	
	$("#operations").find("#pauseplay").click(function()
	{
		if(Timer.isTicking())
		{
			Timer.stop();
		}
		else if(Timer.currentTime > 0)
		{
			Timer.start();
		}
	});
});

var Timer = new function()
{
	this.currentTime = 0;
	this.originalTime = 0;
	
	this.set = function(time)
	{
		this.currentTime = time;
		this.originalTime = time;
		
		this._render();
	}
	
	this.start = function()
	{
		var tick = this._tick.bind(this);
		this._interval.initiate(tick);
		$("#pauseplay").addClass("toggled");
	}
	
	this.stop = function()
	{
		this._interval.terminate();
		$("#pauseplay").removeClass("toggled");
	}
	
	this.isTicking = function()
	{
		return this._interval.instance;
	}
	
	this._tick = function()
	{
		this.currentTime -= 1;
		
		if(this.currentTime <= 0)
		{
			this.stop();
			new Audio("bell.wav").play();
		}

		if(this.currentTime == 60 * 5)
		{
			if(this.originalTime == length_of_session["work"])
			{
				new Audio("ding.wav").play();
			}
		}
		
		this._render();
	}
	
	this._interval = new function()
	{
		this.initiate = function(func)
		{
			clearInterval(this.instance);
			this.instance = setInterval(func, 1000);
		}
		
		this.terminate = function()
		{
			clearInterval(this.instance);
			this.instance = undefined;
		}
	}
	
	this._render = function()
	{
		var minutes = Math.floor(this.currentTime / 60);
		var seconds = String.pad(this.currentTime % 60);
		
		var time = minutes + ":" + seconds;
		
		$("#countdown").find("time").text(time);
		$("title").text(time + ", Rodomopo");
		
		$("#countdown").find("meter").attr("value", this.currentTime);
		$("#countdown").find("meter").attr("max", this.originalTime);
	}
}

String.pad = function(value, length, padding)
{
	value += "";
	length = length || 2;
	padding = padding || "0";
	
	while(value.length < length)
	{
		value = padding + value;
	}
	
	return value;
}