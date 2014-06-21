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
	
	$("#stop").click(function()
	{
		Timer.stop();
		Timer.set(0);
	});
	
	$("#pauseplay").click(function()
	{
		if(Timer.isTiming())
		{
			if(Timer.isTicking())
			{
				Timer.stop();
			}
			else
			{
				Timer.start();
			}
		}
	});
	
	$("#add").click(function()
	{
		if(Timer.isTiming())
		{
			Timer.add(60);
		}
	});
	
	$("#remove").click(function()
	{
		if(Timer.isTiming())
		{
			Timer.remove(60);
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
		$("#pauseplay").addClass("toggled");
		var tick = this._tick.bind(this);
		this._interval.initiate(tick);
		tick();
	}
	
	this.stop = function()
	{
		$("#pauseplay").removeClass("toggled");
		this._interval.terminate();
	}

	this.add = function(time)
	{
		this.currentTime += time;

		if(this.currentTime > this.originalTime)
		{
			this.currentTime = this.originalTime;
		}

		this._render();
	}

	this.remove = function(time)
	{
		this.currentTime -= time;

		if(this.currentTime < 1)
		{
			this.currentTime = 1;
		}

		this._render();
	}

	this.isTiming = function()
	{
		return this.currentTime > 0;
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