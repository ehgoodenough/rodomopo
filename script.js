var session = {
    "work": {
        length: 25 * 60,
    },
    "short_break": {
        length: 5 * 60,
    },
    "long_break": {
        length: 10 * 60
    }
};

$(document).ready(function()
{
    var timer = new Timer();
    
    $("#sessions").find("button").click(function()
    {
        var type = $(this).attr("id");
        var length = session[type].length;
        
        timer.set(length);
        timer.start();
    });
    
    $("#stop").click(function()
    {
        timer.stop();
        timer.set(0);
    });
    
    $("#pauseplay").click(function()
    {
        if(timer.isTiming())
        {
            if(timer.isTicking())
            {
                timer.stop();
            }
            else
            {
                timer.start();
            }
        }
    });
    
    $("#add").click(function()
    {
        if(timer.isTiming())
        {
            timer.add(60);
        }
    });
    
    $("#remove").click(function()
    {
        if(timer.isTiming())
        {
            timer.remove(60);
        }
    });
});

var Timer = function()
{
    this.deltaTime = 0;
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
        
        this.deltaTime = Date.now();
        
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
        this.currentTime -= (Date.now() - this.deltaTime) / 1000;
        this.deltaTime = Date.now();
        
        if(this.currentTime < 0)
        {
            this.currentTime = 0;
        }
        
        if(this.currentTime == 0)
        {
            this.stop();
            new Audio("./sounds/ring.wav").play();
        }
        
        if(this.currentTime <= (60 * 5) + 1
        && this.currentTime >= (60 * 5) - 1)
        {
            if(this.originalTime == session["work"].length)
            {
                new Audio("./sounds/ding.wav").play();
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
        var seconds = String.pad(Math.floor(this.currentTime % 60));
        
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
