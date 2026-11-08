---
title: "Foundations in Discrete AI Methods"
tags: [notes, uni]
lang: en
---



## logic

There are a couple of interesting things to know when we talk about discreet methods in AI, not least with those related with 'logic'. 

Relationship-wise, we have 'satisfiability', 'tautology', and 'unsatisfiability'.

Given a truth-evaluable statement $F$, 

- for it to be 'satisfiable', we need $\exists v:\bar v(F)=1$
- for it to be a tautology, we need $\forall v:\bar v(F)=1$
- for it to be 'unsatisfiable', we need $\forall v:\bar v(F)=0$

'A clause is valid only if it contains a literal and its negation.' I was originally baffled by this because there could be many cases where a clause could be valid, why it must be one statement with its literal and negation? Then I realized, this is indeed, the only case where a clause would be valid in itself, either syntactically or semantically since given 

$$
P_1\lor P_2
$$

and we could name this clause $C$, and we would assign values as

$$
v(P_1)=1,\qquad v(P_2)=1
$$

which would render $P_1\lor P_2$ true at this given truth condition (valuation), but one exception would be sufficient tell that that this clause is not valid and can never be valid: 
$$
v(P_1)=0,\qquad v(P_2)=0
$$

In order to be less sloppy, validity, safisfiability or tautology are all inherently **semantically** defined because we're still talking about all the possible assigned worlds to this truth evaluable statement $C = P_1\lor P_2$. It is simply that we happened to have *syntactical* hints to judge directly if a clause is valid or satisfiable or unsatisfiable. 


