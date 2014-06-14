var length_of_session = {"work": 25, "break": 5, "rebreak": 10};

$(document).ready(function()
{
	$("button.session").click(function()
	{
		var type = $(this).attr("id");
		var length = length_of_session[type] * 60;
		
		Timer.set(length);
		Timer.start();
	});
	
	$("button.session").mouseover(function()
	{
		if(!Timer.isActive())
		{
			var type = $(this).attr("id");
			var length = length_of_session[type] * 60;
			render(length);
		}
	});
	
	$("button.session").mouseout(function()
	{
		if(!Timer.isActive())
		{
			render(Timer.time);
		}
	});
	
	$("button#stop.operation").click(function()
	{
		Timer.stop();
		Timer.set(0);
	});
	
	$("button#pause.operation").click(function()
	{
		Timer.stop();
	});
	
	$("button#play.operation").click(function()
	{
		Timer.start();
	});
});

var Timer = new function()
{
	this.time = 0;
	
	this.interval = new function()
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
	
	this.set = function(time)
	{
		this.time = time;
		render(this.time);
	}
	
	this.start = function()
	{
		var tick = this._tick.bind(this);
		this.interval.initiate(tick);
	}
	
	this.stop = function()
	{
		this.interval.terminate();
	}
	
	this.isActive = function()
	{
		return this.interval.instance;
	}
	
	this._tick = function()
	{
		this.time -= 1;
		
		if(this.time <= 0)
		{
			this.interval.terminate();
			
			//play sound here
		}
		
		render(this.time);
	}
}

function render(time)
{
	var minutes = Math.floor(time / 60);
	var seconds = String.pad(time % 60);
	
	time = minutes + ":" + seconds;
	
	$("#timer").text(time);
	$("title").text(time + ", Romodoro");
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