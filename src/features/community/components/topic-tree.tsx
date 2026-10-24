"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { CornerDownRight, GitBranch, MousePointerClick } from "lucide-react";

export type TopicTreeItem = {
  id: string;
  name: string;
  depth: number;
  events: number;
  proposed?: boolean;
  branches: string[];
};

type TreeNode = TopicTreeItem & { children: TreeNode[] };

function buildTree(items: TopicTreeItem[]): TreeNode[] {
  const roots: TreeNode[] = [];
  const stack: TreeNode[] = [];

  for (const item of items) {
    const node: TreeNode = { ...item, children: [] };

    while (stack.length && stack[stack.length - 1].depth >= node.depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }

    stack.push(node);
  }

  return roots;
}

/**
 * The newsroom's topic tree. Topics nest by depth, the trunk draws the hierarchy, and a
 * link chip jumps to the topic on the other end instead of dumping a comma-separated list.
 */
export function TopicTree({ topics }: { topics: TopicTreeItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [focusId, setFocusId] = useState<string | null>(null);

  const { tree, names, related, linkCount } = useMemo(() => {
    const tree = buildTree(topics);
    const names = new Map(topics.map((topic) => [topic.id, topic.name]));
    const related = new Map<string, Set<string>>();

    topics.forEach((topic) => related.set(topic.id, new Set([topic.id])));

    const pairs = new Set<string>();

    topics.forEach((topic) => {
      topic.branches.forEach((branchId) => {
        const set = related.get(topic.id);
        const other = related.get(branchId);

        if (!set || !other || branchId === topic.id) {
          return;
        }

        set.add(branchId);
        other.add(topic.id);
        pairs.add([topic.id, branchId].sort().join("|"));
      });
    });

    return { tree, names, related, linkCount: pairs.size };
  }, [topics]);

  useEffect(() => {
    const scope = root.current;

    if (!scope || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const cards = Array.from(scope.querySelectorAll<HTMLElement>("[data-tree-card]"));
    const dots = Array.from(scope.querySelectorAll<HTMLElement>("[data-tree-dot]"));
    const badges = Array.from(scope.querySelectorAll<HTMLElement>("[data-tree-badge]"));
    const chips = Array.from(scope.querySelectorAll<HTMLElement>("[data-tree-chip]"));
    const rails = Array.from(scope.querySelectorAll<HTMLElement>("[data-tree-rail]"));

    let observer: IntersectionObserver | null = null;

    const context = gsap.context(() => {
      gsap.set(cards, { autoAlpha: 0, y: 18, scale: 0.985, transformOrigin: "left top" });
      gsap.set(dots, { scale: 0.2, autoAlpha: 0 });
      gsap.set(badges, { scale: 0.65, autoAlpha: 0 });
      gsap.set(chips, { autoAlpha: 0, y: 4 });
      gsap.set(rails, { scaleY: 0, transformOrigin: "top center" });

      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      timeline
        .to(rails, { scaleY: 1, duration: 0.7, ease: "power2.inOut", stagger: 0.08 })
        .to(cards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.045 }, 0.15)
        .to(
          dots,
          { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2.4)", stagger: 0.045 },
          0.22,
        )
        .to(badges, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.045 }, 0.3)
        .to(chips, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.015 }, 0.45);

      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
              timeline.play();
              observer?.disconnect();
            }
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
        );
        observer.observe(scope);
      } else {
        timeline.play();
      }
    }, scope);

    return () => {
      observer?.disconnect();
      context.revert();
    };
  }, []);

  function jumpTo(id: string) {
    const scope = root.current;
    const target = scope?.querySelector<HTMLElement>(
      `[data-topic-node="${CSS.escape(id)}"]`,
    );

    if (!target) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setFocusId(id);
    target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });

    const card = target.querySelector<HTMLElement>("[data-tree-card]");

    if (card && !reduced) {
      gsap.fromTo(
        card,
        { scale: 0.97 },
        { scale: 1, duration: 0.55, ease: "elastic.out(1, 0.5)", overwrite: "auto" },
      );
    }
  }

  return (
    <div className="ntree" ref={root}>
      {linkCount > 0 ? (
        <p className="ntree__hint">
          <MousePointerClick size={13} aria-hidden="true" />
          Hover a topic to trace its links. Click a linked topic to jump to it.
        </p>
      ) : null}

      <div className="ntree__canvas">
        <span className="ntree__rail ntree__rail--root" data-tree-rail aria-hidden="true" />
        <ul className="ntree__list ntree__list--root">
          {tree.map((node) => (
            <TopicBranch
              key={node.id}
              node={node}
              names={names}
              related={related}
              focusId={focusId}
              onFocusTopic={setFocusId}
              onJump={jumpTo}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

function TopicBranch({
  node,
  names,
  related,
  focusId,
  onFocusTopic,
  onJump,
}: {
  node: TreeNode;
  names: Map<string, string>;
  related: Map<string, Set<string>>;
  focusId: string | null;
  onFocusTopic: (id: string | null) => void;
  onJump: (id: string) => void;
}) {
  const links = node.branches.flatMap((branchId) => {
    const name = names.get(branchId);

    return name ? [{ id: branchId, name }] : [];
  });
  const focused = focusId === node.id;
  const linked = Boolean(
    focusId && !focused && related.get(focusId)?.has(node.id),
  );

  return (
    <li
      className="ntree__node"
      data-topic-node={node.id}
      data-depth={Math.min(node.depth, 3)}
      onMouseEnter={() => onFocusTopic(node.id)}
      onMouseLeave={() => onFocusTopic(null)}
    >
      {node.depth > 0 ? (
        <span className="ntree__stem" data-tree-rail aria-hidden="true" />
      ) : null}
      <div
        className="ntree__card"
        data-tree-card
        data-focus={focused ? "true" : undefined}
        data-linked={linked ? "true" : undefined}
      >
        <span className="ntree__leaf" data-tree-dot aria-hidden="true" />

        <div className="ntree__body">
          <div className="ntree__head">
            <span className="ntree__name">{node.name}</span>
            <span
              className="ntree__events"
              data-tree-badge
              data-live={node.events > 0 ? "true" : undefined}
            >
              {node.events} {node.events === 1 ? "event" : "events"}
            </span>
            {node.proposed ? <span className="ntree__tag">proposed</span> : null}
          </div>

          {links.length ? (
            <div className="ntree__links">
              <span className="ntree__links-label">
                <GitBranch size={11} aria-hidden="true" />
                linked
              </span>
              {links.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  className="ntree__link"
                  data-tree-chip
                  onClick={() => onJump(link.id)}
                  onFocus={() => onFocusTopic(node.id)}
                  onBlur={() => onFocusTopic(null)}
                  title={`Jump to ${link.name}`}
                >
                  <CornerDownRight size={11} aria-hidden="true" />
                  <span className="ntree__link-text">{link.name}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {node.children.length ? (
        <div className="ntree__branch">
          <ul className="ntree__list">
            {node.children.map((child) => (
              <TopicBranch
                key={child.id}
                node={child}
                names={names}
                related={related}
                focusId={focusId}
                onFocusTopic={onFocusTopic}
                onJump={onJump}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}
