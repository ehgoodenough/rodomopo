var length_of_session = {"work": 25, "break": 5, "rebreak": 10};

$(document).ready(function()
{
	$("button").on("click", function()
	{
		var type = $(this).attr("id");
		var length = length_of_session[type] * 60;
		
		Timer.set(length);
	});
	
	$("button").on("mouseenter", function()
	{
		if(!Timer.interval)
		{
			var type = $(this).attr("id");
			var length = length_of_session[type] * 60;
			render(length);
		}
	});
	
	$("button").on("mouseleave", function()
	{
		if(!Timer.interval)
		{
			render(0);
		}
	});
});

var Timer = new function()
{
	this.set = function(time)
	{
		this.time = time;
		
		render(this.time);
		
		if(this.interval) {clearInterval(this.interval);}
		this.interval = setInterval(this._tick.bind(this), 1000);
	}
	
	this._tick = function()
	{
		this.time -= 1;
		
		if(this.time <= 0)
		{
			clearInterval(this.interval);
			this.interval = undefined;
			
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