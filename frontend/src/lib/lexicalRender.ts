export function renderLexicalHtml(content: any): string {
  if (!content?.root?.children) return '';

  function renderChildren(children: any[]): string {
    if (!children) return '';
    return children.map((node: any) => {
      // Handle text nodes
      if (node.type === 'text') {
        let text = node.text || '';
        if (node.format === 1) text = `<strong>${text}</strong>`;
        if (node.format === 2) text = `<em>${text}</em>`;
        if (node.format === 8) text = `<u>${text}</u>`;
        return text;
      }

      // Handle links
      if (node.type === 'link') {
        const url = node.fields?.url || '';
        const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
        const innerHtml = renderChildren(node.children);
        return `<a href="${url}"${target} class="text-primary hover:underline">${innerHtml}</a>`;
      }

      // Handle paragraphs
      if (node.type === 'paragraph') {
        const innerHtml = renderChildren(node.children);
        return `<p class="mb-4 text-text-muted leading-relaxed">${innerHtml}</p>`;
      }

      // Handle headings
      if (node.type === 'heading') {
        const innerHtml = renderChildren(node.children);
        return `<h${node.tag} class="text-2xl font-heading font-bold mt-8 mb-4 text-text">${innerHtml}</h${node.tag}>`;
      }

      // Handle blockquotes
      if (node.type === 'quote') {
        const innerHtml = renderChildren(node.children);
        return `<blockquote class="border-l-4 border-primary pl-4 italic my-4 text-text-muted">${innerHtml}</blockquote>`;
      }

      // Handle lists (ul/ol)
      if (node.type === 'list') {
        const tag = node.tag || 'ul';
        const listClass = tag === 'ol' ? 'list-decimal' : 'list-disc';
        const innerHtml = renderChildren(node.children);
        return `<${tag} class="${listClass} pl-6 mb-4 text-text-muted space-y-2">${innerHtml}</${tag}>`;
      }

      // Handle list items
      if (node.type === 'listitem') {
        const innerHtml = renderChildren(node.children);
        return `<li class="text-text-muted">${innerHtml}</li>`;
      }

      return renderChildren(node.children || []);
    }).join('');
  }

  return renderChildren(content.root.children);
}
