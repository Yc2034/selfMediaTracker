# Stock Performance Plotter
轻量脚本，用于批量获取多个标的的历史价格，归一化后绘制对比图，并输出核心指标。
plot_stock_performance.py

## 1. 环境准备
```bash
cd code
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

退出虚拟环境：`deactivate`

## 2. 快速上手
```bash
python plot_stock_performance.py TICKER... [OPTIONS]
```

示例命令：
```bash
# 科技巨头：2024-01-01 起，导出图片到 images/us-tech.png
python plot_stock_performance.py AAPL MSFT NVDA --start 2024-01-01 --output images/us-tech.png

python plot_stock_performance.py AMD INTC AVGO NVDA --start 2025-01-01 --end 2025-10-20 --output images/us-ai.png

python plot_stock_performance.py QQQ TQQQ NVDA TSLA KWEB --start 2025-02-22 --end 2025-05-31 --output images/2025tradewar.png

python plot_stock_performance.py QQQ META AMZN GOOG MSFT AAPL --start 2022-01-01 --end 2022-10-31 --output images/2022soar.png

python plot_stock_performance.py BILI --start 2022-09-01 --end 2025-10-01  --interval 1wk --output images/2022bili.png

python plot_stock_performance.py SPY QQQ KWEB --start 2024-01-01 --end 2024-12-31 --output images/2024Recap.png

# 成长股周线表现：生成 charts/tech.png
python plot_stock_performance.py SFIX BYND SPCE --start 2021-01-01 --interval 1wk --output charts/tech.png

python plot_stock_performance.py SPY QQQ --start 2020-05-15 --interval 1wk --output charts/techbenchmark.png
```



运行后脚本会：
1. 打印每个标的的总收益率与最大回撤；
2. 显示或保存归一化曲线（默认基准为首日 = 1；若使用 `--baseline percentage` 则显示累计收益率）。

## 3. 常用参数
- `--start YYYY-MM-DD`：起始日期，默认最近一年。
- `--end YYYY-MM-DD`：结束日期，默认今日。
- `--interval {1d,1wk,1mo,...}`：采样频率。
- `--baseline {first,percentage}`：归一化方式。
- `--title "自定义标题"`：图表标题。
- `--output path/to/file.png`：保存图片路径。不传则直接弹窗展示。

数据来源为 Yahoo Finance（`yfinance`）。若遇到下载失败或缺失列，请确认网络环境、标的是否可查询、或稍后重试。
