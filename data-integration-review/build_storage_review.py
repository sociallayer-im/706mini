"""Build the storage-first discussion artifact from source-preserving inventories."""
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs' / 'data-integration'
def read(name):
    return json.loads((DOCS / (name + '.json')).read_text())

storage = read('storage-catalog')
frontend_map = read('storage-frontend-map')
findings = read('storage-findings')
original = read('mapping')
requirements = read('frontend-inventory')['requirements']
endpoints = read('backend-inventory')['endpoints']
application_storage = [p for p in storage['physicalStorage'] if p['id'] in {'community706', '$users', '$files'} or p.get('name') in {'community706', '$users', '$files'}]
summary = {
    'applicationPhysicalTables': len(application_storage),
    'supportingPhysicalTables': len(storage['physicalStorage']) - len(application_storage),
    'logicalRecordTypes': len([e for e in storage['entities'] if e.get('storageKind') == 'community706_json_record']),
    'cataloguedEntities': len(storage['entities']),
    'fields': sum(len(e.get('fields', [])) for e in storage['entities']),
    'requirements': len(requirements),
    'endpoints': len(endpoints),
    'uniqueFindings': len({g['id'] for g in findings['findings']}),
    'findingCategories': dict(Counter(g['category'] for g in findings['findings'])),
    'fieldCountingRule': '字段条目按记录类型计数，包含重复的共同外层字段；不是去重物理列数。',
}
data = {'issue': 'SID-123', 'summary': summary, 'applicationStorage': application_storage,
        'storage': storage, 'frontendMap': frontend_map, 'findings': findings,
        'requirements': requirements, 'endpoints': endpoints,
        'frontendCommit': original['frontendCommit'], 'backendCommit': original['backendCommit']}
(DOCS / 'storage-review.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
template = (ROOT / 'data-integration-review' / 'storage-template.html').read_text()
payload = json.dumps(data, ensure_ascii=False).replace('<', '\\u003c')
(ROOT / 'data-integration-review' / 'storage.html').write_text(template.replace('__DATA__', payload))
print(json.dumps(summary, ensure_ascii=False))
