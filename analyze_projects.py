import json

# Read the data
with open('journey-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Count by tools
counts = {'excel': 0, 'powerbi': 0, 'python': 0, 'sql': 0, 'other': 0}

def categorize_project(project):
    tools = project.get('tools', '').lower()
    description = project.get('description', '').lower()
    title = project.get('title', '').lower()
    
    categories = []
    
    if 'excel' in tools or 'excel' in description or 'excel' in title:
        categories.append('excel')
    if 'power bi' in tools or 'powerbi' in tools or 'power bi' in description or 'powerbi' in description:
        categories.append('powerbi')
    if 'python' in tools or 'python' in description or 'python' in title:
        categories.append('python')
    if 'sql' in tools or 'mysql' in tools or 'sql' in description or 'mysql' in description or 'sql' in title:
        categories.append('sql')
    
    # Check for other tools only if no main categories found
    if len(categories) == 0:
        if ('tableau' in tools or ' r ' in tools or 'matlab' in tools or 
            'spss' in tools or 'sas' in tools or 'qlik' in tools or
            'upcoming' in tools or tools.strip() == '' or 'xx' in tools):
            categories.append('other')
    
    return categories if categories else ['other']

print('Project Analysis:')
print('================')

for i, project in enumerate(data):
    categories = categorize_project(project)
    tools = project.get('tools', 'No tools')
    print(f'Project {i+1}: {project.get("title", "No title")[:30]}... - Tools: {tools} - Categories: {categories}')
    
    for cat in categories:
        if cat in counts:
            counts[cat] += 1

print('\nFinal Counts:')
print('=============')
for tool, count in counts.items():
    print(f'{tool.capitalize()}: {count}')

print(f'Total projects: {len(data)}')
