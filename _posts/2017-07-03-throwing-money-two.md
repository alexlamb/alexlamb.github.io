---
published: false
---
In the last post, I showed you a very simple simulation that seems to reproduce, at least to first approximation, the kind of wealth distribution that show up in real economies. To do this, all we had to do was give a bunch of agents some money and let them hand it around at random. Magic! And we raised the following question: *if this model reflects the real world so well, why should be believe that the rich are anything but plain lucky?* But we left on a cliffhanger. We didn't even try to look at what would happen if some of the agents were somehow more deserving of wealth than others. So let's fix that and see what happens. 

Let's tweak the simulation we used last time. First, let's give all our agents a special attribute we'll call *talent*. We'll color them brighter shades of gold based on how much talent they have. And then we'll extend our model so that for each transaction, instead of one agent just handing money to another, there's a choice. Each agent (let's call him A) picks two partners at random: B and C. He then chooses at random based on how talented B is compared to C, and gives his money to the winner. This doesn't mean that the most talented agent will always be selected. But if B has a talent of 4/10 and C has talent of 6/10, then B is going to receive money 40% of the time. 

Let's also change our fitness measure to reflect our new experiment. Last time, we looked to see whether agents had moved from their initial position on the social ladder. This time, let's look at each agent's distance from the ideal position they'd have if everyone were ordered perfectly by talent. 

What happens? Click the sim to find out.



At this point, our imaginary Conservative speaks up. Let's call her Ayn. 

"Look, see?" she says. "Talent rises to the top, just like you'd expect. The distribution is not that different to what it was before, but now those who work harder or who have more innate excellence are being appropriately rewarded. This is what you see in the data from the real world, and it's as it should be."

At this point, it's probably appropriate to introduce a Progressive voice. Let's call him Karl.

"The first thing to note," says Karl, "is that this society is less equal than the random one we started out with. Just look at the GINI coefficient." 

"What's wrong with that?" says Ayn?

"For starters, many of your population with at least some talent are doing less well than they were before we changed the model."

"So what?" says Ayn. "At least society is reflecting the value that is put into it. That's a better outcome."

"Only for those at the top," Karl points out. "Besides, this *isn't* what happens in the real world. In life, the money you can make is largely determined by how much you started out with. If we wanted to build a realistic model of society, we'd do that."

So lets try Karl's idea. This time, instead of A deciding who receives cash based on their talent, let's have him decide based on how much money B and C already own. We can imagine that an agent's money pile reflects the size of their marketing budget, perhaps, or their reputation for success. 

This time, we'll color the agents green for wealth. This means that at first, you can't see the individual agents, because they're all arranged in order of their bank-balance. However, that won't last long once the simulation starts. 

We'll re-set our fit metric back to the way it was initially so that it measures the change in an agent's wealth from their initial position. If where you start off in life is a good measure of where you end up, that number should stay high. 



"This is more like reality," said Karl. "Just look! Those who start rich stay rich."

"Except, once again, you're leaving out talent," says Ayn. "The only way to decide which model wins is via competition. Let's put both behaviors into the model and see which one dominates."

"Fair enough," said Karl. "You're on."

Which approach will have the greatest effect? Any guesses. Tune in next time for the next installment of Wealth Distribution Adventures!

