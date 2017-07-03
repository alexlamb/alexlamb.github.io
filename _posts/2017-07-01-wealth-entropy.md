---
published: true
---
Here's a fun place to kick off a discussion about simulations. Give a room full of people a hundred bucks each in dollar bills. Then get them to hand money to random people they meet as they walk around, one dollar at a time. What do you think happens?

I discovered in researching this post that this interesting phenomenon has seen some recent interest on the internet, which delights me. You can read another post about this effect [here](http://www.decisionsciencenews.com/2017/06/19/counterintuitive-problem-everyone-room-keeps-giving-dollars-random-others-youll-never-guess-happens-next/). Or see a great Twitter conversation about that post [here](https://twitter.com/darrenglass/status/879332005078544384).

But before you follow those links, here's a model of the random-money-gifting effect that I built so you can find out for yourself. Each vertical bar represents a person and the hight of each person's bar represents how much money they've got. I've colored the bars randomly so you can see them clearly. As you can see, at the start of the game, everyone has the same amount of money. Click once the sim once to start it. Click again to freeze, and click a third time to reset. 




What are we seeing here? Well, unexpectedly, some people are making out like bandits while others end up with empty pockets. Why is that?

Well, it's not really that surprising if you think about it. Consider the first gifts made by each of the five hundred agents in the simulation. It would be weird if every agent chose a partner to give to such that there were zero overlaps and nobody got left out. So some people are going to end up with more money than others early on in the game. Then consider the second round of gifts. It would be just as weird if the second round of offered dollars was perfectly balanced to counteract the first. So within two rounds of everyone handing out money, we already know that some people are going to get ahead. And the bigger that asymmetry gets, the less likely that the gifts that follow are going to make it magically go away. 


Distribution looks like wealth in real life.

The GINI number in the top left is a measure of wealth inequality in the population.

In fact, this kind of game has been used to model national economies. 

You can think of this game as capturing one half of what makes an economy run. We're seeing people paying for things. We're just not bothering to model the services that they're getting. And from a big picture distribution standpoint, that doesn't seem to matter much.

But to make our model of a national economy, let's add a little more subtlelty. Because not everything in life costs a dollar, and not everyone starts off with the same amount of money.




I've also measured something else here: social mobility. I look at where people start out on the social ladder, and compare that to where they are now. That gives me a way to model whether our toy economy is keeping people in one class, or letting them move about. 


If a random process gives you something like the wealth curve that shows up in real life, why do we suppose that attributes like talent make a difference? The rich would get richer even if life was perfectly random, so why do we imagine that the wealthy earn what they get?

A conservative might reply by saying that there's no variable for talent in the model. If you don't put talent in and look at what happens, how can you possibly assert that talent isn't relevant?

So next time, we'll try that and see what happens. 



