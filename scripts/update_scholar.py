#!/usr/bin/env python3
"""Refresh Google Scholar citation data for the Research page (publications.html).

Reads the public Google Scholar profile page (allowed by scholar.google.com/robots.txt:
"Allow: /citations?user="), extracts total citations, h-index, i10-index, citations per
year and citations per paper, and writes assets/data/scholar.json.

Runs daily from .github/workflows/update-scholar.yml. Standard library only.
If Scholar does not return a parsable profile (CAPTCHA, layout change, network error),
the JSON file is left untouched and the script exits with status 1.
"""
import datetime
import html
import json
import re
import sys
import urllib.request
from pathlib import Path

USER_ID = "7_JEALYAAAAJ"
PROFILE_URL = f"https://scholar.google.com/citations?user={USER_ID}&hl=en"
OUT = Path(__file__).resolve().parent.parent / "assets" / "data" / "scholar.json"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0 Safari/537.36")


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse(page):
    rows = re.findall(r'<tr class="gsc_a_tr">(.*?)</tr>', page, flags=re.S)
    stats = [int(x) for x in re.findall(r'<td class="gsc_rsb_std">(\d+)</td>', page)]
    if not rows or len(stats) < 6:
        raise ValueError("profile not found in page (CAPTCHA or layout change)")

    papers = {}
    for row in rows:
        title = re.search(r'<a href="([^"]*)" class="gsc_a_at"[^>]*>(.*?)</a>', row, flags=re.S)
        if not title:
            continue
        view_url = "https://scholar.google.com" + html.unescape(title.group(1))
        gs_id = re.search(r"citation_for_view=[^:]+:([^&]+)", view_url)
        if not gs_id:
            continue
        cited = re.search(r'<a href="([^"]*)" class="gsc_a_ac[^"]*"[^>]*>(\d*)</a>', row)
        count = int(cited.group(2)) if cited and cited.group(2) else 0
        papers[gs_id.group(1)] = {
            "title": html.unescape(re.sub(r"<[^>]+>", "", title.group(2))).strip(),
            "cites": count,
            "cites_url": html.unescape(cited.group(1)) if cited and count else "",
            "view_url": view_url,
        }

    # Citations per year: bar z-index counts from the right (1 = most recent year)
    years = [int(y) for y in re.findall(r'<span class="gsc_g_t"[^>]*>(\d{4})</span>', page)]
    by_year = {str(y): 0 for y in years}
    for z, value in re.findall(r'class="gsc_g_a" style="[^"]*z-index:(\d+)"><span class="gsc_g_al">(\d+)</span>', page):
        idx = len(years) - int(z)
        if 0 <= idx < len(years):
            by_year[str(years[idx])] = int(value)

    return {
        "updated": datetime.date.today().isoformat(),
        "profile": PROFILE_URL,
        "citations": stats[0],
        "h_index": stats[2],
        "i10_index": stats[4],
        "by_year": by_year,
        "papers": papers,
    }


def main():
    try:
        data = parse(fetch(PROFILE_URL))
    except Exception as exc:  # leave the current file untouched
        print(f"::warning::Google Scholar not updated: {exc}")
        return 1
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {OUT.name}: {data['citations']} citations, h={data['h_index']}, "
          f"i10={data['i10_index']}, {len(data['papers'])} papers")
    return 0


if __name__ == "__main__":
    sys.exit(main())
