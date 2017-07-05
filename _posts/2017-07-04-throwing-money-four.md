---
published: false
---
In the last post, I left you with a mystery. We had built a small simulation of money moving around in a society, and had extended it to try to model the competing effects of individual aptitude and cumulative wealth. We were trying to figure out which aspect of the model was having a greater effect. I told you we were missing something. 

For those who didn't read that post and would like to try to figure it out for themselves before reading on, here's another copy of that sim, and a hint. Look at the fit measures that give you a score for how well talent and prior wealth are predicting an agent's success. Now look at the colors of the bars themselves. Do the scores reflect what you think you see?




I think it looks wrong. When I eyeball the results, I think there see fewer talented rich people than ones with prior wealth, despite what my prediction measures are telling me. Can that be right? (Bear in mind, this simulation is a little different every time it runs. If you don't see the same thing, run it again and decide for yourself.)

Let's test the idea that there's a discrepancy. How would we do that? I'd propose by specifically applying our measure functions for that part of the population where something fishy seems to be going on. So below you'll find another version of the sim in which we look at both our measures of fit as before, and then at the same functions exclusively applied to the top twenty-five percent of the population.



The numbers are different! Our functions weight every member of society equally, but when we look at the output plot, we're focusing on what makes people rich. But before we start to feel to smug about having spotted something important, we should ask why we were focusing on the rich in the first place. There are probably several reasons. The bars for rich people are taller and therefore easier to see. But also because we're socially programmed to attend to that part of the distribution that corresponds to the wealthy. 

I think that's telling. At some level, this entire simulation has become more about what makes someone rich than about what makes someone poor. And this is much like life, I think. It's easy to see the impacts of extreme wealth, because it tends to be obvious in our environment. It's often much harder to see and understand the effects of poverty.

This bias is even there in the way we plot our data. More wealth means a taller bar or a point higher up. Our value system and our attention is tacitly focused around an ideal of having *more*.

This is one of the reasons I like using simulation as a tool to stretch my understanding of the world. Because it makes me think about my assumptions and the mistakes of perception I'm making. It's not just about the code. It's about what trying to put an idea into code helps me notice about what's really going on around me.

The way I see it is that when we simply ingest news that's thrust at us by the world, we tend to  filter it so as to bolster a model of reality we carry around inside our heads. We can't help it. It's how our brains are wired. But writing a single page of code can give us a chance to test our model, figure out what we're missing, and start thinking about the world like rational people again.

So what have we learned so far? We've learned that while talent and class have an approximately equal effect in our simulation the way we've set it up, the effects *aren't equal* across the entire population. We can't just take a measure that looks at the whole population and expect it to give us answers about the behavior or traits of a few. Another way to say this is that average values bury information. 

What the sim also suggests is that in an environment where both talent and prior wealth matter, all things being equal, prior wealth is likely to matter more than talent for the top tiers of society. 

Have we proved that? Not at all. A simulation like this is nothing more than a thought experiment. To turn this result into publishable science, you'd need to justify the model, test variants of it, compare it to the existing literature, compare it to data for the world if such data exists, and maybe throw in a proof or two. But this blog isn't about doing professional science. It's about massively boosting our intuition with a relatively modest effort investment. And having fun.




