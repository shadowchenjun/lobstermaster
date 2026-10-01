"""Import the selected standalone project documents into the website."""
import argparse
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from shutil import copyfile

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = Path('/Users/chenjun/Documents/AI项目开发')
SOURCES = {
    'sinochem-assistant': {
        'user-manual.html': PROJECTS / '松澜集/docs/handbook/使用手册.html',
        'technical-handover.html': PROJECTS / '松澜集/docs/handbook/技术交接文档.html',
        'requirements-review.html': PROJECTS / '松澜集/docs/reviews/2026-09-23-需求匹配度评审.html',
        'model-selection.html': PROJECTS / '松澜集/docs/reports/2026-09-28-大模型选型对比.html',
        **{
            f'img/{filename}': PROJECTS / '松澜集/docs/handbook/img' / filename
            for filename in [
                '10-float.png', '01-collect-demo.jpg', '02-collect-result.jpg',
                '03-collect-bottom.jpg', '04-fill-plan.jpg', '05-fill-result.jpg',
                '06-target-page.jpg', '08-history.jpg', '09-settings.jpg',
            ]
        },
    },
    'perfectoken': {
        'pt-pay-architecture.html': PROJECTS / 'perfectoken-pay/docs/pt-pay-architecture.html',
        'gateway-comparison.html': PROJECTS / 'AI运维/LiteLLM-vs-NewAPI-对比报告.html',
        'gateway-integration.html': PROJECTS / 'AI运维/newapi-litellm-融合/01-融合方案.html',
        'gateway-poc.html': PROJECTS / 'AI运维/newapi-litellm-融合/02-PoC验证清单与配置草稿.html',
    },
    'funeng': {
        'industry-dashboard.html': Path('/Users/chenjun/Documents/funeng/docs/prototypes/agri-industry-dashboard.html'),
        'market-dashboard.html': Path('/Users/chenjun/Documents/funeng/docs/prototypes/agri-market-dashboard.html'),
    },
    'mediaflow': {
        filename: PROJECTS / 'AI视频智能分析及生成系统/docs' / filename
        for filename in [
            'system-overview.html', 'architecture.html',
            'plans/2026-09-13-multimodal-video-library-composer-spec.md',
            '01-实施记录.md', '02-自然语言选材实施.md', 'stages/README.md', '04-specs-评审采纳.md',
        ]
    },
}


class DocumentParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.parts = []
        self.links = []
        self.has_body = False
        self.implicit_body = False

    def handle_starttag(self, tag, attrs):
        # Standalone reports sometimes rely on the browser's implicit body.
        if tag == 'body':
            self.has_body = True
        elif not self.has_body and tag in ('div', 'main', 'header', 'nav', 'section'):
            self.parts.append('<body>')
            self.has_body = self.implicit_body = True
        # A website reader cannot open the author's local development workbench.
        local_link = tag == 'a' and any(
            key == 'href' and value and value.startswith(('http://127.0.0.1', 'http://localhost', 'file:'))
            for key, value in attrs
        )
        if local_link:
            attrs = [(key, value) for key, value in attrs if key != 'href']
            attrs.extend([('aria-disabled', 'true'), ('title', '仅在项目本地环境可用')])
            attributes = ''.join(f' {key}' if value is None else f' {key}="{escape(value, quote=True)}"' for key, value in attrs)
            self.parts.append(f'<{tag}{attributes}>')
        else:
            self.parts.append(self.get_starttag_text())
        for key, value in attrs:
            if key in ('href', 'src') and value and not value.startswith(('#', 'https:', 'http:', 'data:', 'blob:')):
                self.links.append(value)

    def handle_startendtag(self, tag, attrs):
        self.parts.append(self.get_starttag_text())

    def handle_endtag(self, tag):
        if tag == 'html' and self.implicit_body:
            self.parts.append('</body>')
            self.implicit_body = False
        self.parts.append(f'</{tag}>')

    def handle_data(self, data):
        self.parts.append(data)

    def handle_entityref(self, name):
        self.parts.append(f'&{name};')

    def handle_charref(self, name):
        self.parts.append(f'&#{name};')

    def handle_comment(self, data):
        self.parts.append(f'<!--{data}-->')

    def handle_decl(self, decl):
        self.parts.append(f'<!{decl}>')


def main():
    arguments = argparse.ArgumentParser(description=__doc__)
    arguments.add_argument('--project', choices=SOURCES, help='Import only this project')
    selected = arguments.parse_args().project
    # Validate every input and relative HTML link before replacing any snapshot.
    imports = []
    for project, documents in SOURCES.items():
        if selected and project != selected:
            continue
        for filename, source in documents.items():
            if not source.is_file():
                raise FileNotFoundError(source)
            content = None
            if source.suffix == '.html':
                parser = DocumentParser()
                parser.feed(source.read_text())
                for link in parser.links:
                    target = (Path(filename).parent / link.split('#')[0]).as_posix()
                    if target not in documents:
                        raise ValueError(f'{project}/{filename}: missing relative dependency {link}')
                content = ''.join(parser.parts) + ('</body>' if parser.implicit_body else '')
            imports.append((project, filename, source, content))
    for project, filename, source, content in imports:
        destination = ROOT / 'protected-content/series' / project / filename
        destination.parent.mkdir(parents=True, exist_ok=True)
        if content is None:
            copyfile(source, destination)
        else:
            destination.write_text(content)
    print(f'Imported {len(imports)} documents.')


if __name__ == '__main__':
    main()
