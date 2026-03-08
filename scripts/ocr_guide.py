#!/usr/bin/env python3
"""
OCR guide images → knowledge base using claude CLI (stream-json mode).
Run from project root: python3 scripts/ocr_guide.py
Resume-safe: skips already-processed pages saved in data/guide-knowledge.json.
"""

import subprocess
import json
import pathlib
import base64
import os
import time

# ── Pages manifest (from public/read_guide/index.html) ──
PAGES = [
    (1,"JPG"),(2,"JPG"),(3,"PNG"),(4,"PNG"),(5,"PNG"),(6,"JPG"),(7,"JPG"),
    (8,"JPG"),(9,"JPG"),(10,"JPG"),(11,"JPG"),(12,"JPG"),(13,"JPG"),(14,"JPG"),
    (15,"JPG"),(16,"JPG"),(17,"JPG"),(18,"JPG"),(19,"JPG"),(20,"JPG"),(21,"JPG"),
    (22,"JPG"),(23,"JPG"),(24,"JPG"),(25,"JPG"),(26,"JPG"),(27,"JPG"),(28,"JPG"),
    (29,"JPG"),(30,"JPG"),(31,"JPG"),(32,"PNG"),(33,"JPG"),(34,"JPG"),(35,"PNG"),
    (36,"PNG"),(37,"JPG"),(38,"JPG"),(39,"PNG"),(40,"PNG"),(41,"JPG"),(42,"PNG"),
    (43,"JPG"),(44,"JPG"),(45,"JPG"),(46,"JPG"),(47,"JPG"),(48,"JPG"),(49,"JPG"),
    (50,"JPG"),(51,"JPG"),(52,"JPG"),(53,"JPG"),(54,"JPG"),(55,"JPG"),(56,"JPG"),
    (57,"JPG"),(58,"JPG"),(59,"PNG"),(60,"PNG"),(61,"JPG"),(62,"JPG"),(63,"JPG"),
    (64,"JPG"),(65,"JPG"),(66,"JPG"),(67,"PNG"),(68,"JPG"),(69,"JPG"),(70,"PNG"),
    (71,"JPG"),(72,"JPG"),(73,"JPG"),(74,"JPG"),(75,"JPG"),(76,"JPG"),(77,"JPG"),
    (78,"JPG"),(79,"JPG"),(80,"JPG"),(81,"JPG"),(82,"JPG"),(83,"JPG"),(84,"JPG"),
    (85,"PNG"),(86,"JPG"),(87,"PNG"),(88,"JPG"),(89,"JPG"),(90,"JPG"),(91,"PNG"),
    (92,"PNG"),(93,"PNG"),(94,"PNG"),(95,"PNG"),(96,"JPG"),(97,"PNG"),(98,"PNG"),
    (99,"PNG"),(100,"PNG"),(101,"PNG"),(102,"PNG"),(103,"PNG"),(104,"PNG"),(105,"PNG"),
    (106,"PNG"),(107,"PNG"),(108,"PNG"),(109,"PNG"),(110,"PNG"),(111,"PNG"),(112,"PNG"),
    (113,"PNG"),(114,"PNG"),(115,"PNG"),(116,"PNG"),(117,"PNG"),(118,"PNG"),(119,"JPG"),
    (120,"PNG"),(121,"PNG"),(122,"PNG"),(123,"PNG"),(124,"PNG"),(125,"PNG"),(126,"PNG"),
    (127,"PNG"),(128,"PNG"),(129,"PNG"),(130,"PNG"),(131,"PNG"),(132,"PNG"),(133,"JPG"),
    (134,"PNG"),(135,"PNG"),(136,"JPG"),(137,"PNG"),(138,"PNG"),(139,"PNG"),(140,"PNG"),
    (141,"PNG"),(142,"PNG"),(143,"PNG"),(144,"PNG"),(145,"PNG"),(146,"PNG"),(147,"JPG"),
    (148,"PNG"),(149,"PNG"),(150,"PNG"),(151,"PNG"),(152,"PNG"),(153,"PNG"),(154,"PNG"),
    (155,"PNG"),(156,"PNG"),(157,"PNG"),(158,"PNG"),(159,"PNG"),(160,"PNG"),(161,"PNG"),
    (162,"JPG"),(163,"JPG"),(164,"JPG"),(165,"PNG"),(166,"PNG"),(167,"PNG"),(168,"PNG"),
    (169,"PNG"),
]

# ── TOC (from index.html) ──
TOC = [
    {"num": 1,  "title": "Подготовка кожи к макияжу",    "fileNum": 6},
    {"num": 2,  "title": "Тональные средства",             "fileNum": 26},
    {"num": 3,  "title": "Консилер",                       "fileNum": 44},
    {"num": 4,  "title": "Пудра",                          "fileNum": 52},
    {"num": 5,  "title": "Контур",                         "fileNum": 69},
    {"num": 6,  "title": "Бронзер",                        "fileNum": 71},
    {"num": 7,  "title": "Румяна",                         "fileNum": 81},
    {"num": 8,  "title": "Хайлайтер",                      "fileNum": 94},
    {"num": 9,  "title": "Палетки для лица",               "fileNum": 104},
    {"num": 10, "title": "Средства для макияжа глаз",      "fileNum": 107},
    {"num": 11, "title": "Оформление бровей",              "fileNum": 130},
    {"num": 12, "title": "Продукты для губ",               "fileNum": 140},
    {"num": 13, "title": "Спрей для фиксации макияжа",     "fileNum": 155},
    {"num": 14, "title": "Минимальный набор кистей",       "fileNum": 160},
]

IMAGE_DIR  = pathlib.Path("public/read_guide")
OUTPUT_JSON = pathlib.Path("data/guide-knowledge.json")
OUTPUT_MD   = pathlib.Path("data/guide-knowledge.md")
CLAUDE_BIN  = "/Users/skakovsi/.local/bin/claude"

PROMPT = (
    "Это страница русскоязычного гайда по макияжу. "
    "Извлеки весь текст со страницы. Верни только текст, сохраняя структуру (заголовки, списки, абзацы). "
    "Если страница содержит только изображения без текста, верни: [только изображение]"
)

# Env without any CLAUDE* vars that block nested execution
CLEAN_ENV = {k: v for k, v in os.environ.items()
             if k not in ("CLAUDECODE", "CLAUDE_CODE_SSE_PORT", "CLAUDE_CODE_ENTRYPOINT")}


def build_stream_json_msg(img_path: pathlib.Path) -> str:
    ext = img_path.suffix.lower()
    media_type = "image/png" if ext == ".png" else "image/jpeg"
    b64 = base64.b64encode(img_path.read_bytes()).decode()
    return json.dumps({
        "type": "user",
        "message": {
            "role": "user",
            "content": [
                {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": b64}},
                {"type": "text", "text": PROMPT},
            ],
        },
    })


def parse_stream_json_response(raw: str) -> str:
    """Extract assistant text from stream-json output lines."""
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            obj = json.loads(line)
        except json.JSONDecodeError:
            continue
        if obj.get("type") == "assistant":
            content = obj.get("message", {}).get("content", [])
            texts = [c["text"] for c in content if c.get("type") == "text"]
            if texts:
                return "\n".join(texts)
    return "[ответ не получен]"


def ocr_image(img_path: pathlib.Path) -> str:
    msg = build_stream_json_msg(img_path)
    result = subprocess.run(
        [
            CLAUDE_BIN, "-p",
            "--input-format", "stream-json",
            "--output-format", "stream-json",
            "--verbose",
        ],
        input=msg,
        capture_output=True,
        text=True,
        timeout=120,
        env=CLEAN_ENV,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"exit {result.returncode}")
    return parse_stream_json_response(result.stdout)


def get_chapter(file_num: int):
    chapter = None
    for ch in TOC:
        if file_num >= ch["fileNum"]:
            chapter = ch
    return chapter


def load_existing():
    if OUTPUT_JSON.exists():
        return json.loads(OUTPUT_JSON.read_text(encoding="utf-8"))
    return None


def build_empty_structure():
    return {
        "title": "Makeup Guide Book — @kristar.kristina",
        "intro": [],
        "chapters": [
            {"num": ch["num"], "title": ch["title"], "pages": []}
            for ch in TOC
        ],
    }


def get_processed_file_nums(data: dict) -> set:
    processed = set()
    for p in data.get("intro", []):
        processed.add(p["fileNum"])
    for ch in data.get("chapters", []):
        for p in ch.get("pages", []):
            processed.add(p["fileNum"])
    return processed


def save_json(data: dict):
    OUTPUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_JSON.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def save_markdown(data: dict):
    lines = [f"# {data['title']}\n"]
    if data["intro"]:
        lines.append("## Введение / Обложка\n")
        for p in data["intro"]:
            lines.append(f"### Страница {p['fileNum']}\n")
            lines.append(p["text"])
            lines.append("\n")
    for ch in data["chapters"]:
        lines.append(f"## Глава {ch['num']}: {ch['title']}\n")
        for p in ch["pages"]:
            lines.append(f"### Страница {p['fileNum']}\n")
            lines.append(p["text"])
            lines.append("\n")
    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")


def insert_page(data: dict, file_num: int, text: str):
    chapter = get_chapter(file_num)
    page_entry = {"fileNum": file_num, "text": text}
    if chapter is None:
        data["intro"].append(page_entry)
        data["intro"].sort(key=lambda p: p["fileNum"])
    else:
        for ch in data["chapters"]:
            if ch["num"] == chapter["num"]:
                ch["pages"].append(page_entry)
                ch["pages"].sort(key=lambda p: p["fileNum"])
                break


def main():
    total = len(PAGES)
    existing = load_existing()
    if existing:
        data = existing
        print(f"Resuming from existing {OUTPUT_JSON}")
    else:
        data = build_empty_structure()

    processed = get_processed_file_nums(data)
    remaining = [(num, ext) for num, ext in PAGES if num not in processed]

    if not remaining:
        print("All pages already processed.")
        save_markdown(data)
        return

    print(f"Pages to process: {len(remaining)} / {total}\n")

    for i, (file_num, ext) in enumerate(remaining, 1):
        img_path = IMAGE_DIR / f"{file_num}.{ext}"
        chapter = get_chapter(file_num)
        chapter_label = f"Ch.{chapter['num']}" if chapter else "Intro"

        print(f"[{file_num:>3}/{total}] {chapter_label} — {file_num}.{ext} ...", end=" ", flush=True)

        if not img_path.exists():
            print("MISSING — skip")
            continue

        try:
            text = ocr_image(img_path)
            preview = text[:60].replace("\n", " ")
            print(f"OK  {preview!r}")
        except Exception as e:
            print(f"ERROR: {e}")
            text = f"[ошибка OCR: {e}]"

        insert_page(data, file_num, text)
        save_json(data)  # incremental save for resume safety

        if i < len(remaining):
            time.sleep(1)  # brief pause between requests

    save_markdown(data)
    print(f"\nDone!\n  JSON → {OUTPUT_JSON}\n  MD   → {OUTPUT_MD}")


if __name__ == "__main__":
    main()
