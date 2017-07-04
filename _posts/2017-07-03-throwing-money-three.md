---
published: false
---
Welcome back to my thrilling blog series on wealth inequality modeling! If you've been following the story so far, you know that our notional Conservative and Progressive voices, Ayn and Karl, have decided to test out their dueling ideas in a composite model that compensates both for the effects of cumulative wealth, and for the presence of talent. 

To make this work, every time we pick a pair of candidate money recipients, B and C, we'll take the average of the two probabilities. That way, the likelihood of B being chosen is going to be an even function of both their wealth and their talent. We're not going to try to weight the selection function one way or another. That would make things more complicated and more subjective. 

To show what's going on, we're coloring every bar in our distribution with two colors. The top half of each bar shows the talent of each individual. The bottom half shows how much money they start out with. And now we have two measures of fit: one for talent and one for initial wealth. Let's kick the model off and see what happens.



At first, things are looking good for Karl, but as the simulation rolls on, Ayn starts doing better. Was this what you expected?

"See?" says Ayn. "Talent will out!"

"But this isn't fair," says Karl.

"Life's not fair!" says Ayn. "Get used to it."

"What I mean is, everyone is immortal in this model. The whole problem with the kind of society you advocate is that wealth is usually inherited, not won. And the talent of one individual isn't a good guide for the talent of their offspring. If you really want to do justice to the effect I'm talking about, you'll have to replace agents with their offspring from time to time."

"Alright," says Ayn. "But the model is getting more complicated, and therefore more specific. The more moving parts you put in a simulation, the more likely it is to be wrong."

"A model should be simple, but not so simple that it leaves out important parts of the phenomena you're modeling," Karl retorts.

How are we going to add Karl's extra details to our simulation? Easy. After every cash transaction, we'll give our cash donor a small chance of dying. If A dies, his wealth is immediately passed on to his offspring, A Junior. How will we determine A Junior's talent? Let's take his parent's talent and some other random talent value and take the average. That's a simple approach and it's also vaguely justifiable. A person's skills and temperament are usually some function of their two parents.

We'll have to add in a little more code to track our measures of fit. At the end of a round of exchanges, we'll have to figure out what each agent was born with and how much relative talent they have so we can figure out what factors are playing a part in their failure or success. But that's not hard. We already have code for that built into the sim that we can repurpose.

How do we decide how long agents should live? After all, an agent's lifespan will determine how long they have for their talent to make a difference. Rather than try to math it out, let's choose something that seems notionally fair. How about one over the number of agents in the sim? That'll do for starters. 

Want to see how the model has changed? Click the sim to find out. 


At this point, neither Ayn nor Karl is looking happy. Our model has become so neutral that it's not giving a clear easy answer either way. We haven't found an easy win to justify either ideology. However, there's something that Ayn and Karl are both missing. Can you spot it as the simulation runs?

Next time, I'll let you in on the secret of what neither of our political pundits have spotted. 

