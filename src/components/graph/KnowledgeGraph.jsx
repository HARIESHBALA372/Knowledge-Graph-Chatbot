import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { useTheme } from '../../context/ThemeContext';

const TYPE_COLORS = {
  'Person': '#6366f1',
  'Programming Language': '#10b981',
  'Framework': '#0284c7',
  'Organization': '#f59e0b',
  'Concept': '#3b82f6',
  'Field': '#64748b',
  'Software': '#8b5cf6',
  'Paper': '#ec4899',
  'default': '#64748b',
};

export default function KnowledgeGraph({
  nodes = [],
  relationships = [],
  selectedNodeId,
  onSelectNode,
  layoutName = 'cose',
  height = '100%',
}) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const { isDark } = useTheme();

  // Convert props to Cytoscape elements
  const elements = [
    ...nodes.map((n) => ({
      data: {
        id: n.id,
        label: n.label || n.name || n.id,
        type: n.type || 'Entity',
        color: TYPE_COLORS[n.type] || TYPE_COLORS['default'],
        properties: n.properties || {},
      },
    })),
    ...relationships.map((r, idx) => ({
      data: {
        id: `rel_${r.source}_${r.target}_${idx}`,
        source: r.source,
        target: r.target,
        label: r.label || r.relation || 'RELATED_TO',
      },
    })),
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing instance before creating new one
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const nodeTextColor = isDark ? '#f1f5f9' : '#0f172a';
    const edgeColor = isDark ? '#475569' : '#94a3b8';
    const edgeTextColor = isDark ? '#94a3b8' : '#64748b';

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'label': 'data(label)',
            'color': nodeTextColor,
            'font-size': '11px',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-weight': 600,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'text-wrap': 'wrap',
            'text-max-width': '100px',
            'width': 34,
            'height': 34,
            'border-width': 2,
            'border-color': isDark ? '#1e293b' : '#ffffff',
            'transition-property': 'background-color, line-color, target-arrow-color, width, height, border-width',
            'transition-duration': '0.2s',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'width': 42,
            'height': 42,
            'border-width': 4,
            'border-color': '#2563eb',
            'shadow-blur': 12,
            'shadow-color': '#2563eb',
            'shadow-opacity': 0.6,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 1.5,
            'line-color': edgeColor,
            'target-arrow-color': edgeColor,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 0.8,
            'label': 'data(label)',
            'color': edgeTextColor,
            'font-size': '9px',
            'font-family': 'Inter, system-ui, sans-serif',
            'font-weight': 500,
            'text-rotation': 'autorotate',
            'text-background-color': isDark ? '#0f172a' : '#ffffff',
            'text-background-opacity': 0.85,
            'text-background-padding': '2px',
            'text-background-shape': 'roundrectangle',
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'width': 3,
            'line-color': '#2563eb',
            'target-arrow-color': '#2563eb',
          },
        },
      ],
      layout: {
        name: layoutName,
        animate: true,
        animationDuration: 500,
        padding: 40,
        fit: true,
        ...(layoutName === 'cose'
          ? {
              idealEdgeLength: 100,
              nodeRepulsion: 400000,
              edgeElasticity: 100,
              nestingFactor: 5,
              gravity: 80,
              numIter: 1000,
            }
          : {}),
      },
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const data = node.data();
      if (onSelectNode) {
        onSelectNode({
          id: data.id,
          label: data.label,
          type: data.type,
          properties: data.properties,
        });
      }
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy && onSelectNode) {
        onSelectNode(null);
      }
    });

    cyRef.current = cy;

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      if (cyRef.current) {
        cyRef.current.resize();
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [nodes, relationships, layoutName, isDark]);

  // Highlight selected node programmatically if selectedNodeId changes
  useEffect(() => {
    if (!cyRef.current) return;
    cyRef.current.nodes().unselect();
    if (selectedNodeId) {
      const target = cyRef.current.$(`node#${selectedNodeId}`);
      if (target.length > 0) {
        target.select();
        cyRef.current.animate({
          center: { eles: target },
          zoom: 1.2,
          duration: 400,
        });
      }
    }
  }, [selectedNodeId]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" style={{ height }}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
