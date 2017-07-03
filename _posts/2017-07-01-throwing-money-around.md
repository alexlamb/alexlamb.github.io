---
published: true
---
Here's a fun place to kick off a discussion about simulations. Give a room full of people a hundred bucks each in dollar bills. Then get them to hand money to random people they meet as they walk around, one dollar at a time. What do you think happens?

I discovered in researching this post that this interesting phenomenon has seen some recent interest on the internet, which delights me. You can read another post about this effect [here](http://www.decisionsciencenews.com/2017/06/19/counterintuitive-problem-everyone-room-keeps-giving-dollars-random-others-youll-never-guess-happens-next/). Or see a great Twitter conversation about that post [here](https://twitter.com/darrenglass/status/879332005078544384).

But before you follow those links, here's a model of the random-money-gifting effect that I built so you can find out for yourself. Each vertical bar represents a person and the hight of each person's bar represents how much money they've got. I've colored the bars randomly so you can see them clearly. As you can see, at the start of the game, everyone has the same amount of money. Click once the sim once to start it. Click again to freeze, and click a third time to reset. 




What are we seeing here? Well, unexpectedly, some people are making out like bandits while others end up with empty pockets. Why is that?

Well, it's not really that surprising if you think about it. Consider the first gifts made by each of the five hundred agents in the simulation. It would be weird if every agent chose a partner to give to such that there were zero overlaps and nobody got left out. So some people are going to end up with more money than others early on in the game. Then consider the second round of gifts. It would be just as strange if the second round of offered dollars was perfectly balanced to counteract the imbalance of the first. So within two rounds of everyone handing out money, we already know that some people are going to get ahead. And the bigger that asymmetry gets, the less likely that the gifts that follow are going to make that imbalance magically go away. 



What I think's interesting about this distribution of wealth is how much it looks like the ones that show up in real life. Take a look at this plot of the UK's income for [instance](https://www.thenetworkforsocialchange.org.uk/resources/am-i-rich.html). 


It's a little uncanny. Unsurprisingly, economists have used this kind of game to model national economies. And why not? You can think of this model as capturing one half of what makes an economy run. Every transfer of money is an instance of someone paying for something. We're just not bothering to model the services that they're getting in return for their cash. 

But to make our model of a national economy more realistic, let's add some extra realism. For starters, not everything in life costs a dollar, and not everyone starts off with the same amount of money. So let's vary the amount transferred in each transaction, and give everyone a random amount of cash within a given range to start with. 

Let's also add a metric to look at how the inequality in the model is changing over time. For this, we're going to use the GINI coefficient, a well-understood if imperfect yardstick for understanding societies and wealth. 

GINI is easy to understand. Basically, we calculate the differences from the average wealth that every agent has and find the mean of that number. Then we divide that mean by the largest possible value we could get, to give us a number between zero and one. Zero means that society is equal. One means that someone has all the money and everyone else is penniless. 

I've also measured something else here: social mobility. I look at where people start out on the social ladder and compare that to where they end up after people start handing them dollars. Finding the average distance traveled and comparing that to the maximum amount of possible change gives us a number similar to GINI that tells us whether wealth levels have changed. This gives us a way to model whether our toy economy is keeping people in one class, or letting them move about. 

I've added one more feature that's worth mentioning here. Instead of just giving every agent a random color, I've ranged the colors from dark to light based on how much money they start with. That way you can see at a glance whether our agents are moving about. This should help us check whether our mobility index is working. 


Here's the question: does adding extra complexity to the model change how it behaves? Click the sim to see. 






If a random process gives you something like the wealth curve that shows up in real life, why do we suppose that attributes like talent make a difference? The rich would get richer even if life was perfectly random, so why do we imagine that the wealthy earn what they get?

A conservative might reply by saying that there's no variable for talent in the model. If you don't put talent in and look at what happens, how can you possibly assert that talent isn't relevant?

So next time, we'll try that and see what happens.
