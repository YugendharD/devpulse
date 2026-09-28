import Tilt from "./Tilt";

function ProfileCard({ profile }) {
  return (
    <Tilt className="profile-card" max={6}>
      <img src={profile.avatar_url} alt={profile.login} className="avatar" />
      <div className="profile-info">
        <h2>{profile.name || profile.login}</h2>
        <p className="username">@{profile.login}</p>
        {profile.bio && <p className="bio">{profile.bio}</p>}

        <div className="stats">
          <div className="stat">
            <span className="stat-value">{profile.followers}</span>
            <span className="stat-label">Followers</span>
          </div>
          <div className="stat">
            <span className="stat-value">{profile.following}</span>
            <span className="stat-label">Following</span>
          </div>
          <div className="stat">
            <span className="stat-value">{profile.public_repos}</span>
            <span className="stat-label">Repos</span>
          </div>
        </div>
      </div>
    </Tilt>
  );
}

export default ProfileCard;