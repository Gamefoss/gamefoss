interface Node {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
}

/** Keep public Markdown images inside the current deployment's base path. */
export function rehypeImageBase({ base = '/' }: { base?: string } = {}) {
  const prefix = base.replace(/\/$/, '');
  return (tree: Node) => {
    function visit(node: Node) {
      const src = node.properties?.src;
      if (
        prefix &&
        node.type === 'element' &&
        node.tagName === 'img' &&
        typeof src === 'string' &&
        src.startsWith('/') &&
        !src.startsWith('//') &&
        src !== prefix &&
        !src.startsWith(`${prefix}/`)
      ) {
        node.properties!.src = `${prefix}${src}`;
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
