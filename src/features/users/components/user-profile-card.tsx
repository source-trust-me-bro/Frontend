import type { UserProfile } from "../schemas/user-profile-schema";

type UserProfileCardProps = {
  profile: UserProfile;
  name: string;
  email: string | null;
  role: string;
};

export function UserProfileCard({
  profile,
  name,
  email,
  role,
}: UserProfileCardProps) {
  return (
    <section className="workspace__panel workspace__panel--span-5">
      <div className="workspace__panel-head">
        <h2 className="workspace__panel-title">Your account</h2>
        <span className="workspace__badge">Clerk synced</span>
      </div>
      <div className="workspace__identity">
        <p className="workspace__name">
          {profile.display_name || name}
        </p>
        <p className="workspace__email">{profile.email || email}</p>
      </div>
      <dl className="workspace__facts">
        <div className="workspace__fact">
          <dt>Language</dt>
          <dd>{profile.preferred_language.toUpperCase()}</dd>
        </div>
        <div className="workspace__fact">
          <dt>Role</dt>
          <dd>{role}</dd>
        </div>
        <div className="workspace__fact">
          <dt>Profile ID</dt>
          <dd>{profile.id.slice(0, 10)}…</dd>
        </div>
        <div className="workspace__fact">
          <dt>Storage</dt>
          <dd>MongoDB</dd>
        </div>
      </dl>
      {profile.clerk_user_id ? (
        <p className="workspace__panel-note">
          Clerk user linked to the FastAPI profile.
        </p>
      ) : null}
    </section>
  );
}
