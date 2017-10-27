---
published: false
---
Greeings blog-friends! Welcome to the third installment in my series on modeling teamwork and organizations. This time, I promised you a reveal on the topic of leadership. Specifically, I offered you one simple behavior that would change your effectiveness as a leader more than just about anything else. As it is, I'm going to give you two. But no doubt some of you who've been following this series might be wondering what a sim that only allows agents for four possible actions could possibly have to say about a topic as complex as leadership. The answer, I'd argue, is plenty.

Everyone knows that people are complicated and that their actions are upredictable. Everyone understands that no busines pans out the same way. Yet there are still patterns that show up in organizations. If there weren't, experience would count for nothing and no business books would ever get written. 

A sim is a deliberate attempt to strip away all the subtlety and nuance from the phenomenon you're modeling while still producing the important parts of the pattern you see in the real world – patterns like Tuckman's phases of team formation. Simulations whittle reality. By stripping away everything except what counts, we can start seeing past the complexity of the human condition, and see what's underneath. 

What do we have to play with in this model? Four actions and two rules. Our actions are the three flavors of teamwork and the one of exploitation. Our rules are the heuristics I mentioned last time. If an agent A is defected against by a partner B, A remembers, and retaliates against B the next time they meet. But if, instead, A and B successfully coordinate, A remembers, and uses that behavior instead.

In order to adapt the model to start showing a little organizational dysfunction, the number of changes we need to make are remarkably few. For starters, we split our team up into leaders and workers. Next, we add a little _status behavior_.  












This means that we are perfectly positioned to augment the model we explored last time with a few simple features that will have a massive impact on how it behaves. Instead of modeling a team, we're going to model a dysfunctional company and then show how to fix it. 

How do we do that? For starters, we make it so that workers in our group _have_ to confer with their leaders from time to time. And then we introduce two little changes to our interaction heuristic. As a reminder, here's the rule we used. If an agent A is defected against by a partner B, A remembers, and retaliates against B the next time they meet. But if, instead, A and B successfully coordinate, A remembers, and uses that behavior instead.

This time, we're going to split the population into two groups: leaders and workers. And to make our company dysfunctional, we make the following change. If a worker is defected against by a leader, they don't feel empowered to retaliate. And leaders are so busy that they don't remember the specific positive interactions they have with workers.

That's it. All other elements of the sim remain the same. But as you'll see, the behavior that emerges is quite different. As before, there's one box to showing the agents themselves, and then one to show the levels of each kind of behavior for the leaders and workers. Click on the sim to see what what happens.



As you can see, the leaders in our dysfunctional company never get past defecting, but something like an organizational culture forms anyway, even though it takes far longer to happen than it did with our simple team last time. Why do the leaders always defect? Because it's the easiest thing for them to do. Not being called to account for their actions means that there's no cost to bad behavior. And at the same time, there's a disincentive to try anything else because they can't remember positives. Note from the yellow happiness line for leaders that they're doing fine. They see no problem with this arrangement. And everyone else has found a way to get along, anyway. Once a company is stuck in this pattern, you won't see much interest from management about changing it.
