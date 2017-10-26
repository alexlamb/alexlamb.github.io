---
published: false
---
Greeings blog-friends! Welcome to the third installment in my series on modeling teamwork and organizations. This time: leadership. Almost as soon as I had built the model that I showed you in the last post, I realized I had an exciting tool for exploring the impact of leadership styles on organizational culture. Specifically, I had a tool for exploring leadership _dysfunction_. But as business guru [Patrick Lencioni](https://www.tablegroup.com/books/dysfunctions) and many others will tell you, identifying how things go wrong is the first part of figuring out how to make them right. And this sim makes that remarkably clear. In this post, I'll show you what I discovered.

(Incidentally, Lencioni's book makes some interesting points that correlate nicely with the output of sims like the ones we're exploring here. I recommend taking a look. But we'll have to come back to that in another post.)

In order to explain what I learned about leadership from this model, we should probably take a closer look at what leadership _is_. There are countless definitions that you'll find in business books, some more useful than others. Frequently they're couched in terms of what a leader _can_ be, or what many of us aspire to. At root, though, I'd propose the following definition. 

_A leader is someone who fulfills a coordination role in a social group and who is interacted with differently in order to help facilitate that purpose._

Note that we've said nothing about power, talent, or personality in that description. And there's a reason for that. Human beings tend to see leadership through a certain kind of lens. The role of group coordinator is usually coupled with certain implications about that person's personal attributes and societal value. But leadership in the rest of the animal kingdom seldom works the way it does for us. 

Consider bees. Who would you say 'leads' a hive of honey bees? Is it the queen? She's not making any decisions. She doesn't coordinate anything. She is responsible only for the production of offspring, and by some genetic measures is more like the birthing-slave of the hive than the leader. Yet still the hive makes decisions, for instance about where to forage or what constitutes an ideal new hive site. In his marvelous book, [Honeybee Democracy](https://www.amazon.com/Honeybee-Democracy-Thomas-D-Seeley/dp/0691147213), Thomas Seeley points out that if there _are_ leaders in a hive, they are the scouts. They are the ones who fly out, gather information about food sources and nest sites, and then bring it back to the others. The bees then make use of a collective decision-making process to figure out which scouts to listen to. What differentiates scouts from other workers? Pretty much just age and experience. They do the same jobs as other workers. Eat the same honey. And no one of them is "in charge".

So why do people tend to organize themselves differently? Honey bees have been around a lot longer than us, and are masters of seamless social coordination. Shouldn't we be taking our cues from them? Broadly speaking, I'd say there are two reasons why we don't. 

First, compared to other species, human beings make _really_ complex plans. People take on specific roles based on the needs of a given project, and carry them out in conjunction with others. For our ancestors, this often meant elaborate hunting strategies to trap game far larger than themselves. In the modern workplace, it usually has to do with who's handling what client or writing which piece of code. The nature of the tasks we take on can vary even from day to day. 

The fact that humans are, in essence 'programmable' with complex tasks means that simple, distributed social models like those the honey bees use are unlikely to work for us. That's because without explicit coordination, it's going to be very hard for any one of us to figure out what the rest of us our doing. 

Secondly, we are apes, and because of that, we consistently conflate leadership with sexual dominance. We can't help it. We evolved from species in which domainant males maintained sexual control over multiple females through physical force applied to rivals, just like lions or elk, or countless other mammals you can think of. That means that the process through which we pick someone to call the shots organizationally is likely to always be at least slightly muddied with who's calling the shots reproductively. Can we get past that as a species? I'd like to think so, even though the tide of biology may be against us. 

But my aim is not to get caught up in the weeds of organizational gender issues. It's to point out that people in leadership roles inevitably end up having differently percieved social _status_. In the workplace, we often instinctively treat leaders as more than coordinators or scouts. We tend to assume they are dominant. Likewise, leaders generally assume that dominance plays some role in their job. And, truth be told, sometimes it has to. Members of a team are just as likely to redundantly buck for the position of 'alpha', consequently skewing a team's agenda out of pure ego, as leaders are to unnecessarily indulge in alpha-behavior for themselves. 

These two ways that we differ from the bees has a profound impact on how human leadership happens. First, because our plans are complex, people often need to communicate with their leaders more than they do with randomly chosen other members of an organization. Secondly, because dominance behaviors exist, we make assumptions about how to treat each other based on our social status.

This means that we are perfectly positioned to augment the model we explored last time with a few simple features that will have a massive impact on how it behaves. Instead of modeling a team, we're going to model a dysfunctional company and then show how to fix it. 

How do we do that? For starters, we make it so that workers in our group _have_ to confer with their leaders from time to time. And then we introduce two little changes to our interaction heuristic. As a reminder, here's the rule we used. If an agent A is defected against by a partner B, A remembers, and retaliates against B the next time they meet. But if, instead, A and B successfully coordinate, A remembers, and uses that behavior instead.

This time, we're going to split the population into two groups: leaders and workers. And to make our company dysfunctional, we make the following change. If a worker is defected against by a leader, they don't feel empowered to retaliate. And leaders are so busy that they don't remember the specific positive interactions they have with workers.

That's it. All other elements of the sim remain the same. But as you'll see, the behavior that emerges is quite different. As before, there's one box to showing the agents themselves, and then one to show the levels of each kind of behavior for the leaders and workers. Click on the sim to see what what happens.



As you can see
