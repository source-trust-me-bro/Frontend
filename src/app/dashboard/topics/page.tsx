import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";

import { ErrorPanel } from "@/features/dashboard/components/dashboard-shell";
import { topicNodeSchema, type TopicNode } from "@/features/news/schemas";
import { apiRequest, attempt } from "@/features/news/server/api";

export const metadata: Metadata = {
  title: "Topics",
  description: "Browse every KalevaShorts topic.",
};

export const instant = false;

export default function TopicsPage() {
  return (
    <Topics />
  );
}

function TopicBranch({ nodes }: { nodes: TopicNode[] }) {
  return (
    <ul className="dash-tree">
      {nodes.map((node) => (
        <li key={node.id}>
          <Link
            className="dash-cat-card"
            href={`/dashboard?topic=${node.id}`}
          >
            <strong>{node.name}</strong>
            <span>
              {node.language.toUpperCase()}
              {node.description ? ` · ${node.description}` : ""}
            </span>
          </Link>
          {node.children.length ? <TopicBranch nodes={node.children} /> : null}
        </li>
      ))}
    </ul>
  );
}

async function Topics() {
  const result = await attempt(() =>
    apiRequest("/topics/tree", z.array(topicNodeSchema)),
  );

  if (!result.ok) {
    return <ErrorPanel message={result.message} />;
  }

  const topics = result.data;

  return (
    <div className="dash-view">
      <div className="dash-view__head">
        <div>
          <h1 className="dash-view__title">Topics</h1>
          <p className="dash-view__sub">Browse stories by subject.</p>
        </div>
      </div>
      {topics.length ? (
        <TopicBranch nodes={topics} />
      ) : (
        <div className="dash-empty">
          <h2>There are no topics yet</h2>
          <p>
            The newsroom&apos;s agents make topics themselves as news comes in, and they appear
            here as soon as the first ones exist. Nothing is wrong with your account.
          </p>
        </div>
      )}
    </div>
  );
}
