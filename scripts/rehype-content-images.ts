interface Node {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
}

function meaningfulChildren(node: Node) {
  return (node.children || []).filter(
    (child) => child.type !== 'text' || child.value?.trim(),
  );
}

function standaloneImage(node: Node) {
  const children = meaningfulChildren(node);
  if (children.length !== 1) return;

  const child = children[0];
  if (child.type === 'element' && child.tagName === 'img') return child;

  if (child.type === 'element' && child.tagName === 'a') {
    const linkChildren = meaningfulChildren(child);
    if (
      linkChildren.length === 1 &&
      linkChildren[0].type === 'element' &&
      linkChildren[0].tagName === 'img'
    )
      return linkChildren[0];
  }
}

/** Render standalone Markdown images as figures, using their alt text as captions. */
export function rehypeContentImages() {
  return (tree: Node) => {
    function visit(node: Node) {
      node.children = node.children?.map((child) => {
        if (child.type === 'element' && child.tagName === 'p') {
          const image = standaloneImage(child);
          if (image) {
            const alt = image.properties?.alt;
            return {
              type: 'element',
              tagName: 'figure',
              properties: { className: ['content-figure'] },
              children: [
                ...meaningfulChildren(child),
                ...(typeof alt === 'string' && alt.trim()
                  ? [
                      {
                        type: 'element',
                        tagName: 'figcaption',
                        properties: {},
                        children: [{ type: 'text', value: alt.trim() }],
                      },
                    ]
                  : []),
              ],
            };
          }
        }

        visit(child);
        return child;
      });
    }

    visit(tree);
  };
}
