import type { PublicStory } from "@/features/news/schemas";

const needLabels: Record<string, string> = {
  information: "What happened",
  understanding: "What it means",
  usefulness: "How it helps you",
  emotion: "Moves you",
  break: "A breather",
  community: "Your community",
};

const roleLabels: Record<string, string> = {
  editor_in_chief: "Editor-in-chief",
  language_reviewer: "Language reviewer",
  community_reviewer: "Community reviewer",
  subject_expert: "Subject expert",
};

function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-FI", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/Helsinki",
  }).format(new Date(iso));
}

export function StoryCard({
  story,
  language,
}: {
  story: PublicStory;
  language: string;
}) {
  const web = story.renditions.filter((item) => item.channel === "web");
  const primary = web.find((item) => item.language === language) ?? web[0];
  const others = web.filter((item) => item !== primary);

  return (
    <article className="dash-story" id={`story-${story.story_id}`}>
      <header>
        <div className="dash-chips dash-chips--tight">
          {story.needs.map((need) => (
            <span className="dash-chip" key={need}>
              {needLabels[need] ?? need}
            </span>
          ))}
        </div>
        <h2 className="dash-story__title">{story.headline}</h2>
        <p className="dash-story__dek">{story.standfirst}</p>
        <p className="dash-story__meta">
          <time dateTime={story.published_at}>{formatDate(story.published_at)}</time>
        </p>
      </header>

      {story.corrections.length ? (
        <div className="dash-correction" role="note">
          <strong>Correction</strong>
          {story.corrections.map((item) => (
            <p key={item.text}>{item.text}</p>
          ))}
        </div>
      ) : null}

      {primary ? (
        <div className="dash-article__text">
          {paragraphs(primary.text).map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      ) : null}

      {others.map((item) => (
        <details className="dash-more-language" key={item.language}>
          <summary>Read in {item.language.toUpperCase()}</summary>
          <div className="dash-article__text">
            {paragraphs(item.text).map((text, index) => (
              <p key={index}>{text}</p>
            ))}
          </div>
        </details>
      ))}

      {story.context_notes.length ? (
        <ul className="dash-notes">
          {story.context_notes.map((note) => (
            <li key={note.text}>
              {note.text}
              {note.source_url ? (
                <>
                  {" "}
                  <a href={note.source_url} target="_blank" rel="noopener noreferrer">
                    Source
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      <footer className="dash-trust">
        <p>
          <strong>How this was made.</strong> {story.ai_disclosure}
        </p>
        {story.approvers.length ? (
          <p>
            <strong>Approved by:</strong>{" "}
            {story.approvers
              .map(
                (item) =>
                  `${item.name} (${roleLabels[item.role] ?? item.role}${
                    item.title ? `, ${item.title}` : ""
                  })`,
              )
              .join(" · ")}
          </p>
        ) : null}
        <p>
          <strong>Sources.</strong>
        </p>
        <ul className="dash-sources">
          {story.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">
                {source.name}
              </a>
              {source.official ? <span className="dash-tag">Official</span> : null}
              {source.origin === "agent_reference" ? (
                <span className="dash-tag dash-tag--note">
                  Reference added by the newsroom to confirm the rules
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
