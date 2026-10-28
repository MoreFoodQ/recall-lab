"""Render cited original PDF pages and attach image references to the bank."""
from pathlib import Path
import json, re
import fitz

root = Path(__file__).resolve().parent.parent
bank_path = root / 'public/questions.json'
bank = json.loads(bank_path.read_text(encoding='utf-8-sig'))
image_dir = root / 'public/images/slides'
image_dir.mkdir(parents=True, exist_ok=True)
source_map = {}
for file in sorted((root / 'materials/lectures').glob('*.pdf')):
    with fitz.open(file) as doc:
        source_map[file.name] = {'pages': len(doc)}
count = 0
for q in bank:
    source = q['source']
    file = root / source['file']
    if file.suffix.lower() != '.pdf':
        continue
    match = re.search(r'(?:p(?:p)?\.?\s*|第\s*)(\d+)', source['locator'], re.I)
    if not match:
        raise ValueError(f"Cannot parse page: question {q['id']}: {source['locator']}")
    page_number = int(match.group(1))
    chapter = file.name.split('.')[0]
    out = image_dir / f'lecture-{chapter}-p{page_number:02d}.webp'
    with fitz.open(file) as doc:
        if not 1 <= page_number <= len(doc):
            raise ValueError(f"Page out of range for question {q['id']}")
        if not out.exists():
            page = doc[page_number-1]
            pix = page.get_pixmap(matrix=fitz.Matrix(1200/page.rect.width,1200/page.rect.width),alpha=False)
            from PIL import Image
            Image.frombytes('RGB',[pix.width,pix.height],pix.samples).save(out,'WEBP',quality=85)
            count += 1
    source['image'] = './' + out.relative_to(root / 'public').as_posix()
bank_path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
(root / 'public/source-map.json').write_text(json.dumps(source_map,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Rendered {count} original slide images; attached citations to {sum("image" in q["source"] for q in bank)} questions.')
