---
title: "The Overfitting Crisis"
subtitle: "Why Your Best Models Are Your Worst Investments"
date: "2025-06-29"
excerpt: "Why top-performing backtests often fail in production. Learn to spot overfitting, build robust models, and survive causal shifts in ML and quant finance."
tags: ["Machine Learning", "Data Science", "Overfitting", "Quantitative Finance", "Artificial Intelligence"]
reading_time: 7
featured_image: /overfittingcrisis.webp?height=400&width=800
medium_link: https://medium.com/@johnmunn/the-overfitting-crisis-4be8716370f4
devto_link:
substack:
code_languages: []
draft: false
---

888 algorithmic trading strategies. R² of 0.025 between backtest and live performance. The problem runs deeper than bad luck.

If you’ve ever watched a beautiful backtest collapse the moment it goes live, you’re not alone. Every quant, every ML practitioner, has lived through this nightmare. The model looked perfect. The Sharpe was high. The drawdowns were minimal. The backtest results felt like a green light. But then forward performance hits, and it’s garbage.

This isn’t just a story about getting unlucky. It’s a structural problem. The deeper your optimization, the more likely you’re tuning to noise. And in high-dimensional systems like finance and machine learning, where data is limited and search spaces are huge, the default outcome _is_ overfitting. This piece breaks down how optimization destroys generalization, how dimensionality amplifies the illusion of alpha, and why most backtests lie. More importantly, it shows how to spot the traps, and avoid them.

## How Optimization Destroys Out-of-Sample Performance

In theory, optimization should improve your model. In practice, it often kills it.

In machine learning, overfitting happens when a model learns the training data too well. Memorizing noise rather than signal. In portfolio construction, it’s the same story: you optimize weights based on historical returns and end up with a portfolio that only performs well in that specific slice of history.

Take mean-variance optimization. Michaud’s classic critique is that it doesn’t find the “optimal” portfolio, it finds the one most sensitive to estimation error. When inputs are noisy (expected returns, covariances), the optimizer amplifies that noise, resulting in extreme weights and fragile portfolios.

The 2009 DeMiguel, Garlappi, and Uppal study showed that unless you have 250+ years of monthly data, mean-variance optimization will underperform a naive 1/N portfolio. With 50 assets, you need ~500 years of history to beat equal-weighting. Most practitioners use 10 years or less. Which means most _unconstrained_ optimized portfolios are likely noise-fit.

In ML, hyper parameter tuning does the same thing. Each tweak looks like a win, higher AUC, lower loss, but you’re just learning your validation set too well. You’re not borrowing performance from the future, you’re stealing it. And once that future arrives, the debt comes due.

The solution? Test your models the way they’ll actually be used: moving forward through time

```python
# Simple walk-forward validation in Python (pseudo-example)  
train_window = 500  # days  
test_window = 100  
for i in range(0, len(data) - train_window - test_window):  
    train = data[i : i+train_window]  
    test = data[i+train_window : i+train_window+test_window]  
    model.fit(train)  
    evaluate(model, test)
```

## The Curse of Dimensionality. Why More Data Isn’t Enough

As dimensions increase, the reliability of your model drops off a cliff. Every extra feature or asset you include increases the chance of capturing spurious relationships. In quant finance, the more factors or signals you test, the more likely you’ll find one that looks amazing by chance.

Campbell Harvey and colleagues documented 316+ published “factors” in asset pricing. Many were discovered by torturing the data. Because of multiple testing, a t-statistic of 2.0 means almost nothing. Harvey and Liu suggest that due to the sheer number of factors tested, t-stats of 3.0+ may be a more cautious threshold to mitigate false positives, though they have also critiqued blanket Sharpe ratio haircut practices. And even then, discount your expectations.

In ML, you see the same thing. A deep net can memorize randomly labeled images if you let it. High training accuracy means nothing without generalization. As the saying goes, “With four parameters I can fit an elephant, and with five I can make him wiggle his trunk.”

Here’s what that looks like in practice:

# ASCII illustration of overfitting  
Train Accuracy:      ██████████████████████ 99%  
Validation Accuracy: ███████████            84%

## Causal Fragility Detection (A Practitioner Framework)

Overfitting has a causal dimension most practitioners miss. Most models assume the world is stable, but causal structures change. To detect fragile dependencies:

- **Intervene**: Perturb input features and see if the model collapses.
- **Subgroup Drift**: Test performance across slices (regimes, time windows, demographics).
- **Path-specific analysis**: Use SCM tools (e.g., structural equation models, directed acyclic graphs, and backdoor-adjusted estimates from do-calculus) to isolate _which causal path_ is responsible for a prediction, and whether it would still hold if upstream drivers change.

Instead of standard diagnostics, we’re engaging in structural stress testing

> **_COVID Case Example_**_: Before 2020, customer churn models for airlines assumed price sensitivity and frequent flyer status were strong predictors. Post-pandemic, travel restrictions and health concerns completely rewired behavior. Features that once held strong causal links broke under new conditions. Models trained on 2019 data collapsed in 2020. The lesson: correlations are circumstantial, but causal mechanisms are structural. Build on structure. Those that survived were built on structural causal understanding, not behavioral correlations._

If your model can’t survive a causal disruption, it wasn’t robust, it was rehearsed.

## When Backtests Lie and Forward Tests Fail

Everyone loves a good backtest. But a good backtest is usually lying to you. Why?

- **Data snooping**: You tried 100 things and kept the one that worked.
- **Regime dependence**: Your strategy only works in bull markets, or low vol, or 2013.
- **Look-ahead bias**: You accidentally used information that wouldn’t be available in real time.
- **Leakage**: You normalized on the full dataset before splitting.

Quantopian studied 888 real strategies. As of the time of that study, many industry practices have since evolved, including increased use of purged cross-validation and walk-forward testing. R² between backtest and live Sharpe: 0.025. The more backtesting users did, the worse their live results got. Heavily optimized strategies performed _worse_ out of sample.

It gets worse. Consider XIV, the short-volatility ETN that made steady money for years. Then, in 2018, it lost approximately 96–97% of its value _in a single day_. The note was liquidated. The backtest didn’t include that kind of event. The strategy was overfit to a calm regime. No one asked: what happens when vol spikes?

And then there’s operational overfitting: backtests that ignore execution costs, slippage, borrow fees, and market impact. On paper the strategy looks amazing. In reality, it’s untradable.

## Real Failures. When Models Burned Capital

- **LTCM**: Nobel laureates. Elegant models. Extreme leverage. A 1998 Russian debt default triggered what their models said was a many-sigma event. They lost 90% of capital and required a Federal Reserve-orchestrated private sector rescue.
- **Quant Quake 2007**: Too many funds with the same signals. Crowded trades unwound. Liquidity vanished. Models broke each other.
- **Volmageddon 2018**: Short vol felt like free money. Until XIV lost 95% in a day and was shuttered.
- **OptionSellers.com (2018)**: Sold naked commodity options. When nat gas spiked, clients lost everything. Accounts reportedly went negative.
- **Kaggle and ML competitions**: Top leaderboard models often fail when deployed. As one Redditor put it: “If you see 99.8% accuracy, it’s probably overfit into oblivion.”

None of these were freak accidents. They were the logical consequence of optimizing to history without stress testing for reality.

## What Actually Works. Tools for Generalization

1. **Walk-Forward Testing**
	
	Rolling out-of-sample evaluations simulate live trading. If your performance disappears the moment you move forward in time, your model isn’t robust. Use expanding windows. Capture multiple regimes.
1. **Cross-Validation (done right)**
	In ML, use K-fold CV. For time series, use **Combinatorially Purged Cross-Validation** (López de Prado). It prevents information leakage between training and test.
2. **Causal Reasoning**
	Tools like DAGs, counterfactuals, and SCMs force you to ask _why_ the model works. Causal signals generalize. Spurious ones don’t.
3. **Shrinkage and Regularization**
	In finance, shrink your covariance estimates (e.g., Ledoit-Wolf). Add turnover constraints. In ML: use L1/L2 penalties. Dropout. Simpler models with fewer degrees of freedom generalize better.
4. **Backtest Hygiene**
	Model all real-world constraints: slippage, latency, borrow fees, capacity. In ML, simulate production data flow. Don’t normalize or impute using future data.
5. **Statistical Reality Checks **
	Use the **Deflated Sharpe Ratio**, **White’s Reality Check**, or **Probabilistic Sharpe Ratio** to test if your backtest is statistically significant given multiple trials. These adjust for data mining.
6. **Simulation Tests**
	Run a Monte Carlo test of 1,000 random strategies on noise. You’ll see that some show incredible backtests, but flop out-of-sample. That’s what you’re up against.

## The Mindset Shift. From Performance to Robustness

Stop chasing perfect backtests. Start asking:

- ☑ Does this work across multiple regimes?
- ☑ Can I explain _why_ it works causally?
- ☑ What’s my true out-of-sample test period?
- ☑ Have I accounted for all the models/strategies I tried?
- ☑ What happens if my key assumption breaks?

Causal models won’t give you the highest Sharpe. Regularized models might underfit. But they’re more likely to _survive_. And that’s what you want, strategies that live long enough to compound.

Backtests are audition tapes, not contracts.

## One More Thing, Discount Your Own Results

Got a backtest Sharpe of 2.0? Cut it in half. Then maybe again. The industry rule of thumb is a 50% haircut.

Treat all results as inflated unless proven otherwise. Assume you’re overfitting, and work to prove you’re not.

## Final Thought

The overfitting crisis isn’t about bad modeling. It’s about forgetting that the world changes. Models that cling to the past too tightly will fail the future.

But you can build smarter. Simpler. More resilient. Models that make it through live testing with their dignity intact.

Those are the ones that survive first contact with reality, and compound over decades.