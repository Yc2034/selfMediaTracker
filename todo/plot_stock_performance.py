#!/usr/bin/env python3
"""
Download and compare performance for multiple tickers.

Usage examples:

    python3 code/plot_stock_performance.py SFIX BYND SPCE --start 2021-01-01 --output charts/tech.png
    python code/plot_stock_performance.py 0700.HK BABA --baseline first --output charts/tech.png

The script normalizes each price series before plotting so you can compare
relative performance on the same chart.
"""

from __future__ import annotations

import argparse
import math
from datetime import datetime, timedelta
from pathlib import Path
from typing import Iterable, Optional

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import yfinance as yf


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Plot normalized price performance for multiple tickers."
    )
    parser.add_argument(
        "tickers",
        nargs="+",
        help="Ticker symbols understood by Yahoo Finance (e.g., AAPL 0700.HK).",
    )
    parser.add_argument(
        "--start",
        type=str,
        default=None,
        help="Start date (YYYY-MM-DD). Defaults to 1 year ago.",
    )
    parser.add_argument(
        "--end",
        type=str,
        default=None,
        help="End date (YYYY-MM-DD). Defaults to today.",
    )
    parser.add_argument(
        "--interval",
        type=str,
        default="1d",
        help="Sampling interval (e.g., 1d, 1wk, 1mo). Defaults to 1d.",
    )
    parser.add_argument(
        "--baseline",
        choices=("first", "percentage"),
        default="first",
        help=(
            "Normalization style: 'first' divides by the first value (baseline = 1). "
            "'percentage' converts to cumulative percentage returns. Defaults to 'first'."
        ),
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Optional path to save the plot image (PNG, SVG, etc.).",
    )
    parser.add_argument(
        "--title",
        type=str,
        default=None,
        help="Optional plot title. Defaults to a generated description.",
    )
    return parser.parse_args()


def _resolve_dates(start: Optional[str], end: Optional[str]) -> tuple[datetime, datetime]:
    today = datetime.today().date()
    end_date = datetime.strptime(end, "%Y-%m-%d").date() if end else today
    default_start = today - timedelta(days=365)
    start_date = datetime.strptime(start, "%Y-%m-%d").date() if start else default_start
    if start_date >= end_date:
        raise ValueError(f"Start date {start_date} must be before end date {end_date}.")
    return datetime.combine(start_date, datetime.min.time()), datetime.combine(
        end_date, datetime.min.time()
    )


def fetch_price_history(
    tickers: Iterable[str], start: datetime, end: datetime, interval: str
) -> pd.DataFrame:
    """Download adjusted close prices indexed by date."""
    data = yf.download(
        tickers=list(tickers),
        start=start,
        end=end,
        interval=interval,
        auto_adjust=True,
        progress=False,
    )
    if data.empty:
        raise RuntimeError("No data returned. Check tickers and date range.")
    closes = _extract_close_prices(data, tickers)
    closes = closes.sort_index()
    return closes.dropna(how="all")


def _extract_close_prices(data: pd.DataFrame, tickers: Iterable[str]) -> pd.DataFrame:
    """Handle yfinance column permutations and return a clean Close dataframe."""
    if isinstance(data.columns, pd.MultiIndex):
        level0 = list(data.columns.get_level_values(0))
        level1 = list(data.columns.get_level_values(1))
        if "Close" in level0:
            closes = data.loc[:, pd.IndexSlice["Close", :]]
            closes.columns = closes.columns.get_level_values(1)
            return closes
        if "Adj Close" in level0:
            closes = data.loc[:, pd.IndexSlice["Adj Close", :]]
            closes.columns = closes.columns.get_level_values(1)
            return closes
        if "Close" in level1:
            closes = data.loc[:, pd.IndexSlice[:, "Close"]]
            closes.columns = closes.columns.get_level_values(0)
            return closes
        if "Adj Close" in level1:
            closes = data.loc[:, pd.IndexSlice[:, "Adj Close"]]
            closes.columns = closes.columns.get_level_values(0)
            return closes
        sample_cols = ", ".join(map(str, data.columns[:6]))
        raise RuntimeError(
            f"Unexpected yfinance columns, unable to locate Close or Adj Close. Sample: {sample_cols}"
        )

    # Single-ticker DataFrame: prefer Close, fall back to Adj Close, else assume already Close-like.
    if "Close" in data.columns:
        closes = data[["Close"]]
    elif "Adj Close" in data.columns:
        closes = data[["Adj Close"]]
    else:
        closes = data.copy()
    closes.columns = [list(tickers)[0]]
    return closes


def normalize_prices(prices: pd.DataFrame, baseline: str) -> pd.DataFrame:
    clean = prices.ffill().dropna()
    if clean.empty:
        raise RuntimeError("No usable data after dropping missing values.")
    if baseline == "first":
        normalized = clean / clean.iloc[0]
    else:  # baseline == "percentage"
        normalized = clean.pct_change().fillna(0.0)
        normalized = (1 + normalized).cumprod() - 1
    return normalized


def summarize_performance(
    normalized: pd.DataFrame, baseline: str, original_prices: Optional[pd.DataFrame] = None
) -> pd.DataFrame:
    if normalized.empty:
        raise RuntimeError("No normalized data provided for summary generation.")

    price_index = normalized if baseline == "first" else normalized + 1
    price_index = price_index.dropna()
    if price_index.empty:
        raise RuntimeError("Unable to compute summary metrics from empty price data.")

    horizon_days = max((price_index.index[-1] - price_index.index[0]).days, 1)
    horizon_years = max(horizon_days / 365.25, 1 / 365.25)

    total_return = price_index.iloc[-1] / price_index.iloc[0] - 1
    annualized_return = (1 + total_return) ** (1 / horizon_years) - 1

    period_returns = price_index.pct_change().dropna()
    num_periods = len(period_returns)
    freq = num_periods / horizon_years if horizon_years > 0 else float("nan")

    if num_periods > 1 and freq > 0:
        annualized_vol = period_returns.std(ddof=1) * math.sqrt(freq)
    else:
        annualized_vol = pd.Series(0.0, index=price_index.columns)

    with np.errstate(divide="ignore", invalid="ignore"):
        sharpe = annualized_return / annualized_vol.replace(0.0, np.nan)

    best_day = period_returns.max().reindex(price_index.columns)
    worst_day = period_returns.min().reindex(price_index.columns)

    drawdowns = price_index / price_index.cummax() - 1
    max_drawdown = drawdowns.min()
    max_drawdown_dates = drawdowns.idxmin()

    start_price = pd.Series(np.nan, index=price_index.columns)
    end_price = pd.Series(np.nan, index=price_index.columns)
    abs_change = pd.Series(np.nan, index=price_index.columns)
    if original_prices is not None:
        aligned_prices = original_prices.reindex(price_index.index).ffill().dropna()
        if not aligned_prices.empty:
            start_price = aligned_prices.iloc[0]
            end_price = aligned_prices.iloc[-1]
            abs_change = end_price - start_price

    summary = pd.DataFrame({
        "start_price": start_price,
        "end_price": end_price,
        "abs_change": abs_change,
        "total_return": total_return,
        "cagr": annualized_return,
        "ann_vol": annualized_vol,
        "sharpe": sharpe,
        "best_day": best_day,
        "worst_day": worst_day,
        "max_drawdown": max_drawdown,
        "max_dd_date": max_drawdown_dates,
    })

    summary = summary.sort_values("total_return", ascending=False)
    return summary


def plot_series(
    normalized: pd.DataFrame,
    summary: pd.DataFrame,
    *,
    baseline: str,
    title: Optional[str],
    output: Optional[str],
    original_prices: Optional[pd.DataFrame] = None,
) -> None:
    fig, (ax, ax_table) = plt.subplots(
        2,
        1,
        figsize=(14, 9),
        gridspec_kw={"height_ratios": [3.4, 1]},
    )

    colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#6A994E', '#BC4B51']

    if original_prices is not None:
        price_lookup = original_prices.reindex(normalized.index).ffill()
    else:
        price_lookup = None

    for idx, col in enumerate(normalized.columns):
        ax.plot(
            normalized.index,
            normalized[col],
            label=col,
            color=colors[idx % len(colors)],
            linewidth=2.5,
            alpha=0.9,
        )

        end_value = normalized[col].iloc[-1]
        end_date = normalized.index[-1]
        ax.annotate(
            f'{end_value:.2f}',
            xy=(end_date, end_value),
            xytext=(8, 0),
            textcoords='offset points',
            fontsize=9,
            fontweight='bold',
            color=colors[idx % len(colors)],
            bbox=dict(
                boxstyle='round,pad=0.25',
                facecolor='white',
                edgecolor=colors[idx % len(colors)],
                alpha=0.85,
            ),
        )

        min_idx = normalized[col].idxmin()
        min_value = normalized[col].loc[min_idx]
        if price_lookup is not None and col in price_lookup:
            raw_val = price_lookup.loc[min_idx, col]
            value_label = f"Low: {raw_val:,.2f}"
        else:
            value_label = f"Low: {min_value:.2f}"
        ax.annotate(
            f"{value_label}\n{min_idx:%Y-%m-%d}",
            xy=(min_idx, min_value),
            xytext=(-20, -25),
            textcoords='offset points',
            fontsize=8,
            color=colors[idx % len(colors)],
            bbox=dict(
                boxstyle='round,pad=0.25',
                facecolor='white',
                edgecolor=colors[idx % len(colors)],
                alpha=0.85,
            ),
            arrowprops=dict(
                arrowstyle='->',
                color=colors[idx % len(colors)],
                lw=0.8,
                shrinkA=2,
                shrinkB=2,
            ),
            horizontalalignment='right',
        )

    ax.set_xlabel("Date", fontsize=12, fontweight='bold')
    if baseline == "first":
        ax.set_ylabel("Growth vs. baseline (x)", fontsize=12, fontweight='bold')
    else:
        ax.set_ylabel("Cumulative return", fontsize=12, fontweight='bold')

    title_text = title or f"Performance Comparison: {', '.join(normalized.columns)}"
    ax.set_title(title_text, fontsize=15, fontweight='bold', pad=14)

    legend = ax.legend(
        title="Ticker",
        title_fontsize=11,
        fontsize=10,
        loc='upper left',
        frameon=True,
        fancybox=True,
    )
    legend.get_frame().set_alpha(0.9)
    legend.get_frame().set_edgecolor('#CBD5E0')

    ax.grid(True, linestyle='--', linewidth=0.6, alpha=0.35, color='#94A3B8')
    ax.set_axisbelow(True)

    baseline_level = 1 if baseline == "first" else 0
    ax.axhline(y=baseline_level, color='#475569', linestyle='-', linewidth=0.8, alpha=0.35)

    # Format table data with richer detail for easier comparison
    table_data = summary.copy()
    format_percent_cols = {
        "total_return": "{:.1f}%",
        "cagr": "{:.1f}%",
        "ann_vol": "{:.1f}%",
        "best_day": "{:.1f}%",
        "worst_day": "{:.1f}%",
        "max_drawdown": "{:.1f}%",
    }

    for col, fmt in format_percent_cols.items():
        if col in table_data:
            table_data[col] = (table_data[col] * 100).map(lambda v: fmt.format(v) if pd.notnull(v) else "—")

    if "sharpe" in table_data:
        table_data["sharpe"] = table_data["sharpe"].map(lambda v: f"{v:.2f}" if pd.notnull(v) else "—")

    money_cols = ["start_price", "end_price", "abs_change"]
    for col in money_cols:
        if col in table_data:
            table_data[col] = table_data[col].map(lambda v: f"{v:,.2f}" if pd.notnull(v) else "—")

    if "max_dd_date" in table_data:
        table_data["max_dd_date"] = table_data["max_dd_date"].map(
            lambda v: v.strftime("%Y-%m-%d") if isinstance(v, pd.Timestamp) and pd.notnull(v) else "—"
        )

    display_columns = [
        ("start_price", "Start"),
        ("end_price", "End"),
        ("abs_change", "Abs Δ"),
        ("total_return", "Total Return"),
        ("cagr", "CAGR"),
        ("ann_vol", "Ann Vol"),
        ("sharpe", "Sharpe"),
        ("best_day", "Best Day"),
        ("worst_day", "Worst Day"),
        ("max_drawdown", "Max Drawdown"),
        ("max_dd_date", "Max DD Date"),
    ]

    filtered_columns = [(col, label) for col, label in display_columns if col in table_data]
    if filtered_columns:
        column_keys, column_labels = zip(*filtered_columns)
    else:
        column_keys = tuple(table_data.columns)
        column_labels = tuple(table_data.columns)

    table_body = table_data.loc[:, column_keys]

    ax_table.axis('off')
    table = ax_table.table(
        cellText=table_body.values,
        colLabels=column_labels,
        rowLabels=table_body.index,
        cellLoc="center",
        loc="center",
    )

    table.auto_set_font_size(False)
    table.set_fontsize(9)
    table.scale(1.05, 1.5)
    if hasattr(table, "auto_set_column_width"):
        table.auto_set_column_width(col=list(range(len(column_labels))))

    for (row, col), cell in table.get_celld().items():
        if row == 0:
            cell.set_facecolor('#1E293B')
            cell.set_text_props(weight='bold', color='white')
        elif col == -1:
            cell.set_facecolor('#E2E8F0')
            cell.set_text_props(weight='bold')
        else:
            cell.set_facecolor('#F8FAFC' if row % 2 == 0 else '#FFFFFF')
        cell.set_edgecolor('#CBD5E0')
        cell.set_linewidth(0.8)

    fig.tight_layout(h_pad=2.0)

    if output:
        output_path = Path(output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(output_path, dpi=200, bbox_inches="tight")
        print(f"Saved plot to {output_path.resolve()}")
    else:
        plt.show()


def main() -> None:
    args = _parse_args()
    start, end = _resolve_dates(args.start, args.end)
    prices = fetch_price_history(args.tickers, start, end, args.interval)
    normalized = normalize_prices(prices, args.baseline)
    summary = summarize_performance(normalized, args.baseline, prices)
    print(summary.to_string(float_format=lambda v: f"{v:.3f}"))
    plot_series(
        normalized,
        summary,
        baseline=args.baseline,
        title=args.title,
        output=args.output,
        original_prices=prices,
    )


if __name__ == "__main__":
    main()
