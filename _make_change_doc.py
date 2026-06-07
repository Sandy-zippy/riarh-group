#!/usr/bin/env python3
"""Create a formatted Google Doc (Riarh change log / handover review) via the gws CLI.
Builds the full text once, then applies headings, bold+coloured status tags, and
checkbox list items in a single batchUpdate so indices stay stable."""
import json, subprocess, sys

def gws(args, body=None, params=None):
    cmd = ['gws'] + args
    if params is not None:
        cmd += ['--params', json.dumps(params)]
    if body is not None:
        cmd += ['--json', json.dumps(body)]
    out = subprocess.run(cmd, capture_output=True, text=True)
    raw = out.stdout + ("\n" + out.stderr if out.returncode else "")
    lines = [l for l in out.stdout.splitlines() if not l.startswith('Using keyring backend')]
    js = '\n'.join(lines).strip()
    try:
        return json.loads(js)
    except Exception:
        print("GWS RAW OUTPUT:\n", out.stdout, "\nSTDERR:\n", out.stderr, file=sys.stderr)
        raise

GREEN = {"red": 0.13, "green": 0.50, "blue": 0.15}
AMBER = {"red": 0.78, "green": 0.45, "blue": 0.00}
ACCENT = {"red": 0.855, "green": 0.467, "blue": 0.204}  # terracotta #da7734

# ---- content model ---------------------------------------------------------
# Each block: ('title'|'h1'|'h2'|'normal'|'bullet'|'item', text[, status])
# 'item' => checkbox line with a bold+coloured status token prefix.
blocks = []
def title(t): blocks.append(('title', t))
def h1(t): blocks.append(('h1', t))
def h2(t): blocks.append(('h2', t))
def p(t): blocks.append(('normal', t))
def b(t): blocks.append(('bullet', t))
def item(status, t): blocks.append(('item', t, status))  # status: 'DONE'|'PENDING'

import sys as _sys
content_path = _sys.argv[1] if len(_sys.argv) > 1 else None
import importlib.util
spec = importlib.util.spec_from_file_location("content", content_path)
content = importlib.util.module_from_spec(spec)
content.title=title; content.h1=h1; content.h2=h2; content.p=p; content.b=b; content.item=item
spec.loader.exec_module(content)

# ---- build text + ranges ---------------------------------------------------
full = ""
paras = []
for blk in blocks:
    typ = blk[0]
    if typ == 'item':
        status = blk[2]
        tok = ("Done" if status == 'DONE' else ("Pending" if status == 'PENDING' else status))
        line = f"{tok}  —  {blk[1]}"
        start = len(full); full += line + "\n"
        paras.append({'s': start, 'e': len(full), 'type': 'item',
                      'status': status, 'tok_len': len(tok)})
    else:
        line = blk[1]
        start = len(full); full += line + "\n"
        paras.append({'s': start, 'e': len(full), 'type': typ})

# ---- create or reuse doc ---------------------------------------------------
import os
existing = os.environ.get('RIARH_DOC_ID')
if existing:
    doc_id = existing
    cur = gws(['docs', 'documents', 'get'], params={"documentId": doc_id})
    end = 1
    for el in cur.get('body', {}).get('content', []):
        if 'endIndex' in el:
            end = max(end, el['endIndex'])
    if end > 2:
        gws(['docs', 'documents', 'batchUpdate'], params={"documentId": doc_id},
            body={"requests": [{"deleteContentRange": {"range": {"startIndex": 1, "endIndex": end - 1}}}]})
else:
    doc = gws(['docs', 'documents', 'create'], body={"title": "Riarh Group Website — Change Log & Handover Review"})
    doc_id = doc['documentId']

NS = {'title': 'TITLE', 'h1': 'HEADING_1', 'h2': 'HEADING_2',
      'normal': 'NORMAL_TEXT', 'bullet': 'NORMAL_TEXT', 'item': 'NORMAL_TEXT'}

reqs = [{"insertText": {"location": {"index": 1}, "text": full}}]
for pr in paras:
    s, e = 1 + pr['s'], 1 + pr['e']            # e includes trailing newline
    reqs.append({"updateParagraphStyle": {
        "range": {"startIndex": s, "endIndex": e},
        "paragraphStyle": {"namedStyleType": NS[pr['type']]},
        "fields": "namedStyleType"}})
    if pr['type'] == 'bullet':
        reqs.append({"createParagraphBullets": {
            "range": {"startIndex": s, "endIndex": e},
            "bulletPreset": "BULLET_DISC_CIRCLE_SQUARE"}})
    if pr['type'] == 'item':
        reqs.append({"createParagraphBullets": {
            "range": {"startIndex": s, "endIndex": e},
            "bulletPreset": "BULLET_CHECKBOX"}})
        col = GREEN if pr['status'] == 'DONE' else AMBER
        reqs.append({"updateTextStyle": {
            "range": {"startIndex": s, "endIndex": s + pr['tok_len']},
            "textStyle": {"bold": True, "foregroundColor": {"color": {"rgbColor": col}}},
            "fields": "bold,foregroundColor"}})

gws(['docs', 'documents', 'batchUpdate'], params={"documentId": doc_id}, body={"requests": reqs})
print("DOC_ID:" + doc_id)
print("URL:https://docs.google.com/document/d/" + doc_id + "/edit")
