// App.jsx
import React, { useState } from "react";

// ProfileCard Component
function ProfileCard(props) {
  const [isFollowing, setIsFollowing] = useState(false);

  // handle follow/unfollow
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    console.log(props.name + " follow status: " + !isFollowing);
  };

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "16px",
      margin: "10px",
      width: "250px",
      textAlign: "center",
      background: "#fff"
    }}>
      <img 
        src={props.avatar} 
        alt={props.name} 
        style={{
          width: "80px", 
          height: "80px", 
          borderRadius: "50%", 
          objectFit: "cover"
        }} 
      />
      <h2>{props.name}</h2>
      <p style={{color: "gray", margin: "4px 0"}}>{props.title}</p>
      <p style={{fontSize: "12px", color: "#666"}}>{props.location}</p>

      <p style={{marginTop: "10px"}}>{props.bio}</p>

      <div style={{display: "flex", justifyContent: "space-around", marginTop: "12px"}}>
        <div>
          <strong>{props.followers}</strong>
          <p style={{fontSize: "12px"}}>Followers</p>
        </div>
        <div>
          <strong>{props.following}</strong>
          <p style={{fontSize: "12px"}}>Following</p>
        </div>
      </div>

      <button 
        onClick={toggleFollow}
        style={{
          marginTop: "12px",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: isFollowing ? "#ccc" : "black",
          color: "white"
        }}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

// Main App
export default function App() {
  const people = [
    {
      name: "Ava Johnson",
      title: "Frontend Engineer",
      location: "Berlin, DE",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
      followers: 1234,
      following: 321,
      bio: "Loves creating cool UIs with React."
    },
    {
      name: "Noah Patel",
      title: "UI/UX Designer",
      location: "Toronto, CA",
      avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200",
      followers: 980,
      following: 420,
      bio: "Design + Coffee = Happy me!"
    },
    {
      name: "Maya Kim",
      title: "Full-stack Dev",
      location: "Seoul, KR",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200",
      followers: 2210,
      following: 150,
      bio: "Love building apps with JS and Node."
    }
  ];

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      background: "#f2f2f2",
      minHeight: "100vh",
      padding: "20px"
    }}>
      {people.map((p, index) => (
        <ProfileCard 
          key={index}
          name={p.name}
          title={p.title}
          location={p.location}
          avatar={p.avatar}
          followers={p.followers}
          following={p.following}
          bio={p.bio}
        />
      ))}
    </div>
  );
}
